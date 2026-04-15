import { emptyProfile, type Profile, type Experience, type Project } from "./schema";

const SECTION_ALIASES: Record<string, string> = {
  about: "about", 소개: "about",
  experience: "experience", 경력: "experience", "경력 사항": "experience", 경력사항: "experience",
  projects: "projects", 프로젝트: "projects",
  skills: "skills", 기술: "skills", "기술 스택": "skills", 스킬: "skills",
  side: "side", "사이드 프로젝트": "side",
  contact: "contact", 연락처: "contact",
};

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

function extractUrl(text: string, host: string): string | undefined {
  const re = new RegExp(`https?://[^\\s)\\]]*${host}[^\\s)\\]]*`, "i");
  const m = text.match(re);
  return m?.[0];
}

function extractEmail(text: string): string | undefined {
  const m = text.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/);
  return m?.[0];
}

function stripBold(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").trim();
}

function stripList(s: string): string {
  return s.replace(/^\s*[-*]\s+/, "").trim();
}

type Block = { heading: number; title: string; lines: string[] };

function splitBlocks(md: string): Block[] {
  const lines = md.split(/\r?\n/);
  const blocks: Block[] = [];
  let current: Block | null = null;
  for (const line of lines) {
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      if (current) blocks.push(current);
      current = { heading: h[1].length, title: h[2].trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    } else {
      current = { heading: 0, title: "", lines: [line] };
    }
  }
  if (current) blocks.push(current);
  return blocks;
}

export function parseMarkdownToProfile(md: string): Profile {
  const profile: Profile = { ...emptyProfile, skills: [], summary: [], experience: [], projects: [] };
  const blocks = splitBlocks(md);

  // H1 = name + optional title on same line
  const h1 = blocks.find((b) => b.heading === 1);
  if (h1) {
    const parts = h1.title.split(/\s{2,}|\s+(?=[A-Z])/);
    profile.name = stripBold(parts[0] || h1.title);
    if (parts.length > 1) profile.title = stripBold(parts.slice(1).join(" "));
  }

  // Top-level contact detection from whole doc
  const fullText = md;
  profile.email = extractEmail(fullText) ?? "";
  profile.github = extractUrl(fullText, "github.com") ?? "";
  profile.blog = extractUrl(fullText, "vercel.app") ?? extractUrl(fullText, "blog") ?? "";
  profile.socials = {
    linkedin: extractUrl(fullText, "linkedin.com") ?? "",
    twitter: extractUrl(fullText, "twitter.com") ?? extractUrl(fullText, "x.com") ?? "",
    website: profile.blog,
  };

  // Walk blocks, track current H2 section
  let section: string = "";
  let currentExp: Experience | null = null;
  let currentProj: Project | null = null;

  const pushExp = () => {
    if (currentExp && currentExp.company) profile.experience.push(currentExp);
    currentExp = null;
  };
  const pushProj = () => {
    if (currentProj && currentProj.name) profile.projects.push(currentProj);
    currentProj = null;
  };

  for (const b of blocks) {
    if (b.heading === 2) {
      pushExp(); pushProj();
      section = SECTION_ALIASES[normalize(b.title)] ?? normalize(b.title);
      // About may have content directly under H2
      if (section === "about") {
        for (const line of b.lines) {
          const t = stripBold(line.trim());
          if (!t || t === "---") continue;
          if (!profile.tagline) profile.tagline = t;
          profile.summary.push(t);
        }
      } else if (section === "skills") {
        for (const line of b.lines) {
          const t = stripList(line).trim();
          if (!t) continue;
          t.split(/[,·]/).map((s) => s.trim()).filter(Boolean).forEach((s) => profile.skills.push(s));
        }
      }
      continue;
    }

    if (b.heading === 3) {
      if (section === "experience") {
        pushExp();
        currentExp = { company: stripBold(b.title), role: "", period: "", desc: "" };
        const bodyLines = b.lines.map((l) => l.trim()).filter(Boolean);
        // heuristic: line with date-like token = period+role
        const periodLine = bodyLines.find((l) => /\d{4}/.test(l));
        if (periodLine) currentExp.period = periodLine.replace(/\*\*/g, "").trim();
        // Role often embedded in heading like "회사 Role"
        const parts = stripBold(b.title).split(/\s{2,}|\s+(?=[A-Z])/);
        if (parts.length > 1) {
          currentExp.company = parts[0];
          currentExp.role = parts.slice(1).join(" ");
        }
        const descLines = bodyLines.filter((l) => l !== periodLine && !/^\s*[-*]/.test(l));
        currentExp.desc = descLines.slice(0, 3).map(stripBold).join(" ");
      } else if (section === "projects" || section === "side") {
        pushProj();
        currentProj = {
          name: stripBold(b.title),
          org: "",
          period: "",
          stack: [],
          highlights: [],
        };
        let grabStack = false;
        for (const raw of b.lines) {
          const line = raw.trim();
          if (!line) { grabStack = false; continue; }
          if (/^\*\*(사용기술|Stack|Tech|기술)\*\*/i.test(line) || /^(사용기술|Stack|Tech|기술)\s*[:：]/i.test(line)) {
            grabStack = true; continue;
          }
          if (grabStack && !line.startsWith("#") && !line.startsWith("**") && !line.startsWith("-")) {
            currentProj.stack = line.split(/[,·]/).map((s) => s.trim()).filter(Boolean);
            grabStack = false;
            continue;
          }
          if (/\d{4}/.test(line) && !currentProj.period) {
            const m = line.match(/(\d{4}[^\n]*)/);
            if (m) currentProj.period = m[1].trim();
            const orgPart = line.replace(/\d{4}[^\n]*/, "").trim();
            if (orgPart) currentProj.org = stripBold(orgPart);
            continue;
          }
          if (/^\s*[-*]\s+/.test(line)) {
            const item = stripList(line);
            const clean = stripBold(item);
            if (clean) currentProj.highlights.push(clean);
          }
        }
      }
      continue;
    }

    // Lines without heading belong to current section
    if (b.heading === 0 || b.heading > 3) {
      if (section === "about") {
        for (const line of b.lines) {
          const t = stripBold(line.trim());
          if (!t || t === "---") continue;
          if (!profile.tagline) profile.tagline = t;
          profile.summary.push(t);
        }
      }
    }
  }
  pushExp(); pushProj();

  // Deduplicate + trim
  profile.skills = Array.from(new Set(profile.skills)).slice(0, 30);
  profile.summary = profile.summary.slice(0, 6);

  if (!profile.title) profile.title = "Developer";
  if (!profile.tagline && profile.summary[0]) profile.tagline = profile.summary[0];
  if (!profile.nameEn) profile.nameEn = "";

  return profile;
}
