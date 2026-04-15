"use client";

import { themes, themeOrder, type ThemeId } from "@/lib/themes";

type Props = {
  value: ThemeId;
  onChange: (id: ThemeId) => void;
};

export function ThemeSwitcher({ value, onChange }: Props) {
  const current = themes[value];
  return (
    <div
      className="inline-flex rounded-full p-1 backdrop-blur"
      style={{
        background: "rgba(127,127,127,0.1)",
        border: `1px solid ${current.page.muted}33`,
      }}
    >
      {themeOrder.map((id) => {
        const t = themes[id];
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className="rounded-full px-3 py-1 text-xs font-medium transition"
            style={
              active
                ? { background: t.page.accent, color: "#ffffff" }
                : { color: current.page.muted, background: "transparent" }
            }
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
