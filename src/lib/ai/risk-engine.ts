/**
 * DETERMINISTIC RISK ENGINE
 * -------------------------------------------------------------------------
 * The LLM extracts behavioural indicators. This module is the only place a
 * numeric risk score is produced. Model-emitted numbers such as
 * `{ "risk_score": 97 }` are ignored.
 *
 * Unique indicator *types* contribute once (deduplicated). Duplicate messages
 * cannot inflate the score.
 *
 * Weights (documented, reproducible):
 *   identity_probing            +10
 *   personal_information        +15
 *   trust_building              +10
 *   secrecy_pressure            +20
 *   isolation                   +20
 *   image_solicitation          +25
 *   manipulation                +20
 *   threat                      +30
 *   blackmail                   +35
 *   repeated_unwanted_contact   +15
 *
 * Bands: 0–24 LOW · 25–49 MEDIUM · 50–74 HIGH · 75–100 CRITICAL
 * -------------------------------------------------------------------------
 */

import type { IndicatorType, LlmRiskIndicator, LlmSafetyAnalysis } from "./schema";
import type { Severity } from "@/lib/demo/types";

export const INDICATOR_WEIGHTS: Record<IndicatorType, number> = {
  identity_probing: 10,
  personal_information: 15,
  trust_building: 10,
  secrecy_pressure: 20,
  isolation: 20,
  image_solicitation: 25,
  manipulation: 20,
  threat: 30,
  blackmail: 35,
  repeated_unwanted_contact: 15,
};

export const INDICATOR_LABELS: Record<IndicatorType, string> = {
  identity_probing: "Age / identity probing",
  personal_information: "Personal information extraction",
  trust_building: "Trust-building behaviour",
  secrecy_pressure: "Secrecy pressure",
  isolation: "Isolation from trusted adults",
  image_solicitation: "Image solicitation",
  manipulation: "Manipulation",
  threat: "Threat",
  blackmail: "Blackmail",
  repeated_unwanted_contact: "Repeated unwanted contact",
};

export type ScoredIndicator = {
  type: IndicatorType;
  label: string;
  weight: number;
  contribution: number;
  severity: Severity;
  confidence: number;
  evidence: string;
  source: string;
  whyItMatters: string;
};

export type RiskEngineResult = {
  score: number;
  band: Severity;
  contributions: ScoredIndicator[];
  uniqueTypes: IndicatorType[];
};

export function bandFromScore(score: number): Severity {
  if (score >= 75) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  return "low";
}

function severityFloor(sev: Severity): number {
  if (sev === "critical") return 0.95;
  if (sev === "high") return 0.85;
  if (sev === "medium") return 0.7;
  return 0.55;
}

/**
 * Score a set of LLM indicators. Duplicate types keep the highest
 * (weight × confidence) contribution.
 */
export function scoreIndicators(indicators: LlmRiskIndicator[]): RiskEngineResult {
  const best = new Map<IndicatorType, ScoredIndicator>();

  for (const ind of indicators) {
    const weight = INDICATOR_WEIGHTS[ind.type];
    if (weight == null) continue;
    const confidence = clamp01(ind.confidence);
    if (confidence < 0.35) continue;
    const contribution = Math.round(weight * Math.max(confidence, severityFloor(ind.severity)));
    const current = best.get(ind.type);
    const next: ScoredIndicator = {
      type: ind.type,
      label: INDICATOR_LABELS[ind.type],
      weight,
      contribution,
      severity: ind.severity,
      confidence,
      evidence: ind.evidence,
      source: ind.source,
      whyItMatters: ind.why_it_matters,
    };
    if (!current || next.contribution > current.contribution) best.set(ind.type, next);
  }

  const contributions = [...best.values()].sort((a, b) => b.contribution - a.contribution);
  const raw = contributions.reduce((sum, c) => sum + c.contribution, 0);
  const score = Math.max(0, Math.min(100, raw));

  return {
    score,
    band: bandFromScore(score),
    contributions,
    uniqueTypes: contributions.map((c) => c.type),
  };
}

export function scoreAnalysis(analysis: LlmSafetyAnalysis): RiskEngineResult {
  return scoreIndicators(analysis.risk_indicators);
}

/** Session-by-session cumulative score from session_signals or message groups. */
export function scoreBySession(
  analysis: LlmSafetyAnalysis,
  fallbackTypes: IndicatorType[][],
): { label: string; types: IndicatorType[]; score: number; delta: number; event: string }[] {
  const sessions =
    analysis.session_signals && analysis.session_signals.length
      ? [...analysis.session_signals].sort((a, b) => a.session_index - b.session_index)
      : fallbackTypes.map((types, i) => ({
          session_index: i + 1,
          label: `Session ${i + 1}`,
          indicators: types,
        }));

  const seen = new Set<IndicatorType>();
  let prev = 0;
  return sessions.map((s) => {
    for (const t of s.indicators) seen.add(t);
    const indicators: LlmRiskIndicator[] = [...seen].map((type) => {
      const hit = analysis.risk_indicators.find((r) => r.type === type);
      return (
        hit ?? {
          type,
          severity: "medium",
          confidence: 0.7,
          evidence: "",
          source: s.label,
          why_it_matters: "",
        }
      );
    });
    const scored = scoreIndicators(indicators);
    const delta = scored.score - prev;
    const newest = s.indicators[s.indicators.length - 1];
    const event = newest ? INDICATOR_LABELS[newest] : "No new indicator";
    prev = scored.score;
    return {
      label: s.label || `Session ${s.session_index}`,
      types: s.indicators,
      score: scored.score,
      delta,
      event,
    };
  });
}

export function projectedScore(score: number, direction: "escalating" | "stable" | "declining"): number {
  if (direction === "escalating") return Math.min(100, score + 7);
  if (direction === "declining") return Math.max(0, score - 6);
  return score;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}
