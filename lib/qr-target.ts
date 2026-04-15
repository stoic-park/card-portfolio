import type { Profile, QrTarget } from "./schema";
import { defaultQrTarget } from "./schema";

export function slugify(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 52);
}

export function getProjectSlug(profile: Profile): string {
  return slugify(profile.projectName || profile.name) || "card";
}

export function getPredictedSiteUrl(profile: Profile): string {
  return `https://${getProjectSlug(profile)}.vercel.app`;
}

export function getQrTarget(profile: Profile): QrTarget {
  return profile.qr ?? defaultQrTarget;
}

export function resolveQrUrl(profile: Profile): string {
  const q = getQrTarget(profile);
  const site = getPredictedSiteUrl(profile);
  if (q.mode === "custom" && q.customUrl) return q.customUrl;
  if (q.mode === "siteAnchor") return `${site}/#resume`;
  return site;
}
