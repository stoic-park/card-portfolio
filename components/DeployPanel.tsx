"use client";

import { useEffect, useState } from "react";
import type { Profile, QrMode } from "@/lib/schema";
import { defaultQrTarget } from "@/lib/schema";
import { themes, type ThemeId } from "@/lib/themes";
import { resolveQrUrl, getProjectSlug, getPredictedSiteUrl } from "@/lib/qr-target";

type State =
  | { kind: "idle" }
  | { kind: "deploying" }
  | { kind: "success"; url: string }
  | { kind: "error"; message: string };

const TOKEN_KEY = "card-portfolio:vercel-token:v1";
const TEAM_KEY = "card-portfolio:team-id:v1";

type DeployPanelProps = {
  profile: Profile;
  themeId: ThemeId;
  onProfileChange: (p: Profile) => void;
};

export function DeployPanel({ profile, themeId, onProfileChange }: DeployPanelProps) {
  const qr = profile.qr ?? defaultQrTarget;
  const setQrMode = (mode: QrMode) => onProfileChange({ ...profile, qr: { ...qr, mode } });
  const setQrCustomUrl = (customUrl: string) => onProfileChange({ ...profile, qr: { ...qr, customUrl } });
  const setProjectName = (v: string) => onProfileChange({ ...profile, projectName: v });

  const [token, setToken] = useState("");
  const [teamId, setTeamId] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const [rememberToken, setRememberToken] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = window.localStorage.getItem(TOKEN_KEY);
    if (t) { setToken(t); setRememberToken(true); }
    const tm = window.localStorage.getItem(TEAM_KEY);
    if (tm) setTeamId(tm);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (rememberToken && token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  }, [token, rememberToken]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (teamId) window.localStorage.setItem(TEAM_KEY, teamId);
    else window.localStorage.removeItem(TEAM_KEY);
  }, [teamId]);

  const slug = getProjectSlug(profile);
  const predictedUrl = getPredictedSiteUrl(profile);
  const includeResume = profile.includeResume !== false;
  const setIncludeResume = (v: boolean) => {
    const next: typeof profile = { ...profile, includeResume: v };
    if (!v && qr.mode === "siteAnchor") next.qr = { ...qr, mode: "site" };
    onProfileChange(next);
  };

  async function onDeploy() {
    if (!token) { setState({ kind: "error", message: "Vercel 토큰이 필요합니다." }); return; }
    if (!profile.name) { setState({ kind: "error", message: "프로필의 이름을 먼저 입력하세요." }); return; }
    setState({ kind: "deploying" });
    try {
      const qrUrl = resolveQrUrl(profile);
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          profile,
          themeId,
          projectName: slug,
          teamId: teamId || undefined,
          qrUrl,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setState({ kind: "error", message: data.error ?? `HTTP ${res.status}` });
        return;
      }
      setState({ kind: "success", url: data.url });
    } catch (e) {
      setState({ kind: "error", message: String(e) });
    }
  }

  return (
    <section className="rounded-xl border border-neutral-200 bg-white">
      <div className="flex flex-col gap-2 border-b border-neutral-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">Deploy to Vercel</h2>
          <p className="text-xs leading-relaxed text-neutral-500">
            자기 Vercel 계정의 Personal Access Token으로 배포합니다.
          </p>
        </div>
        <a
          href="https://vercel.com/account/tokens"
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center self-start text-xs font-medium text-neutral-500 underline hover:text-neutral-900 sm:self-auto"
        >
          토큰 발급 →
        </a>
      </div>
      <div className="space-y-4 p-4 text-sm">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-500">Vercel Token</span>
          <input
            type="password"
            autoComplete="off"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="vercel_XXXXXXXXXXXX"
            className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-base"
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-neutral-600">
            <input
              type="checkbox"
              checked={rememberToken}
              onChange={(e) => setRememberToken(e.target.checked)}
            />
            이 브라우저에 토큰 저장 (localStorage, 공용 PC에선 끄기)
          </label>
          {token && (
            <button
              type="button"
              onClick={() => {
                setToken("");
                setRememberToken(false);
                if (typeof window !== "undefined") window.localStorage.removeItem(TOKEN_KEY);
              }}
              className="btn btn-xs btn-secondary"
            >
              토큰 삭제 (로그아웃)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-500">프로젝트 이름</span>
            <input
              value={profile.projectName ?? ""}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="my-card"
              className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-base"
            />
            <span className="mt-1 block text-[11px] text-neutral-500">
              예상 URL: <span className="font-mono">{predictedUrl}</span>
            </span>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-500">Team ID (선택)</span>
            <input
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              placeholder="team_xxx (개인 계정은 비워두세요)"
              className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-base"
            />
          </label>
        </div>

        <label className="flex items-start gap-2 rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs">
          <input
            type="checkbox"
            checked={includeResume}
            onChange={(e) => setIncludeResume(e.target.checked)}
            className="mt-0.5"
          />
          <div className="flex-1">
            <div className="font-medium text-neutral-700">이력 섹션 포함</div>
            <p className="mt-0.5 text-[11px] text-neutral-500">
              끄면 명함 한 장만 배포됩니다 (경력·프로젝트·소셜 섹션 전부 제외).
            </p>
          </div>
        </label>

        <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs">
          <div className="mb-2 font-medium text-neutral-700">QR 대상</div>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2">
              <input type="radio" checked={qr.mode === "site"} onChange={() => setQrMode("site")} />
              <span>배포 사이트 루트 <span className="break-all font-mono text-[11px]">{predictedUrl}</span></span>
            </label>
            <label className={`flex items-center gap-2 ${!includeResume ? "opacity-50" : ""}`}>
              <input
                type="radio"
                checked={qr.mode === "siteAnchor"}
                onChange={() => setQrMode("siteAnchor")}
                disabled={!includeResume}
              />
              <span>배포 사이트 이력 앵커 <span className="break-all font-mono text-[11px]">{predictedUrl}/#resume</span>
              {!includeResume && <span className="ml-1 text-neutral-400">(이력 미포함이라 비활성)</span>}</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="radio"
                checked={qr.mode === "custom"}
                onChange={() => setQrMode("custom")}
                className="mt-1"
              />
              <div className="flex-1">
                <span>직접 입력 URL (LinkedIn, 별도 사이트 등)</span>
                {qr.mode === "custom" && (
                  <input
                    type="url"
                    placeholder="https://..."
                    value={qr.customUrl ?? ""}
                    onChange={(e) => setQrCustomUrl(e.target.value)}
                    className="mt-1.5 w-full rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-base"
                  />
                )}
              </div>
            </label>
          </div>
          <p className="mt-2 text-[11px] text-neutral-500">
            현재 QR: <span className="break-all font-mono">{resolveQrUrl(profile)}</span>
          </p>
          <p className="mt-1 text-[11px] text-neutral-400">
            ※ Vercel production alias는 프로젝트 이름 기반 ({slug}.vercel.app)이라 배포 전에도 정확한 URL로 QR을 미리 만들 수 있습니다. 단, 이미 점유된 이름이면 Vercel이 접미어를 붙일 수 있어요.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs">
          <span className="text-neutral-500">배포 테마:</span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium"
            style={{ background: themes[themeId].page.accent, color: "#fff" }}
          >
            ● {themes[themeId].label}
          </span>
          <span className="text-neutral-400">— 선택한 1개 디자인만 배포됩니다</span>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={onDeploy}
            disabled={state.kind === "deploying"}
            className="btn btn-md btn-primary"
          >
            {state.kind === "deploying" ? "배포 중..." : "▲ Deploy"}
          </button>
          {state.kind === "success" && (
            <a href={state.url} target="_blank" rel="noreferrer" className="break-all text-xs text-green-700 underline">
              {state.url}
            </a>
          )}
          {state.kind === "error" && (
            <span className="text-xs text-red-600">{state.message}</span>
          )}
        </div>

        <p className="text-xs text-neutral-400">
          최초 배포 시 프로젝트가 자동 생성됩니다. 같은 이름으로 재배포하면 덮어씁니다.
        </p>
      </div>
    </section>
  );
}
