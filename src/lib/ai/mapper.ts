import { CHAIN_META } from "@/lib/demo/intelligence";
import { bandFromRisk, threatLabel, type AnalysisLang, type AnalysisResult, type BehaviourHit, type ChainStage, type ConversationSession, type CrossPattern, type DemoMessage, type ExplainIndicator, type ThreatKind, type TimelinePoint } from "@/lib/demo/types";
import { detectLanguage, LANG_LABELS } from "@/lib/nlp/language";
import type { LangCode } from "@/lib/nlp/types";
import { detectAndRedactPii } from "./pii";
import { INDICATOR_LABELS, projectedScore, scoreAnalysis, scoreBySession, type ScoredIndicator } from "./risk-engine";
import type { BehaviouralStage, IndicatorType, LlmSafetyAnalysis } from "./schema";

const TYPE_TO_BEHAVIOUR: Record<IndicatorType, BehaviourHit["id"]> = {
  identity_probing: "age_probe",
  personal_information: "pii_extract",
  trust_building: "trust_build",
  secrecy_pressure: "secrecy",
  isolation: "isolation",
  image_solicitation: "image_ask",
  manipulation: "trust_build",
  threat: "blackmail",
  blackmail: "blackmail",
  repeated_unwanted_contact: "unwanted",
};

const STAGE_MAP: Record<BehaviouralStage, ChainStage["id"]> = {
  contact: "contact",
  trust_building: "trust",
  personal_information: "personal_info",
  secrecy: "secrecy",
  isolation: "isolation",
  image_solicitation: "image",
  manipulation: "manipulation",
  threat: "threat",
  blackmail: "threat",
};

export type LiveMeta = {
  analysisMode: "live" | "fallback";
  modelName: string;
  latencyMs: number;
  visionUsed: boolean;
  visionNote?: string;
  transcriptionNote?: string;
  isSynthetic: boolean;
  provider: string;
};

export function mapToAnalysisResult(
  analysis: LlmSafetyAnalysis,
  messages: DemoMessage[],
  meta: LiveMeta,
): AnalysisResult {
  const scored = scoreAnalysis(analysis);
  const threatType = toThreat(analysis.threat_type);
  const lang = toLang(analysis.language_code, messages);
  const behaviours = buildBehaviours(scored.contributions, messages);
  const chain = buildChain(analysis.behavioural_stages, scored.contributions, messages);
  const sessions = buildSessions(messages, analysis, scored.contributions);
  const timeline = buildTimeline(analysis, messages, scored.score);
  const trajectory =
    analysis.escalation_signal === "escalating"
      ? "Escalating"
      : analysis.escalation_signal === "declining"
        ? "Declining"
        : "Stable";
  const projected = projectedScore(scored.score, analysis.escalation_signal);
  const joined = messages.map((m) => m.text).join("\n");
  const pii = detectAndRedactPii(joined);
  const indicators: ExplainIndicator[] = scored.contributions.map((c) => ({
    id: c.type,
    type: c.type,
    label: c.label,
    severity: c.severity,
    source: c.source,
    contribution: c.contribution,
    evidence: c.evidence,
    whyItMatters: c.whyItMatters,
    confidence: c.confidence,
  }));
  const crossPatterns = buildCross(scored.uniqueTypes, sessions);

  return {
    risk: scored.score,
    projectedRisk: projected,
    singleMessageRisk: sessions[0]?.singleMessageRisk ?? Math.min(18, scored.score),
    band: scored.band,
    behaviours,
    chain,
    sessions,
    crossPatterns,
    indicators,
    timeline,
    trajectory,
    why: indicators.map((i) => i.label),
    recommendation: recommend(threatType, scored.band, indicators),
    summary: analysis.summary,
    detectedLanguage: lang,
    languageLabel: analysis.language || LANG_LABELS[lang] || String(lang),
    normalizedMeaning: analysis.normalized_meaning,
    privacy: {
      piiDetected: pii.detected,
      redacted: pii.redacted,
      identityExposed: false,
      autonomousEscalation: false,
      humanApproval: true,
      originalSample: pii.originalSample,
      redactedSample: pii.redactedSample,
    },
    messages,
    threatType,
    threatLabel: threatType === "suspicious" && analysis.threat_type === "none" ? "No concerning pattern" : threatLabel(threatType),
    confidenceLabel: meta.analysisMode === "live" ? "Live model" : "Fallback",
    modelStatus: meta.analysisMode === "live" ? "Live LLM" : "Unavailable",
    autonomousAction: "Disabled",
    humanReview: "REQUIRED",
    escalationNote:
      "Simulated trajectory — not a validated prediction. The system does not accuse a person, contact police, or expose a child's identity. A trained human reviews every consequential step. Model-reported confidence is not a validated safety probability.",
    analysisMode: meta.analysisMode,
    isSynthetic: meta.isSynthetic,
    modelName: meta.modelName,
    modelConfidence: Math.round(analysis.model_confidence * 100),
    latencyMs: meta.latencyMs,
    recommendedHumanReview: analysis.recommended_human_review || scored.band === "high" || scored.band === "critical",
    uncertainty: analysis.uncertainty,
    visionUsed: meta.visionUsed,
    visionNote: meta.visionNote,
    transcriptionNote: meta.transcriptionNote,
    provider: meta.provider,
    evidenceSources: uniqueSources(messages),
  };
}

function toThreat(t: LlmSafetyAnalysis["threat_type"]): ThreatKind {
  if (t === "none") return "suspicious";
  return t;
}

function toLang(code: string, messages: DemoMessage[]): LangCode {
  const joined = messages.map((m) => m.text).join(" ");
  const detected = detectLanguage(joined);
  const raw = (code || "").trim();
  if (!raw) return detected;
  const allowed: AnalysisLang[] = ["en", "hi", "hi-Latn", "mr", "bn", "ta", "te", "kn", "ml", "gu", "pa"];
  if ((allowed as string[]).includes(raw)) return raw as LangCode;
  return detected;
}

function buildBehaviours(contrib: ScoredIndicator[], messages: DemoMessage[]): BehaviourHit[] {
  const meta: { id: BehaviourHit["id"]; label: string; types: IndicatorType[] }[] = [
    { id: "age_probe", label: "Age / identity probing", types: ["identity_probing"] },
    { id: "pii_extract", label: "Personal information extraction", types: ["personal_information"] },
    { id: "trust_build", label: "Trust building", types: ["trust_building"] },
    { id: "secrecy", label: "Secrecy pressure", types: ["secrecy_pressure"] },
    { id: "isolation", label: "Isolation from trusted adults", types: ["isolation"] },
    { id: "image_ask", label: "Image solicitation", types: ["image_solicitation"] },
    { id: "blackmail", label: "Threat / blackmail indicators", types: ["threat", "blackmail"] },
    { id: "unwanted", label: "Repeated unwanted contact", types: ["repeated_unwanted_contact"] },
  ];
  return meta.map((m) => {
    const hit = contrib.find((c) => m.types.includes(c.type));
    return {
      id: m.id,
      label: m.label,
      present: Boolean(hit),
      evidence: hit?.evidence ?? "Not observed in this thread.",
      weight: hit?.contribution ?? 0,
    };
  });
}

function buildChain(
  stages: BehaviouralStage[],
  contrib: ScoredIndicator[],
  messages: DemoMessage[],
): ChainStage[] {
  const present = new Set(stages.map((s) => STAGE_MAP[s]));
  if (messages.some((m) => m.speaker === "other")) present.add("contact");
  const evidenceOf = (id: ChainStage["id"]) => {
    const match = contrib.find((c) => STAGE_MAP_REVERSE[c.type] === id);
    return match?.evidence ?? "Pattern observed across the thread.";
  };

  return CHAIN_META.map((meta) => {
    const status: ChainStage["status"] = present.has(meta.id)
      ? "detected"
      : relatedEmerging(meta.id, present)
        ? "emerging"
        : "not_detected";
    return {
      id: meta.id,
      label: meta.label,
      status,
      evidence:
        status === "not_detected"
          ? "Not observed in this thread."
          : status === "emerging"
            ? "Early signal — not a confirmed stage."
            : evidenceOf(meta.id),
    };
  });
}

const STAGE_MAP_REVERSE: Record<IndicatorType, ChainStage["id"]> = {
  identity_probing: "personal_info",
  personal_information: "personal_info",
  trust_building: "trust",
  secrecy_pressure: "secrecy",
  isolation: "isolation",
  image_solicitation: "image",
  manipulation: "manipulation",
  threat: "threat",
  blackmail: "threat",
  repeated_unwanted_contact: "contact",
};

function relatedEmerging(id: ChainStage["id"], present: Set<ChainStage["id"]>): boolean {
  if (id === "isolation" && present.has("secrecy")) return true;
  if (id === "image" && present.has("secrecy")) return true;
  if (id === "manipulation" && present.has("trust") && present.has("secrecy")) return true;
  return false;
}

function buildSessions(
  messages: DemoMessage[],
  analysis: LlmSafetyAnalysis,
  contrib: ScoredIndicator[],
): ConversationSession[] {
  const groups = groupSessions(messages);
  const scored = scoreBySession(
    analysis,
    groups.map((g) =>
      contrib
        .filter((c) => g.some((m) => m.text.includes(c.evidence.slice(0, 24)) || c.source.toLowerCase().includes("session")))
        .map((c) => c.type),
    ),
  );
  return groups.map((g, i) => ({
    index: i + 1,
    label: g[0]?.day || scored[i]?.label || `Session ${i + 1}`,
    day: g[0]?.day ?? `Session ${i + 1}`,
    text: g.map((m) => m.text).join(" / "),
    gloss: g.find((m) => m.gloss)?.gloss,
    singleMessageRisk: scored[i]?.score ?? Math.round(((i + 1) / groups.length) * (contrib.reduce((s, c) => s + c.contribution, 0))),
    sourceLabel: g[0]?.sourceLabel,
  }));
}

function groupSessions(messages: DemoMessage[]): DemoMessage[][] {
  const byDay = new Map<string, DemoMessage[]>();
  let auto = 0;
  for (const m of messages) {
    const key = m.day || m.sourceLabel || `turn-${++auto}`;
    const list = byDay.get(key) ?? [];
    list.push(m);
    byDay.set(key, list);
  }
  const groups = [...byDay.values()];
  if (groups.length <= 1) {
    const others = messages.filter((m) => m.speaker === "other");
    if (others.length >= 3) return others.map((m) => [m]);
  }
  return groups.length ? groups : [messages];
}

function buildTimeline(analysis: LlmSafetyAnalysis, messages: DemoMessage[], risk: number): TimelinePoint[] {
  const groups = groupSessions(messages);
  const rows = scoreBySession(
    analysis,
    groups.map((_, i) => {
      const slice = analysis.risk_indicators
        .filter((_, idx) => idx <= i)
        .map((r) => r.type);
      return slice;
    }),
  );
  if (!rows.length) {
    return [{ day: "Now", score: risk, event: "Single analysis", delta: risk }];
  }
  return rows.map((r) => ({
    day: r.label,
    score: r.score,
    event: r.event,
    delta: r.delta,
  }));
}

function buildCross(types: IndicatorType[], sessions: ConversationSession[]): CrossPattern[] {
  return [
    { id: "identity", label: "Repeated identity probing", present: types.includes("identity_probing") || types.includes("personal_information") },
    { id: "pii", label: "Personal information extraction", present: types.includes("personal_information") },
    { id: "secrecy", label: "Increasing secrecy", present: types.includes("secrecy_pressure") },
    { id: "pressure", label: "Escalating pressure", present: types.includes("image_solicitation") || types.includes("blackmail") || types.includes("threat") },
    { id: "intensity", label: "Increasing interaction intensity", present: sessions.length >= 4 || types.includes("repeated_unwanted_contact") },
  ];
}

function recommend(kind: ThreatKind, band: ReturnType<typeof bandFromRisk>, indicators: ExplainIndicator[]): string {
  if (kind === "grooming" && (band === "critical" || band === "high")) {
    return "Review secrecy behaviour and repeated requests for personal information.";
  }
  switch (band) {
    case "low":
      return indicators.length
        ? "Low concern. Offer safety guidance and keep the door open."
        : "No urgent intervention. Offer safety guidance and keep the door open.";
    case "medium":
      return "Encourage a trusted adult. Offer safety education. Human review is still available.";
    case "high":
      return "Offer a trusted-adult or counsellor pathway and create a responder review case. Do not contact authorities automatically.";
    case "critical":
      return "Urgent human review. Preserve redacted evidence. Open a support pathway. A person decides the next step.";
  }
}

function uniqueSources(messages: DemoMessage[]): string[] {
  return [...new Set(messages.map((m) => m.sourceLabel || m.source || "paste"))];
}

void TYPE_TO_BEHAVIOUR;
void INDICATOR_LABELS;
