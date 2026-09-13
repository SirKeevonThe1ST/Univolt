import { getStorageRepository } from "./storage/index.ts";
import { nlpProvider } from "../nlp/provider.ts";
import { analyseProgression } from "../pipeline/progression.ts";
import { scoreThread, type ScoreWeights } from "../pipeline/scoring.ts";
import { prioritise } from "../pipeline/priority.ts";
import { redactText } from "../privacy/redact.ts";
import type { ThreadTurn } from "../nlp/types.ts";
import { analyzeConversation } from "../ai/analyze.ts";
import { scoreAnalysis } from "../ai/risk-engine.ts";
import { buildLiveSafetyCasePack } from "../ai/case-pack.ts";
import type { SafetyCasePack } from "../nlp/types.ts";
import type { DemoMessage } from "../demo/types.ts";

export type IngestInput = {
  source: "anonymous_tip" | "anonymous_callback" | "ingested_thread" | "synthetic_seed";
  turns: ThreadTurn[];
  regionCode?: string | null;
  callbackRequested?: boolean;
  encryptedContact?: string | null;
  screenshot?: boolean;
  voice?: boolean;
  severity?: number;
  retentionDays?: number;
};

export async function loadWeights(): Promise<ScoreWeights> {
  return {
    classifier_confidence: 22,
    stage: 20,
    persistence: 12,
    secrecy: 12,
    pii_request: 12,
    image_request: 10,
    age_gap: 7,
    prior_flags: 5,
  };
}

export async function ingestThread(input: IngestInput): Promise<{
  id: string;
  publicId: string;
  score: number;
  band: string;
  priority: string;
  stage: string;
}> {
  const repo = getStorageRepository();
  const weights = await loadWeights();
  const turns = input.turns.length
    ? input.turns
    : [{ speaker: "reporter" as const, text: "(empty report)" }];

  // 1. Persist initial report first so data is safely stored
  const { id, publicId } = await repo.createInitialReport(input);

  const joinedLang = nlpProvider.detect_language(turns.map((t) => t.text).join(" "));

  // 2. Process Evidence / AI Separately. AI failure must never cause a submitted report to be lost.
  const llmMessages: DemoMessage[] = turns.map((t) => ({
    speaker: t.speaker === "other" ? "other" : "child",
    text: t.text,
    source: "paste",
  }));

  let live: Awaited<ReturnType<typeof analyzeConversation>> = {
    ok: false,
    error: "AI unavailable",
    code: "no_key",
  };

  try {
    live = await analyzeConversation({ messages: llmMessages });
  } catch (err) {
    console.warn("[ai] analyzeConversation call threw error, falling back to deterministic risk engine:", err);
  }

  let score: number;
  let band: "low" | "med" | "high" | "critical";
  let stage: "contact" | "trust_building" | "isolation" | "exploitation_attempt";
  let factors: { key: string; label: string; points: number }[];
  let livePack: SafetyCasePack | null = null;
  let distress: boolean;
  let priority: ReturnType<typeof prioritise>["priority"];
  let fallbackScored: ReturnType<typeof scoreThread> | null = null;

  if (live.ok) {
    const risk = scoreAnalysis(live.analysis);
    livePack = buildLiveSafetyCasePack({
      analysis: live.analysis,
      risk,
      turns,
      modelName: live.result.modelName ?? "unknown",
    });
    score = risk.score;
    band = livePack.risk_band;
    stage = livePack.stage;
    factors = risk.contributions.map((c) => ({ key: c.type, label: c.label, points: c.contribution }));
    distress = livePack.risk_band === "critical" || (input.severity ?? 0) >= 4;
    priority = livePack.recommended_urgency;
  } else {
    fallbackScored = scoreThread(turns, weights, 0);
    score = fallbackScored.score;
    band = fallbackScored.band;
    stage = fallbackScored.stage;
    factors = fallbackScored.factors;
    distress = fallbackScored.flags.distress || (input.severity ?? 0) >= 4;
    priority = prioritise({ band, stage, distress }).priority;
  }
  const { history } = analyseProgression(turns);
  const now = new Date();

  const timeline = history.map((h) => ({
    at: now.toISOString(),
    event: `${h.stage}: ${h.reason}`,
  }));

  const pack: SafetyCasePack =
    livePack ??
    {
      ...nlpProvider.draft_safety_case({
        evidence: turns.map((t) => ({ ...t, text: redactText(t.text).text })),
        timeline,
        classification: fallbackScored!.classification,
        flags: fallbackScored!.flags,
        stage,
        score,
        band,
        priority,
        language: joinedLang,
      }),
      analysis_mode: "fallback" as const,
      label: "AI-generated — human review required" as const,
      pocso_note:
        `DEMO FALLBACK — AI SERVICE UNAVAILABLE. ${live.ok ? "" : live.error ?? ""} ` +
        "This pack was built from the offline rule/lexicon classifier, not a live model call. " +
        "SIMULATED pack. Not a POCSO complaint, not e-evidence, and not a filing with any agency. " +
        "A designated human officer must confirm before any irreversible step.",
    };

  // Collect NLP flag hits
  const flags: { flag: string; label: string }[] = [];
  for (const turn of turns) {
    for (const h of nlpProvider.extract_flags(turn.text, turns).hits) {
      flags.push({ flag: h.flag, label: h.label });
    }
  }

  // 3. Update responder case with scores, flags, safety pack, and timeline
  await repo.updateCaseAnalysis(id, {
    score,
    band,
    stage,
    priority,
    distress,
    factors,
    flags,
    history,
    pack,
    analysisMode: live.ok ? "live" : "fallback",
    modelName: live.ok ? live.result.modelName ?? null : null,
  });

  return {
    id,
    publicId,
    score,
    band,
    priority,
    stage,
  };
}
