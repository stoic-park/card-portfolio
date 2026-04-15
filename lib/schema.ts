export type Experience = {
  company: string;
  role: string;
  period: string;
  desc: string;
};

export type Project = {
  name: string;
  org: string;
  period: string;
  stack: string[];
  highlights: string[];
};

export type Socials = {
  linkedin?: string;
  twitter?: string;
  website?: string;
};

export type CardCustomization = {
  image?: string;
  scale: number;
  offsetX: number;
  offsetY: number;
  opacity: number;
};

export type FontChoice = "theme" | "pretendard" | "notoSansKr" | "inter" | "geist";

export type QrMode = "site" | "siteAnchor" | "custom";
export type QrTarget = {
  mode: QrMode;
  customUrl?: string;
};

export const defaultQrTarget: QrTarget = { mode: "site" };

export const defaultCardCustomization: CardCustomization = {
  scale: 1,
  offsetX: 50,
  offsetY: 50,
  opacity: 1,
};

export type Profile = {
  name: string;
  nameEn: string;
  title: string;
  tagline: string;
  email: string;
  github: string;
  blog: string;
  location: string;
  socials: Socials;
  card?: CardCustomization;
  cardBack?: CardCustomization;
  fontOverride?: FontChoice;
  qr?: QrTarget;
  projectName?: string;
  includeResume?: boolean;
  skills: string[];
  summary: string[];
  experience: Experience[];
  projects: Project[];
};

export const emptyProfile: Profile = {
  name: "",
  nameEn: "",
  title: "",
  tagline: "",
  email: "",
  github: "",
  blog: "",
  location: "",
  socials: {},
  skills: [],
  summary: [],
  experience: [],
  projects: [],
};
