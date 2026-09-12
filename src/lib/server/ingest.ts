import { getSql } from "@/lib/db";
import { nlpProvider } from "../nlp/provider";
import { analyseProgression } from "../pipeline/progression";
import { scoreThread, type ScoreWeights } from "../pipeline/scoring";
import { prioritise, slaDueAt } from "../pipeline/priority";
import { redactText, sha256Hex } from "../privacy/redact";
import { nid, publicCaseId } from "../utils";
import { writeAudit, writeEvent } from "./audit";
import type { ThreadTurn } from "../nlp/types";

export type IngestInput = {
  source: "anonymous_tip" | "anonymous_callback" | "ingested_thread" | "synthetic_seed";
  turns: ThreadTurn[];
  regionCode?: string | null;
  callbackRequested?: boolean;
  encryptedContact?: string | null;
  screenshot?: boolean;
  voice?: boolean;
  severity?: number;
  retentionDays?: number;
};

export async function loadWeights(): Promise<ScoreWeights> {
  const sql = await getSql();
  const rows = await sql<{ key: string; weight: string | number }>`
    select key, weight from scoring_config
  `;
  const w: ScoreWeights = {};
  for (const r of rows) w[r.key] = Number(r.weight);
  return Object.keys(w).length ? w : {
    classifier_confidence: 22,
    stage: 20,
    persistence: 12,
    secrecy: 12,
    pii_request: 12,
    image_request: 10,
    age_gap: 7,
    prior_flags: 5,
  };
}

export async function ingestThread(input: IngestInput): Promise<{
  id: string;
  publicId: string;
  score: number;
  band: string;
  priority: string;
  stage: string;
}> {
  const sql = await getSql();
  const weights = await loadWeights();
  const turns = input.turns.length
    ? input.turns
    : [{ speaker: "reporter" as const, text: "(empty report)" }];

  const joinedLang = nlpProvider.detect_language(turns.map((t) => t.text).join(" "));
  const scored = scoreThread(turns, weights, 0);
  const { history } = analyseProgression(turns);
  const distress = scored.flags.distress || (input.severity ?? 0) >= 4;
  const { priority } = prioritise({
    band: scored.band,
    stage: scored.stage,
    distress,
  });

  const now = new Date();
  const due = slaDueAt(now, priority);
  const retain = input.retentionDays ?? 365;
  const retentionUntil = new Date(now.getTime() + retain * 86400000);

  const id = nid("case");
  const publicId = publicCaseId();

  await sql`
    insert into cases (
      id, public_id, source, status, priority, risk_score, risk_band, stage,
      language, region_code, callback_requested, distress_flag, assigned_to,
      sla_due_at, last_activity_at, ai_generated, identity_sealed, retention_until
    ) values (
      ${id}, ${publicId}, ${input.source}, ${"new"}, ${priority},
      ${scored.score}, ${scored.band}, ${scored.stage},
      ${joinedLang}, ${input.regionCode ?? null}, ${Boolean(input.callbackRequested)},
      ${distress}, ${null}, ${due.toISOString()}, ${now.toISOString()},
      ${true}, ${true}, ${retentionUntil.toISOString()}
    )
  `;

  let turnIndex = 0;
  for (const turn of turns) {
    const red = redactText(turn.text);
    const hash = await sha256Hex(turn.text);
    const mid = nid("msg");
    const lang = nlpProvider.detect_language(turn.text);
    await sql`
      insert into messages (id, case_id, turn_index, speaker, lang, redacted_text, raw_hash)
      values (${mid}, ${id}, ${turnIndex}, ${turn.speaker}, ${lang}, ${red.text}, ${hash})
    `;
    for (const h of nlpProvider.extract_flags(turn.text, turns).hits) {
      await sql`
        insert into flags (id, case_id, message_id, flag_type, present, evidence_label)
        values (${nid("flg")}, ${id}, ${mid}, ${h.flag}, ${true}, ${h.label})
      `;
    }
    turnIndex += 1;
  }

  await sql`
    insert into scores (id, case_id, message_id, score, risk_band, contributing_factors)
    values (
      ${nid("scr")}, ${id}, ${null}, ${scored.score}, ${scored.band},
      ${JSON.stringify(scored.factors)}::jsonb
    )
  `;

  for (const step of history) {
    await sql`
      insert into stage_history (id, case_id, stage, reason)
      values (${nid("stg")}, ${id}, ${step.stage}, ${step.reason})
    `;
  }

  const timeline = history.map((h) => ({
    at: now.toISOString(),
    event: `${h.stage}: ${h.reason}`,
  }));

  const pack = nlpProvider.draft_safety_case({
    evidence: turns.map((t) => ({ ...t, text: redactText(t.text).text })),
    timeline,
    classification: scored.classification,
    flags: scored.flags,
    stage: scored.stage,
    score: scored.score,
    band: scored.band,
    priority,
    language: joinedLang,
  });

  await sql`
    insert into safety_cases (id, case_id, pack)
    values (${nid("sft")}, ${id}, ${JSON.stringify(pack)}::jsonb)
  `;

  if (input.screenshot) {
    await sql`
      insert into attachments (id, case_id, kind, storage_ref)
      values (${nid("att")}, ${id}, ${"screenshot"}, ${"vault://simulated-sealed-screenshot"})
    `;
  }
  if (input.voice) {
    await sql`
      insert into attachments (id, case_id, kind, storage_ref)
      values (${nid("att")}, ${id}, ${"voice"}, ${"vault://simulated-sealed-voice"})
    `;
  }

  if (input.callbackRequested && input.encryptedContact) {
    await sql`
      insert into reporter_identity (id, case_id, sealed, encrypted_blob)
      values (${nid("idn")}, ${id}, ${true}, ${input.encryptedContact})
    `;
  }

  await writeEvent(id, "case.ingested", {
    publicId,
    band: scored.band,
    priority,
    stage: scored.stage,
    ai_generated: true,
  });
  await writeAudit({
    actorId: null,
    actorRole: "system",
    action: "case.ingested",
    resourceType: "case",
    resourceId: id,
    metadata: { source: input.source, band: scored.band, priority },
  });

  if (priority === "P1") {
    await writeEvent(id, "alert.p1.stub", {
      channel: "simulated-realtime",
      note: "P1 real-time alert stub — no live agency webhook.",
    });
  }

  return {
    id,
    publicId,
    score: scored.score,
    band: scored.band,
    priority,
    stage: scored.stage,
  };
}
