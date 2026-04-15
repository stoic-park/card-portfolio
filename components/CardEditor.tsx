"use client";

import { useRef, useState, useEffect } from "react";
import type { Profile, CardCustomization } from "@/lib/schema";
import { themes, type ThemeId } from "@/lib/themes";

type Props = {
  profile: Profile;
  themeId: ThemeId;
  customization: CardCustomization;
  onChange: (c: CardCustomization) => void;
  side?: "front" | "back";
};

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

type Drag =
  | { kind: "none" }
  | { kind: "move"; startX: number; startY: number; initX: number; initY: number; w: number; h: number }
  | { kind: "scale"; startX: number; startY: number; initScale: number; w: number };

export function CardEditor({ profile, themeId, customization, onChange, side = "front" }: Props) {
  const t = themes[themeId];
  const face = side === "front" ? t.card.front : t.card.back;
  const canvasRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<Drag>({ kind: "none" });
  const [hover, setHover] = useState(false);

  const hasImage = !!customization.image;

  useEffect(() => {
    if (drag.kind === "none") return;

    function onMove(e: PointerEvent) {
      e.preventDefault();
      if (drag.kind === "move") {
        const dx = ((e.clientX - drag.startX) / drag.w) * 100;
        const dy = ((e.clientY - drag.startY) / drag.h) * 100;
        onChange({
          ...customization,
          offsetX: clamp(drag.initX + dx, 0, 100),
          offsetY: clamp(drag.initY + dy, 0, 100),
        });
      } else if (drag.kind === "scale") {
        const dx = (e.clientX - drag.startX) / drag.w;
        const next = clamp(drag.initScale + dx * 2.5, 0.5, 3);
        onChange({ ...customization, scale: next });
      }
    }
    function onUp() {
      setDrag({ kind: "none" });
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [drag, customization, onChange]);

  function startMove(e: React.PointerEvent) {
    if (!hasImage) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDrag({
      kind: "move",
      startX: e.clientX,
      startY: e.clientY,
      initX: customization.offsetX,
      initY: customization.offsetY,
      w: rect.width,
      h: rect.height,
    });
  }

  function startScale(e: React.PointerEvent) {
    e.stopPropagation();
    if (!hasImage) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDrag({
      kind: "scale",
      startX: e.clientX,
      startY: e.clientY,
      initScale: customization.scale,
      w: rect.width,
    });
  }

  function onWheel(e: React.WheelEvent) {
    if (!hasImage) return;
    e.preventDefault();
    const delta = -e.deltaY * 0.002;
    onChange({ ...customization, scale: clamp(customization.scale + delta, 0.5, 3) });
  }

  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div
        ref={canvasRef}
        onPointerDown={startMove}
        onWheel={onWheel}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative overflow-hidden rounded-2xl select-none touch-none"
        style={{
          aspectRatio: "1.75 / 1",
          background: face.bg,
          color: face.text,
          boxShadow: face.shadow,
          cursor: hasImage ? (drag.kind === "move" ? "grabbing" : "grab") : "default",
        }}
      >
        {hasImage && (
          <>
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url(${customization.image})`,
                backgroundSize: `${customization.scale * 100}%`,
                backgroundPosition: `${customization.offsetX}% ${customization.offsetY}%`,
                backgroundRepeat: "no-repeat",
                opacity: customization.opacity,
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

        {/* Text preview */}
        {side === "front" ? (
          <div className="relative z-10 flex h-full flex-col justify-between p-6" style={{ fontFamily: t.fontSans }}>
            <div>
              <div
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em]"
                style={{ color: face.muted }}
              >
                <span style={{ color: face.accent }}>●</span>
                <span>Portfolio Card · {t.label}</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold">{profile.name || "Name"}</h2>
              <p className="mt-1 text-sm" style={{ color: face.muted }}>{profile.nameEn}</p>
            </div>
            <div>
              <p className="text-base font-semibold" style={{ color: face.accent }}>{profile.title}</p>
              <p className="mt-1 text-xs" style={{ color: face.muted }}>{profile.tagline}</p>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex h-full items-center gap-4 p-5" style={{ fontFamily: t.fontSans }}>
            <div
              className="shrink-0 flex h-[110px] w-[110px] items-center justify-center rounded-lg text-[10px]"
              style={{ background: t.card.qrBg, color: "#999" }}
            >
              QR
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: face.muted }}>Scan or tap</div>
              <p className="mt-1 truncate text-sm font-semibold">{profile.email || "email@example.com"}</p>
              <p className="truncate text-xs" style={{ color: face.muted }}>{profile.github.replace(/^https?:\/\//, "")}</p>
              <p className="truncate text-xs" style={{ color: face.muted }}>{profile.blog.replace(/^https?:\/\//, "")}</p>
            </div>
          </div>
        )}

        {/* Scale handle */}
        {hasImage && (
          <button
            type="button"
            onPointerDown={startScale}
            aria-label="크기 조정 핸들"
            className="absolute bottom-2 right-2 z-20 h-5 w-5 rounded-full border-2 border-white bg-black/70 cursor-nwse-resize"
            style={{ touchAction: "none" }}
          />
        )}

        {/* Drop hint */}
        {!hasImage && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <p className="text-xs" style={{ color: face.muted }}>
              위의 "배경 이미지 업로드" 버튼으로 시작하세요
            </p>
          </div>
        )}

        {/* Grid guide while dragging */}
        {hasImage && (drag.kind !== "none" || hover) && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "33.333% 33.333%",
            }}
          />
        )}
      </div>
      <p className="mt-2 text-center text-xs text-neutral-500">
        드래그 = 위치 · 휠/우하단 핸들 드래그 = 크기
      </p>
    </div>
  );
}
