"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import Link from "next/link";
import { toPng } from "html-to-image";
import { BusinessCard } from "./BusinessCard";
import { FlatCardFace } from "./FlatCardFace";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { PortfolioView } from "./PortfolioView";
import { DeployPanel } from "./DeployPanel";
import { CardCustomizer } from "./CardCustomizer";
import { defaultProfile } from "@/lib/profile";
import { emptyProfile, type Profile, type Experience, type Project } from "@/lib/schema";
import { parseMarkdownToProfile } from "@/lib/parse-markdown";
import { loadProfile, saveProfile, loadTheme, saveTheme } from "@/lib/storage";
import { resolveQrUrl } from "@/lib/qr-target";
import { resolveFontStack, fontOrder, fonts } from "@/lib/fonts";
import { defaultTheme, themes, type ThemeId } from "@/lib/themes";

type Tab = "markdown" | "form" | "card" | "deploy";

const TABS: { id: Tab; label: string }[] = [
  { id: "markdown", label: "Markdown" },
  { id: "form", label: "Form" },
  { id: "card", label: "Card" },
  { id: "deploy", label: "Deploy" },
];

export function Studio() {
  const [tab, setTab] = useState<Tab>("markdown");
  const [mdText, setMdText] = useState<string>("");
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [themeId, setThemeId] = useState<ThemeId>(defaultTheme);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const exportFrontRef = useRef<HTMLDivElement>(null);
  const exportBackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = loadProfile();
    if (stored) setProfile(stored);
    const tid = loadTheme() as ThemeId | null;
    if (tid && themes[tid]) setThemeId(tid);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveProfile(profile);
  }, [profile, hydrated]);
  useEffect(() => {
    if (hydrated) saveTheme(themeId);
  }, [themeId, hydrated]);

  useEffect(() => {
    const url = resolveQrUrl(profile);
    QRCode.toDataURL(url, { margin: 1, width: 320, color: { dark: "#111111", light: "#ffffff" } })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [profile]);

  const t = themes[themeId];

  function onParseMarkdown() {
    if (!mdText.trim()) return;
    const p = parseMarkdownToProfile(mdText);
    setProfile({
      ...p,
      nameEn: p.nameEn || profile.nameEn,
      location: p.location || profile.location,
    });
  }

  function onFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setMdText(text);
      setProfile(parseMarkdownToProfile(text));
    };
    reader.readAsText(file);
  }

  function onDownload() {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.name || "profile"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function onResetDefault() { setProfile(defaultProfile); }
  function onClear() { setProfile(emptyProfile); setMdText(""); }

  async function onDownloadPng(side: "front" | "back") {
    const node = (side === "front" ? exportFrontRef : exportBackRef).current;
    if (!node) return;
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${profile.name || "card"}-${side}.png`;
      a.click();
    } catch (e) {
      console.error("PNG export failed", e);
      alert("PNG 내보내기 실패. 외부 이미지가 CORS로 차단됐을 수 있습니다.");
    }
  }

  const skillsCsv = useMemo(() => profile.skills.join(", "), [profile.skills]);

  return (
    <main className="flex h-dvh flex-col bg-neutral-50 text-neutral-900">
      <nav className="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-semibold">card-portfolio</Link>
          <span className="text-xs text-neutral-400">/ Studio</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onDownload} className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50">Download JSON</button>
          <button onClick={onResetDefault} className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50">Reset</button>
          <button onClick={onClear} className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50">Clear</button>
        </div>
      </nav>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-2">
        {/* Input column */}
        <section className="flex min-h-0 flex-col rounded-xl border border-neutral-200 bg-white">
          <div className="flex shrink-0 border-b border-neutral-200">
            {TABS.map((k) => (
              <button
                key={k.id}
                onClick={() => setTab(k.id)}
                className={`px-4 py-3 text-sm ${
                  tab === k.id ? "border-b-2 border-neutral-900 font-semibold" : "text-neutral-500"
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {tab === "markdown" && (
              <div className="p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <button onClick={() => fileRef.current?.click()} className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs hover:bg-neutral-50">
                    .md 파일 업로드
                  </button>
                  <input ref={fileRef} type="file" accept=".md,.markdown,text/markdown,text/plain" className="hidden" onChange={onFileUpload} />
                  <button onClick={onParseMarkdown} className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs text-white hover:bg-neutral-800">
                    파싱
                  </button>
                  <span className="text-xs text-neutral-400">H1=이름, H2=섹션</span>
                </div>
                <textarea
                  value={mdText}
                  onChange={(e) => setMdText(e.target.value)}
                  placeholder={`# 이름\n\n## 소개\n한 줄 소개...\n\n## 경력 사항\n### 회사명 Role\n2024 ~ 재직중`}
                  className="h-[calc(100%-44px)] min-h-[320px] w-full rounded-md border border-neutral-200 bg-neutral-50 p-3 font-mono text-xs leading-relaxed"
                />
              </div>
            )}

            {tab === "form" && (
              <div className="space-y-4 p-4 text-sm">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="이름">
                    <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input" />
                  </Field>
                  <Field label="영문명">
                    <input value={profile.nameEn} onChange={(e) => setProfile({ ...profile, nameEn: e.target.value })} className="input" />
                  </Field>
                </div>
                <Field label="직함">
                  <input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} className="input" />
                </Field>
                <Field label="한 줄 소개">
                  <input value={profile.tagline} onChange={(e) => setProfile({ ...profile, tagline: e.target.value })} className="input" />
                </Field>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Field label="Email"><input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="input" /></Field>
                  <Field label="GitHub"><input value={profile.github} onChange={(e) => setProfile({ ...profile, github: e.target.value })} className="input" /></Field>
                  <Field label="Blog"><input value={profile.blog} onChange={(e) => setProfile({ ...profile, blog: e.target.value })} className="input" /></Field>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Field label="LinkedIn"><input value={profile.socials?.linkedin ?? ""} onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, linkedin: e.target.value } })} className="input" /></Field>
                  <Field label="Twitter/X"><input value={profile.socials?.twitter ?? ""} onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, twitter: e.target.value } })} className="input" /></Field>
                  <Field label="Website"><input value={profile.socials?.website ?? ""} onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, website: e.target.value } })} className="input" /></Field>
                </div>
                <Field label="폰트">
                  <select
                    value={profile.fontOverride ?? "theme"}
                    onChange={(e) => setProfile({ ...profile, fontOverride: e.target.value as typeof profile.fontOverride })}
                    className="input"
                  >
                    {fontOrder.map((f) => (
                      <option key={f} value={f}>{fonts[f].label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Skills (쉼표 구분)">
                  <input value={skillsCsv} onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className="input" />
                </Field>
                <ExperienceListEditor
                  items={profile.experience}
                  onChange={(experience) => setProfile({ ...profile, experience })}
                />
                <ProjectListEditor
                  items={profile.projects}
                  onChange={(projects) => setProfile({ ...profile, projects })}
                />
              </div>
            )}

            {tab === "card" && (
              <CardCustomizer
                profile={profile}
                themeId={themeId}
                onChange={(patch) => setProfile({ ...profile, ...patch })}
              />
            )}

            {tab === "deploy" && (
              <div className="p-4">
                <DeployPanel profile={profile} themeId={themeId} onProfileChange={setProfile} />
              </div>
            )}
          </div>
        </section>

        {/* Preview column */}
        <section className="flex min-h-0 flex-col rounded-xl border border-neutral-200 bg-white">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Preview</span>
              <button
                onClick={() => onDownloadPng("front")}
                className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] hover:bg-neutral-50"
              >
                앞면 PNG
              </button>
              <button
                onClick={() => onDownloadPng("back")}
                className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-[11px] hover:bg-neutral-50"
              >
                뒷면 PNG
              </button>
            </div>
            <ThemeSwitcher value={themeId} onChange={setThemeId} />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div
              className="flex flex-col items-center gap-5 p-6"
              style={{ background: t.page.bg, color: t.page.text, fontFamily: resolveFontStack(profile.fontOverride, t.fontSans) }}
            >
              <BusinessCard themeId={themeId} qrDataUrl={qrDataUrl} profile={profile} />
              <p className="text-xs text-center" style={{ color: t.page.muted }}>
                <span className="font-medium" style={{ color: t.page.accent }}>{t.label}</span>
                {" — "}{t.signature}
              </p>
            </div>
            {profile.includeResume !== false && (
              <div className="border-t border-neutral-200">
                <button
                  onClick={() => setShowResume((v) => !v)}
                  className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  <span>이력 미리보기</span>
                  <span className="text-xs text-neutral-500">{showResume ? "▲ 접기" : "▼ 펼치기"}</span>
                </button>
                {showResume && <PortfolioView profile={profile} themeId={themeId} compact />}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Offscreen export nodes */}
      <div style={{ position: "fixed", left: -9999, top: 0, pointerEvents: "none" }} aria-hidden>
        <div ref={exportFrontRef}>
          <FlatCardFace profile={profile} themeId={themeId} side="front" qrDataUrl={qrDataUrl} />
        </div>
        <div ref={exportBackRef}>
          <FlatCardFace profile={profile} themeId={themeId} side="back" qrDataUrl={qrDataUrl} />
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 14px;
          background: #fafafa;
        }
        .input:focus { outline: none; border-color: #0070f3; background: #fff; }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-neutral-500">{label}</span>
      {children}
    </label>
  );
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [m] = next.splice(from, 1);
  next.splice(to, 0, m);
  return next;
}

function RowControls({ onUp, onDown, onDelete }: { onUp: () => void; onDown: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-1">
      <button type="button" onClick={onUp} aria-label="위로" className="h-7 w-7 rounded border border-neutral-200 text-xs hover:bg-neutral-50">↑</button>
      <button type="button" onClick={onDown} aria-label="아래로" className="h-7 w-7 rounded border border-neutral-200 text-xs hover:bg-neutral-50">↓</button>
      <button type="button" onClick={onDelete} aria-label="삭제" className="h-7 w-7 rounded border border-red-200 text-xs text-red-600 hover:bg-red-50">✕</button>
    </div>
  );
}

function ExperienceListEditor({ items, onChange }: { items: Experience[]; onChange: (next: Experience[]) => void }) {
  const update = (i: number, patch: Partial<Experience>) => {
    const next = items.map((x, idx) => (idx === i ? { ...x, ...patch } : x));
    onChange(next);
  };
  const add = () => onChange([...items, { company: "", role: "", period: "", desc: "" }]);
  return (
    <section className="space-y-3 border-t border-neutral-200 pt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">경력 ({items.length})</h3>
        <button type="button" onClick={add} className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs text-white hover:bg-neutral-800">+ 추가</button>
      </div>
      {items.length === 0 && (
        <p className="text-xs text-neutral-400">항목이 없습니다. "+ 추가" 또는 Markdown 탭에서 불러오세요.</p>
      )}
      {items.map((exp, i) => (
        <div key={i} className="rounded-md border border-neutral-200 bg-white p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-neutral-400">#{i + 1}</span>
            <RowControls
              onUp={() => onChange(move(items, i, i - 1))}
              onDown={() => onChange(move(items, i, i + 1))}
              onDelete={() => onChange(items.filter((_, idx) => idx !== i))}
            />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field label="회사"><input className="input" value={exp.company} onChange={(e) => update(i, { company: e.target.value })} /></Field>
            <Field label="직무"><input className="input" value={exp.role} onChange={(e) => update(i, { role: e.target.value })} /></Field>
          </div>
          <Field label="기간"><input className="input" value={exp.period} onChange={(e) => update(i, { period: e.target.value })} placeholder="2024 ~ 재직중" /></Field>
          <Field label="설명"><textarea className="input min-h-[60px]" value={exp.desc} onChange={(e) => update(i, { desc: e.target.value })} /></Field>
        </div>
      ))}
    </section>
  );
}

function ProjectListEditor({ items, onChange }: { items: Project[]; onChange: (next: Project[]) => void }) {
  const update = (i: number, patch: Partial<Project>) => {
    const next = items.map((x, idx) => (idx === i ? { ...x, ...patch } : x));
    onChange(next);
  };
  const add = () => onChange([...items, { name: "", org: "", period: "", stack: [], highlights: [] }]);
  return (
    <section className="space-y-3 border-t border-neutral-200 pt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">프로젝트 ({items.length})</h3>
        <button type="button" onClick={add} className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs text-white hover:bg-neutral-800">+ 추가</button>
      </div>
      {items.length === 0 && (
        <p className="text-xs text-neutral-400">항목이 없습니다. "+ 추가" 또는 Markdown 탭에서 불러오세요.</p>
      )}
      {items.map((proj, i) => (
        <div key={i} className="rounded-md border border-neutral-200 bg-white p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-neutral-400">#{i + 1}</span>
            <RowControls
              onUp={() => onChange(move(items, i, i - 1))}
              onDown={() => onChange(move(items, i, i + 1))}
              onDelete={() => onChange(items.filter((_, idx) => idx !== i))}
            />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field label="이름"><input className="input" value={proj.name} onChange={(e) => update(i, { name: e.target.value })} /></Field>
            <Field label="소속/조직"><input className="input" value={proj.org} onChange={(e) => update(i, { org: e.target.value })} /></Field>
          </div>
          <Field label="기간"><input className="input" value={proj.period} onChange={(e) => update(i, { period: e.target.value })} /></Field>
          <Field label="스택 (쉼표 구분)">
            <input
              className="input"
              value={proj.stack.join(", ")}
              onChange={(e) => update(i, { stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
            />
          </Field>
          <Field label="Highlights (줄바꿈 = 항목)">
            <textarea
              className="input min-h-[80px]"
              value={proj.highlights.join("\n")}
              onChange={(e) => update(i, { highlights: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
            />
          </Field>
        </div>
      ))}
    </section>
  );
}
