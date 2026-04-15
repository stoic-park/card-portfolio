import type { Profile } from "./schema";

const KEY = "card-portfolio:profile:v1";
const THEME_KEY = "card-portfolio:theme:v1";

export function saveProfile(p: Profile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}

export function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveTheme(id: string): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(THEME_KEY, id); } catch {}
}

export function loadTheme(): string | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(THEME_KEY); } catch { return null; }
}
