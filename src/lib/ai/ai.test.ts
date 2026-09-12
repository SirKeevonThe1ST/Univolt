import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseConversation, dedupeMessages } from "./parse-conversation.ts";
import { scoreIndicators, bandFromScore } from "./risk-engine.ts";
import { detectAndRedactPii } from "./pii.ts";
import { LlmSafetyAnalysisSchema } from "./schema.ts";

describe("conversation parser", () => {
  it("parses labelled speakers", () => {
    const msgs = parseConversation(`OTHER:\nhey how old are you?\nCHILD:\nwhy do you want to know?`);
    assert.equal(msgs[0].speaker, "other");
    assert.equal(msgs[1].speaker, "child");
    assert.match(msgs[0].text, /old are you/i);
  });
  it("deduplicates repeated lines", () => {
    const msgs = dedupeMessages([
      { speaker: "other", text: "send me a picture" },
      { speaker: "other", text: "Send me a picture" },
    ]);
    assert.equal(msgs.length, 1);
  });
});

describe("deterministic risk engine", () => {
  it("scores unique indicator types and caps at 100", () => {
    const scored = scoreIndicators([
      { type: "secrecy_pressure", severity: "high", confidence: 0.94, evidence: "don't tell them", source: "s1", why_it_matters: "hides the chat" },
      { type: "image_solicitation", severity: "critical", confidence: 0.9, evidence: "send me a picture", source: "s2", why_it_matters: "asks for an image" },
      { type: "secrecy_pressure", severity: "high", confidence: 0.99, evidence: "don't tell them", source: "s1", why_it_matters: "dup" },
    ]);
    assert.equal(scored.uniqueTypes.length, 2);
    assert.ok(scored.score >= 40);
    assert.ok(scored.score <= 100);
    assert.equal(bandFromScore(18), "low");
    assert.equal(bandFromScore(82), "critical");
  });
  it("harmless conversations can stay LOW", () => {
    const scored = scoreIndicators([]);
    assert.equal(scored.score, 0);
    assert.equal(scored.band, "low");
  });
});

describe("PII redaction", () => {
  it("redacts names and schools", () => {
    const r = detectAndRedactPii("My name is Aarav and I study at XYZ School.");
    assert.ok(r.detected >= 1);
    assert.match(r.redactedSample, /REDACTED/);
    assert.equal(r.identityExposed, false);
  });
});

describe("LLM schema", () => {
  it("accepts a valid analysis object", () => {
    const parsed = LlmSafetyAnalysisSchema.safeParse({
      language: "English",
      language_code: "en",
      summary: "Homework chat.",
      normalized_meaning: "Casual school talk.",
      threat_type: "none",
      risk_indicators: [],
      behavioural_stages: [],
      escalation_signal: "stable",
      uncertainty: [],
      recommended_human_review: false,
      model_confidence: 0.8,
      session_signals: [],
    });
    assert.equal(parsed.success, true);
  });
});
