export type ThemeId = "stripe" | "vercel" | "linear" | "notion" | "spotify";

export type Face = {
  bg: string;
  text: string;
  muted: string;
  accent: string;
  shadow: string;
};

export type Theme = {
  id: ThemeId;
  label: string;
  signature: string;
  fontSans: string;
  page: {
    bg: string;
    text: string;
    muted: string;
    accent: string;
  };
  card: {
    front: Face;
    back: Face;
    qrBg: string;
  };
};

export const themes: Record<ThemeId, Theme> = {
  stripe: {
    id: "stripe",
    label: "Stripe",
    signature: "Indigo gradient hero, weight-300 headline",
    fontSans: "'Inter Variable', Inter, system-ui, sans-serif",
    page: {
      bg: "linear-gradient(180deg, #f6f9fc 0%, #ffffff 100%)",
      text: "#061b31",
      muted: "#4d4d4d",
      accent: "#533afd",
    },
    card: {
      front: {
        bg: "linear-gradient(135deg, #1c1e54 0%, #533afd 55%, #7b61ff 100%)",
        text: "#ffffff",
        muted: "rgba(255,255,255,0.75)",
        accent: "#c4b5fd",
        shadow: "0 30px 60px -20px rgba(50,50,93,0.4), 0 18px 36px -18px rgba(83,58,253,0.3)",
      },
      back: {
        bg: "#ffffff",
        text: "#061b31",
        muted: "#4d4d4d",
        accent: "#533afd",
        shadow: "0 30px 60px -20px rgba(50,50,93,0.25), 0 18px 36px -18px rgba(0,0,0,0.15)",
      },
      qrBg: "#ffffff",
    },
  },
  vercel: {
    id: "vercel",
    label: "Vercel",
    signature: "Hairline borders, Geist typographic system",
    fontSans: "'Geist', 'Inter Variable', system-ui, sans-serif",
    page: {
      bg: "#fafafa",
      text: "#171717",
      muted: "#666666",
      accent: "#0070f3",
    },
    card: {
      front: {
        bg: "#ffffff",
        text: "#171717",
        muted: "#666666",
        accent: "#0070f3",
        shadow: "inset 0 0 0 1px #ebebeb, 0 12px 32px -12px rgba(0,0,0,0.08)",
      },
      back: {
        bg: "#000000",
        text: "#ffffff",
        muted: "rgba(255,255,255,0.7)",
        accent: "#ffffff",
        shadow: "inset 0 0 0 1px #222, 0 12px 32px -12px rgba(0,0,0,0.3)",
      },
      qrBg: "#ffffff",
    },
  },
  linear: {
    id: "linear",
    label: "Linear",
    signature: "Dark-native, weight-510 precision",
    fontSans: "'Inter Variable', Inter, system-ui, sans-serif",
    page: {
      bg: "#08090a",
      text: "#f7f8f8",
      muted: "#8a8f98",
      accent: "#5e6ad2",
    },
    card: {
      front: {
        bg: "#191a1b",
        text: "#f7f8f8",
        muted: "#8a8f98",
        accent: "#a5b4fc",
        shadow: "0 0 0 1px rgba(255,255,255,0.18), 0 20px 50px -20px rgba(94,106,210,0.5), 0 0 60px -10px rgba(94,106,210,0.3)",
      },
      back: {
        bg: "#5e6ad2",
        text: "#ffffff",
        muted: "rgba(255,255,255,0.8)",
        accent: "#ffffff",
        shadow: "0 0 0 1px rgba(255,255,255,0.12), 0 20px 50px -20px rgba(94,106,210,0.6)",
      },
      qrBg: "#ffffff",
    },
  },
  notion: {
    id: "notion",
    label: "Notion",
    signature: "Warm off-white, whisper-weight borders",
    fontSans: "'Inter Variable', system-ui, sans-serif",
    page: {
      bg: "#f6f5f4",
      text: "#1f1f1f",
      muted: "#615d59",
      accent: "#0075de",
    },
    card: {
      front: {
        bg: "#ffffff",
        text: "#1f1f1f",
        muted: "#615d59",
        accent: "#0075de",
        shadow: "0 1px 2px rgba(15,15,15,0.06), 0 12px 32px -12px rgba(15,15,15,0.16)",
      },
      back: {
        bg: "#ffffff",
        text: "#1f1f1f",
        muted: "#615d59",
        accent: "#0075de",
        shadow: "0 1px 2px rgba(15,15,15,0.06), 0 12px 32px -12px rgba(15,15,15,0.16)",
      },
      qrBg: "#ffffff",
    },
  },
  spotify: {
    id: "spotify",
    label: "Spotify",
    signature: "Pill geometry, vivid green accent",
    fontSans: "'Inter Variable', system-ui, sans-serif",
    page: {
      bg: "#121212",
      text: "#ffffff",
      muted: "#b3b3b3",
      accent: "#1ed760",
    },
    card: {
      front: {
        bg: "radial-gradient(120% 140% at 0% 0%, #1ed760 0%, #0a7a36 45%, #121212 100%)",
        text: "#ffffff",
        muted: "rgba(255,255,255,0.8)",
        accent: "#ffffff",
        shadow: "0 24px 48px -12px rgba(30,215,96,0.35), 0 8px 24px -8px rgba(0,0,0,0.6)",
      },
      back: {
        bg: "#181818",
        text: "#ffffff",
        muted: "#b3b3b3",
        accent: "#1ed760",
        shadow: "0 0 0 1px rgba(255,255,255,0.15), 0 24px 48px -12px rgba(0,0,0,0.6), 0 0 60px -10px rgba(30,215,96,0.12)",
      },
      qrBg: "#ffffff",
    },
  },
};

export const themeOrder: ThemeId[] = ["vercel", "stripe", "linear", "notion", "spotify"];
export const defaultTheme: ThemeId = "vercel";
