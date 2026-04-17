import { NextResponse } from "next/server";
import { generateSite } from "@/lib/generate-site";
import type { Profile } from "@/lib/schema";
import type { ThemeId } from "@/lib/themes";

export const runtime = "nodejs";

type Body = {
  token: string;
  projectName: string;
  profile: Profile;
  themeId: ThemeId;
  teamId?: string;
  qrUrl?: string;
};

type DeploymentResponse = {
  url?: string;
  id?: string;
  alias?: string[];
  readyState?: string;
  status?: string;
};

async function waitForReady(
  token: string,
  teamId: string | undefined,
  id: string,
  timeoutMs = 90_000
): Promise<DeploymentResponse> {
  const qs = teamId ? `?teamId=${encodeURIComponent(teamId)}` : "";
  const started = Date.now();
  let last: DeploymentResponse = {};
  while (Date.now() - started < timeoutMs) {
    const res = await fetch(`https://api.vercel.com/v13/deployments/${id}${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      last = (await res.json()) as DeploymentResponse;
      const state = last.readyState ?? last.status;
      if (state === "READY") return last;
      if (state === "ERROR" || state === "CANCELED") return last;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  return last;
}

function slugify(s: string): string {
  return (s || "card")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 52) || "card";
}

async function deployOnce(
  token: string,
  teamId: string | undefined,
  name: string,
  files: Record<string, string>
): Promise<{ ok: true; data: DeploymentResponse } | { ok: false; status: number; error: string; code?: string }> {
  const payload = {
    name,
    files: Object.entries(files).map(([file, data]) => ({
      file,
      data: Buffer.from(data, "utf-8").toString("base64"),
      encoding: "base64",
    })),
    projectSettings: { framework: null },
    target: "production",
  };
  const qs = teamId ? `?teamId=${encodeURIComponent(teamId)}` : "";
  const res = await fetch(`https://api.vercel.com/v13/deployments${qs}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = json as { error?: { message?: string; code?: string } };
    return {
      ok: false,
      status: res.status,
      error: err?.error?.message ?? `Vercel API error ${res.status}`,
      code: err?.error?.code,
    };
  }
  return { ok: true, data: json as DeploymentResponse };
}

function pickPublicUrl(data: DeploymentResponse): string | null {
  const aliases = (data.alias ?? []).filter((a) => typeof a === "string" && a.length > 0);
  // Deployment-specific URLs contain a long alphanumeric hash segment between the
  // project name and the team slug. Production aliases do not. Prefer the latter.
  const looksLikeDeploymentUrl = (a: string) => /-[a-z0-9]{9,}-/i.test(a);
  const stable = aliases.filter((a) => !looksLikeDeploymentUrl(a));
  const pool = stable.length > 0 ? stable : aliases;
  if (pool.length > 0) {
    const shortest = pool.slice().sort((a, b) => a.length - b.length)[0];
    return `https://${shortest}`;
  }
  return data.url ? `https://${data.url}` : null;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { token, profile, themeId, teamId } = body;
  if (!token) return NextResponse.json({ error: "Missing Vercel token" }, { status: 400 });
  if (!profile) return NextResponse.json({ error: "Missing profile" }, { status: 400 });

  const name = slugify(body.projectName || profile.name || "card");

  // Phase 1 — deploy with placeholder QR target to learn the real URL
  const placeholderQr = "https://vercel.com";
  let phase1Files: Record<string, string>;
  try {
    phase1Files = await generateSite(profile, themeId, placeholderQr);
  } catch (e) {
    return NextResponse.json({ error: `Failed to generate site: ${String(e)}` }, { status: 500 });
  }

  const first = await deployOnce(token, teamId, name, phase1Files);
  if (!first.ok) {
    return NextResponse.json({ error: first.error, code: first.code }, { status: first.status });
  }

  // Wait until Phase 1 is READY so Vercel populates the production alias
  let ready: DeploymentResponse = first.data;
  if (first.data.id) {
    ready = await waitForReady(token, teamId, first.data.id);
  }
  const merged: DeploymentResponse = {
    ...first.data,
    ...ready,
    alias: [
      ...new Set([...(first.data.alias ?? []), ...(ready.alias ?? [])]),
    ],
  };

  const realUrl = pickPublicUrl(merged);
  if (!realUrl) {
    // Couldn't resolve a URL — fall back to returning phase-1 deployment as-is
    return NextResponse.json({
      url: null,
      id: first.data.id ?? null,
      alias: first.data.alias ?? [],
      warning: "Deployment succeeded but no URL could be resolved; QR may be incorrect.",
    });
  }

  // Phase 2 — regenerate HTML with the real URL baked into the QR, then redeploy
  let phase2Files: Record<string, string>;
  try {
    phase2Files = await generateSite(profile, themeId, realUrl);
  } catch (e) {
    return NextResponse.json({ error: `Failed to regenerate site: ${String(e)}` }, { status: 500 });
  }

  const second = await deployOnce(token, teamId, name, phase2Files);
  if (!second.ok) {
    // Phase 1 is live but QR is wrong; surface the error so the user can retry.
    return NextResponse.json(
      {
        error: `Phase 2 redeploy failed: ${second.error}`,
        code: second.code,
        url: realUrl,
        warning: "Phase 1 deployed successfully, but QR URL could not be corrected.",
      },
      { status: second.status }
    );
  }

  const finalUrl = pickPublicUrl(second.data) ?? realUrl;
  return NextResponse.json({
    url: finalUrl,
    id: second.data.id ?? null,
    alias: second.data.alias ?? [],
    qrTarget: realUrl,
  });
}
