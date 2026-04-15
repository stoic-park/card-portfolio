import type { Profile } from "@/lib/schema";
import { themes, type ThemeId } from "@/lib/themes";
import { resolveFontStack } from "@/lib/fonts";
import { SocialLinks } from "./SocialLinks";

type Props = {
  profile: Profile;
  themeId?: ThemeId;
  compact?: boolean;
};

export function PortfolioView({ profile, themeId = "vercel", compact = false }: Props) {
  const t = themes[themeId];
  const padX = compact ? "px-4" : "px-6";
  const padY = compact ? "py-8" : "py-16";
  return (
    <div
      className={`${padX} ${padY} mx-auto max-w-3xl`}
      style={{ background: t.page.bg, color: t.page.text, fontFamily: resolveFontStack(profile.fontOverride, t.fontSans) }}
    >
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">{profile.name || "이름 없음"}</h1>
        <p className="mt-2 text-lg" style={{ color: t.page.muted }}>
          {profile.title}{profile.title && profile.tagline ? " · " : ""}{profile.tagline}
        </p>
        <div className="mt-5">
          <SocialLinks profile={profile} color={t.page.text} muted={t.page.muted} />
        </div>
        <p className="mt-3 text-xs" style={{ color: t.page.muted }}>
          상세 프로젝트·코드는 위 링크에서 확인하세요.
        </p>
      </header>

      {profile.skills.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: t.page.muted }}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span
                key={s}
                className="rounded-full px-3 py-1 text-sm"
                style={{ border: `1px solid ${t.page.muted}44`, color: t.page.text }}
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {profile.experience.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: t.page.muted }}>
            Experience
          </h2>
          <ul className="space-y-5">
            {profile.experience.map((e, i) => (
              <li key={`${e.company}-${i}`} className="pl-4" style={{ borderLeft: `2px solid ${t.page.accent}55` }}>
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-lg font-semibold">{e.company}</h3>
                  <span className="text-sm" style={{ color: t.page.muted }}>{e.role}</span>
                  <span className="ml-auto text-xs" style={{ color: t.page.muted }}>{e.period}</span>
                </div>
                {e.desc && <p className="mt-1 text-sm" style={{ color: t.page.text }}>{e.desc}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {profile.projects.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: t.page.muted }}>
            Projects
          </h2>
          <ul className="space-y-7">
            {profile.projects.map((p, i) => (
              <li key={`${p.name}-${i}`}>
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  {p.org && <span className="text-sm" style={{ color: t.page.muted }}>{p.org}</span>}
                  {p.period && <span className="ml-auto text-xs" style={{ color: t.page.muted }}>{p.period}</span>}
                </div>
                {p.stack.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded px-2 py-0.5 text-xs"
                        style={{ background: `${t.page.accent}14`, color: t.page.text }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                {p.highlights.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                    {p.highlights.map((h, j) => <li key={j}>{h}</li>)}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
