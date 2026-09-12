import type { ExplainResult, ExtractedFlags, Classification, ProgressionStage } from "./types.ts";

const STAGE_LABEL: Record<ProgressionStage, string> = {
  contact: "early contact",
  trust_building: "trust-building",
  isolation: "isolation from caregivers",
  exploitation_attempt: "an exploitation attempt",
};

export function explain(input: {
  classification: Classification;
  flags: ExtractedFlags;
  stage: ProgressionStage;
  score: number;
  band: "low" | "med" | "high" | "critical";
}): ExplainResult {
  const top: ExplainResult["top_factors"] = [];

  top.push({
    label: `Classifier: ${input.classification.label.replace(/_/g, " ")}`,
    weight: Math.round(input.classification.confidence * 100),
    direction: input.classification.label === "benign" ? "down" : "up",
  });
  top.push({
    label: `Thread stage: ${STAGE_LABEL[input.stage]}`,
    weight: stageWeight(input.stage),
    direction: input.stage === "contact" ? "down" : "up",
  });

  for (const h of input.flags.hits) {
    top.push({ label: h.label, weight: 10, direction: "up" });
  }

  top.sort((a, b) => b.weight - a.weight);
  const trimmed = top.slice(0, 6);

  const flagBits = input.flags.hits.map((h) => h.label.toLowerCase());
  const flagText =
    flagBits.length === 0
      ? "No high-risk behavioural flags fired."
      : `Signals noted: ${flagBits.join("; ")}.`;

  const plain =
    input.band === "low"
      ? `This looks like ordinary conversation at ${STAGE_LABEL[input.stage]}. ${flagText} A human should still glance at it. AI did not decide any action.`
      : `This thread is in ${STAGE_LABEL[input.stage]} and currently scores ${input.score}/100 (${input.band}). ${flagText} Evidence is redacted. A human responder must confirm any next step — the model cannot intervene.`;

  return { top_factors: trimmed, plain_summary: plain };
}

function stageWeight(s: ProgressionStage): number {
  switch (s) {
    case "contact":
      return 10;
    case "trust_building":
      return 35;
    case "isolation":
      return 65;
    case "exploitation_attempt":
      return 90;
  }
}
