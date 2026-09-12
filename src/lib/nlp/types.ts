export type LangCode =
  | "en"
  | "hi"
  | "hi-Latn"
  | "mr"
  | "mr-Latn"
  | "ta"
  | "ta-Latn"
  | "bn"
  | "bn-Latn"
  | "te"
  | "te-Latn"
  | "kn"
  | "kn-Latn"
  | "ml"
  | "ml-Latn"
  | "gu"
  | "gu-Latn"
  | "pa"
  | "pa-Latn"
  | "und";

export type RiskLabel =
  | "grooming_risk"
  | "cyberbullying_risk"
  | "exploitation_risk"
  | "benign";

export type Classification = {
  grooming_risk: number;
  cyberbullying_risk: number;
  exploitation_risk: number;
  benign: number;
  label: RiskLabel;
  confidence: number;
};

export type FlagName =
  | "secrecy"
  | "pii_request"
  | "isolation"
  | "incentive"
  | "platform_migration"
  | "image_request"
  | "age_gap"
  | "distress"
  | "age_probe"
  | "trust_build"
  | "blackmail"
  | "unwanted_contact";

export type ExtractedFlags = Record<FlagName, boolean> & {
  hits: { flag: FlagName; label: string }[];
};

export type ProgressionStage =
  | "contact"
  | "trust_building"
  | "isolation"
  | "exploitation_attempt";

export type ExplainResult = {
  top_factors: { label: string; weight: number; direction: "up" | "down" }[];
  plain_summary: string;
};

export type SafetyCasePack = {
  ai_generated: true;
  label: "AI-generated — human review required";
  incident_summary: string;
  risk_band: "low" | "med" | "high" | "critical";
  risk_score: number;
  stage: ProgressionStage;
  timeline: { at: string; event: string }[];
  redacted_evidence: { turn: number; speaker: string; excerpt: string }[];
  explanation: ExplainResult;
  recommended_urgency: "P1" | "P2" | "P3" | "P4";
  human_confirmation_required: true;
  pocso_note: string;
  /** Was this pack built from a real LLM call, or the offline lexicon fallback? */
  analysis_mode?: "live" | "fallback";
  model?: string | null;
  model_confidence?: number;
  language_label?: string;
  /** Indicator-level detail from the LLM, for the "why was this flagged" view. */
  indicators?: {
    type: string;
    label: string;
    severity: "low" | "medium" | "high" | "critical";
    confidence: number;
    evidence: string;
    source: string;
    why_it_matters: string;
    contribution: number;
  }[];
  uncertainty?: string[];
};

export type ThreadTurn = {
  speaker: "child" | "other" | "reporter";
  text: string;
  at?: string;
};

/**
 * Swappable NLP backend. Default implementation is rule-based + lexicon hybrid.
 * A Python microservice can implement the same contract (see nlp-service/).
 */
export interface NLPProvider {
  classify(text: string, langHint?: LangCode | "auto"): Classification;
  detect_language(text: string): LangCode;
  extract_flags(turn: string, context: ThreadTurn[]): ExtractedFlags;
  explain(input: {
    classification: Classification;
    flags: ExtractedFlags;
    stage: ProgressionStage;
    score: number;
    band: SafetyCasePack["risk_band"];
  }): ExplainResult;
  draft_safety_case(input: {
    evidence: ThreadTurn[];
    timeline: { at: string; event: string }[];
    classification: Classification;
    flags: ExtractedFlags;
    stage: ProgressionStage;
    score: number;
    band: SafetyCasePack["risk_band"];
    priority: SafetyCasePack["recommended_urgency"];
    language: LangCode;
  }): SafetyCasePack;
}
