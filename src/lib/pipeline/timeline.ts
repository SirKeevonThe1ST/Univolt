import type { ThreadTurn } from "../nlp/types.ts";
import { analyseProgression } from "./progression.ts";
import { scoreThread, type ScoreWeights } from "./scoring.ts";

export type TimelinePoint = {
  /** Index of the turn that caused this stage entry (0-based, into `turns`). */
  turnIndex: number;
  stage: ReturnType<typeof analyseProgression>["history"][number]["stage"];
  reason: string;
  /** Score if the thread had ended right after this turn. */
  scoreAtStage: number;
  band: "low" | "med" | "high" | "critical";
  /** Wall-clock time if the turn carried one, else null (demo/synthetic threads). */
  at: string | null;
};

export type ThreadTimeline = {
  points: TimelinePoint[];
  startScore: number;
  currentScore: number;
  escalation: number;
  /** Points-per-turn from first to last stage entry; null if only one point. */
  speedPointsPerTurn: number | null;
  speedLabel: "flat" | "gradual" | "escalating" | "rapid";
};

/**
 * Re-scores the thread cumulatively after each turn so we can show how risk
 * moved as the conversation progressed, not just the final number.
 * This is a read-only analysis derived from the same scoring engine used for
 * the live score — it does not introduce a second source of truth.
 */
export function buildTimeline(turns: ThreadTurn[], weights?: ScoreWeights): ThreadTimeline {
  const { history } = analyseProgression(turns);

  // Map each stage transition to the turn index that most plausibly caused it:
  // walk turns cumulatively and re-run analyseProgression to find the first
  // turn count at which each stage first appears.
  const stageAtTurnCount: number[] = [];
  for (let i = 1; i <= turns.length; i++) {
    const partial = turns.slice(0, i);
    const { history: h } = analyseProgression(partial);
    stageAtTurnCount.push(h.length);
  }

  const points: TimelinePoint[] = history.map((step, idx) => {
    // Find the smallest turn-count at which this many stages had appeared.
    let turnIndex = turns.length > 0 ? turns.length - 1 : 0;
    for (let i = 0; i < stageAtTurnCount.length; i++) {
      if (stageAtTurnCount[i] >= idx + 1) {
        turnIndex = i;
        break;
      }
    }
    // The final stage entry reflects the whole thread (including any trailing
    // turns after the last transition, e.g. a distress reply) so the last
    // point always agrees with the overall score shown elsewhere.
    const isLast = idx === history.length - 1;
    const partial = isLast ? turns : turns.slice(0, turnIndex + 1);
    const scored = scoreThread(partial, weights);
    return {
      turnIndex,
      stage: step.stage,
      reason: step.reason,
      scoreAtStage: scored.score,
      band: scored.band,
      at: turns[turnIndex]?.at ?? null,
    };
  });

  const startScore = points[0]?.scoreAtStage ?? 0;
  const currentScore = points.length ? points[points.length - 1].scoreAtStage : 0;
  const escalation = currentScore - startScore;

  const turnSpan = points.length > 1 ? points[points.length - 1].turnIndex - points[0].turnIndex : 0;
  const speedPointsPerTurn = turnSpan > 0 ? escalation / turnSpan : null;

  let speedLabel: ThreadTimeline["speedLabel"] = "flat";
  if (speedPointsPerTurn !== null) {
    if (speedPointsPerTurn >= 15) speedLabel = "rapid";
    else if (speedPointsPerTurn >= 7) speedLabel = "escalating";
    else if (speedPointsPerTurn > 0) speedLabel = "gradual";
  } else if (escalation > 0) {
    // Single-point jump (very short thread) that still escalated meaningfully.
    speedLabel = escalation >= 40 ? "rapid" : "gradual";
  }

  return { points, startScore, currentScore, escalation, speedPointsPerTurn, speedLabel };
}
