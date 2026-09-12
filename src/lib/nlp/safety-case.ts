import { explain } from "./explain.ts";
import { redactText } from "../privacy/redact.ts";
import type { SafetyCasePack, ThreadTurn, Classification, ExtractedFlags, ProgressionStage } from "./types.ts";

export function draftSafetyCase(input: {
  evidence: ThreadTurn[];
  timeline: { at: string; event: string }[];
  classification: Classification;
  flags: ExtractedFlags;
  stage: ProgressionStage;
  score: number;
  band: SafetyCasePack["risk_band"];
  priority: SafetyCasePack["recommended_urgency"];
  language: string;
}): SafetyCasePack {
  const explanation = explain({
    classification: input.classification,
    flags: input.flags,
    stage: input.stage,
    score: input.score,
    band: input.band,
  });

  const redacted_evidence = input.evidence.slice(-8).map((t, i) => ({
    turn: i + 1,
    speaker: t.speaker,
    excerpt: clip(redactText(t.text).text, 140),
  }));

  const who = input.classification.label.replace(/_/g, " ");
  const incident_summary =
    `Language ${input.language}. Highest classifier label: ${who} ` +
    `(confidence ${Math.round(input.classification.confidence * 100)}%). ` +
    `Progression stage: ${input.stage.replace(/_/g, " ")}. ` +
    `${explanation.plain_summary}`;

  return {
    ai_generated: true,
    label: "AI-generated — human review required",
    incident_summary,
    risk_band: input.band,
    risk_score: input.score,
    stage: input.stage,
    timeline: input.timeline,
    redacted_evidence,
    explanation,
    recommended_urgency: input.priority,
    human_confirmation_required: true,
    pocso_note:
      "SIMULATED pack. Not a POCSO complaint, not e-evidence, and not a filing with any agency. A designated human officer must confirm before any irreversible step.",
  };
}

function clip(s: string, n: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}
