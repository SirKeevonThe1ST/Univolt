import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { analyseProgression } from "./progression.ts";
import { scoreThread } from "./scoring.ts";
import { prioritise } from "./priority.ts";
import { assertTransition, canTransition } from "./lifecycle.ts";
import { buildTimeline } from "./timeline.ts";
import { SYNTHETIC_THREADS } from "../synthetic/conversations.ts";
import { defaultNLPProvider } from "../nlp/provider.ts";
import { redactText } from "../privacy/redact.ts";

describe("progression state machine", () => {
  it("stays at contact for homework chat", () => {
    const t = SYNTHETIC_THREADS.find((s) => s.key === "en-low-school")!;
    assert.equal(analyseProgression(t.turns).stage, "contact");
  });
  it("reaches exploitation_attempt on the Tamil-English critical sample", () => {
    const t = SYNTHETIC_THREADS.find((s) => s.key === "ta-latn-critical")!;
    const { stage, history } = analyseProgression(t.turns);
    assert.equal(stage, "exploitation_attempt");
    assert.ok(history.length >= 2);
  });
});

describe("risk scoring on labeled synthetic set", () => {
  it("scores the homework thread low", () => {
    const t = SYNTHETIC_THREADS.find((s) => s.key === "en-low-school")!;
    const r = scoreThread(t.turns);
    assert.equal(r.band, "low");
    assert.ok(r.score < 25, String(r.score));
  });
  it("scores the surprise-party false positive low", () => {
    const t = SYNTHETIC_THREADS.find((s) => s.key === "en-low-surprise")!;
    const r = scoreThread(t.turns);
    assert.ok(r.band === "low" || r.band === "med");
    assert.ok(r.score < 40, `surprise party scored ${r.score}`);
  });
  it("scores Hinglish high sample at least high", () => {
    const t = SYNTHETIC_THREADS.find((s) => s.key === "hi-latn-high")!;
    const r = scoreThread(t.turns);
    assert.ok(r.score >= 50, String(r.score));
    assert.ok(["high", "critical"].includes(r.band), r.band);
  });
  it("scores Tamil-English sample critical or high", () => {
    const t = SYNTHETIC_THREADS.find((s) => s.key === "ta-latn-critical")!;
    const r = scoreThread(t.turns);
    assert.ok(r.score >= 70, String(r.score));
    assert.ok(["high", "critical"].includes(r.band), r.band);
    assert.equal(r.flags.distress, true);
  });
});

describe("prioritisation", () => {
  it("raises distress to P1", () => {
    const p = prioritise({ band: "med", stage: "trust_building", distress: true });
    assert.equal(p.priority, "P1");
  });
  it("keeps a low contact thread at P4", () => {
    const p = prioritise({ band: "low", stage: "contact", distress: false });
    assert.equal(p.priority, "P4");
  });
});

describe("lifecycle — human confirmation", () => {
  it("allows new → assigned without confirm", () => {
    assert.equal(canTransition("new", "assigned"), true);
    assertTransition("new", "assigned", false);
  });
  it("blocks escalate without confirm", () => {
    assert.throws(() => assertTransition("in_progress", "escalated_to_authorities", false));
  });
  it("allows escalate with confirm", () => {
    assertTransition("in_progress", "escalated_to_authorities", true);
  });
  it("rejects illegal jumps", () => {
    assert.equal(canTransition("new", "resolved"), false);
  });
});

describe("E2E case lifecycle (pure pipeline)", () => {
  it("ingests → scores → cases → prioritises → assigns → human-confirmed escalate → resolve", () => {
    const t = SYNTHETIC_THREADS.find((s) => s.key === "ta-latn-critical")!;
    const scored = scoreThread(t.turns);
    const pri = prioritise({
      band: scored.band,
      stage: scored.stage,
      distress: scored.flags.distress,
    });
    const pack = defaultNLPProvider.draft_safety_case({
      evidence: t.turns,
      timeline: t.turns.map((turn, i) => ({
        at: new Date(Date.now() + i * 60_000).toISOString(),
        event: `${turn.speaker} turn`,
      })),
      classification: scored.classification,
      flags: scored.flags,
      stage: scored.stage,
      score: scored.score,
      band: scored.band,
      priority: pri.priority,
      language: "ta-Latn",
    });

    assert.equal(pack.ai_generated, true);
    assert.equal(pack.human_confirmation_required, true);
    assert.ok(pack.redacted_evidence.length > 0);
    assert.equal(pri.priority, "P1");

    let status: "new" | "assigned" | "in_progress" | "escalated_to_authorities" | "resolved" | "closed" = "new";
    assertTransition(status, "assigned", false);
    status = "assigned";
    assertTransition(status, "in_progress", false);
    status = "in_progress";
    assert.throws(() => assertTransition(status, "escalated_to_authorities", false));
    assertTransition(status, "escalated_to_authorities", true);
    status = "escalated_to_authorities";
    assertTransition(status, "resolved", false);
    status = "resolved";
    assertTransition(status, "closed", true);
  });
});

describe("grooming progression timeline", () => {
  it("stays flat for the homework thread", () => {
    const t = SYNTHETIC_THREADS.find((s) => s.key === "en-low-school")!;
    const tl = buildTimeline(t.turns);
    assert.equal(tl.points.length, 1);
    assert.equal(tl.escalation, 0);
    assert.equal(tl.speedLabel, "flat");
  });
  it("shows rising per-stage risk and rapid escalation for the Tamil-English critical sample", () => {
    const t = SYNTHETIC_THREADS.find((s) => s.key === "ta-latn-critical")!;
    const tl = buildTimeline(t.turns);
    assert.ok(tl.points.length >= 2, `expected multiple stages, got ${tl.points.length}`);
    // Score at each stage should be non-decreasing — stages only escalate.
    for (let i = 1; i < tl.points.length; i++) {
      assert.ok(
        tl.points[i].scoreAtStage >= tl.points[i - 1].scoreAtStage,
        `stage ${i} score ${tl.points[i].scoreAtStage} dropped below ${tl.points[i - 1].scoreAtStage}`,
      );
    }
    assert.ok(tl.currentScore > tl.startScore, "expected current score above start score");
    assert.equal(tl.escalation, tl.currentScore - tl.startScore);
  });
  it("matches the final scoreThread result on the last point", () => {
    const t = SYNTHETIC_THREADS.find((s) => s.key === "hi-latn-high")!;
    const tl = buildTimeline(t.turns);
    const finalScore = scoreThread(t.turns).score;
    assert.equal(tl.currentScore, finalScore);
  });
});

describe("PII redaction", () => {
  it("strips phones and emails before storage", () => {
    const r = redactText("Call me on 9876543210 or kid@example.com");
    assert.ok(r.kinds.includes("phone"));
    assert.ok(r.kinds.includes("email"));
    assert.equal(r.text.includes("9876543210"), false);
    assert.equal(r.text.includes("kid@example.com"), false);
  });
});
