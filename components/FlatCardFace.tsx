import type { Profile } from "@/lib/schema";
import { themes, type ThemeId } from "@/lib/themes";
import { resolveFontStack } from "@/lib/fonts";

type Props = {
  profile: Profile;
  themeId: ThemeId;
  side: "front" | "back";
  qrDataUrl: string;
  width?: number;
};

function stripProto(s: string) {
  return s.replace(/^https?:\/\//, "");
}

export function FlatCardFace({ profile, themeId, side, qrDataUrl, width = 840 }: Props) {
  const t = themes[themeId];
  const height = Math.round(width / 1.75);
  const face = side === "front" ? t.card.front : t.card.back;
  const bg = side === "front" ? profile.card : profile.cardBack;
  const fontFamily = resolveFontStack(profile.fontOverride, t.fontSans);

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        borderRadius: 24,
        overflow: "hidden",
        background: face.bg,
        color: face.text,
        boxShadow: face.shadow,
        fontFamily,
      }}
    >
      {bg?.image && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${bg.image})`,
              backgroundSize: `${bg.scale * 100}%`,
              backgroundPosition: `${bg.offsetX}% ${bg.offsetY}%`,
              backgroundRepeat: "no-repeat",
              opacity: bg.opacity,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.45) 100%)",
              mixBlendMode: "multiply",
            }}
          />
        </>
      )}

      {side === "front" ? (
        <div style={{ position: "relative", zIndex: 1, height: "100%", padding: 48, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: face.muted, fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase" }}>
              <span style={{ color: face.accent }}>●</span> Portfolio Card · {t.label}
            </div>
            <h1 style={{ margin: "16px 0 4px", fontSize: 56, fontWeight: 700, letterSpacing: "-0.01em" }}>{profile.name || "Name"}</h1>
            <p style={{ margin: 0, fontSize: 18, color: face.muted }}>{profile.nameEn}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 600, color: face.accent }}>{profile.title}</p>
            <p style={{ margin: "6px 0 0", fontSize: 16, color: face.muted }}>{profile.tagline}</p>
          </div>
        </div>
      ) : (
        <div style={{ position: "relative", zIndex: 1, height: "100%", padding: 36, display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ flex: "0 0 auto", padding: 12, borderRadius: 16, background: t.card.qrBg }}>
            {qrDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="QR" width={180} height={180} style={{ display: "block" }} />
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ color: face.muted, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>Scan or tap</div>
            <p style={{ margin: "6px 0 2px", fontSize: 22, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile.email}</p>
            <p style={{ margin: 0, fontSize: 15, color: face.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{stripProto(profile.github)}</p>
            <p style={{ margin: 0, fontSize: 15, color: face.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{stripProto(profile.blog)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
