import type { LangCode } from "./types.ts";

const DEVANAGARI = /[\u0900-\u097F]/;
const TAMIL = /[\u0B80-\u0BFF]/;
const MARATHI_MARKERS = /[ळऱय़]/;

const HINGLISH = [
  "hai", "nahi", "nahin", "kya", "kyun", "mat", "bata", "batana", "bhejo",
  "bhejna", "yaar", "yaar", "accha", "achha", "theek", "tum", "tera", "meri",
  "mera", "aap", "please", "pic", "photo", "mummy", "papa", "ghar", "school",
  "dost", "baat", "chalo", "chalte", "app", "whatsapp", "secret",
];

const MARATHI_LATN = ["ahe", "nahi", "kay", "tu", "mala", "sang", "photo", "ghar"];
const TAMIL_LATN = [
  "illa", "inga", "unga", "sollu", "soladhe", "anuppu", "photo", "appa", "amma",
  "vera", "app", "secret", "pesalam", "venum",
];

export function detectLanguage(text: string): LangCode {
  const t = text.trim();
  if (!t) return "und";
  if (TAMIL.test(t)) return "ta";
  if (DEVANAGARI.test(t)) return MARATHI_MARKERS.test(t) ? "mr" : "hi";

  const tokens = t.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (tokens.length === 0) return "und";

  const hit = (lex: string[]) =>
    tokens.filter((w) => lex.includes(w)).length / Math.max(1, tokens.length);

  const hi = hit(HINGLISH);
  const mr = hit(MARATHI_LATN);
  const ta = hit(TAMIL_LATN);

  if (ta >= 0.12 && ta >= hi && ta >= mr) return "ta-Latn";
  if (mr >= 0.18 && mr > hi) return "mr-Latn";
  if (hi >= 0.12) return "hi-Latn";

  // Latin letters dominate
  const latin = (t.match(/[A-Za-z]/g) ?? []).length;
  const other = (t.match(/[^\sA-Za-z0-9.,!?'"()\-]/g) ?? []).length;
  if (latin > other) return "en";
  return "und";
}

export function baseLang(code: LangCode): "en" | "hi" | "mr" | "ta" | "und" {
  if (code === "und") return "und";
  if (code.startsWith("hi")) return "hi";
  if (code.startsWith("mr")) return "mr";
  if (code.startsWith("ta")) return "ta";
  return "en";
}
