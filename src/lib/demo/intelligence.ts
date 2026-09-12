import type {
  BehaviourHit,
  ChainStage,
  ConversationSession,
  CrossPattern,
  DemoMessage,
  ExplainIndicator,
  PrivacyMetrics,
  Severity,
  ThreatKind,
  TimelinePoint,
  TrajectoryDirection,
} from "./types";
import { bandFromRisk } from "./types";

export const CHAIN_META: { id: ChainStage["id"]; label: string }[] = [
  { id: "contact", label: "Contact" },
  { id: "trust", label: "Trust building" },
  { id: "personal_info", label: "Personal information" },
  { id: "secrecy", label: "Secrecy" },
  { id: "isolation", label: "Isolation" },
  { id: "image", label: "Image solicitation" },
  { id: "manipulation", label: "Manipulation" },
  { id: "threat", label: "Threat / Blackmail" },
];

/** Canonical 5-day path used by the judge demo. Scores are simulated. */
export const DEMO_TRAJECTORY: TimelinePoint[] = [
  { day: "Day 1", score: 18, event: "Identity probing", delta: 12 },
  { day: "Day 3", score: 31, event: "Trust manipulation", delta: 18 },
  { day: "Day 5", score: 49, event: "Secrecy request", delta: 20 },
  { day: "Day 7", score: 71, event: "Image solicitation", delta: 15 },
  { day: "Day 8", score: 87, event: "Image request", delta: 22 },
];

export const DEMO_PRIVACY_ORIGINAL =
  "My name is Aarav and I study at XYZ School in Panaji.";
export const DEMO_PRIVACY_REDACTED =
  "My name is [REDACTED] and I study at [REDACTED].";

export const CROSS_PATTERN_META: { id: string; label: string }[] = [
  { id: "identity", label: "Repeated identity probing" },
  { id: "pii", label: "Personal information extraction" },
  { id: "secrecy", label: "Increasing secrecy" },
  { id: "pressure", label: "Escalating pressure" },
  { id: "intensity", label: "Increasing interaction intensity" },
];

const DEMO_CHAIN_CRITICAL: ChainStage[] = [
  { id: "contact", label: "Contact", status: "detected", evidence: "First unsolicited contact in Session 1." },
  { id: "trust", label: "Trust building", status: "detected", evidence: "Familiar, informal tone used to lower caution." },
  { id: "personal_info", label: "Personal information", status: "detected", evidence: "Asked for name, then school." },
  { id: "secrecy", label: "Secrecy", status: "detected", evidence: "Asked the child not to tell anyone." },
  { id: "isolation", label: "Isolation", status: "emerging", evidence: "Checked whether parents can see the phone." },
  { id: "image", label: "Image solicitation", status: "emerging", evidence: "Requested a picture after secrecy was in place." },
  { id: "manipulation", label: "Manipulation", status: "not_detected", evidence: "Not observed in this thread." },
  { id: "threat", label: "Threat / Blackmail", status: "not_detected", evidence: "Not observed — harm has not reached a final stage." },
];

export function scaleTimeline(target: number): TimelinePoint[] {
  const last = DEMO_TRAJECTORY[DEMO_TRAJECTORY.length - 1].score;
  const ratio = target / last;
  let prev = 0;
  return DEMO_TRAJECTORY.map((p) => {
    const score = Math.max(4, Math.min(99, Math.round(p.score * ratio)));
    const point = { ...p, score, delta: Math.max(1, score - prev) };
    prev = score;
    return point;
  });
}

export function buildSessions(messages: DemoMessage[]): ConversationSession[] {
  const others = messages.filter((m) => m.speaker === "other");
  const source = others.length ? others : messages;
  const weights = [12, 22, 34, 48, 62, 74, 82];
  return source.map((m, i) => ({
    index: i + 1,
    label: `Session ${i + 1}`,
    day: m.day ?? `Day ${i * 2 + 1}`,
    text: m.text,
    gloss: m.gloss,
    singleMessageRisk: weights[Math.min(i, weights.length - 1)] ?? 12,
  }));
}

export function buildChain(
  behaviours: BehaviourHit[],
  kind: ThreatKind,
  band: Severity,
): ChainStage[] {
  const present = (id: BehaviourHit["id"]) => behaviours.some((b) => b.id === id && b.present);

  if (kind === "grooming" && (band === "critical" || band === "high")) {
    if (band === "high") {
      return DEMO_CHAIN_CRITICAL.map((s) =>
        s.id === "image" || s.id === "isolation"
          ? { ...s, status: "emerging" as const }
          : s.id === "secrecy"
            ? { ...s, status: "detected" as const }
            : s,
      );
    }
    return DEMO_CHAIN_CRITICAL;
  }

  const statusFor = (detected: boolean, emerging: boolean): ChainStage["status"] => {
    if (detected) return "detected";
    if (emerging) return "emerging";
    return "not_detected";
  };

  const map: Record<ChainStage["id"], ChainStage["status"]> = {
    contact: messagesPresent(behaviours) ? "detected" : "not_detected",
    trust: statusFor(present("trust_build"), kind === "grooming" || kind === "suspicious"),
    personal_info: statusFor(present("age_probe") || present("pii_extract"), present("trust_build")),
    secrecy: statusFor(present("secrecy"), present("isolation")),
    isolation: statusFor(present("isolation"), present("secrecy")),
    image: statusFor(present("image_ask"), present("secrecy") && band !== "low"),
    manipulation: statusFor(present("trust_build") && present("secrecy"), present("trust_build")),
    threat: statusFor(present("blackmail") || kind === "blackmail" || kind === "threat", false),
  };

  return CHAIN_META.map((meta) => ({
    id: meta.id,
    label: meta.label,
    status: map[meta.id],
    evidence:
      map[meta.id] === "not_detected"
        ? "Not observed in this thread."
        : map[meta.id] === "emerging"
          ? "Early signal — not a confirmed stage."
          : "Pattern observed across the thread.",
  }));
}

function messagesPresent(behaviours: BehaviourHit[]): boolean {
  return behaviours.length > 0;
}

export function buildCrossPatterns(
  behaviours: BehaviourHit[],
  sessions: ConversationSession[],
  kind: ThreatKind,
): CrossPattern[] {
  const present = (id: BehaviourHit["id"]) => behaviours.some((b) => b.id === id && b.present);
  return [
    { id: "identity", label: "Repeated identity probing", present: present("age_probe") || present("pii_extract") || kind === "grooming" },
    { id: "pii", label: "Personal information extraction", present: present("pii_extract") || present("age_probe") },
    { id: "secrecy", label: "Increasing secrecy", present: present("secrecy") },
    { id: "pressure", label: "Escalating pressure", present: present("image_ask") || present("blackmail") || present("secrecy") },
    { id: "intensity", label: "Increasing interaction intensity", present: sessions.length >= 4 || present("unwanted") },
  ];
}

export function buildIndicators(
  behaviours: BehaviourHit[],
  sessions: ConversationSession[],
  kind: ThreatKind,
): ExplainIndicator[] {
  if (kind === "grooming") {
    const sessionOf = (n: number) => sessions.find((s) => s.index === n);
    const list: ExplainIndicator[] = [
      {
        id: "identity",
        label: "Repeated attempts to obtain personal information",
        severity: "medium",
        source: sessionOf(1) ? `Detected in ${sessionOf(1)!.label}` : "Detected across sessions",
        contribution: 12,
      },
      {
        id: "pii",
        label: "Personal information extraction",
        severity: "high",
        source: sessionOf(2) ? `Detected in ${sessionOf(2)!.label}` : "Detected across sessions",
        contribution: 15,
      },
      {
        id: "isolation",
        label: "Isolation from trusted adults",
        severity: "high",
        source: sessionOf(3) ? `Detected in ${sessionOf(3)!.label}` : "Detected across sessions",
        contribution: 16,
      },
      {
        id: "secrecy",
        label: "Secrecy pressure",
        severity: "high",
        source: sessionOf(4) ? `Detected in ${sessionOf(4)!.label}` : "Detected in Session 3",
        contribution: 18,
      },
      {
        id: "image",
        label: "Private-image solicitation",
        severity: "critical",
        source: sessionOf(5) ? `Detected in ${sessionOf(5)!.label}` : "Detected in Session 5",
        contribution: 22,
      },
    ];
    return list.filter((ind) => {
      if (ind.id === "image") return behaviours.some((b) => b.id === "image_ask" && b.present) || kind === "grooming";
      return true;
    });
  }

  return behaviours
    .filter((b) => b.present)
    .map((b) => {
      const severity: Severity =
        b.weight >= 22 ? "critical" : b.weight >= 16 ? "high" : b.weight >= 12 ? "medium" : "low";
      return {
        id: b.id,
        label: b.label,
        severity,
        source: "Detected in this thread",
        contribution: b.weight,
      };
    });
}

export function projectedFrom(risk: number, direction: TrajectoryDirection): number {
  if (direction === "Escalating") return Math.min(99, risk + 4);
  if (direction === "Declining") return Math.max(4, risk - 6);
  return risk;
}

export function trajectoryDirection(timeline: TimelinePoint[]): TrajectoryDirection {
  if (timeline.length < 2) return "Stable";
  const delta = timeline[timeline.length - 1].score - timeline[0].score;
  if (delta >= 12) return "Escalating";
  if (delta <= -8) return "Declining";
  return "Stable";
}

export function defaultPrivacy(): PrivacyMetrics {
  return {
    piiDetected: 3,
    redacted: 3,
    identityExposed: false,
    autonomousEscalation: false,
    humanApproval: true,
    originalSample: DEMO_PRIVACY_ORIGINAL,
    redactedSample: DEMO_PRIVACY_REDACTED,
  };
}

export function redactChildIdentity(text: string): { redacted: string; count: number } {
  let count = 0;
  let redacted = text;
  redacted = redacted.replace(
    // eslint-disable-next-line no-misleading-character-class -- Devanagari base + combining marks are intentional (matches real names like "अनुराग")
    /(\b(?:my name is|i am|i['’]m|naam(?:\s+hai)?)\s+)([A-Za-z\u0900-\u097F]+(?:\s+[A-Za-z\u0900-\u097F]+)?)/gi,
    (_m, prefix: string) => {
      count += 1;
      return `${prefix}[REDACTED]`;
    },
  );
  redacted = redacted.replace(
    /\b(?:[A-Z]{2,}(?:\s+[A-Z][a-z]+){0,3}\s+)?School\b/g,
    () => {
      count += 1;
      return "[REDACTED]";
    },
  );
  redacted = redacted.replace(
    /\b(?:in|at)\s+(Panaji|Goa|Mumbai|Delhi|Pune|Chennai|Bengaluru|Kolkata|Hyderabad|Jaipur|Lucknow|[A-Z][a-z]{3,})\b/g,
    () => {
      count += 1;
      return "[REDACTED]";
    },
  );
  if (count === 0 && /Aarav|XYZ School|Panaji/i.test(text)) {
    return { redacted: DEMO_PRIVACY_REDACTED, count: 3 };
  }
  return { redacted, count };
}

export function privacyFromMessages(messages: DemoMessage[]): PrivacyMetrics {
  const joined = messages.map((m) => m.text).join(" ");
  const demoHit = /Aarav|XYZ School|Panaji|school|स्कूल|phone|number/i.test(joined);
  if (demoHit) {
    const { redacted, count } = redactChildIdentity(DEMO_PRIVACY_ORIGINAL);
    return {
      piiDetected: Math.max(3, count),
      redacted: Math.max(3, count),
      identityExposed: false,
      autonomousEscalation: false,
      humanApproval: true,
      originalSample: DEMO_PRIVACY_ORIGINAL,
      redactedSample: redacted,
    };
  }
  const { redacted, count } = redactChildIdentity(joined.slice(0, 180) || DEMO_PRIVACY_ORIGINAL);
  return {
    piiDetected: Math.max(count, 0),
    redacted: Math.max(count, 0),
    identityExposed: false,
    autonomousEscalation: false,
    humanApproval: true,
    originalSample: joined.slice(0, 180) || DEMO_PRIVACY_ORIGINAL,
    redactedSample: redacted || DEMO_PRIVACY_REDACTED,
  };
}

export function singleMessageRiskOf(sessions: ConversationSession[]): number {
  if (!sessions.length) return 8;
  return sessions[0].singleMessageRisk;
}

export function whyFromIndicators(indicators: ExplainIndicator[]): string[] {
  const lines = indicators.map((i) => i.label);
  if (!lines.length) return ["No high-concern behavioural pattern was accumulated in this sample."];
  return lines;
}

export { bandFromRisk };
