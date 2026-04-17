import QRCode from "qrcode";
import type { Profile } from "./schema";
import { themes, type ThemeId } from "./themes";
import { resolveFontStack, collectFontImports } from "./fonts";

function esc(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function stripProto(s: string): string {
  return s.replace(/^https?:\/\//, "");
}

function socialSvg(kind: string): string {
  const icons: Record<string, string> = {
    mail: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></svg>`,
    github: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.21.08 1.85 1.25 1.85 1.25 1.08 1.85 2.82 1.32 3.51 1.01.11-.78.42-1.32.77-1.63-2.67-.3-5.47-1.34-5.47-5.97 0-1.32.47-2.4 1.24-3.24-.13-.3-.54-1.54.12-3.21 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.67 1.67.25 2.91.12 3.21.77.84 1.23 1.92 1.23 3.24 0 4.64-2.8 5.67-5.48 5.97.43.37.81 1.1.81 2.23v3.3c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.4-1.85 3.63 0 4.3 2.39 4.3 5.5v6.24ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z"/></svg>`,
    twitter: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.85l-5.36-6.98L3.9 22H1.14l6.97-7.96L1.5 2h7l4.85 6.4L18.24 2Zm-1.2 18h1.87L7.04 4H5.1l11.94 16Z"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`,
  };
  return icons[kind] ?? "";
}

function socialLinks(p: Profile): string {
  const items: Array<{ href: string; label: string; icon: string }> = [];
  if (p.email) items.push({ href: `mailto:${p.email}`, label: "Email", icon: "mail" });
  if (p.github) items.push({ href: p.github, label: "GitHub", icon: "github" });
  if (p.socials?.linkedin) items.push({ href: p.socials.linkedin, label: "LinkedIn", icon: "linkedin" });
  if (p.socials?.twitter) items.push({ href: p.socials.twitter, label: "Twitter", icon: "twitter" });
  const site = p.socials?.website || p.blog;
  if (site) items.push({ href: site, label: "Website", icon: "globe" });
  if (items.length === 0) return "";
  return `<ul class="socials">${items
    .map(
      (i) =>
        `<li><a href="${esc(i.href)}" target="_blank" rel="noreferrer" title="${esc(i.label)}" aria-label="${esc(i.label)}">${socialSvg(i.icon)}</a></li>`
    )
    .join("")}</ul>`;
}

function resumeHtml(p: Profile): string {
  const exp = p.experience
    .map(
      (e) => `
    <li class="item">
      <div class="row"><h3>${esc(e.company)}</h3><span class="muted">${esc(e.role)}</span><span class="period">${esc(e.period)}</span></div>
      ${e.desc ? `<p>${esc(e.desc)}</p>` : ""}
    </li>`
    )
    .join("");
  const proj = p.projects
    .map(
      (x) => `
    <li class="item">
      <div class="row"><h3>${esc(x.name)}</h3>${x.org ? `<span class="muted">${esc(x.org)}</span>` : ""}${x.period ? `<span class="period">${esc(x.period)}</span>` : ""}</div>
      ${x.stack.length ? `<div class="chips">${x.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>` : ""}
      ${x.highlights.length ? `<ul class="bullets">${x.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
    </li>`
    )
    .join("");
  const skills = p.skills.length
    ? `<section><h2>Skills</h2><div class="chips chips-lg">${p.skills.map((s) => `<span>${esc(s)}</span>`).join("")}</div></section>`
    : "";
  return `
  <section class="resume" id="resume">
    <h1>${esc(p.name || "Name")}</h1>
    <p class="lede">${esc(p.title)}${p.title && p.tagline ? " · " : ""}${esc(p.tagline)}</p>
    ${socialLinks(p)}
    <p class="hint">상세 프로젝트·코드는 위 링크에서 확인하세요.</p>
    ${skills}
    ${p.experience.length ? `<section><h2>Experience</h2><ul class="list">${exp}</ul></section>` : ""}
    ${p.projects.length ? `<section><h2>Projects</h2><ul class="list">${proj}</ul></section>` : ""}
  </section>`;
}

export async function generateSite(
  profile: Profile,
  themeId: ThemeId,
  qrTargetUrl: string
): Promise<Record<string, string>> {
  const t = themes[themeId];
  const isDark = themeId === "linear" || themeId === "spotify";
  const qr = await QRCode.toDataURL(qrTargetUrl, {
    margin: 1,
    width: 320,
    color: { dark: "#111111", light: "#ffffff" },
  });

  const css = `
  :root {
    --page-bg: ${t.page.bg.includes("gradient") ? "transparent" : t.page.bg};
    --page-text: ${t.page.text};
    --page-muted: ${t.page.muted};
    --page-accent: ${t.page.accent};
    --card-front-bg: ${t.card.front.bg};
    --card-front-text: ${t.card.front.text};
    --card-front-muted: ${t.card.front.muted};
    --card-front-accent: ${t.card.front.accent};
    --card-front-shadow: ${t.card.front.shadow};
    --card-back-bg: ${t.card.back.bg};
    --card-back-text: ${t.card.back.text};
    --card-back-muted: ${t.card.back.muted};
    --card-back-accent: ${t.card.back.accent};
    --card-back-shadow: ${t.card.back.shadow};
    --qr-bg: ${t.card.qrBg};
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    background: ${t.page.bg};
    color: var(--page-text);
    font-family: ${resolveFontStack(profile.fontOverride, t.fontSans)};
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    color-scheme: ${isDark ? "dark" : "light"};
  }
  a { color: inherit; }
  .card-scene {
    min-height: 100dvh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; padding: 24px; overflow-x: clip; position: relative;
  }
  .card-glow {
    position: absolute; top: 50%; left: 50%;
    width: min(55vw, 400px); height: min(55vw, 400px);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: radial-gradient(closest-side, ${t.page.accent} 0%, transparent 100%);
    filter: blur(80px);
    opacity: ${isDark ? 0.30 : 0.20};
    pointer-events: none;
    z-index: 0;
  }
  .perspective { perspective: 1000px; width: 100%; max-width: 560px; position: relative; z-index: 1; }
  @media (orientation: portrait) and (max-width: 640px) {
    .card-scene { padding: 16px; gap: 16px; }
    .perspective {
      /* Rotated width must yield visual width <= 92vw (rotated width = pre / 1.75) */
      --rot-w: min(82dvh, calc(92vw * 1.75));
      width: var(--rot-w);
      max-width: none;
      transform: rotate(90deg);
      margin: calc((var(--rot-w) - var(--rot-w) / 1.75) / 2) 0;
    }
  }
  .card {
    position: relative; aspect-ratio: 1.75/1; transform-style: preserve-3d; transition: transform .7s ease; cursor: pointer; background: transparent; border: 0; padding: 0; width: 100%;
  }
  .card.flipped { transform: rotateY(180deg); }
  .face {
    position: absolute; inset: 0; backface-visibility: hidden; border-radius: 16px; padding: 24px; display: flex; overflow: hidden;
  }
  .face.front {
    background: var(--card-front-bg); color: var(--card-front-text); box-shadow: var(--card-front-shadow);
    flex-direction: column; justify-content: space-between; text-align: left;
  }
  .card-bg { position: absolute; inset: 0; background-repeat: no-repeat; }
  .card-scrim { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%); mix-blend-mode: multiply; pointer-events: none; }
  .front-layer { position: relative; z-index: 1; }
  .face.back {
    background: var(--card-back-bg); color: var(--card-back-text); box-shadow: var(--card-back-shadow);
    transform: rotateY(180deg); align-items: center; gap: 16px; padding: 20px;
  }
  .eyebrow { font-size: 10px; letter-spacing: .25em; text-transform: uppercase; color: var(--card-front-muted); display: inline-flex; align-items: center; gap: 6px; }
  .eyebrow i { color: var(--card-front-accent); font-style: normal; }
  .name { margin: 12px 0 4px; font-size: 28px; font-weight: 700; letter-spacing: -0.01em; }
  .subname { margin: 0; font-size: 13px; color: var(--card-front-muted); }
  .role { margin: 0; font-size: 16px; font-weight: 600; color: var(--card-front-accent); }
  .tagline { margin-top: 4px; font-size: 12px; line-height: 1.5; color: var(--card-front-muted); }
  .qr { flex: 0 0 auto; padding: 8px; border-radius: 10px; background: var(--qr-bg); }
  .qr img { display: block; width: 110px; height: 110px; }
  .back-info { flex: 1; min-width: 0; }
  .back-eyebrow { font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: var(--card-back-muted); }
  .back-primary { margin: 4px 0 2px; font-size: 14px; font-weight: 600; }
  .back-sub {
    margin: 0; font-size: 12px; color: var(--card-back-muted);
    overflow: hidden; text-overflow: ellipsis; overflow-wrap: anywhere; word-break: break-word;
    display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; line-clamp: 1;
  }
  .scroll-hint {
    font-size: 13px; color: var(--page-muted); text-decoration: none;
    display: inline-flex; align-items: center; justify-content: center;
    min-height: 44px; padding: 0 16px; border-radius: 999px; position: relative; z-index: 1;
  }
  .scroll-hint:hover { color: var(--page-accent); background: color-mix(in srgb, var(--page-muted) 8%, transparent); }
  .resume {
    max-width: 720px; margin: 0 auto;
    padding: clamp(32px, 6vw, 64px) clamp(16px, 4vw, 24px) clamp(48px, 8vw, 96px);
    overflow-wrap: anywhere;
  }
  .resume h1 { font-size: clamp(28px, 6vw, 36px); font-weight: 700; letter-spacing: -0.01em; margin: 0; }
  .resume .lede { margin: 8px 0 20px; font-size: clamp(15px, 2.5vw, 18px); color: var(--page-muted); }
  .resume h2 { font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: var(--page-muted); font-weight: 600; margin: 36px 0 14px; }
  .resume h3 { margin: 0; font-size: clamp(15px, 2.4vw, 17px); font-weight: 600; }
  .resume p { margin: 6px 0; font-size: 15px; line-height: 1.55; }
  .hint { font-size: 12px; color: var(--page-muted); margin: 12px 0 0; }
  .socials { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
  .socials a {
    display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--page-muted) 30%, transparent); color: var(--page-text); transition: transform .15s ease;
  }
  .socials a:hover { transform: scale(1.06); color: var(--page-accent); }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .chips span { font-size: 12px; padding: 2px 8px; border-radius: 4px; background: color-mix(in srgb, var(--page-accent) 10%, transparent); }
  .chips-lg span { font-size: 13px; padding: 4px 10px; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--page-muted) 30%, transparent); background: transparent; }
  .list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 20px; }
  .item { padding-left: 14px; border-left: 2px solid color-mix(in srgb, var(--page-accent) 35%, transparent); }
  .item .row { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; }
  .item .muted, .item .period { font-size: 13px; color: var(--page-muted); }
  .item .period { margin-left: auto; font-size: 12px; }
  .bullets { margin: 10px 0 0; padding-left: 20px; font-size: 14px; }
  .bullets li { margin: 4px 0; }
  .signature { font-size: 11px; color: var(--page-muted); text-align: center; position: relative; z-index: 1; }
  .signature b { color: var(--page-accent); font-weight: 500; }
  `;

  const siteUrl = qrTargetUrl;
  const title = `${profile.name || "Portfolio"} — ${profile.title || "Developer"}`;
  const description = profile.tagline || "Card + portfolio";

  const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="${isDark ? "dark" : "light"}"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(description)}"/>
<meta property="og:url" content="${esc(siteUrl)}"/>
${collectFontImports(profile.fontOverride).map((u) => `<link rel="stylesheet" href="${esc(u)}"/>`).join("\n")}
<style>${css}</style>
</head>
<body>
<section class="card-scene">
  <div class="card-glow"></div>
  <div class="perspective">
    <button class="card" id="card" type="button" aria-label="명함 뒤집기">
      <div class="face front">
        ${
          profile.card?.image
            ? `<div class="card-bg" style="background-image:url('${profile.card.image}');background-size:${(profile.card.scale ?? 1) * 100}%;background-position:${profile.card.offsetX ?? 50}% ${profile.card.offsetY ?? 50}%;opacity:${profile.card.opacity ?? 1};"></div><div class="card-scrim"></div>`
            : ""
        }
        <div class="front-layer">
          <span class="eyebrow"><i>●</i> Portfolio Card · ${esc(t.label)}</span>
          <h1 class="name">${esc(profile.name || "Name")}</h1>
          <p class="subname">${esc(profile.nameEn)}</p>
        </div>
        <div class="front-layer">
          <p class="role">${esc(profile.title)}</p>
          <p class="tagline">${esc(profile.tagline)}</p>
        </div>
      </div>
      <div class="face back">
        ${
          profile.cardBack?.image
            ? `<div class="card-bg" style="background-image:url('${profile.cardBack.image}');background-size:${(profile.cardBack.scale ?? 1) * 100}%;background-position:${profile.cardBack.offsetX ?? 50}% ${profile.cardBack.offsetY ?? 50}%;opacity:${profile.cardBack.opacity ?? 1};"></div><div class="card-scrim"></div>`
            : ""
        }
        <div class="front-layer qr"><img src="${qr}" alt="QR"/></div>
        <div class="front-layer back-info">
          <div class="back-eyebrow">Scan or tap</div>
          <p class="back-primary">${esc(profile.email)}</p>
          <p class="back-sub">${esc(stripProto(profile.github))}</p>
          <p class="back-sub">${esc(stripProto(profile.blog))}</p>
        </div>
      </div>
    </button>
  </div>
  <p class="signature"><b>${esc(t.label)}</b> — ${esc(t.signature)}</p>
  ${profile.includeResume === false ? "" : '<a class="scroll-hint" href="#resume">↓ 이력 보기</a>'}
</section>
${profile.includeResume === false ? "" : resumeHtml(profile)}
<script>
  (function(){
    var card = document.getElementById('card');
    if (!card) return;
    card.addEventListener('click', function(){ card.classList.toggle('flipped'); });
  })();
</script>
</body>
</html>`;

  return { "index.html": html };
}
