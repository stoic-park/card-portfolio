"use client";

import { useState } from "react";
import Link from "next/link";
import { defaultProfile } from "@/lib/profile";
import type { Profile } from "@/lib/schema";
import { themes, type ThemeId } from "@/lib/themes";
import { resolveFontStack } from "@/lib/fonts";

type Props = {
  themeId: ThemeId;
  qrDataUrl: string;
  portfolioPath?: string;
  profile?: Profile;
};

export function BusinessCard({ themeId, qrDataUrl, portfolioPath = "/portfolio", profile = defaultProfile }: Props) {
  const [flipped, setFlipped] = useState(false);
  const t = themes[themeId];
  const { front, back, qrBg } = t.card;

  return (
    <div className="perspective-1000 w-full max-w-[420px]" style={{ fontFamily: resolveFontStack(profile.fontOverride, t.fontSans) }}>
      <button
        type="button"
        aria-label="명함 뒤집기"
        onClick={() => setFlipped((v) => !v)}
        className="relative block w-full preserve-3d transition-transform duration-700 ease-out aspect-[1.75/1]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col justify-between overflow-hidden"
          style={{ background: front.bg, color: front.text, boxShadow: front.shadow }}
        >
          {profile.card?.image && (
            <>
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${profile.card.image})`,
                  backgroundSize: `${profile.card.scale * 100}%`,
                  backgroundPosition: `${profile.card.offsetX}% ${profile.card.offsetY}%`,
                  backgroundRepeat: "no-repeat",
                  opacity: profile.card.opacity,
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, transparent 0%, ${front.bg.includes("gradient") ? "rgba(0,0,0,0.35)" : front.bg} 100%)`,
                  opacity: 0.55,
                  mixBlendMode: "multiply",
                }}
              />
            </>
          )}
          <div className="relative text-left">
            <div
              className="text-[10px] tracking-[0.25em] uppercase flex items-center gap-1.5"
              style={{ color: front.muted }}
            >
              <span style={{ color: front.accent }}>●</span>
              <span>Portfolio Card · {t.label}</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">{profile.name}</h1>
            <p className="mt-1 text-sm" style={{ color: front.muted }}>
              {profile.nameEn}
            </p>
          </div>
          <div className="relative text-left">
            <p className="text-base font-semibold" style={{ color: front.accent }}>
              {profile.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: front.muted }}>
              {profile.tagline}
            </p>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-5 flex items-center gap-4 overflow-hidden"
          style={{ background: back.bg, color: back.text, boxShadow: back.shadow }}
        >
          {profile.cardBack?.image && (
            <>
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${profile.cardBack.image})`,
                  backgroundSize: `${profile.cardBack.scale * 100}%`,
                  backgroundPosition: `${profile.cardBack.offsetX}% ${profile.cardBack.offsetY}%`,
                  backgroundRepeat: "no-repeat",
                  opacity: profile.cardBack.opacity,
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.45) 100%)",
                  mixBlendMode: "multiply",
                }}
              />
            </>
          )}
          <div
            className="relative z-10 shrink-0 rounded-lg p-2"
            style={{ background: qrBg }}
          >
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="포트폴리오 QR" width={110} height={110} />
            ) : (
              <div className="h-[110px] w-[110px]" style={{ background: "#e5e5e5" }} />
            )}
          </div>
          <div className="relative z-10 min-w-0 flex-1 text-left">
            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: back.muted }}>
              Scan or tap
            </p>
            <p className="mt-1 text-sm font-semibold truncate">{profile.email}</p>
            <p className="mt-0.5 text-xs truncate" style={{ color: back.muted }}>
              {profile.github.replace("https://", "")}
            </p>
            <p className="text-xs truncate" style={{ color: back.muted }}>
              {profile.blog.replace("https://", "")}
            </p>
          </div>
        </div>
      </button>

      <div className="mt-4 flex items-center justify-between text-xs" style={{ color: t.page.muted }}>
        <span>탭하여 앞/뒤 전환</span>
        <Link
          href={portfolioPath}
          className="underline underline-offset-4"
          style={{ color: t.page.accent }}
        >
          포트폴리오 보기 →
        </Link>
      </div>
    </div>
  );
}
