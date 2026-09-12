export type PiiKind =
  | "name"
  | "phone"
  | "email"
  | "school"
  | "address"
  | "username"
  | "handle"
  | "location";

export type PiiHit = { kind: PiiKind; value: string };

export type PiiReport = {
  hits: PiiHit[];
  detected: number;
  redacted: number;
  identityExposed: boolean;
  originalSample: string;
  redactedSample: string;
};

const PATTERNS: { kind: PiiKind; re: RegExp }[] = [
  { kind: "email", re: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
  { kind: "phone", re: /(?:\+91[\s-]?)?[6-9]\d{9}\b/g },
  { kind: "phone", re: /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g },
  { kind: "handle", re: /(?<!\w)@[A-Za-z0-9._]{2,32}/g },
  { kind: "username", re: /\b(?:user(?:name)?|id|handle)\s*[:#]?\s*[A-Za-z0-9._]{3,32}\b/gi },
  {
    kind: "school",
    re: /\b(?:[A-Z][\w'.-]+(?:\s+[A-Z][\w'.-]+){0,4}\s+)?(?:School|Vidyalaya|Vidya Mandir|Academy|Convent|High School|Public School)\b/g,
  },
  {
    kind: "address",
    re: /\b(?:house|flat|plot|street|nagar|road|sector|lane|block)\s+[\w.-]+(?:\s+[\w.-]+){0,4}/gi,
  },
];

const NAME_HINT =
  /\b(?:my name is|i am|i['’]m|naam(?:\s+hai)?|mera naam)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?|[A-Za-z\u0900-\u097F]{2,})/gi;

const LOCATION_HINT =
  /\b(?:in|at|from|near)\s+(Panaji|Goa|Mumbai|Delhi|Pune|Chennai|Bengaluru|Bangalore|Kolkata|Hyderabad|Jaipur|Lucknow|Ahmedabad|Surat|Indore|Bhopal|Patna|Nagpur|Kanpur|Noida|Gurgaon|Gurugram|[A-Z][a-z]{3,})\b/g;

export function detectAndRedactPii(text: string): PiiReport {
  const original = text;
  let redacted = text;
  const hits: PiiHit[] = [];

  const apply = (kind: PiiKind, re: RegExp) => {
    const copy = new RegExp(re.source, re.flags);
    redacted = redacted.replace(copy, (value) => {
      hits.push({ kind, value });
      return "[REDACTED]";
    });
  };

  for (const { kind, re } of PATTERNS) apply(kind, re);
  apply("name", NAME_HINT);
  apply("location", LOCATION_HINT);

  const unique = dedupeHits(hits);
  const sampleSrc = original.length > 280 ? `${original.slice(0, 280)}…` : original;
  const sampleRed =
    redacted.length > 280 ? `${redacted.slice(0, 280)}…` : redacted || sampleSrc;

  return {
    hits: unique,
    detected: unique.length,
    redacted: unique.length,
    identityExposed: false,
    originalSample: sampleSrc || "No text provided.",
    redactedSample: unique.length ? sampleRed : sampleSrc || "No text provided.",
  };
}

function dedupeHits(hits: PiiHit[]): PiiHit[] {
  const seen = new Set<string>();
  const out: PiiHit[] = [];
  for (const h of hits) {
    const key = `${h.kind}:${h.value.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(h);
  }
  return out;
}

/** Redact before the LLM sees the evidence. Analysis still sees the behaviour. */
export function redactForModel(text: string): string {
  return detectAndRedactPii(text).redactedSample === text
    ? detectAndRedactPii(text).redactedSample
    : runFullRedaction(text);
}

function runFullRedaction(text: string): string {
  let redacted = text;
  for (const { re } of PATTERNS) {
    redacted = redacted.replace(new RegExp(re.source, re.flags), "[REDACTED]");
  }
  redacted = redacted.replace(NAME_HINT, (m) => m.replace(/([A-Za-z\u0900-\u097F]{2,})$/u, "[REDACTED]"));
  redacted = redacted.replace(LOCATION_HINT, (m) => m.replace(/\s+\S+$/, " [REDACTED]"));
  return redacted;
}
