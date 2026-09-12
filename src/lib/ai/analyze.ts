import { LlmSafetyAnalysisSchema, LLM_ANALYSIS_JSON_SCHEMA, OCR_JSON_SCHEMA, OcrExtractSchema, CopilotReplySchema, BriefingSchema, WhatIfSchema, type LlmSafetyAnalysis, type OcrExtract } from "./schema";
import { chatJson, extractJsonObject, resolveProvider, transcribeAudio, type ChatContent, type ChatMessage } from "./client";
import { mapToAnalysisResult, type LiveMeta } from "./mapper";
import { detectAndRedactPii } from "./pii";
import { formatConversation } from "./parse-conversation";
import type { AnalysisResult, DemoMessage } from "@/lib/demo/types";

const ANALYST_SYSTEM = `You are SurakshaNet Safety Analyst, a child-safety behavioural signal extractor for India.

You analyse conversation evidence (chat logs, screenshot text, voice transcripts) for grooming, cyberbullying, blackmail, threats, and related harms.

Rules:
- Extract behavioural indicators grounded in quoted evidence from the input. Never invent messages.
- Do NOT output a final numeric risk_score. A deterministic engine scores indicators separately.
- Do NOT determine guilt, name a perpetrator, or recommend contacting police, parents, or authorities.
- Set recommended_human_review true whenever any medium-or-higher indicator is present.
- Understand English, Hindi, Hinglish, Marathi, Bengali, Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi, and code-mixed text. Preserve original wording in evidence quotes.
- If the conversation is harmless (homework, casual chat, family logistics), return an empty risk_indicators array, threat_type "none", behavioural_stages [] or ["contact"] only, and recommended_human_review false.
- behavioural_stages must only include stages actually observed in the evidence.
- uncertainty lists ambiguities. Do not force a high-risk classification when evidence is thin.
- session_signals: group indicators by session/day when chronological evidence exists.
- language_code should be one of: en, hi, hi-Latn, mr, bn, ta, te, kn, ml, gu, pa.
- model_confidence is your confidence in the extraction (0-1), not a probability of harm.

Return JSON only matching the schema.`;

const OCR_SYSTEM = `You extract chat conversations from screenshots of messaging apps.
Return JSON only. For each visible bubble, identify speaker as "other" (the person messaging the child) or "child".
Preserve original language (including Hinglish). Do not translate the text field.
If text is unreadable, set low_confidence true and include what you could read.
Never invent messages that are not visible.`;

export type AnalyzeEvidenceInput = {
  messages: DemoMessage[];
  images?: { name: string; dataUrl: string }[];
  isSynthetic?: boolean;
  transcriptionNote?: string;
};

export type AnalyzeEvidenceResult =
  | {
      ok: true;
      result: AnalysisResult;
      analysis: LlmSafetyAnalysis;
      rawMode: "live";
    }
  | {
      ok: false;
      error: string;
      code: string;
    };

export async function analyzeConversation(input: AnalyzeEvidenceInput): Promise<AnalyzeEvidenceResult> {
  if (!input.messages.length && !input.images?.length) {
    return { ok: false, error: "Add a conversation, screenshot, or voice note first.", code: "empty" };
  }

  const provider = resolveProvider();
  const joined = formatConversation(input.messages);
  const pii = detectAndRedactPii(joined);
  const redactedTranscript = pii.redactedSample.length > 20 ? redactMessages(input.messages) : joined;

  const userParts: ChatContent[] = [
    {
      type: "text",
      text: `Analyse this conversation evidence for child-safety behavioural indicators.

EVIDENCE (PII redacted where detected):
${redactedTranscript}

${input.isSynthetic ? "NOTE: This is a SYNTHETIC DEMO conversation, not a real child." : "NOTE: This is live user-provided evidence."}

Return structured JSON.`,
    },
  ];

  const visionUsed = Boolean(provider.vision && input.images?.length);
  if (visionUsed && input.images) {
    for (const img of input.images.slice(0, 4)) {
      userParts.push({ type: "image_url", image_url: { url: img.dataUrl } });
    }
    userParts.push({
      type: "text",
      text: "Screenshots are attached. Use them as additional evidence. Prefer the reviewed transcript if it conflicts with OCR.",
    });
  }

  const messages: ChatMessage[] = [
    { role: "system", content: ANALYST_SYSTEM },
    { role: "user", content: userParts },
  ];

  let raw = await chatJson({
    messages,
    schema: { name: "safety_analysis", schema: LLM_ANALYSIS_JSON_SCHEMA as unknown as Record<string, unknown>, strict: true },
    maxTokens: 2800,
    timeoutMs: 34_000,
  });

  if (!raw.ok) return { ok: false, error: raw.error, code: raw.code };

  let parsed = parseAnalysis(raw.text);
  if (!parsed.ok) {
    raw = await chatJson({
      messages: [
        ...messages,
        { role: "assistant", content: raw.text },
        {
          role: "user",
          content: `The previous JSON failed validation (${parsed.error}). Return corrected JSON only, matching the schema. Do not invent evidence.`,
        },
      ],
      maxTokens: 2800,
      timeoutMs: 20_000,
    });
    if (!raw.ok) return { ok: false, error: raw.error, code: raw.code };
    parsed = parseAnalysis(raw.text);
    if (!parsed.ok) {
      return { ok: false, error: "The safety model returned invalid structured output.", code: "invalid_json" };
    }
  }

  const meta: LiveMeta = {
    analysisMode: "live",
    modelName: raw.ok ? raw.model : provider.model,
    latencyMs: raw.ok ? raw.latencyMs : 0,
    visionUsed,
    visionNote: visionUsed
      ? undefined
      : input.images?.length
        ? "Image analysis unavailable for the current model. Text was extracted from the screenshot for analysis."
        : undefined,
    transcriptionNote: input.transcriptionNote,
    isSynthetic: Boolean(input.isSynthetic),
    provider: provider.id,
  };

  const result = mapToAnalysisResult(parsed.data, input.messages, meta);
  return { ok: true, result, analysis: parsed.data, rawMode: "live" };
}

export async function extractConversationFromImages(images: { name: string; dataUrl: string }[]): Promise<
  { ok: true; extract: OcrExtract; visionUsed: boolean } | { ok: false; error: string; visionUsed: boolean }
> {
  const provider = resolveProvider();
  if (!images.length) return { ok: false, error: "No screenshots attached.", visionUsed: false };
  if (!provider.vision) {
    return {
      ok: false,
      error: "Image analysis unavailable for the current model. Paste the conversation text instead.",
      visionUsed: false,
    };
  }

  const parts: ChatContent[] = [
    {
      type: "text",
      text: `Extract every readable chat message from these ${images.length} screenshot(s). Label speakers as child or other. source_label should be the screenshot filename.`,
    },
  ];
  for (const img of images.slice(0, 6)) {
    parts.push({ type: "image_url", image_url: { url: img.dataUrl } });
    parts.push({ type: "text", text: `Filename: ${img.name}` });
  }

  const raw = await chatJson({
    messages: [
      { role: "system", content: OCR_SYSTEM },
      { role: "user", content: parts },
    ],
    schema: { name: "ocr_extract", schema: OCR_JSON_SCHEMA as unknown as Record<string, unknown>, strict: true },
    maxTokens: 2200,
    timeoutMs: 34_000,
  });
  if (!raw.ok) return { ok: false, error: raw.error, visionUsed: true };

  try {
    const json = extractJsonObject(raw.text);
    const parsed = OcrExtractSchema.safeParse(json);
    if (!parsed.success) {
      return { ok: false, error: "Could not reconstruct a conversation from the screenshot.", visionUsed: true };
    }
    return { ok: true, extract: parsed.data, visionUsed: true };
  } catch {
    return { ok: false, error: "Could not reconstruct a conversation from the screenshot.", visionUsed: true };
  }
}

export async function transcribeVoiceNote(input: { base64: string; mime: string }) {
  return transcribeAudio(input);
}

export async function generateBriefing(input: { result: AnalysisResult }) {
  const ctx = caseContext(input.result);
  const raw = await chatJson({
    messages: [
      {
        role: "system",
        content:
          "You write concise factual responder briefings for a child-safety desk. Do not accuse anyone. Do not recommend contacting police. Always require human judgment. JSON only: { briefing, bullets, human_judgment_required: true }.",
      },
      { role: "user", content: ctx + "\n\nGenerate a 30-second responder briefing." },
    ],
    maxTokens: 700,
    timeoutMs: 20_000,
  });
  if (!raw.ok) return raw;
  try {
    const parsed = BriefingSchema.safeParse(extractJsonObject(raw.text));
    if (!parsed.success) {
      return { ok: true as const, briefing: raw.text.trim(), bullets: [] as string[], human_judgment_required: true as const, model: raw.model, latencyMs: raw.latencyMs };
    }
    return { ok: true as const, ...parsed.data, model: raw.model, latencyMs: raw.latencyMs };
  } catch {
    return { ok: true as const, briefing: raw.text.trim(), bullets: [] as string[], human_judgment_required: true as const, model: raw.model, latencyMs: raw.latencyMs };
  }
}

export async function copilotAsk(input: { result: AnalysisResult; question: string }) {
  const q = input.question.trim();
  if (!q) return { ok: false as const, error: "Ask a question." };
  const raw = await chatJson({
    messages: [
      {
        role: "system",
        content:
          "You are SurakshaNet Safety Copilot for trained responders. Answer only from the case context. Never make autonomous safeguarding decisions. Never tell the responder to contact police or parents automatically. Always state that human judgment is required. JSON: { answer, missing_information, human_judgment_required: true }.",
      },
      { role: "user", content: `${caseContext(input.result)}\n\nResponder question: ${q}` },
    ],
    maxTokens: 900,
    timeoutMs: 20_000,
  });
  if (!raw.ok) return raw;
  try {
    const parsed = CopilotReplySchema.safeParse(extractJsonObject(raw.text));
    if (!parsed.success) {
      return { ok: true as const, answer: raw.text.trim(), missing_information: [] as string[], human_judgment_required: true as const };
    }
    return { ok: true as const, ...parsed.data };
  } catch {
    return { ok: true as const, answer: raw.text.trim(), missing_information: [] as string[], human_judgment_required: true as const };
  }
}

export async function simulateWhatIf(input: {
  result: AnalysisResult;
  scenario: "continue" | "block" | "tell_adult" | "counsellor";
}) {
  const labels = {
    continue: "Continue interaction",
    block: "Block contact",
    tell_adult: "Tell a trusted adult",
    counsellor: "Request counsellor support",
  };
  const raw = await chatJson({
    messages: [
      {
        role: "system",
        content:
          "You write a short PLAUSIBLE SCENARIO for a child-safety what-if simulator. It is ILLUSTRATIVE, NOT a guaranteed prediction, NOT scientifically validated. JSON: { scenario, plausible_description, illustrative_projection, not_a_prediction: true }.",
      },
      {
        role: "user",
        content: `${caseContext(input.result)}\n\nWhat-if: ${labels[input.scenario]}. Keep it under 120 words.`,
      },
    ],
    maxTokens: 500,
    timeoutMs: 18_000,
  });
  if (!raw.ok) return raw;
  try {
    const parsed = WhatIfSchema.safeParse(extractJsonObject(raw.text));
    if (!parsed.success) {
      return {
        ok: true as const,
        scenario: labels[input.scenario],
        plausible_description: raw.text.trim(),
        illustrative_projection: "Illustrative only.",
        not_a_prediction: true as const,
      };
    }
    return { ok: true as const, ...parsed.data };
  } catch {
    return {
      ok: true as const,
      scenario: labels[input.scenario],
      plausible_description: raw.text.trim(),
      illustrative_projection: "Illustrative only.",
      not_a_prediction: true as const,
    };
  }
}

function parseAnalysis(text: string): { ok: true; data: LlmSafetyAnalysis } | { ok: false; error: string } {
  try {
    const json = extractJsonObject(text);
    const parsed = LlmSafetyAnalysisSchema.safeParse(json);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues.map((i) => i.message).join("; ") };
    }
    return { ok: true, data: parsed.data };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "invalid json" };
  }
}

function redactMessages(messages: DemoMessage[]): string {
  return messages
    .map((m) => {
      const red = detectAndRedactPii(m.text).redactedSample;
      const src = m.sourceLabel ? `[${m.sourceLabel}] ` : "";
      return `${src}${m.speaker.toUpperCase()}: ${red}`;
    })
    .join("\n");
}

function caseContext(r: AnalysisResult): string {
  const indicators = r.indicators
    .map((i) => `- ${i.label} (${i.severity}, +${i.contribution}) evidence: ${i.evidence ?? i.source}`)
    .join("\n");
  const thread = r.messages
    .slice(0, 24)
    .map((m) => `${m.speaker}: ${detectAndRedactPii(m.text).redactedSample}`)
    .join("\n");
  return `Risk ${r.risk}/100 (${r.band}). Threat: ${r.threatLabel}. Language: ${r.languageLabel}.
Trajectory: ${r.trajectory}. Human review: REQUIRED. Autonomous action: DISABLED.

Indicators:
${indicators || "(none)"}

Uncertainty:
${(r.uncertainty ?? []).join("; ") || "(none)"}

Redacted evidence:
${thread}`;
}
