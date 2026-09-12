import type { LangCode } from "@/lib/nlp/types";

export type DemoRole = "responder" | "counsellor" | "supervisor";

export type ThreatKind =
  | "grooming"
  | "cyberbullying"
  | "blackmail"
  | "threat"
  | "suspicious";

export type Severity = "low" | "medium" | "high" | "critical";

export type AnalysisLang =
  | "en"
  | "hi"
  | "hi-Latn"
  | "mr"
  | "bn"
  | "ta"
  | "te"
  | "kn"
  | "ml"
  | "gu"
  | "pa";

export const ANALYSIS_LANGS: { code: AnalysisLang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "hi-Latn", label: "Hinglish", native: "Hinglish" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

export const PRIMARY_LANGS: AnalysisLang[] = ["en", "hi", "hi-Latn"];

export type BehaviourId =
  | "age_probe"
  | "pii_extract"
  | "trust_build"
  | "secrecy"
  | "isolation"
  | "image_ask"
  | "blackmail"
  | "unwanted";

export type BehaviourHit = {
  id: BehaviourId;
  label: string;
  present: boolean;
  evidence: string;
  weight: number;
};

export type ChainStatus = "detected" | "emerging" | "not_detected";

export type ChainStageId =
  | "contact"
  | "trust"
  | "personal_info"
  | "secrecy"
  | "isolation"
  | "image"
  | "manipulation"
  | "threat";

export type ChainStage = {
  id: ChainStageId;
  label: string;
  status: ChainStatus;
  evidence: string;
};

export type ConversationSession = {
  index: number;
  label: string;
  day: string;
  text: string;
  gloss?: string;
  singleMessageRisk: number;
  sourceLabel?: string;
};

export type CrossPattern = {
  id: string;
  label: string;
  present: boolean;
};

export type ExplainIndicator = {
  id: string;
  type?: string;
  label: string;
  severity: Severity;
  source: string;
  contribution: number;
  evidence?: string;
  whyItMatters?: string;
  confidence?: number;
};

export type TimelinePoint = {
  day: string;
  score: number;
  event: string;
  delta: number;
};

export type DemoMessage = {
  speaker: "child" | "other";
  text: string;
  gloss?: string;
  day?: string;
  source?: "paste" | "screenshot" | "voice" | "file" | "demo";
  sourceLabel?: string;
};

export type GraphNode = {
  id: string;
  label: string;
  kind: "child" | "account";
  risk: number;
};

export type GraphEdge = {
  from: string;
  to: string;
  strength: number;
  label: string;
};

export type AuditEntry = {
  id: string;
  at: string;
  action: string;
  actor: string;
  detail?: string;
};

export type CaseStatus =
  | "human_review"
  | "support"
  | "monitoring"
  | "counsellor"
  | "closed";

export type PrivacyMetrics = {
  piiDetected: number;
  redacted: number;
  identityExposed: boolean;
  autonomousEscalation: boolean;
  humanApproval: boolean;
  originalSample: string;
  redactedSample: string;
};

export type TrajectoryDirection = "Escalating" | "Stable" | "Declining";

export type AnalysisMode = "live" | "fallback" | "prototype";

export type DemoCase = {
  id: string;
  publicId: string;
  risk: number;
  projectedRisk: number;
  singleMessageRisk: number;
  band: Severity;
  threatType: ThreatKind;
  threatLabel: string;
  ageBand: string;
  language: AnalysisLang;
  languageLabel: string;
  status: CaseStatus;
  lastActivity: string;
  summary: string;
  recommendation: string;
  why: string[];
  behaviours: BehaviourHit[];
  chain: ChainStage[];
  sessions: ConversationSession[];
  crossPatterns: CrossPattern[];
  indicators: ExplainIndicator[];
  timeline: TimelinePoint[];
  trajectory: TrajectoryDirection;
  messages: DemoMessage[];
  evidence: string[];
  graph: { nodes: GraphNode[]; edges: GraphEdge[] };
  audit: AuditEntry[];
  privacy: PrivacyMetrics;
  detectedLanguage: string;
  normalizedMeaning: string;
  region: string;
  source: "seed" | "analysis" | "child" | "simulation";
  analysisMode?: AnalysisMode;
  isSynthetic?: boolean;
  modelName?: string;
  modelConfidence?: number;
  briefing?: string;
  screenshots?: { name: string; dataUrl: string }[];
  voiceNote?: { durationSec: number; mime: string; transcription?: string };
  uncertainty?: string[];
};

export type AnalysisStage =
  | "idle"
  | "message"
  | "behaviour"
  | "accumulation"
  | "assessment"
  | "done";

export type AnalysisResult = {
  risk: number;
  projectedRisk: number;
  singleMessageRisk: number;
  band: Severity;
  behaviours: BehaviourHit[];
  chain: ChainStage[];
  sessions: ConversationSession[];
  crossPatterns: CrossPattern[];
  indicators: ExplainIndicator[];
  timeline: TimelinePoint[];
  trajectory: TrajectoryDirection;
  why: string[];
  recommendation: string;
  summary: string;
  detectedLanguage: LangCode;
  languageLabel: string;
  normalizedMeaning: string;
  privacy: PrivacyMetrics;
  messages: DemoMessage[];
  threatType: ThreatKind;
  threatLabel: string;
  confidenceLabel: "Simulated" | "Live model" | "Fallback";
  modelStatus: "Prototype" | "Live LLM" | "Unavailable";
  autonomousAction: "Disabled";
  humanReview: "REQUIRED";
  escalationNote: string;
  analysisMode?: AnalysisMode;
  isSynthetic?: boolean;
  modelName?: string;
  modelConfidence?: number;
  latencyMs?: number;
  recommendedHumanReview?: boolean;
  uncertainty?: string[];
  visionUsed?: boolean;
  visionNote?: string;
  transcriptionNote?: string;
  provider?: string;
  evidenceSources?: string[];
  briefing?: string;
};

export function bandFromRisk(score: number): Severity {
  if (score >= 75) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  return "low";
}

export function threatLabel(kind: ThreatKind): string {
  switch (kind) {
    case "grooming":
      return "Possible grooming";
    case "cyberbullying":
      return "Cyberbullying";
    case "blackmail":
      return "Blackmail";
    case "threat":
      return "Threat";
    case "suspicious":
      return "Suspicious contact";
  }
}

export function statusLabel(s: CaseStatus): string {
  switch (s) {
    case "human_review":
      return "Human review required";
    case "support":
      return "Active support";
    case "monitoring":
      return "Monitoring";
    case "counsellor":
      return "Counsellor assigned";
    case "closed":
      return "Closed";
  }
}
