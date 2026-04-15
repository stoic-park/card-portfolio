import type { Profile } from "@/lib/schema";

type Item = { label: string; href: string; icon: React.ReactNode };

function iconGithub() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.21.08 1.85 1.25 1.85 1.25 1.08 1.85 2.82 1.32 3.51 1.01.11-.78.42-1.32.77-1.63-2.67-.3-5.47-1.34-5.47-5.97 0-1.32.47-2.4 1.24-3.24-.13-.3-.54-1.54.12-3.21 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.67 1.67.25 2.91.12 3.21.77.84 1.23 1.92 1.23 3.24 0 4.64-2.8 5.67-5.48 5.97.43.37.81 1.1.81 2.23v3.3c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"/>
    </svg>
  );
}
function iconLinkedin() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.4-1.85 3.63 0 4.3 2.39 4.3 5.5v6.24ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z"/>
    </svg>
  );
}
function iconTwitter() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.85l-5.36-6.98L3.9 22H1.14l6.97-7.96L1.5 2h7l4.85 6.4L18.24 2Zm-1.2 18h1.87L7.04 4H5.1l11.94 16Z"/>
    </svg>
  );
}
function iconGlobe() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}
function iconMail() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 7 9-7" />
    </svg>
  );
}

export function SocialLinks({ profile, color, muted }: { profile: Profile; color: string; muted: string }) {
  const items: Item[] = [];
  if (profile.email) items.push({ label: "Email", href: `mailto:${profile.email}`, icon: iconMail() });
  if (profile.github) items.push({ label: "GitHub", href: profile.github, icon: iconGithub() });
  if (profile.socials?.linkedin) items.push({ label: "LinkedIn", href: profile.socials.linkedin, icon: iconLinkedin() });
  if (profile.socials?.twitter) items.push({ label: "Twitter/X", href: profile.socials.twitter, icon: iconTwitter() });
  const site = profile.socials?.website || profile.blog;
  if (site) items.push({ label: "Website", href: site, icon: iconGlobe() });

  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap items-center gap-2">
      {items.map((i) => (
        <li key={i.label}>
          <a
            href={i.href}
            target="_blank"
            rel="noreferrer"
            title={i.label}
            aria-label={i.label}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:scale-105"
            style={{ border: `1px solid ${muted}44`, color }}
          >
            {i.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
