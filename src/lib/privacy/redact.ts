/**
 * Lightweight NER-style redaction run BEFORE storage.
 * Patterns only — no third-party NER API.
 */

export type Redaction = {
  text: string;
  kinds: string[];
};

const PATTERNS: { kind: string; re: RegExp }[] = [
  { kind: "email", re: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
  { kind: "phone", re: /(?:\+91[\s-]?)?[6-9]\d{9}\b/g },
  { kind: "phone", re: /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g },
  { kind: "aadhaar", re: /\b\d{4}\s\d{4}\s\d{4}\b/g },
  { kind: "url", re: /\bhttps?:\/\/[^\s]+/gi },
  {
    kind: "address",
    re: /\b(?:house|flat|plot|street|nagar|road|sector)\s+[\w.-]+/gi,
  },
];

const NAME_HINT =
  /\b(?:my name is|i am|i'm|main hoon|naam)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/gi;

export function redactText(input: string): Redaction {
  let text = input;
  const kinds = new Set<string>();

  for (const { kind, re } of PATTERNS) {
    const copy = new RegExp(re.source, re.flags);
    if (copy.test(text)) {
      kinds.add(kind);
      text = text.replace(new RegExp(re.source, re.flags), `[${kind.toUpperCase()}]`);
    }
  }

  text = text.replace(NAME_HINT, (_m, name: string) => {
    kinds.add("name");
    return `my name is [${maskName(name)}]`;
  });

  return { text, kinds: [...kinds] };
}

function maskName(name: string): string {
  const parts = name.split(/\s+/);
  return parts.map((p) => `${p[0] ?? ""}***`).join(" ");
}

/** SHA-256 hex. Works in Node 22 and modern browsers. */
export async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function sha256HexSync(value: string): string {
  // Fast non-crypto fingerprint for tests / fallback. Production path uses sha256Hex.
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}
