import type { LangCode } from "./types.ts";

const DEVANAGARI = /[\u0900-\u097F]/;
const TAMIL = /[\u0B80-\u0BFF]/;
const BENGALI = /[\u0980-\u09FF]/;
const GURMUKHI = /[\u0A00-\u0A7F]/;
const GUJARATI = /[\u0A80-\u0AFF]/;
const TELUGU = /[\u0C00-\u0C7F]/;
const KANNADA = /[\u0C80-\u0CFF]/;
const MALAYALAM = /[\u0D00-\u0D7F]/;
const MARATHI_MARKERS = /[ळऱय़]/;

const HINGLISH = [
  "hai", "nahi", "nahin", "kya", "kyun", "mat", "bata", "batana", "bhejo",
  "bhejna", "yaar", "accha", "achha", "theek", "tum", "tera", "meri",
  "mera", "aap", "pic", "photo", "mummy", "papa", "ghar", "school",
  "dost", "baat", "chalo", "chalte", "whatsapp", "secret", "rahi", "raha",
];

const MARATHI_LATN = ["ahe", "nahi", "kay", "tu", "mala", "sang", "photo", "ghar", "nako"];
const TAMIL_LATN = [
  "illa", "inga", "unga", "sollu", "soladhe", "anuppu", "photo", "appa", "amma",
  "vera", "pesalam", "venum",
];
const BENGALI_LATN = ["koro", "kothay", "tumi", "bolish", "na", "photo", "pathao", "baba", "ma"];
const TELUGU_LATN = ["ela", "undi", "cheppu", "vaddu", "photo", "pampu", "school", "nanna"];
const KANNADA_LATN = ["hege", "ide", "heli", "beda", "photo", "kaluhisu", "school"];
const MALAYALAM_LATN = ["entha", "undu", "parayu", "venda", "photo", "ayakku", "school"];
const GUJARATI_LATN = ["shu", "che", "nahi", "kaho", "photo", "moklo", "school"];
const PUNJABI_LATN = ["ki", "hai", "nahi", "dass", "photo", "bhej", "school", "yaar"];

export const LANG_LABELS: Record<LangCode, string> = {
  en: "English",
  hi: "Hindi",
  "hi-Latn": "Hinglish",
  mr: "Marathi",
  "mr-Latn": "Marathi (Roman)",
  ta: "Tamil",
  "ta-Latn": "Tamil-English",
  bn: "Bengali",
  "bn-Latn": "Bengali (Roman)",
  te: "Telugu",
  "te-Latn": "Telugu (Roman)",
  kn: "Kannada",
  "kn-Latn": "Kannada (Roman)",
  ml: "Malayalam",
  "ml-Latn": "Malayalam (Roman)",
  gu: "Gujarati",
  "gu-Latn": "Gujarati (Roman)",
  pa: "Punjabi",
  "pa-Latn": "Punjabi (Roman)",
  und: "Undetermined",
};

export function detectLanguage(text: string): LangCode {
  const t = text.trim();
  if (!t) return "und";
  if (TAMIL.test(t)) return "ta";
  if (MALAYALAM.test(t)) return "ml";
  if (KANNADA.test(t)) return "kn";
  if (TELUGU.test(t)) return "te";
  if (GUJARATI.test(t)) return "gu";
  if (GURMUKHI.test(t)) return "pa";
  if (BENGALI.test(t)) return "bn";
  if (DEVANAGARI.test(t)) return MARATHI_MARKERS.test(t) ? "mr" : "hi";

  const tokens = t.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (tokens.length === 0) return "und";

  const hit = (lex: string[]) =>
    tokens.filter((w) => lex.includes(w)).length / Math.max(1, tokens.length);

  const scores: [LangCode, number][] = [
    ["ta-Latn", hit(TAMIL_LATN)],
    ["mr-Latn", hit(MARATHI_LATN)],
    ["bn-Latn", hit(BENGALI_LATN)],
    ["te-Latn", hit(TELUGU_LATN)],
    ["kn-Latn", hit(KANNADA_LATN)],
    ["ml-Latn", hit(MALAYALAM_LATN)],
    ["gu-Latn", hit(GUJARATI_LATN)],
    ["pa-Latn", hit(PUNJABI_LATN)],
    ["hi-Latn", hit(HINGLISH)],
  ];
  scores.sort((a, b) => b[1] - a[1]);
  const [best, bestScore] = scores[0];
  if (bestScore >= 0.12) return best;

  const latin = (t.match(/[A-Za-z]/g) ?? []).length;
  const other = (t.match(/[^\sA-Za-z0-9.,!?'"()-]/g) ?? []).length;
  if (latin > other) return "en";
  return "und";
}

export function baseLang(
  code: LangCode,
): "en" | "hi" | "mr" | "ta" | "bn" | "te" | "kn" | "ml" | "gu" | "pa" | "und" {
  if (code === "und") return "und";
  if (code.startsWith("hi")) return "hi";
  if (code.startsWith("mr")) return "mr";
  if (code.startsWith("ta")) return "ta";
  if (code.startsWith("bn")) return "bn";
  if (code.startsWith("te")) return "te";
  if (code.startsWith("kn")) return "kn";
  if (code.startsWith("ml")) return "ml";
  if (code.startsWith("gu")) return "gu";
  if (code.startsWith("pa")) return "pa";
  return "en";
}
