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

function slugify(s: string): string {
  return (s || "card")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 52) || "card";
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
  const qrUrl = body.qrUrl || "#resume";

  let files: Record<string, string>;
  try {
    files = await generateSite(profile, themeId, qrUrl);
  } catch (e) {
    return NextResponse.json({ error: `Failed to generate site: ${String(e)}` }, { status: 500 });
  }

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
  const vercelRes = await fetch(`https://api.vercel.com/v13/deployments${qs}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json: unknown = await vercelRes.json().catch(() => ({}));
  if (!vercelRes.ok) {
    const err = json as { error?: { message?: string; code?: string } };
    return NextResponse.json(
      { error: err?.error?.message ?? `Vercel API error ${vercelRes.status}`, code: err?.error?.code },
      { status: vercelRes.status }
    );
  }

  const data = json as { url?: string; id?: string; alias?: string[] };
  const url = data.url ? `https://${data.url}` : null;
  return NextResponse.json({ url, id: data.id ?? null, alias: data.alias ?? [] });
}
