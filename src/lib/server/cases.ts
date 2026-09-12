import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { ensureStaffProfile } from "./staff";
import { writeAccess, writeAudit, writeEvent } from "./audit";
import { assertTransition, type CaseStatus } from "../pipeline/lifecycle";
import { ensureSeeded } from "./seed";
import { nid } from "../utils";
import { SLA_MINUTES, type Priority } from "../pipeline/priority";
import { ingestThread, loadWeights } from "./ingest";
import { buildTimeline, type ThreadTimeline } from "../pipeline/timeline";
import { nlpProvider } from "../nlp/provider";
import { scoreThread } from "../pipeline/scoring";
import type { Json } from "../json";
import type { SafetyCasePack, LangCode, ThreadTurn } from "../nlp/types";
import type { StaffProfile } from "./staff";

export type CaseRow = {
  id: string;
  public_id: string;
  source: string;
  status: CaseStatus;
  priority: Priority;
  risk_score: number;
  risk_band: string;
  stage: string;
  language: string;
  region_code: string | null;
  callback_requested: boolean;
  distress_flag: boolean;
  assigned_to: string | null;
  sla_due_at: string;
  last_activity_at: string;
  ai_generated: boolean;
  identity_sealed: boolean;
  created_at: string;
  assigned_name: string | null;
};

export const listCases = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureSeeded();
    const me = await ensureStaffProfile(context.userId, "Responder");
    const sql = await getSql();
    const rows = await sql<CaseRow>`
      select
        c.id, c.public_id, c.source, c.status, c.priority, c.risk_score, c.risk_band,
        c.stage, c.language, c.region_code, c.callback_requested, c.distress_flag,
        c.assigned_to, c.sla_due_at::text as sla_due_at,
        c.last_activity_at::text as last_activity_at, c.ai_generated, c.identity_sealed,
        c.created_at::text as created_at,
        s.display_name as assigned_name
      from cases c
      left join staff_profiles s on s.user_id = c.assigned_to
      order by
        case c.priority when 'P1' then 1 when 'P2' then 2 when 'P3' then 3 else 4 end,
        c.sla_due_at asc
    `;
    await writeAccess({
      actorId: context.userId,
      resourceType: "case_list",
      resourceId: "queue",
      purpose: "queue.view",
    });
    return { me, cases: rows };
  });

export type CaseDetail = {
  me: StaffProfile;
  case: CaseRow;
  messages: {
    id: string;
    turn_index: number;
    speaker: string;
    lang: string;
    redacted_text: string;
    created_at: string;
  }[];
  scores: {
    score: number;
    risk_band: string;
    contributing_factors: Json;
    created_at: string;
  }[];
  flags: { flag_type: string; evidence_label: string }[];
  stages: { stage: string; reason: string; entered_at: string }[];
  events: { event_type: string; payload: Json; created_at: string }[];
  notes: {
    id: string;
    author_id: string;
    body: string;
    created_at: string;
    author_name: string | null;
  }[];
  safetyPack: SafetyCasePack | null;
  hasSealedIdentity: boolean;
  identitySealed: boolean;
  attachments: { kind: string; storage_ref: string }[];
  timeline: ThreadTimeline;
};

export const getCase = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }): Promise<CaseDetail> => {
    await ensureSeeded();
    const me = await ensureStaffProfile(context.userId, "Responder");
    const sql = await getSql();
    const cases = await sql<CaseRow>`
      select
        c.id, c.public_id, c.source, c.status, c.priority, c.risk_score, c.risk_band,
        c.stage, c.language, c.region_code, c.callback_requested, c.distress_flag,
        c.assigned_to, c.sla_due_at::text as sla_due_at,
        c.last_activity_at::text as last_activity_at, c.ai_generated, c.identity_sealed,
        c.created_at::text as created_at,
        s.display_name as assigned_name
      from cases c
      left join staff_profiles s on s.user_id = c.assigned_to
      where c.id = ${id}
    `;
    const row = cases[0];
    if (!row) throw new Error("Case not found");

    const messages = await sql<CaseDetail["messages"][number]>`
      select id, turn_index, speaker, lang, redacted_text, created_at::text as created_at
      from messages where case_id = ${id} order by turn_index
    `;
    const scores = await sql<CaseDetail["scores"][number]>`
      select score, risk_band, contributing_factors, created_at::text as created_at
      from scores where case_id = ${id} order by created_at
    `;
    const flags = await sql<CaseDetail["flags"][number]>`
      select flag_type, evidence_label from flags where case_id = ${id}
    `;
    const stages = await sql<CaseDetail["stages"][number]>`
      select stage, reason, entered_at::text as entered_at
      from stage_history where case_id = ${id} order by entered_at
    `;
    const events = await sql<CaseDetail["events"][number]>`
      select event_type, payload, created_at::text as created_at
      from event_log where case_id = ${id} order by created_at
    `;
    const notes = await sql<CaseDetail["notes"][number]>`
      select n.id, n.author_id, n.body, n.created_at::text as created_at, s.display_name as author_name
      from case_notes n
      left join staff_profiles s on s.user_id = n.author_id
      where n.case_id = ${id}
      order by n.created_at
    `;
    const safety = await sql<{ pack: SafetyCasePack }>`
      select pack from safety_cases where case_id = ${id}
    `;
    const identity = await sql<{ sealed: boolean }>`
      select sealed from reporter_identity where case_id = ${id}
    `;
    const attachments = await sql<CaseDetail["attachments"][number]>`
      select kind, storage_ref from attachments where case_id = ${id}
    `;

    await writeAccess({
      actorId: context.userId,
      resourceType: "case",
      resourceId: id,
      purpose: "case.view",
    });

    const timeline = buildTimeline(
      messages.map((m) => ({
        speaker: (m.speaker === "child" || m.speaker === "reporter" ? m.speaker : "other") as
          | "child"
          | "other"
          | "reporter",
        text: m.redacted_text,
        at: m.created_at,
      })),
      await loadWeights(),
    );

    return {
      me,
      case: row,
      messages,
      scores,
      flags,
      stages,
      events,
      notes,
      safetyPack: safety[0]?.pack ?? null,
      hasSealedIdentity: Boolean(identity[0]),
      identitySealed: identity[0]?.sealed ?? true,
      attachments,
      timeline,
    };
  });

export const transitionCase = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; to: CaseStatus; confirm: boolean }) => d)
  .handler(async ({ context, data }) => {
    const me = await ensureStaffProfile(context.userId, "Responder");
    const sql = await getSql();
    const rows = await sql<{ status: CaseStatus; assigned_to: string | null; priority: Priority }>`
      select status, assigned_to, priority from cases where id = ${data.id}
    `;
    const row = rows[0];
    if (!row) throw new Error("Case not found");

    const from = row.status;
    let assigned = row.assigned_to;

    if (data.to === "assigned" && from === "new") {
      assigned = context.userId;
    }

    assertTransition(from, data.to, data.confirm);

    let sla: string | null = null;
    if (data.to === "assigned" || data.to === "in_progress") {
      const due = new Date(Date.now() + SLA_MINUTES[row.priority] * 60_000);
      sla = due.toISOString();
    }

    await sql`
      update cases set
        status = ${data.to},
        assigned_to = ${assigned},
        sla_due_at = coalesce(${sla}::timestamptz, sla_due_at),
        last_activity_at = now(),
        updated_at = now()
      where id = ${data.id}
    `;
    await writeEvent(data.id, "case.status", { from, to: data.to, confirm: data.confirm });
    await writeAudit({
      actorId: context.userId,
      actorRole: me.role,
      action: `case.${data.to}`,
      resourceType: "case",
      resourceId: data.id,
      metadata: { from, confirm: data.confirm },
    });
    return { ok: true as const };
  });

export const addNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; body: string }) => d)
  .handler(async ({ context, data }) => {
    const me = await ensureStaffProfile(context.userId, "Responder");
    const body = data.body.trim();
    if (!body) throw new Error("Note is empty");
    const sql = await getSql();
    await sql`
      insert into case_notes (id, case_id, author_id, body)
      values (${nid("nte")}, ${data.id}, ${context.userId}, ${body})
    `;
    await writeAudit({
      actorId: context.userId,
      actorRole: me.role,
      action: "case.note",
      resourceType: "case",
      resourceId: data.id,
    });
    return { ok: true as const };
  });

export const revealIdentity = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; confirm: boolean }) => d)
  .handler(async ({ context, data }) => {
    if (!data.confirm) throw new Error("Human confirmation required");
    const me = await ensureStaffProfile(context.userId, "Responder");
    if (me.role === "ngo") throw new Error("NGO role cannot unseal identity");
    const sql = await getSql();
    const rows = await sql<{ encrypted_blob: string | null; sealed: boolean }>`
      select encrypted_blob, sealed from reporter_identity where case_id = ${data.id}
    `;
    const row = rows[0];
    if (!row?.encrypted_blob) throw new Error("No sealed identity on this case");
    const { decryptField } = await import("../privacy/crypto");
    const plain = decryptField(row.encrypted_blob);
    await sql`
      update reporter_identity
      set sealed = false, reveal_authorized_by = ${context.userId}, reveal_authorized_at = now()
      where case_id = ${data.id}
    `;
    await sql`update cases set identity_sealed = false, updated_at = now() where id = ${data.id}`;
    await writeAudit({
      actorId: context.userId,
      actorRole: me.role,
      action: "identity.reveal",
      resourceType: "case",
      resourceId: data.id,
      metadata: { note: "contact revealed to authorised responder; not written to logs" },
    });
    return { contact: plain };
  });

export const regenerateSafetyCase = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const me = await ensureStaffProfile(context.userId, "Responder");
    const sql = await getSql();
    const cases = await sql<{ priority: Priority; language: string }>`
      select priority, language from cases where id = ${id}
    `;
    const row = cases[0];
    if (!row) throw new Error("Case not found");

    const messages = await sql<{ speaker: string; redacted_text: string; turn_index: number }>`
      select speaker, redacted_text, turn_index from messages
      where case_id = ${id} order by turn_index
    `;
    if (!messages.length) throw new Error("No evidence on this case to build a pack from");

    const stages = await sql<{ stage: string; reason: string; entered_at: string }>`
      select stage, reason, entered_at::text as entered_at
      from stage_history where case_id = ${id} order by entered_at
    `;

    const turns: ThreadTurn[] = messages.map((m) => ({
      speaker: (m.speaker === "child" || m.speaker === "reporter" ? m.speaker : "other") as
        | "child"
        | "other"
        | "reporter",
      text: m.redacted_text,
    }));

    const weights = await loadWeights();
    const scored = scoreThread(turns, weights);

    const pack = nlpProvider.draft_safety_case({
      // Evidence is the already-redacted, already-stored text — regenerating
      // never re-reads raw input and never adds turns that aren't on record.
      evidence: turns,
      timeline: stages.map((s) => ({ at: s.entered_at, event: `${s.stage}: ${s.reason}` })),
      classification: scored.classification,
      flags: scored.flags,
      stage: scored.stage,
      score: scored.score,
      band: scored.band,
      priority: row.priority,
      language: row.language as LangCode,
    });

    await sql`
      update cases set risk_score = ${scored.score}, risk_band = ${scored.band}, stage = ${scored.stage}
      where id = ${id}
    `;
    await sql`
      insert into safety_cases (id, case_id, pack)
      values (${nid("sft")}, ${id}, ${JSON.stringify(pack)}::jsonb)
      on conflict (case_id) do update set pack = excluded.pack, created_at = now()
    `;
    await writeEvent(id, "safety_case.regenerated", { risk_score: scored.score });
    await writeAudit({
      actorId: context.userId,
      actorRole: me.role,
      action: "safety_case.regenerate",
      resourceType: "case",
      resourceId: id,
    });
    return { pack };
  });

export const exportSafetyPack = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    await ensureStaffProfile(context.userId, "Responder");
    const sql = await getSql();
    const rows = await sql<{ pack: SafetyCasePack; public_id: string }>`
      select s.pack, c.public_id
      from safety_cases s join cases c on c.id = s.case_id
      where s.case_id = ${id}
    `;
    if (!rows[0]) throw new Error("No safety pack");
    await writeAccess({
      actorId: context.userId,
      resourceType: "case",
      resourceId: id,
      purpose: "export.safety_pack",
    });
    return {
      format: "simulated-pocso-e-evidence-v0" as const,
      disclaimer:
        "SIMULATED. Not a legal filing, not hash-chained e-evidence, and not submitted to any agency.",
      public_id: rows[0].public_id,
      pack: rows[0].pack,
    };
  });

export const ingestDemoThread = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { text: string }) => d)
  .handler(async ({ context, data }) => {
    await ensureStaffProfile(context.userId, "Responder");
    await ensureSeeded();
    const lines = data.text
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);
    const turns = lines.map((line) => {
      const m = line.match(/^(other|child|reporter)\s*:\s*(.*)$/i);
      if (m) {
        return {
          speaker: m[1].toLowerCase() as "other" | "child" | "reporter",
          text: m[2],
        };
      }
      return { speaker: "other" as const, text: line };
    });
    return ingestThread({
      source: "ingested_thread",
      turns,
    });
  });
