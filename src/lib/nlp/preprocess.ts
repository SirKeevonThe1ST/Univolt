import { detectLanguage } from "./language.ts";
import type { LangCode } from "./types.ts";

/** Common Roman → Devanagari / Tamil glosses used only for matching, not display. */
const ROMAN_GLOSS: Record<string, string> = {
  nahi: "नहीं",
  nahin: "नहीं",
  mat: "मत",
  bata: "बता",
  batana: "बताना",
  bataana: "बताना",
  bhejo: "भेजो",
  bhejna: "भेजना",
  pic: "photo",
  photo: "photo",
  mummy: "मम्मी",
  papa: "पापा",
  ghar: "घर",
  secret: "secret",
  gupt: "गोपनीय",
  chalo: "चलो",
  chalte: "चलते",
  yaar: "यार",
  dost: "दोस्त",
  school: "school",
  number: "number",
  phone: "phone",
  address: "address",
  gift: "gift",
  paise: "पैसे",
  akele: "अकेले",
  mil: "मिल",
  soladhe: "சொல்லாதே",
  anuppu: "அனுப்பு",
  pesalam: "பேசலாம்",
  vera: "வேற",
  amma: "அம்மா",
  appa: "அப்பா",
  illa: "இல்ல",
};

const EMOJI_GLOSS: Record<string, string> = {
  "🤫": " secret ",
  "🙊": " secret ",
  "🎁": " gift ",
  "💰": " money ",
  "📱": " phone ",
  "📸": " photo ",
  "📷": " photo ",
  "🏠": " home ",
  "❤️": " affection ",
  "😘": " affection ",
  "😈": " threat ",
  "😡": " anger ",
};

const SCRIPT_FOLD: Record<string, string> = {
  "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
  "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
};

export type Preprocessed = {
  original: string;
  normalized: string;
  tokens: string[];
  lang: LangCode;
  gloss: string;
};

export function preprocess(text: string, langHint?: LangCode | "auto"): Preprocessed {
  let s = text.normalize("NFKC");
  for (const [k, v] of Object.entries(SCRIPT_FOLD)) s = s.split(k).join(v);
  for (const [e, g] of Object.entries(EMOJI_GLOSS)) s = s.split(e).join(g);

  s = s
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  const lower = s.toLowerCase();
  const tokens = lower.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const glossParts = tokens.map((t) => ROMAN_GLOSS[t] ?? t);
  const gloss = `${lower} ${glossParts.join(" ")}`;
  const lang = langHint && langHint !== "auto" ? langHint : detectLanguage(text);

  return {
    original: text,
    normalized: lower,
    tokens,
    lang,
    gloss,
  };
}

export function containsAny(hay: string, needles: readonly string[]): string | null {
  const h = hay.toLowerCase();
  for (const n of needles) {
    if (n.length < 3) {
      const re = new RegExp(`(?:^|\\s)${escapeRe(n)}(?:\\s|$)`, "i");
      if (re.test(h)) return n;
    } else if (h.includes(n.toLowerCase())) {
      return n;
    }
  }
  return null;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
