import type { ExtractedFlags, ProgressionStage, ThreadTurn } from "../nlp/types.ts";
import { extractFlags } from "../nlp/flags.ts";
import { classify } from "../nlp/classify.ts";

export type StageStep = { stage: ProgressionStage; reason: string };

/**
 * Per-thread state machine:
 *   contact → trust_building → isolation → exploitation_attempt
 * Stages only advance; they never skip backwards.
 */
export function analyseProgression(turns: ThreadTurn[]): {
  stage: ProgressionStage;
  history: StageStep[];
} {
  let stage: ProgressionStage = "contact";
  const history: StageStep[] = [{ stage: "contact", reason: "Thread opened" }];
  const seen: ExtractedFlags[] = [];

  for (const turn of turns) {
    const flags = extractFlags(turn.text, turns);
    seen.push(flags);
    const cls = classify(turn.text);
    const next = nextStage(stage, flags, cls.label);
    if (next !== stage) {
      stage = next;
      history.push({ stage, reason: reasonFor(next, flags) });
    }
  }

  return { stage, history };
}

function nextStage(
  current: ProgressionStage,
  flags: ExtractedFlags,
  label: string,
): ProgressionStage {
  const order: ProgressionStage[] = [
    "contact",
    "trust_building",
    "isolation",
    "exploitation_attempt",
  ];
  let idx = order.indexOf(current);

  const trust =
    flags.incentive || flags.secrecy || label === "grooming_risk";
  const iso = flags.isolation || flags.platform_migration;
  const exploit =
    flags.image_request ||
    flags.pii_request ||
    label === "exploitation_risk";

  if (trust) idx = Math.max(idx, 1);
  if (iso) idx = Math.max(idx, 2);
  if (exploit && (iso || flags.secrecy || flags.incentive)) idx = Math.max(idx, 3);
  if (exploit && current === "isolation") idx = 3;

  return order[idx] ?? current;
}

function reasonFor(stage: ProgressionStage, flags: ExtractedFlags): string {
  switch (stage) {
    case "trust_building":
      return flags.secrecy
        ? "Secrecy combined with rapport-building language"
        : "Incentive or grooming-rapport signal";
    case "isolation":
      return flags.platform_migration
        ? "Attempt to move the child off-platform"
        : "Language isolating the child from caregivers";
    case "exploitation_attempt":
      return "Photo, identifier, or meet-up request after earlier grooming signals";
    default:
      return "Initial contact";
  }
}
