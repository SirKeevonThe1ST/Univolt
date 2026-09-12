import { bandFromScore, clamp } from "../utils.ts";
import { analyseProgression } from "./progression.ts";
import { classify } from "../nlp/classify.ts";
import { extractFlags } from "../nlp/flags.ts";
import type { ExtractedFlags, ThreadTurn } from "../nlp/types.ts";

export type ScoreWeights = Record<string, number>;

export const DEFAULT_WEIGHTS: ScoreWeights = {
  classifier_confidence: 22,
  stage: 20,
  persistence: 12,
  secrecy: 12,
  pii_request: 12,
  image_request: 10,
  age_gap: 7,
  prior_flags: 5,
};

export type Factor = { key: string; label: string; points: number };

export type ScoreResult = {
  score: number;
  band: "low" | "med" | "high" | "critical";
  factors: Factor[];
  flags: ExtractedFlags;
  stage: ReturnType<typeof analyseProgression>["stage"];
  classification: ReturnType<typeof classify>;
};

const STAGE_POINTS: Record<string, number> = {
  contact: 8,
  trust_building: 36,
  isolation: 68,
  exploitation_attempt: 96,
};

export function scoreThread(
  turns: ThreadTurn[],
  weights: ScoreWeights = DEFAULT_WEIGHTS,
  priorFlagCount = 0,
): ScoreResult {
  const { stage } = analyseProgression(turns);
  const joined = turns.map((t) => t.text).join(" \n ");
  const classification = classify(joined);
  const flags = mergeFlags(turns);
  const persistence = persistenceCount(turns);

  const w = normalise(weights);
  const factors: Factor[] = [];

  const clsRisk = Math.max(
    classification.grooming_risk,
    classification.cyberbullying_risk,
    classification.exploitation_risk,
    1 - classification.benign,
  );
  factors.push({
    key: "classifier_confidence",
    label: "Classifier risk mass",
    points: Math.round(clsRisk * 100 * w.classifier_confidence),
  });

  factors.push({
    key: "stage",
    label: `Stage ${stage.replace(/_/g, " ")}`,
    points: Math.round(STAGE_POINTS[stage] * w.stage),
  });

  factors.push({
    key: "persistence",
    label: "Repeated signals",
    points: Math.round(Math.min(100, persistence * 22) * w.persistence),
  });

  const addFlag = (key: keyof ExtractedFlags, label: string, weightKey = key as string) => {
    if (typeof flags[key] === "boolean" && flags[key]) {
      const pts = Math.round(100 * (w[weightKey] ?? 0.08));
      factors.push({ key: weightKey, label, points: pts });
    }
  };

  addFlag("secrecy", "Secrecy");
  addFlag("pii_request", "Identifier request");
  addFlag("image_request", "Image request");
  addFlag("age_gap", "Age-gap signal");
  addFlag("age_probe", "Age / identity probing");
  addFlag("trust_build", "Trust building");
  addFlag("blackmail", "Threat / blackmail");
  addFlag("unwanted_contact", "Repeated unwanted contact");

  if (flags.platform_migration) {
    factors.push({ key: "platform_migration", label: "Off-platform move", points: 10 });
  }
  if (flags.isolation) {
    factors.push({ key: "isolation", label: "Isolation", points: 10 });
  }
  if (flags.incentive) {
    factors.push({ key: "incentive", label: "Incentive", points: 6 });
  }
  if (flags.distress) {
    factors.push({ key: "distress", label: "Distress language", points: 8 });
  }
  if (classification.label === "exploitation_risk") {
    factors.push({ key: "exploit_label", label: "Exploitation label", points: 12 });
  }

  const priorPts = Math.round(Math.min(100, priorFlagCount * 12) * (w.prior_flags ?? 0));
  if (priorPts) {
    factors.push({ key: "prior_flags", label: "Prior flags on case", points: priorPts });
  }

  const raw = factors.reduce((a, f) => a + f.points, 0);
  const score = clamp(Math.round(raw), 0, 100);

  return {
    score,
    band: bandFromScore(score),
    factors: factors.filter((f) => f.points > 0).sort((a, b) => b.points - a.points),
    flags,
    stage,
    classification,
  };
}

function normalise(weights: ScoreWeights): ScoreWeights {
  const sum = Object.values(weights).reduce((a, b) => a + Number(b), 0) || 1;
  const out: ScoreWeights = {};
  for (const [k, v] of Object.entries(weights)) out[k] = Number(v) / sum;
  return out;
}

function mergeFlags(turns: ThreadTurn[]): ExtractedFlags {
  const acc = extractFlags("", []);
  acc.hits = [];
  for (const t of turns) {
    const f = extractFlags(t.text, turns);
    (Object.keys(acc) as (keyof ExtractedFlags)[]).forEach((k) => {
      if (k === "hits") return;
      if (f[k]) (acc as Record<string, unknown>)[k] = true;
    });
    acc.hits.push(...f.hits);
  }
  const seen = new Set<string>();
  acc.hits = acc.hits.filter((h) => {
    const key = `${h.flag}:${h.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return acc;
}

function persistenceCount(turns: ThreadTurn[]): number {
  let n = 0;
  for (const t of turns) {
    const f = extractFlags(t.text, []);
    if (f.hits.length) n += 1;
  }
  return n;
}
