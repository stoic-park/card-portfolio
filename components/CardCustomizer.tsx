"use client";

import { useRef, useState } from "react";
import type { Profile, CardCustomization } from "@/lib/schema";
import { defaultCardCustomization } from "@/lib/schema";
import type { ThemeId } from "@/lib/themes";
import { CardEditor } from "./CardEditor";

type Side = "front" | "back";

type Props = {
  profile: Profile;
  themeId: ThemeId;
  onChange: (partial: { card?: CardCustomization; cardBack?: CardCustomization }) => void;
};

async function resizeImage(file: File, maxWidth = 1024): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ""));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("image load failed"));
    el.src = dataUrl;
  });
  if (img.width <= maxWidth) return dataUrl;
  const ratio = maxWidth / img.width;
  const canvas = document.createElement("canvas");
  canvas.width = maxWidth;
  canvas.height = Math.round(img.height * ratio);
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.88);
}

export function CardCustomizer({ profile, themeId, onChange }: Props) {
  const [side, setSide] = useState<Side>("front");
  const fileRef = useRef<HTMLInputElement>(null);

  const current: CardCustomization =
    (side === "front" ? profile.card : profile.cardBack) ?? defaultCardCustomization;

  const update = (next: CardCustomization | undefined) => {
    if (side === "front") onChange({ card: next });
    else onChange({ cardBack: next });
  };
  const patch = (p: Partial<CardCustomization>) => update({ ...current, ...p });

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const dataUrl = await resizeImage(f);
    patch({ image: dataUrl });
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-4 p-4 text-sm">
      <div className="inline-flex rounded-full border border-neutral-200 bg-white p-1">
        {(["front", "back"] as Side[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSide(s)}
            className={`rounded-full px-3 py-1 text-xs transition ${
              side === s ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-50"
            }`}
          >
            {s === "front" ? "앞면" : "뒷면"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => fileRef.current?.click()} className="btn btn-sm btn-secondary">
          {current.image ? "이미지 교체" : "배경 이미지 업로드"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        {current.image && (
          <button onClick={() => update(undefined)} className="btn btn-sm btn-danger">
            이미지 제거
          </button>
        )}
        <span className="text-xs text-neutral-400">{side === "front" ? "앞면" : "뒷면"} 편집 중</span>
      </div>

      {current.image && (
        <CardEditor profile={profile} themeId={themeId} customization={current} onChange={update} side={side} />
      )}

      {current.image && (
        <div className="space-y-3">
          <Slider label="크기" min={0.5} max={3} step={0.05} value={current.scale} onChange={(v) => patch({ scale: v })} format={(v) => `${Math.round(v * 100)}%`} />
          <Slider label="가로 위치" min={0} max={100} step={1} value={current.offsetX} onChange={(v) => patch({ offsetX: v })} format={(v) => `${v}%`} />
          <Slider label="세로 위치" min={0} max={100} step={1} value={current.offsetY} onChange={(v) => patch({ offsetY: v })} format={(v) => `${v}%`} />
          <Slider label="불투명도" min={0} max={1} step={0.05} value={current.opacity} onChange={(v) => patch({ opacity: v })} format={(v) => `${Math.round(v * 100)}%`} />
          <div className="flex gap-2">
            <button
              onClick={() => update({ ...defaultCardCustomization, image: current.image })}
              className="btn btn-sm btn-secondary"
            >
              위치/크기 초기화
            </button>
          </div>
          <p className="text-xs text-neutral-500">
            이미지는 1024px로 리사이즈 후 localStorage 저장, 배포 HTML에도 인라인 포함됩니다.
          </p>
        </div>
      )}
    </div>
  );
}

function Slider({
  label, min, max, step, value, onChange, format,
}: {
  label: string; min: number; max: number; step: number;
  value: number; onChange: (v: number) => void; format: (v: number) => string;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-xs font-medium text-neutral-500">{label}</span>
        <span className="text-xs tabular-nums text-neutral-700">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </label>
  );
}
