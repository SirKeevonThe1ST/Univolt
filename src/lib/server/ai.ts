import { createServerFn } from "@tanstack/react-start";
import {
  analyzeConversation,
  copilotAsk,
  extractConversationFromImages,
  generateBriefing,
  simulateWhatIf,
  transcribeVoiceNote,
} from "@/lib/ai/analyze";
import { aiRuntime, resolveProvider } from "@/lib/ai/client";
import { parseConversation } from "@/lib/ai/parse-conversation";
import type { AnalysisResult, DemoMessage } from "@/lib/demo/types";

export type EvidenceMessage = {
  speaker: "child" | "other";
  text: string;
  gloss?: string;
  day?: string;
  source?: DemoMessage["source"];
  sourceLabel?: string;
};

export type AnalyzePayload = {
  messages: EvidenceMessage[];
  pastedText?: string;
  images?: { name: string; dataUrl: string }[];
  isSynthetic?: boolean;
  transcriptionNote?: string;
};

export const analyzeEvidence = createServerFn({ method: "POST" })
  .validator((d: AnalyzePayload) => d)
  .handler(async ({ data }) => {
    const fromPaste = data.pastedText?.trim() ? parseConversation(data.pastedText, "Pasted text") : [];
    const provided = (data.messages ?? []).map((m) => ({
      speaker: m.speaker,
      text: m.text,
      gloss: m.gloss,
      day: m.day,
      source: m.source,
      sourceLabel: m.sourceLabel,
    }));
    const messages = provided.length ? provided : fromPaste;
    return analyzeConversation({
      messages,
      images: data.images?.slice(0, 6),
      isSynthetic: data.isSynthetic,
      transcriptionNote: data.transcriptionNote,
    });
  });

export const extractScreenshots = createServerFn({ method: "POST" })
  .validator((d: { images: { name: string; dataUrl: string }[] }) => d)
  .handler(async ({ data }) => extractConversationFromImages(data.images.slice(0, 6)));

export const transcribeVoice = createServerFn({ method: "POST" })
  .validator((d: { base64: string; mime: string }) => d)
  .handler(async ({ data }) => transcribeVoiceNote(data));

export const askCopilot = createServerFn({ method: "POST" })
  .validator((d: { result: AnalysisResult; question: string }) => d)
  .handler(async ({ data }) => copilotAsk(data));

export const requestBriefing = createServerFn({ method: "POST" })
  .validator((d: { result: AnalysisResult }) => d)
  .handler(async ({ data }) => generateBriefing(data));

export const requestWhatIf = createServerFn({ method: "POST" })
  .validator((d: {
    result: AnalysisResult;
    scenario: "continue" | "block" | "tell_adult" | "counsellor";
  }) => d)
  .handler(async ({ data }) => simulateWhatIf(data));

export const getAiHealth = createServerFn({ method: "GET" }).handler(async () => {
  const p = resolveProvider();
  return {
    connected: Boolean(p.apiKey),
    provider: p.id,
    model: p.model || "unconfigured",
    vision: p.vision,
    stt: p.stt,
    lastOk: aiRuntime.lastOk,
    lastAt: aiRuntime.lastAt,
    lastLatencyMs: aiRuntime.lastLatencyMs,
    lastError: aiRuntime.lastError ? "previous call failed" : null,
    riskEngine: "operational" as const,
    audit: "operational" as const,
    humanReview: "required" as const,
  };
});
