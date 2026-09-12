import { z } from "zod";

/** Indicator types the LLM may emit. Final scores are computed elsewhere. */
export const INDICATOR_TYPES = [
  "identity_probing",
  "personal_information",
  "trust_building",
  "secrecy_pressure",
  "isolation",
  "image_solicitation",
  "manipulation",
  "threat",
  "blackmail",
  "repeated_unwanted_contact",
] as const;

export type IndicatorType = (typeof INDICATOR_TYPES)[number];

export const BEHAVIOURAL_STAGES = [
  "contact",
  "trust_building",
  "personal_information",
  "secrecy",
  "isolation",
  "image_solicitation",
  "manipulation",
  "threat",
  "blackmail",
] as const;

export type BehaviouralStage = (typeof BEHAVIOURAL_STAGES)[number];

export const THREAT_TYPES = [
  "grooming",
  "cyberbullying",
  "blackmail",
  "threat",
  "suspicious",
  "none",
] as const;

export const SEVERITIES = ["low", "medium", "high", "critical"] as const;
export const ESCALATIONS = ["escalating", "stable", "declining"] as const;

export const RiskIndicatorSchema = z.object({
  type: z.enum(INDICATOR_TYPES),
  severity: z.enum(SEVERITIES),
  confidence: z.number().min(0).max(1),
  evidence: z.string(),
  source: z.string(),
  why_it_matters: z.string(),
});

export const SessionSignalSchema = z.object({
  session_index: z.number().int().min(1),
  label: z.string(),
  indicators: z.array(z.enum(INDICATOR_TYPES)),
});

export const LlmSafetyAnalysisSchema = z.object({
  language: z.string(),
  language_code: z.string(),
  summary: z.string(),
  normalized_meaning: z.string(),
  threat_type: z.enum(THREAT_TYPES),
  risk_indicators: z.array(RiskIndicatorSchema),
  behavioural_stages: z.array(z.enum(BEHAVIOURAL_STAGES)),
  escalation_signal: z.enum(ESCALATIONS),
  uncertainty: z.array(z.string()),
  recommended_human_review: z.boolean(),
  model_confidence: z.number().min(0).max(1),
  session_signals: z.array(SessionSignalSchema).optional(),
});

export type LlmSafetyAnalysis = z.infer<typeof LlmSafetyAnalysisSchema>;
export type LlmRiskIndicator = z.infer<typeof RiskIndicatorSchema>;

export const OcrMessageSchema = z.object({
  speaker: z.enum(["child", "other"]),
  text: z.string(),
  source_label: z.string(),
});

export const OcrExtractSchema = z.object({
  language: z.string(),
  ocr_confidence: z.number().min(0).max(1),
  low_confidence: z.boolean(),
  messages: z.array(OcrMessageSchema),
  notes: z.string(),
});

export type OcrExtract = z.infer<typeof OcrExtractSchema>;

export const CopilotReplySchema = z.object({
  answer: z.string(),
  missing_information: z.array(z.string()),
  human_judgment_required: z.literal(true),
});

export type CopilotReply = z.infer<typeof CopilotReplySchema>;

export const BriefingSchema = z.object({
  briefing: z.string(),
  bullets: z.array(z.string()),
  human_judgment_required: z.literal(true),
});

export type Briefing = z.infer<typeof BriefingSchema>;

export const WhatIfSchema = z.object({
  scenario: z.string(),
  plausible_description: z.string(),
  illustrative_projection: z.string(),
  not_a_prediction: z.literal(true),
});

export type WhatIfResult = z.infer<typeof WhatIfSchema>;

/** JSON Schema sent to the provider for structured decoding. */
export const LLM_ANALYSIS_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "language",
    "language_code",
    "summary",
    "normalized_meaning",
    "threat_type",
    "risk_indicators",
    "behavioural_stages",
    "escalation_signal",
    "uncertainty",
    "recommended_human_review",
    "model_confidence",
    "session_signals",
  ],
  properties: {
    language: { type: "string" },
    language_code: { type: "string" },
    summary: { type: "string" },
    normalized_meaning: { type: "string" },
    threat_type: { type: "string", enum: [...THREAT_TYPES] },
    risk_indicators: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["type", "severity", "confidence", "evidence", "source", "why_it_matters"],
        properties: {
          type: { type: "string", enum: [...INDICATOR_TYPES] },
          severity: { type: "string", enum: [...SEVERITIES] },
          confidence: { type: "number" },
          evidence: { type: "string" },
          source: { type: "string" },
          why_it_matters: { type: "string" },
        },
      },
    },
    behavioural_stages: {
      type: "array",
      items: { type: "string", enum: [...BEHAVIOURAL_STAGES] },
    },
    escalation_signal: { type: "string", enum: [...ESCALATIONS] },
    uncertainty: { type: "array", items: { type: "string" } },
    recommended_human_review: { type: "boolean" },
    model_confidence: { type: "number" },
    session_signals: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["session_index", "label", "indicators"],
        properties: {
          session_index: { type: "integer" },
          label: { type: "string" },
          indicators: { type: "array", items: { type: "string", enum: [...INDICATOR_TYPES] } },
        },
      },
    },
  },
} as const;

export const OCR_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["language", "ocr_confidence", "low_confidence", "messages", "notes"],
  properties: {
    language: { type: "string" },
    ocr_confidence: { type: "number" },
    low_confidence: { type: "boolean" },
    notes: { type: "string" },
    messages: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["speaker", "text", "source_label"],
        properties: {
          speaker: { type: "string", enum: ["child", "other"] },
          text: { type: "string" },
          source_label: { type: "string" },
        },
      },
    },
  },
} as const;
