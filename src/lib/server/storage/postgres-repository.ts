import type pg from "pg";
import { nid, publicCaseId } from "../../utils.ts";
import { redactText, sha256Hex } from "../../privacy/redact.ts";
import { nlpProvider } from "../../nlp/provider.ts";
import { assertTransition, type CaseStatus } from "../../pipeline/lifecycle.ts";
import { SLA_MINUTES, slaDueAt, type Priority } from "../../pipeline/priority.ts";
import { buildTimeline } from "../../pipeline/timeline.ts";
import { SYNTHETIC_THREADS } from "../../synthetic/conversations.ts";
import type { SafetyCasePack } from "../../nlp/types.ts";
import type { StaffProfile, StaffRole } from "../staff.ts";
import type { CaseDetail, CaseRow } from "../cases.ts";
import type {
  AccessEntry,
  AnalyticsData,
  AuditEntry,
  CaseAnalysisInput,
  InitialReportInput,
  StorageRepository,
} from "./types.ts";

let poolInstance: pg.Pool | null = null;

async function getPool(): Promise<pg.Pool> {
  if (!poolInstance) {
    const databaseUrl = process.env.DATABASE_URL?.trim();
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is required for PostgresStorageRepository");
    }
    const { Pool } = await import("pg");
    poolInstance = new Pool({ connectionString: databaseUrl });
  }
  return poolInstance;
}

export class PostgresStorageRepository implements StorageRepository {
  private pool = getPool;

  async createInitialReport(input: InitialReportInput): Promise<{ id: string; publicId: string }> {
    const id = nid("case");
    const publicId = publicCaseId();
    const now = new Date();
    const severity = input.severity ?? 1;
    const turns = input.turns.length
      ? input.turns
      : [{ speaker: "reporter" as const, text: `Severity ${severity} — no written note.` }];

    const joinedLang = nlpProvider.detect_language(turns.map((t) => t.text).join(" "));
    const initialPriority: Priority =
      severity >= 4 ? "P1" : severity === 3 ? "P2" : severity === 2 ? "P3" : "P4";
    const due = slaDueAt(now, initialPriority);
    const retainDays = input.retentionDays ?? 365;
    const retentionUntil = new Date(now.getTime() + retainDays * 86400000);
    const distress = severity >= 4;

    const client = await (await this.pool()).connect();
    try {
      await client.query("BEGIN");

      await client.query(
        `insert into cases (
          id, public_id, source, status, priority, risk_score, risk_band, stage,
          language, region_code, callback_requested, distress_flag, assigned_to,
          sla_due_at, last_activity_at, ai_generated, identity_sealed, retention_until,
          created_at, updated_at
        ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
        [
          id,
          publicId,
          input.source,
          "new",
          initialPriority,
          severity >= 4 ? 80 : severity === 3 ? 55 : severity === 2 ? 30 : 15,
          severity >= 4 ? "critical" : severity === 3 ? "high" : severity === 2 ? "med" : "low",
          "contact",
          joinedLang,
          input.regionCode ?? null,
          Boolean(input.callbackRequested),
          distress,
          null,
          due.toISOString(),
          now.toISOString(),
          true,
          true,
          retentionUntil.toISOString(),
          now.toISOString(),
          now.toISOString(),
        ],
      );

      let turnIndex = 0;
      for (const turn of turns) {
        const red = redactText(turn.text);
        const hash = await sha256Hex(turn.text);
        const mid = nid("msg");
        const lang = nlpProvider.detect_language(turn.text);
        await client.query(
          `insert into messages (id, case_id, turn_index, speaker, lang, redacted_text, raw_hash, created_at)
           values ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [mid, id, turnIndex, turn.speaker, lang, red.text, hash, now.toISOString()],
        );
        turnIndex += 1;
      }

      if (input.screenshot) {
        await client.query(
          `insert into attachments (id, case_id, kind, storage_ref, created_at)
           values ($1, $2, $3, $4, $5)`,
          [nid("att"), id, "screenshot", "vault://simulated-sealed-screenshot", now.toISOString()],
        );
      }
      if (input.voice) {
        await client.query(
          `insert into attachments (id, case_id, kind, storage_ref, created_at)
           values ($1, $2, $3, $4, $5)`,
          [nid("att"), id, "voice", "vault://simulated-sealed-voice", now.toISOString()],
        );
      }

      if (input.callbackRequested && input.encryptedContact) {
        await client.query(
          `insert into reporter_identity (id, case_id, sealed, encrypted_blob)
           values ($1, $2, $3, $4)`,
          [nid("idn"), id, true, input.encryptedContact],
        );
      }

      await client.query(
        `insert into audit_log (id, actor_id, actor_role, action, resource_type, resource_id, metadata, created_at)
         values ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          nid("aud"),
          null,
          "system",
          "report.submitted",
          "case",
          id,
          JSON.stringify({ source: input.source, severity: input.severity }),
          now.toISOString(),
        ],
      );

      await client.query("COMMIT");
      return { id, publicId };
    } catch (err) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw err;
    } finally {
      client.release();
    }
  }

  async updateCaseAnalysis(caseId: string, analysis: CaseAnalysisInput): Promise<void> {
    const client = await (await this.pool()).connect();
    try {
      await client.query("BEGIN");
      const now = new Date();
      const due = slaDueAt(now, analysis.priority);

      await client.query(
        `update cases set
          risk_score = $1, risk_band = $2, stage = $3, priority = $4,
          distress_flag = $5, sla_due_at = $6, last_activity_at = $7, updated_at = $8
         where id = $9`,
        [
          analysis.score,
          analysis.band,
          analysis.stage,
          analysis.priority,
          analysis.distress,
          due.toISOString(),
          now.toISOString(),
          now.toISOString(),
          caseId,
        ],
      );

      await client.query(
        `insert into scores (id, case_id, message_id, score, risk_band, contributing_factors, created_at)
         values ($1, $2, $3, $4, $5, $6, $7)`,
        [
          nid("scr"),
          caseId,
          null,
          analysis.score,
          analysis.band,
          JSON.stringify(analysis.factors),
          now.toISOString(),
        ],
      );

      for (const f of analysis.flags) {
        await client.query(
          `insert into flags (id, case_id, message_id, flag_type, present, evidence_label, created_at)
           values ($1, $2, $3, $4, $5, $6, $7)`,
          [nid("flg"), caseId, null, f.flag, true, f.label, now.toISOString()],
        );
      }

      for (const h of analysis.history) {
        await client.query(
          `insert into stage_history (id, case_id, stage, reason, entered_at)
           values ($1, $2, $3, $4, $5)`,
          [nid("stg"), caseId, h.stage, h.reason, now.toISOString()],
        );
      }

      await client.query(
        `insert into safety_cases (id, case_id, pack, created_at)
         values ($1, $2, $3, $4)
         on conflict (case_id) do update set pack = excluded.pack, created_at = excluded.created_at`,
        [nid("sft"), caseId, JSON.stringify(analysis.pack), now.toISOString()],
      );

      await client.query(
        `insert into event_log (id, case_id, event_type, payload, created_at)
         values ($1, $2, $3, $4, $5)`,
        [
          nid("evt"),
          caseId,
          "case.ingested",
          JSON.stringify({
            band: analysis.band,
            priority: analysis.priority,
            stage: analysis.stage,
            ai_generated: true,
            analysis_mode: analysis.analysisMode,
            model: analysis.modelName ?? null,
          }),
          now.toISOString(),
        ],
      );

      await client.query(
        `insert into audit_log (id, actor_id, actor_role, action, resource_type, resource_id, metadata, created_at)
         values ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          nid("aud"),
          null,
          "system",
          "case.ingested",
          "case",
          caseId,
          JSON.stringify({
            band: analysis.band,
            priority: analysis.priority,
            analysis_mode: analysis.analysisMode,
          }),
          now.toISOString(),
        ],
      );

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw err;
    } finally {
      client.release();
    }
  }

  async getCaseDetail(id: string, userId: string): Promise<CaseDetail | null> {
    const me = await this.ensureStaffProfile(userId, "Responder");
    const caseRes = await (await this.pool()).query<CaseRow>(
      `select
        c.id, c.public_id, c.source, c.status, c.priority, c.risk_score, c.risk_band,
        c.stage, c.language, c.region_code, c.callback_requested, c.distress_flag,
        c.assigned_to, c.sla_due_at::text as sla_due_at,
        c.last_activity_at::text as last_activity_at, c.ai_generated, c.identity_sealed,
        c.created_at::text as created_at,
        s.display_name as assigned_name
      from cases c
      left join staff_profiles s on s.user_id = c.assigned_to
      where c.id = $1`,
      [id],
    );
    const row = caseRes.rows[0];
    if (!row) return null;

    const msgRes = await (await this.pool()).query<CaseDetail["messages"][number]>(
      `select id, turn_index, speaker, lang, redacted_text, created_at::text as created_at
       from messages where case_id = $1 order by turn_index`,
      [id],
    );

    const scoreRes = await (await this.pool()).query<CaseDetail["scores"][number]>(
      `select score, risk_band, contributing_factors, created_at::text as created_at
       from scores where case_id = $1 order by created_at`,
      [id],
    );

    const flagRes = await (await this.pool()).query<CaseDetail["flags"][number]>(
      `select flag_type, evidence_label from flags where case_id = $1`,
      [id],
    );

    const stageRes = await (await this.pool()).query<CaseDetail["stages"][number]>(
      `select stage, reason, entered_at::text as entered_at
       from stage_history where case_id = $1 order by entered_at`,
      [id],
    );

    const eventRes = await (await this.pool()).query<CaseDetail["events"][number]>(
      `select event_type, payload, created_at::text as created_at
       from event_log where case_id = $1 order by created_at`,
      [id],
    );

    const noteRes = await (await this.pool()).query<CaseDetail["notes"][number]>(
      `select n.id, n.author_id, n.body, n.created_at::text as created_at, s.display_name as author_name
       from case_notes n
       left join staff_profiles s on s.user_id = n.author_id
       where n.case_id = $1 order by n.created_at`,
      [id],
    );

    const safetyRes = await (await this.pool()).query<{ pack: SafetyCasePack }>(
      `select pack from safety_cases where case_id = $1`,
      [id],
    );

    const idnRes = await (await this.pool()).query<{ sealed: boolean }>(
      `select sealed from reporter_identity where case_id = $1`,
      [id],
    );

    const attRes = await (await this.pool()).query<CaseDetail["attachments"][number]>(
      `select kind, storage_ref from attachments where case_id = $1`,
      [id],
    );

    await this.writeAccess({
      actorId: userId,
      resourceType: "case",
      resourceId: id,
      purpose: "case.view",
    });

    const timeline = buildTimeline(
      msgRes.rows.map((m) => ({
        speaker: (m.speaker === "child" || m.speaker === "reporter" ? m.speaker : "other") as
          | "child"
          | "other"
          | "reporter",
        text: m.redacted_text,
        at: m.created_at,
      })),
      {
        classifier_confidence: 22,
        stage: 20,
        persistence: 12,
        secrecy: 12,
        pii_request: 12,
        image_request: 10,
        age_gap: 7,
        prior_flags: 5,
      },
    );

    return {
      me,
      case: row,
      messages: msgRes.rows,
      scores: scoreRes.rows,
      flags: flagRes.rows,
      stages: stageRes.rows,
      events: eventRes.rows,
      notes: noteRes.rows,
      safetyPack: safetyRes.rows[0]?.pack ?? null,
      hasSealedIdentity: Boolean(idnRes.rows[0]),
      identitySealed: idnRes.rows[0]?.sealed ?? true,
      attachments: attRes.rows,
      timeline,
    };
  }

  async listCases(userId: string): Promise<{ me: StaffProfile; cases: CaseRow[] }> {
    await this.ensureSeeded();
    const me = await this.ensureStaffProfile(userId, "Responder");

    const res = await (await this.pool()).query<CaseRow>(
      `select
        c.id, c.public_id, c.source, c.status, c.priority, c.risk_score, c.risk_band,
        c.stage, c.language, c.region_code, c.callback_requested, c.distress_flag,
        c.assigned_to, c.sla_due_at::text as sla_due_at,
        c.last_activity_at::text as last_activity_at, c.ai_generated, c.identity_sealed,
        c.created_at::text as created_at,
        s.display_name as assigned_name,
        sc.pack ->> 'analysis_mode' as analysis_mode
      from cases c
      left join staff_profiles s on s.user_id = c.assigned_to
      left join safety_cases sc on sc.case_id = c.id
      order by
        case c.priority when 'P1' then 1 when 'P2' then 2 when 'P3' then 3 else 4 end,
        c.sla_due_at asc`,
    );

    await this.writeAccess({
      actorId: userId,
      resourceType: "case_list",
      resourceId: "queue",
      purpose: "queue.view",
    });

    return { me, cases: res.rows };
  }

  async transitionCase(
    id: string,
    to: CaseStatus,
    userId: string,
    role: string,
    confirm: boolean,
  ): Promise<void> {
    const existing = await (await this.pool()).query<{ status: CaseStatus; assigned_to: string | null; priority: Priority }>(
      `select status, assigned_to, priority from cases where id = $1`,
      [id],
    );
    const row = existing.rows[0];
    if (!row) throw new Error("Case not found");

    const from = row.status;
    let assigned = row.assigned_to;
    if (to === "assigned" && from === "new") {
      assigned = userId;
    }

    assertTransition(from, to, confirm);

    let sla: string | null = null;
    if (to === "assigned" || to === "in_progress") {
      const due = new Date(Date.now() + SLA_MINUTES[row.priority] * 60_000);
      sla = due.toISOString();
    }

    await (await this.pool()).query(
      `update cases set
        status = $1, assigned_to = $2, sla_due_at = coalesce($3::timestamptz, sla_due_at),
        last_activity_at = now(), updated_at = now()
       where id = $4`,
      [to, assigned, sla, id],
    );

    await this.writeEvent(id, "case.status", { from, to, confirm });
    await this.writeAudit({
      actorId: userId,
      actorRole: role,
      action: `case.${to}`,
      resourceType: "case",
      resourceId: id,
      metadata: { from, confirm },
    });
  }

  async addCaseNote(id: string, authorId: string, role: string, body: string): Promise<void> {
    const trimmed = body.trim();
    if (!trimmed) throw new Error("Note is empty");

    await (await this.pool()).query(
      `insert into case_notes (id, case_id, author_id, body)
       values ($1, $2, $3, $4)`,
      [nid("nte"), id, authorId, trimmed],
    );

    await (await this.pool()).query(
      `update cases set last_activity_at = now() where id = $1`,
      [id],
    );

    await this.writeAudit({
      actorId: authorId,
      actorRole: role,
      action: "case.note",
      resourceType: "case",
      resourceId: id,
    });
  }

  async revealIdentity(caseId: string, userId: string, role: string): Promise<string> {
    if (role === "ngo") throw new Error("NGO role cannot unseal identity");
    const idnRes = await (await this.pool()).query<{ encrypted_blob: string | null }>(
      `select encrypted_blob from reporter_identity where case_id = $1`,
      [caseId],
    );
    const row = idnRes.rows[0];
    if (!row?.encrypted_blob) throw new Error("No sealed identity on this case");

    const { decryptField } = await import("../../privacy/crypto");
    const plain = decryptField(row.encrypted_blob);

    await (await this.pool()).query(
      `update reporter_identity set sealed = false, reveal_authorized_by = $1, reveal_authorized_at = now()
       where case_id = $2`,
      [userId, caseId],
    );

    await (await this.pool()).query(
      `update cases set identity_sealed = false, updated_at = now() where id = $1`,
      [caseId],
    );

    await this.writeAudit({
      actorId: userId,
      actorRole: role,
      action: "identity.reveal",
      resourceType: "case",
      resourceId: caseId,
      metadata: { note: "contact revealed to authorised responder; not written to logs" },
    });

    return plain;
  }

  async saveSafetyPack(
    caseId: string,
    pack: SafetyCasePack,
    score: number,
    band: string,
    stage: string,
    userId: string,
    role: string,
  ): Promise<void> {
    await (await this.pool()).query(
      `update cases set risk_score = $1, risk_band = $2, stage = $3, updated_at = now() where id = $4`,
      [score, band, stage, caseId],
    );

    await (await this.pool()).query(
      `insert into safety_cases (id, case_id, pack)
       values ($1, $2, $3)
       on conflict (case_id) do update set pack = excluded.pack, created_at = now()`,
      [nid("sft"), caseId, JSON.stringify(pack)],
    );

    await this.writeEvent(caseId, "safety_case.regenerated", {
      risk_score: score,
      analysis_mode: pack.analysis_mode,
    });

    await this.writeAudit({
      actorId: userId,
      actorRole: role,
      action: "safety_case.regenerate",
      resourceType: "case",
      resourceId: caseId,
    });
  }

  async getSafetyPack(caseId: string, userId: string): Promise<{ public_id: string; pack: SafetyCasePack }> {
    const res = await (await this.pool()).query<{ pack: SafetyCasePack; public_id: string }>(
      `select s.pack, c.public_id
       from safety_cases s join cases c on c.id = s.case_id
       where s.case_id = $1`,
      [caseId],
    );
    if (!res.rows[0]) throw new Error("No safety pack");

    await this.writeAccess({
      actorId: userId,
      resourceType: "case",
      resourceId: caseId,
      purpose: "export.safety_pack",
    });

    return { public_id: res.rows[0].public_id, pack: res.rows[0].pack };
  }

  async writeAudit(entry: AuditEntry): Promise<void> {
    await (await this.pool()).query(
      `insert into audit_log (id, actor_id, actor_role, action, resource_type, resource_id, metadata)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [
        nid("aud"),
        entry.actorId ?? null,
        entry.actorRole ?? null,
        entry.action,
        entry.resourceType,
        entry.resourceId ?? null,
        JSON.stringify(entry.metadata ?? {}),
      ],
    );
  }

  async writeEvent(caseId: string, eventType: string, payload: Record<string, unknown>): Promise<void> {
    await (await this.pool()).query(
      `insert into event_log (id, case_id, event_type, payload)
       values ($1, $2, $3, $4)`,
      [nid("evt"), caseId, eventType, JSON.stringify(payload)],
    );
  }

  async writeAccess(entry: AccessEntry): Promise<void> {
    await (await this.pool()).query(
      `insert into access_log (id, actor_id, resource_type, resource_id, purpose)
       values ($1, $2, $3, $4, $5)`,
      [nid("acc"), entry.actorId, entry.resourceType, entry.resourceId, entry.purpose],
    );
  }

  async ensureStaffProfile(userId: string, displayName: string): Promise<StaffProfile> {
    const existing = await (await this.pool()).query<StaffProfile>(
      `select user_id, role, display_name, region, active from staff_profiles where user_id = $1`,
      [userId],
    );
    if (existing.rows[0]) return existing.rows[0];

    const countRes = await (await this.pool()).query<{ n: number }>(`select count(*)::int as n from staff_profiles`);
    const role: StaffRole = (countRes.rows[0]?.n ?? 0) === 0 ? "admin" : "responder";

    await (await this.pool()).query(
      `insert into staff_profiles (user_id, role, display_name, region, active)
       values ($1, $2, $3, $4, $5)`,
      [userId, role, displayName || "Responder", null, true],
    );

    await this.writeAudit({
      actorId: userId,
      actorRole: role,
      action: "staff.provision",
      resourceType: "staff",
      resourceId: userId,
      metadata: { role },
    });

    return {
      user_id: userId,
      role,
      display_name: displayName || "Responder",
      region: null,
      active: true,
    };
  }

  async listStaff(userId: string): Promise<{ me: StaffProfile; staff: StaffProfile[] }> {
    const me = await this.ensureStaffProfile(userId, "Responder");
    const res = await (await this.pool()).query<StaffProfile>(
      `select user_id, role, display_name, region, active from staff_profiles order by created_at asc`,
    );
    return { me, staff: res.rows };
  }

  async setStaffRole(adminUserId: string, targetUserId: string, role: StaffRole): Promise<void> {
    const me = await this.ensureStaffProfile(adminUserId, "Responder");
    if (me.role !== "admin") throw new Error("Only admins can change roles");

    await (await this.pool()).query(
      `update staff_profiles set role = $1 where user_id = $2`,
      [role, targetUserId],
    );

    await this.writeAudit({
      actorId: adminUserId,
      actorRole: me.role,
      action: "staff.role_change",
      resourceType: "staff",
      resourceId: targetUserId,
      metadata: { role },
    });
  }

  async getAnalytics(userId: string): Promise<AnalyticsData> {
    await this.ensureSeeded();
    await this.ensureStaffProfile(userId, "Responder");

    const byBand = (
      await (await this.pool()).query<{ risk_band: string; n: number }>(
        `select risk_band, count(*)::int as n from cases group by risk_band`,
      )
    ).rows;

    const byLang = (
      await (await this.pool()).query<{ language: string; n: number }>(
        `select language, count(*)::int as n from cases group by language`,
      )
    ).rows;

    const byRegion = (
      await (await this.pool()).query<{ region_code: string; n: number }>(
        `select coalesce(region_code, 'unspecified') as region_code, count(*)::int as n from cases group by 1`,
      )
    ).rows;

    const byPriority = (
      await (await this.pool()).query<{ priority: string; n: number }>(
        `select priority, count(*)::int as n from cases group by priority`,
      )
    ).rows;

    const byStatus = (
      await (await this.pool()).query<{ status: string; n: number }>(
        `select status, count(*)::int as n from cases group by status`,
      )
    ).rows;

    const flagTypes = (
      await (await this.pool()).query<{ flag_type: string; n: number }>(
        `select flag_type, count(*)::int as n from flags group by flag_type order by n desc`,
      )
    ).rows;

    const overdue = (
      await (await this.pool()).query<{ n: number }>(
        `select count(*)::int as n from cases where sla_due_at < now() and status not in ('resolved', 'closed')`,
      )
    ).rows[0]?.n ?? 0;

    await this.writeAccess({
      actorId: userId,
      resourceType: "analytics",
      resourceId: "org",
      purpose: "analytics.view",
    });

    return { byBand, byLang, byRegion, byPriority, byStatus, flagTypes, overdue };
  }

  async listAudit(userId: string): Promise<{ me: StaffProfile; rows: import("../analytics").AuditRow[] }> {
    const me = await this.ensureStaffProfile(userId, "Responder");
    const res = await (await this.pool()).query<import("../analytics").AuditRow>(
      `select id, actor_id, actor_role, action, resource_type, resource_id, metadata,
              created_at::text as created_at
       from audit_log
       order by created_at desc
       limit 200`,
    );
    return { me, rows: res.rows };
  }

  async ensureSeeded(): Promise<void> {
    const res = await (await this.pool()).query<{ n: number }>(`select count(*)::int as n from cases`);
    if ((res.rows[0]?.n ?? 0) > 0) return;

    for (const t of SYNTHETIC_THREADS) {
      const initial = await this.createInitialReport({
        source: "synthetic_seed",
        turns: t.turns,
        regionCode: t.region ?? null,
        callbackRequested: false,
        screenshot: false,
        voice: false,
        severity: 2,
      });

      const turns = t.turns;
      const classification: import("../../nlp/types").Classification = {
        grooming_risk: 0.8,
        cyberbullying_risk: 0.1,
        exploitation_risk: 0.1,
        benign: 0.0,
        label: "grooming_risk",
        confidence: 0.8,
      };
      const flags: import("../../nlp/types").ExtractedFlags = {
        secrecy: true,
        pii_request: false,
        isolation: false,
        incentive: false,
        platform_migration: false,
        image_request: false,
        age_gap: false,
        distress: false,
        age_probe: false,
        trust_build: true,
        blackmail: false,
        unwanted_contact: false,
        hits: [{ flag: "secrecy", label: "Secret keeping" }],
      };
      const scored = nlpProvider.draft_safety_case({
        evidence: turns.map((turn) => ({ ...turn, text: redactText(turn.text).text })),
        timeline: [],
        classification,
        flags,
        stage: "trust_building",
        score: 45,
        band: "med",
        priority: "P3",
        language: "en",
      });

      await this.updateCaseAnalysis(initial.id, {
        score: 45,
        band: "med",
        stage: "trust_building",
        priority: "P3",
        distress: false,
        factors: [{ key: "synthetic", label: "Baseline Synthetic Case", points: 45 }],
        flags: [{ flag: "synthetic_seed", label: "Synthetic seed case" }],
        history: [{ stage: "trust_building", reason: "Synthetic seed initial state" }],
        pack: {
          ...scored,
          analysis_mode: "fallback",
          pocso_note: "SYNTHETIC SEED CASE — for development and verification.",
        },
        analysisMode: "fallback",
        modelName: "synthetic",
      });
    }
  }
}
