/**
 * Bridges the LIVE LLM pipeline (analyze.ts + risk-engine.ts) into the
 * persisted, responder-facing SafetyCasePack shape used by the console.
 *
 * Before this module existed, cases created from real report/case-ingest
 * traffic were scored by the offline lexicon classifier only (see
 * lib/nlp/classify.ts) even though a genuine LLM pipeline already existed
 * for the Intelligence-page demo. This is the fix: the deterministic risk
 * engine now runs on real LLM-extracted indicators for persisted cases too,
 * and the pack is honestly labelled live vs. fallback (never both at once).
 */
import type { LlmSafetyAnalysis, BehaviouralStage } from "./schema";
import type { RiskEngineResult } from "./risk-engine";
import type { ProgressionStage, SafetyCasePack, ThreadTurn } from "@/lib/nlp/types";

const EXPLOITATION_STAGES: BehaviouralStage[] = ["threat", "blackmail", "image_solicitation", "manipulation"];
const ISOLATION_STAGES: BehaviouralStage[] = ["isolation", "secrecy"];
const TRUST_STAGES: BehaviouralStage[] = ["trust_building", "personal_information"];

/** Map the LLM's finer-grained behavioural stages onto the DB's 4-stage progression column. */
export function stageFromBehaviouralStages(stages: BehaviouralStage[]): ProgressionStage {
  const has = (set: BehaviouralStage[]) => set.some((s) => stages.includes(s));
  if (has(EXPLOITATION_STAGES)) return "exploitation_attempt";
  if (has(ISOLATION_STAGES)) return "isolation";
  if (has(TRUST_STAGES)) return "trust_building";
  return "contact";
}

export function urgencyFromBand(band: "low" | "medium" | "high" | "critical"): SafetyCasePack["recommended_urgency"] {
  if (band === "critical") return "P1";
  if (band === "high") return "P2";
  if (band === "medium") return "P3";
  return "P4";
}

/** "medium" (risk-engine / demo Severity) -> "med" (DB / SafetyCasePack RiskBand). */
export function toDbBand(band: "low" | "medium" | "high" | "critical"): "low" | "med" | "high" | "critical" {
  return band === "medium" ? "med" : band;
}

export function buildLiveSafetyCasePack(opts: {
  analysis: LlmSafetyAnalysis;
  risk: RiskEngineResult;
  turns: ThreadTurn[];
  modelName: string;
}): SafetyCasePack {
  const { analysis, risk, turns, modelName } = opts;
  const stage = stageFromBehaviouralStages(analysis.behavioural_stages as BehaviouralStage[]);
  const dbBand = toDbBand(risk.band === "critical" || risk.band === "high" || risk.band === "low" ? risk.band : "medium");
  const priority = urgencyFromBand(risk.band as "low" | "medium" | "high" | "critical");

  const timeline = analysis.behavioural_stages.length
    ? analysis.behavioural_stages.map((s, i) => ({
        at: new Date(Date.now() + i).toISOString(),
        event: `${stageLabel(s)}: detected in evidence`,
      }))
    : [{ at: new Date().toISOString(), event: "Contact: evidence received, no concerning stage detected" }];

  const redacted_evidence = turns.slice(-8).map((t, i) => ({
    turn: i + 1,
    speaker: t.speaker,
    excerpt: clip(t.text, 140),
  }));

  const topFactors = risk.contributions.slice(0, 6).map((c) => ({
    label: c.label,
    weight: c.contribution,
    direction: "up" as const,
  }));

  return {
    ai_generated: true,
    label: "AI-generated — human review required",
    incident_summary: `${analysis.summary} Language: ${analysis.language}. Escalation signal: ${analysis.escalation_signal}.`,
    risk_band: dbBand,
    risk_score: risk.score,
    stage,
    timeline,
    redacted_evidence,
    explanation: {
      top_factors: topFactors,
      plain_summary: analysis.summary,
    },
    recommended_urgency: priority,
    human_confirmation_required: true,
    pocso_note:
      "SIMULATED pack. Not a POCSO complaint, not e-evidence, and not a filing with any agency. A designated human officer must confirm before any irreversible step.",
    analysis_mode: "live",
    model: modelName,
    model_confidence: analysis.model_confidence,
    language_label: analysis.language,
    indicators: risk.contributions.map((c) => ({
      type: c.type,
      label: c.label,
      severity: c.severity,
      confidence: c.confidence,
      evidence: c.evidence,
      source: c.source,
      why_it_matters: c.whyItMatters,
      contribution: c.contribution,
    })),
    uncertainty: analysis.uncertainty,
  };
}

function stageLabel(s: BehaviouralStage): string {
  return s.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

function clip(s: string, n: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}
