import { detectLanguage, LANG_LABELS } from "@/lib/nlp/language";
import { extractFlags } from "@/lib/nlp/flags";
import { scoreThread } from "@/lib/pipeline/scoring";
import type { ThreadTurn } from "@/lib/nlp/types";
import { getScenario } from "./scenarios";
import {
  bandFromRisk,
  threatLabel,
  type AnalysisLang,
  type AnalysisResult,
  type BehaviourHit,
  type DemoMessage,
  type Severity,
  type ThreatKind,
  type TimelinePoint,
} from "./types";
import {
  buildChain,
  buildCrossPatterns,
  buildIndicators,
  buildSessions,
  privacyFromMessages,
  projectedFrom,
  scaleTimeline,
  singleMessageRiskOf,
  trajectoryDirection,
  whyFromIndicators,
} from "./intelligence";

const BEHAVIOUR_META: { id: BehaviourHit["id"]; label: string }[] = [
  { id: "age_probe", label: "Age / identity probing" },
  { id: "pii_extract", label: "Personal information extraction" },
  { id: "trust_build", label: "Trust building" },
  { id: "secrecy", label: "Secrecy pressure" },
  { id: "isolation", label: "Isolation from trusted adults" },
  { id: "image_ask", label: "Image solicitation" },
  { id: "blackmail", label: "Threat / blackmail indicators" },
  { id: "unwanted", label: "Repeated unwanted contact" },
];

function targetScore(kind: ThreatKind, severity: Severity, live: number): number {
  const floor: Record<Severity, number> = {
    low: 16,
    medium: 38,
    high: 62,
    critical: 84,
  };
  const kindBoost: Record<ThreatKind, number> = {
    grooming: 4,
    cyberbullying: 0,
    blackmail: 6,
    threat: 5,
    suspicious: -8,
  };
  const curated = Math.min(96, floor[severity] + kindBoost[kind]);
  if (kind === "grooming" && severity === "critical") return 87;
  return Math.round(curated * 0.72 + live * 0.28);
}

export function analyseMessages(
  messages: DemoMessage[],
  opts: {
    kind?: ThreatKind;
    severity?: Severity;
    lang?: AnalysisLang;
    curated?: boolean;
  } = {},
): AnalysisResult {
  const turns: ThreadTurn[] = messages.map((m) => ({ speaker: m.speaker, text: m.text }));
  const joined = messages.map((m) => m.text).join("\n");
  const live = scoreThread(turns);
  const flags = extractFlags(joined, turns);
  const kind = opts.kind ?? inferKind(flags, live.classification.label);
  const severity = opts.severity ?? bandFromRisk(live.score);
  const risk = opts.curated ? targetScore(kind, severity, live.score) : live.score;
  const band = bandFromRisk(risk);
  const lang = detectLanguage(joined);
  const languageLabel = LANG_LABELS[lang] ?? String(lang);

  const behaviours: BehaviourHit[] = BEHAVIOUR_META.map((meta) => {
    const present = isPresent(meta.id, flags, kind, messages);
    return {
      ...meta,
      present,
      evidence: present ? evidenceFor(meta.id, messages) : "Not observed in this thread.",
      weight: present ? weightFor(meta.id) : 0,
    };
  });

  const sessions = buildSessions(messages);
  const chain = buildChain(behaviours, kind, band);
  const crossPatterns = buildCrossPatterns(behaviours, sessions, kind);
  const indicators = buildIndicators(behaviours, sessions, kind);
  const why = whyFromIndicators(indicators);
  const timeline =
    opts.curated || kind === "grooming" ? scaleTimeline(risk) : inferredTimeline(messages, risk);
  const trajectory = trajectoryDirection(timeline);
  const projectedRisk = projectedFrom(risk, trajectory);
  const privacy = privacyFromMessages(messages);
  const normalized =
    messages
      .filter((m) => m.gloss)
      .map((m) => m.gloss)
      .join(" → ") || "Meaning taken from the original wording (prototype normalisation).";

  return {
    risk,
    projectedRisk,
    singleMessageRisk: singleMessageRiskOf(sessions),
    band,
    behaviours,
    chain,
    sessions,
    crossPatterns,
    indicators,
    timeline,
    trajectory,
    why: why.length ? why : ["No high-concern behavioural pattern was accumulated in this sample."],
    recommendation: recommend(kind, band),
    summary: summarise(kind, band, behaviours),
    detectedLanguage: lang,
    languageLabel,
    normalizedMeaning: normalized,
    privacy,
    messages,
    threatType: kind,
    threatLabel: threatLabel(kind),
    confidenceLabel: "Simulated",
    modelStatus: "Prototype",
    autonomousAction: "Disabled",
    humanReview: "REQUIRED",
    escalationNote:
      "Simulated trajectory — not a validated prediction. The system does not accuse a person, contact police, or expose a child's identity. A trained human reviews every consequential step.",
    analysisMode: "prototype",
    isSynthetic: Boolean(opts.curated),
    recommendedHumanReview: band === "high" || band === "critical",
    uncertainty: [],
  };
}

export function analyseScenario(kind: ThreatKind, lang: AnalysisLang, severity: Severity): AnalysisResult {
  const pack = getScenario(kind, lang, severity);
  const result = analyseMessages(pack.messages, { kind, severity, lang, curated: true });
  result.normalizedMeaning = pack.normalized;
  return result;
}

function inferKind(
  flags: ReturnType<typeof extractFlags>,
  label: string,
): ThreatKind {
  if (flags.blackmail) return "blackmail";
  if (label === "cyberbullying_risk") return "cyberbullying";
  if (label === "exploitation_risk" && flags.image_request) return "grooming";
  if (label === "grooming_risk") return "grooming";
  if (flags.image_request || flags.secrecy) return "grooming";
  return "suspicious";
}

function isPresent(
  id: BehaviourHit["id"],
  flags: ReturnType<typeof extractFlags>,
  kind: ThreatKind,
  messages: DemoMessage[],
): boolean {
  const text = messages.map((m) => m.text.toLowerCase()).join(" ");
  switch (id) {
    case "age_probe":
      return flags.age_probe || /old are you|what's your name|kitne saal|umar|kya kar|वयस|বয়স|వయసు|ವಯಸ್ಸು|വയസ്സ്|ઉંમર|ਉਮਰ/.test(text);
    case "pii_extract":
      return flags.pii_request || /school|स्कूल|স্কুল|ஸ்கூல்|స్కూల్|ಶಾಲೆ|സ്കൂൾ|સ્કૂલ|ਸਕੂਲ/.test(text);
    case "trust_build":
      return flags.trust_build || kind === "grooming";
    case "secrecy":
      return flags.secrecy || /don't tell|mat batana|मत बताना|बলিস না|சொல்லாதே/.test(text);
    case "isolation":
      return flags.isolation || /parents check|माता-पिता|mummy papa/.test(text);
    case "image_ask":
      return flags.image_request || /picture|photo|pic |फोटो|ছবি|போட்டோ|ఫోటో|ഫോട്ടോ|ਫੋਟੋ/.test(text);
    case "blackmail":
      return flags.blackmail || kind === "blackmail" || kind === "threat";
    case "unwanted":
      return flags.unwanted_contact || messages.filter((m) => m.speaker === "other").length >= 4;
  }
}

function evidenceFor(id: BehaviourHit["id"], messages: DemoMessage[]): string {
  const map: Record<string, RegExp> = {
    age_probe: /old|name|saal|umar|वयस|বয়স|வயசு|వయసు|ವಯಸ್ಸು|വയസ്സ്|ઉંમર|ਉਮਰ|kya kar/i,
    pii_extract: /school|class|phone|स्कूल|স্কুল/i,
    trust_build: /mature|understand|kya kar/i,
    secrecy: /don't tell|mat batana|secret|मत बता|சொல்லாதே|কাউকে/i,
    isolation: /parents|mummy|papa|teacher|माता/i,
    image_ask: /picture|photo|pic|फोटो|ছবি|போட்டோ/i,
    blackmail: /post|or else|scared|blackmail|i have your/i,
    unwanted: /./,
  };
  const re = map[id];
  const hit = messages.find((m) => m.speaker === "other" && re.test(m.text));
  return hit ? `“${hit.text}”` : "Pattern inferred across multiple turns.";
}

function weightFor(id: BehaviourHit["id"]): number {
  const w: Record<BehaviourHit["id"], number> = {
    age_probe: 12,
    pii_extract: 15,
    trust_build: 18,
    secrecy: 20,
    isolation: 16,
    image_ask: 22,
    blackmail: 28,
    unwanted: 10,
  };
  return w[id];
}

function recommend(kind: ThreatKind, band: Severity): string {
  if (kind === "grooming" && (band === "critical" || band === "high")) {
    return "Review secrecy behaviour and repeated requests for personal information.";
  }
  switch (band) {
    case "low":
      return "No urgent intervention. Offer safety guidance and keep the door open.";
    case "medium":
      return "Encourage a trusted adult. Offer safety education. Human review is still available.";
    case "high":
      return "Offer a trusted-adult or counsellor pathway and create a responder review case. Do not contact authorities automatically.";
    case "critical":
      return "Urgent human review. Preserve redacted evidence. Open a support pathway. A person decides the next step.";
  }
}

function summarise(kind: ThreatKind, band: Severity, behaviours: BehaviourHit[]): string {
  const hits = behaviours.filter((b) => b.present).map((b) => b.label.toLowerCase());
  const list = hits.slice(0, 3).join(", ");
  return `High-concern pattern (${threatLabel(kind).toLowerCase()}, ${band}). Review ${list || "the accumulated behavioural signals"}. This is a risk indicator, not a finding of guilt.`;
}

function inferredTimeline(messages: DemoMessage[], risk: number): TimelinePoint[] {
  const others = messages.filter((m) => m.speaker === "other");
  if (others.length === 0) return [{ day: "Day 1", score: risk, event: "Single message", delta: risk }];
  return others.map((m, i) => ({
    day: m.day ?? `Turn ${i + 1}`,
    score: Math.round(((i + 1) / others.length) * risk),
    event: m.gloss ?? "Behavioural signal",
    delta: Math.round(risk / others.length),
  }));
}
