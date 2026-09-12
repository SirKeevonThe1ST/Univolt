import { extractFlags } from "./flags.ts";
import { BENIGN_SCHOOL, BULLYING, EXPLOITATION, GROOMING_TRUST } from "./lexicon.ts";
import { containsAny, preprocess } from "./preprocess.ts";
import { detectLanguage } from "./language.ts";
import type { Classification, LangCode, RiskLabel } from "./types.ts";

export function classify(text: string, langHint?: LangCode | "auto"): Classification {
  const p = preprocess(text, langHint);
  const flags = extractFlags(p.original, []);
  const school = Boolean(containsAny(p.gloss, BENIGN_SCHOOL));
  const bullyingHit = Boolean(containsAny(p.gloss, BULLYING));
  const exploitHit = Boolean(containsAny(p.gloss, EXPLOITATION));
  const trustHit = Boolean(containsAny(p.gloss, GROOMING_TRUST));

  let grooming = 0;
  let bullying = 0;
  let exploit = 0;
  let benign = 0.55;

  if (flags.secrecy) grooming += 0.22;
  if (flags.isolation) grooming += 0.2;
  if (trustHit) grooming += 0.14;
  if (flags.incentive) grooming += 0.12;
  if (flags.platform_migration) grooming += 0.16;
  if (flags.image_request) {
    grooming += 0.18;
    exploit += 0.12;
  }
  if (flags.pii_request) {
    grooming += 0.1;
    exploit += 0.08;
  }
  if (flags.age_gap) grooming += 0.12;
  if (exploitHit) exploit += 0.45;
  if (bullyingHit) bullying += 0.48;
  if (flags.distress) bullying += 0.08;

  // Benign overrides — surprise-party / school-work false-positive guard
  if (school && !flags.platform_migration && !exploitHit && !flags.age_gap) {
    grooming *= 0.35;
    exploit *= 0.35;
    if (!bullyingHit) bullying *= 0.4;
    benign += 0.25;
  }

  if (!flags.secrecy && !flags.isolation && !flags.incentive && !flags.image_request && !exploitHit && !bullyingHit) {
    benign += 0.3;
    grooming *= 0.4;
  }

  grooming = clamp01(grooming);
  bullying = clamp01(bullying);
  exploit = clamp01(exploit);
  benign = clamp01(benign);

  const scores = {
    grooming_risk: round2(grooming),
    cyberbullying_risk: round2(bullying),
    exploitation_risk: round2(exploit),
    benign: round2(benign),
  };

  const entries: [RiskLabel, number][] = [
    ["grooming_risk", scores.grooming_risk],
    ["cyberbullying_risk", scores.cyberbullying_risk],
    ["exploitation_risk", scores.exploitation_risk],
    ["benign", scores.benign],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  const [label, confidence] = entries[0];

  // Language is detected even if unused — keeps the provider contract honest.
  void detectLanguage(text);

  return { ...scores, label, confidence: round2(confidence) };
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
