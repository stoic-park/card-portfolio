"use client";

import { useState } from "react";
import Link from "next/link";
import { BusinessCard } from "./BusinessCard";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { defaultTheme, themes, type ThemeId } from "@/lib/themes";
import type { Profile } from "@/lib/schema";

export function CardScene({ qrDataUrl, profile }: { qrDataUrl: string; profile?: Profile }) {
  const [themeId, setThemeId] = useState<ThemeId>(defaultTheme);
  const t = themes[themeId];

  return (
    <main
      className="min-h-dvh flex flex-col items-center justify-center gap-8 p-6"
      style={{ background: t.page.bg, color: t.page.text, fontFamily: t.fontSans }}
    >
      <ThemeSwitcher value={themeId} onChange={setThemeId} />
      <BusinessCard themeId={themeId} qrDataUrl={qrDataUrl} profile={profile} />
      <p className="text-xs text-center max-w-xs" style={{ color: t.page.muted }}>
        <span className="font-medium" style={{ color: t.page.accent }}>{t.label}</span>
        {" — "}
        {t.signature}
      </p>
      <Link href="/studio" className="text-xs underline underline-offset-4" style={{ color: t.page.accent }}>
        직접 만들어보기 → Studio
      </Link>
    </main>
  );
}
