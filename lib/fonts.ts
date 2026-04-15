import type { FontChoice } from "./schema";

export type FontDef = {
  id: FontChoice;
  label: string;
  stack: string;
  cssImport?: string;
};

export const fonts: Record<FontChoice, FontDef> = {
  theme: {
    id: "theme",
    label: "테마 기본",
    stack: "",
  },
  pretendard: {
    id: "pretendard",
    label: "Pretendard (한글)",
    stack: "'Pretendard Variable', Pretendard, system-ui, sans-serif",
    cssImport: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css",
  },
  notoSansKr: {
    id: "notoSansKr",
    label: "Noto Sans KR",
    stack: "'Noto Sans KR', system-ui, sans-serif",
    cssImport: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap",
  },
  inter: {
    id: "inter",
    label: "Inter",
    stack: "'Inter Variable', Inter, system-ui, sans-serif",
    cssImport: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
  },
  geist: {
    id: "geist",
    label: "Geist",
    stack: "'Geist', 'Inter Variable', system-ui, sans-serif",
    cssImport: "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap",
  },
};

export const fontOrder: FontChoice[] = ["theme", "pretendard", "notoSansKr", "inter", "geist"];

export function resolveFontStack(choice: FontChoice | undefined, themeStack: string): string {
  if (!choice || choice === "theme") return themeStack;
  return fonts[choice].stack;
}

export function collectFontImports(choice: FontChoice | undefined): string[] {
  if (!choice || choice === "theme") return [];
  const def = fonts[choice];
  return def.cssImport ? [def.cssImport] : [];
}
