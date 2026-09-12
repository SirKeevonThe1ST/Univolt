import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { classify } from "./classify.ts";
import { detectLanguage } from "./language.ts";
import { extractFlags } from "./flags.ts";
import { preprocess } from "./preprocess.ts";
import { SYNTHETIC_THREADS } from "../synthetic/conversations.ts";

describe("language detection", () => {
  it("detects English", () => {
    assert.equal(detectLanguage("Hey, did you finish the homework?"), "en");
  });
  it("detects Hinglish", () => {
    assert.equal(detectLanguage("Mummy papa ko mat batana yaar"), "hi-Latn");
  });
  it("detects Devanagari Hindi", () => {
    assert.equal(detectLanguage("माता पिता को मत बताना"), "hi");
  });
  it("detects Tamil-English code mix", () => {
    assert.equal(detectLanguage("Soladhe veetla. Vera app la pesalam."), "ta-Latn");
  });
});

describe("preprocessing", () => {
  it("normalises emoji and roman glosses", () => {
    const p = preprocess("Pic bhejo 📸");
    assert.ok(p.gloss.includes("photo"));
    assert.ok(p.tokens.includes("pic") || p.gloss.includes("भेजो") || p.normalized.includes("bhejo"));
  });
});

describe("false-positive guards", () => {
  const benign = [
    "Don't tell dad — the surprise party is at 6. Secret Santa gifts too.",
    "Can you send the class notes photo from the group?",
    "Happy birthday mom I love you",
    "Let's build a secret base in Minecraft",
    "Please send the homework assignment photo",
    "Aaj mummy ke saath market jaana hai",
  ];
  for (const text of benign) {
    it(`keeps benign: ${text.slice(0, 42)}`, () => {
      const c = classify(text);
      assert.ok(
        c.label === "benign" || c.benign >= 0.45,
        `expected benign-ish, got ${c.label} ${JSON.stringify(c)}`,
      );
      assert.ok(c.grooming_risk < 0.5, `grooming too high: ${c.grooming_risk}`);
      assert.ok(c.exploitation_risk < 0.4, `exploit too high: ${c.exploitation_risk}`);
    });
  }
});

describe("synthetic labeled set", () => {
  it("flags secrecy in the Hinglish high sample", () => {
    const t = SYNTHETIC_THREADS.find((s) => s.key === "hi-latn-high")!;
    const f = extractFlags(t.turns[0].text, t.turns);
    assert.equal(f.secrecy, true);
  });
  it("flags platform migration and image request in Tamil-English sample", () => {
    const t = SYNTHETIC_THREADS.find((s) => s.key === "ta-latn-critical")!;
    const joined = t.turns.map((x) => x.text).join(" ");
    const f = extractFlags(joined, t.turns);
    assert.equal(f.platform_migration, true);
    assert.equal(f.image_request, true);
    assert.equal(f.distress, true);
  });
  it("does not flag surprise-party as secrecy", () => {
    const f = extractFlags(
      "Don't tell dad — the surprise party is at 6. Secret Santa gifts too.",
    );
    assert.equal(f.secrecy, false);
  });
});
