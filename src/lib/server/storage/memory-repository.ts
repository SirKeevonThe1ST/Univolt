import { nid, publicCaseId } from "../../utils.ts";
import { redactText, sha256Hex } from "../../privacy/redact.ts";
import { nlpProvider } from "../../nlp/provider.ts";
import { assertTransition, type CaseStatus } from "../../pipeline/lifecycle.ts";
import { SLA_MINUTES, slaDueAt, type Priority } from "../../pipeline/priority.ts";
import { buildTimeline } from "../../pipeline/timeline.ts";
import { SYNTHETIC_THREADS } from "../../synthetic/conversations.ts";
import type { SafetyCasePack, ThreadTurn } from "../../nlp/types.ts";
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

interface CaseEntity {
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
  retention_until: string;
  created_at: string;
  updated_at: string;
}

interface MessageEntity {
  id: string;
  case_id: string;
  turn_index: number;
  speaker: string;
  lang: string;
  redacted_text: string;
  raw_hash: string;
  created_at: string;
}

interface ScoreEntity {
  id: string;
  case_id: string;
  message_id: string | null;
  score: number;
  risk_band: string;
  contributing_factors: unknown;
  created_at: string;
}

interface FlagEntity {
  id: string;
  case_id: string;
  message_id: string | null;
  flag_type: string;
  present: boolean;
  evidence_label: string;
  created_at: string;
}

interface StageHistoryEntity {
  id: string;
  case_id: string;
  stage: string;
  reason: string;
  entered_at: string;
}

interface SafetyCaseEntity {
  id: string;
  case_id: string;
  pack: SafetyCasePack;
  created_at: string;
}

interface AttachmentEntity {
  id: string;
  case_id: string;
  kind: "screenshot" | "voice" | "text";
  storage_ref: string;
  created_at: string;
}

interface ReporterIdentityEntity {
  id: string;
  case_id: string;
  sealed: boolean;
  encrypted_blob: string | null;
  reveal_authorized_by: string | null;
  reveal_authorized_at: string | null;
}

interface AuditLogEntity {
  id: string;
  actor_id: string | null;
  actor_role: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface EventLogEntity {
  id: string;
  case_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
}

interface CaseNoteEntity {
  id: string;
  case_id: string;
  author_id: string;
  body: string;
  created_at: string;
}

interface AccessLogEntity {
  id: string;
  actor_id: string;
  resource_type: string;
  resource_id: string;
  purpose: string;
  created_at: string;
}

interface MemoryStoreState {
  cases: Map<string, CaseEntity>;
  messages: MessageEntity[];
  scores: ScoreEntity[];
  flags: FlagEntity[];
  stageHistory: StageHistoryEntity[];
  safetyCases: Map<string, SafetyCaseEntity>;
  attachments: AttachmentEntity[];
  identities: Map<string, ReporterIdentityEntity>;
  auditLog: AuditLogEntity[];
  eventLog: EventLogEntity[];
  staffProfiles: Map<string, StaffProfile>;
  caseNotes: CaseNoteEntity[];
  accessLog: AccessLogEntity[];
  scoringWeights: Record<string, number>;
  isSeeded: boolean;
}

const g = globalThis as unknown as {
  __surakshaMemoryStore__?: MemoryStoreState;
};

function getStore(): MemoryStoreState {
  if (!g.__surakshaMemoryStore__) {
    g.__surakshaMemoryStore__ = {
      cases: new Map(),
      messages: [],
      scores: [],
      flags: [],
      stageHistory: [],
      safetyCases: new Map(),
      attachments: [],
      identities: new Map(),
      auditLog: [],
      eventLog: [],
      staffProfiles: new Map(),
      caseNotes: [],
      accessLog: [],
      scoringWeights: {
        classifier_confidence: 22,
        stage: 20,
        persistence: 12,
        secrecy: 12,
        pii_request: 12,
        image_request: 10,
        age_gap: 7,
        prior_flags: 5,
      },
      isSeeded: false,
    };
  }
  return g.__surakshaMemoryStore__;
}

export class MemoryStorageRepository implements StorageRepository {
  private store = getStore();

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

    const caseEntity: CaseEntity = {
      id,
      public_id: publicId,
      source: input.source,
      status: "new",
      priority: initialPriority,
      risk_score: severity >= 4 ? 80 : severity === 3 ? 55 : severity === 2 ? 30 : 15,
      risk_band: severity >= 4 ? "critical" : severity === 3 ? "high" : severity === 2 ? "med" : "low",
      stage: "contact",
      language: joinedLang,
      region_code: input.regionCode ?? null,
      callback_requested: Boolean(input.callbackRequested),
      distress_flag: distress,
      assigned_to: null,
      sla_due_at: due.toISOString(),
      last_activity_at: now.toISOString(),
      ai_generated: true,
      identity_sealed: true,
      retention_until: retentionUntil.toISOString(),
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };
    this.store.cases.set(id, caseEntity);

    // Persist messages with redacted text and hash
    let turnIndex = 0;
    for (const turn of turns) {
      const red = redactText(turn.text);
      const hash = await sha256Hex(turn.text);
      const mid = nid("msg");
      const lang = nlpProvider.detect_language(turn.text);
      this.store.messages.push({
        id: mid,
        case_id: id,
        turn_index: turnIndex,
        speaker: turn.speaker,
        lang,
        redacted_text: red.text,
        raw_hash: hash,
        created_at: now.toISOString(),
      });
      turnIndex += 1;
    }

    // Attachments
    if (input.screenshot) {
      this.store.attachments.push({
        id: nid("att"),
        case_id: id,
        kind: "screenshot",
        storage_ref: "vault://simulated-sealed-screenshot",
        created_at: now.toISOString(),
      });
    }
    if (input.voice) {
      this.store.attachments.push({
        id: nid("att"),
        case_id: id,
        kind: "voice",
        storage_ref: "vault://simulated-sealed-voice",
        created_at: now.toISOString(),
      });
    }

    // Sealed confidential identity
    if (input.callbackRequested && input.encryptedContact) {
      this.store.identities.set(id, {
        id: nid("idn"),
        case_id: id,
        sealed: true,
        encrypted_blob: input.encryptedContact,
        reveal_authorized_by: null,
        reveal_authorized_at: null,
      });
    }

    // Initial audit entry
    await this.writeAudit({
      actorId: null,
      actorRole: "system",
      action: "report.submitted",
      resourceType: "case",
      resourceId: id,
      metadata: { source: input.source, severity: input.severity },
    });

    return { id, publicId };
  }

  async updateCaseAnalysis(caseId: string, analysis: CaseAnalysisInput): Promise<void> {
    const existing = this.store.cases.get(caseId);
    if (!existing) throw new Error(`Case ${caseId} not found`);

    const now = new Date();
    const due = slaDueAt(now, analysis.priority);

    existing.risk_score = analysis.score;
    existing.risk_band = analysis.band;
    existing.stage = analysis.stage;
    existing.priority = analysis.priority;
    existing.distress_flag = analysis.distress;
    existing.sla_due_at = due.toISOString();
    existing.last_activity_at = now.toISOString();
    existing.updated_at = now.toISOString();

    // Scores
    this.store.scores.push({
      id: nid("scr"),
      case_id: caseId,
      message_id: null,
      score: analysis.score,
      risk_band: analysis.band,
      contributing_factors: analysis.factors,
      created_at: now.toISOString(),
    });

    // Flags
    for (const f of analysis.flags) {
      this.store.flags.push({
        id: nid("flg"),
        case_id: caseId,
        message_id: null,
        flag_type: f.flag,
        present: true,
        evidence_label: f.label,
        created_at: now.toISOString(),
      });
    }

    // Stage history
    for (const h of analysis.history) {
      this.store.stageHistory.push({
        id: nid("stg"),
        case_id: caseId,
        stage: h.stage,
        reason: h.reason,
        entered_at: now.toISOString(),
      });
    }

    // Safety case pack
    this.store.safetyCases.set(caseId, {
      id: nid("sft"),
      case_id: caseId,
      pack: analysis.pack,
      created_at: now.toISOString(),
    });

    await this.writeEvent(caseId, "case.ingested", {
      publicId: existing.public_id,
      band: analysis.band,
      priority: analysis.priority,
      stage: analysis.stage,
      ai_generated: true,
      analysis_mode: analysis.analysisMode,
      model: analysis.modelName ?? null,
    });

    await this.writeAudit({
      actorId: null,
      actorRole: "system",
      action: "case.ingested",
      resourceType: "case",
      resourceId: caseId,
      metadata: {
        source: existing.source,
        band: analysis.band,
        priority: analysis.priority,
        analysis_mode: analysis.analysisMode,
      },
    });

    if (analysis.priority === "P1") {
      await this.writeEvent(caseId, "alert.p1.stub", {
        channel: "simulated-realtime",
        note: "P1 real-time alert stub — no live agency webhook.",
      });
    }
  }

  async getCaseDetail(id: string, userId: string): Promise<CaseDetail | null> {
    const c = this.store.cases.get(id);
    if (!c) return null;

    const me = await this.ensureStaffProfile(userId, "Responder");
    const assignedStaff = c.assigned_to ? this.store.staffProfiles.get(c.assigned_to) : null;
    const safety = this.store.safetyCases.get(id);
    const identity = this.store.identities.get(id);

    const messages = this.store.messages
      .filter((m) => m.case_id === id)
      .sort((a, b) => a.turn_index - b.turn_index);

    const scores = this.store.scores
      .filter((s) => s.case_id === id)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    const flags = this.store.flags
      .filter((f) => f.case_id === id)
      .map((f) => ({ flag_type: f.flag_type, evidence_label: f.evidence_label }));

    const stages = this.store.stageHistory
      .filter((s) => s.case_id === id)
      .sort((a, b) => new Date(a.entered_at).getTime() - new Date(b.entered_at).getTime());

    const events = this.store.eventLog
      .filter((e) => e.case_id === id)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((e) => ({ event_type: e.event_type, payload: e.payload, created_at: e.created_at }));

    const notes = this.store.caseNotes
      .filter((n) => n.case_id === id)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((n) => {
        const author = this.store.staffProfiles.get(n.author_id);
        return {
          id: n.id,
          author_id: n.author_id,
          body: n.body,
          created_at: n.created_at,
          author_name: author?.display_name ?? null,
        };
      });

    const attachments = this.store.attachments
      .filter((a) => a.case_id === id)
      .map((a) => ({ kind: a.kind, storage_ref: a.storage_ref }));

    await this.writeAccess({
      actorId: userId,
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
      this.store.scoringWeights,
    );

    const row: CaseRow = {
      ...c,
      assigned_name: assignedStaff?.display_name ?? null,
      analysis_mode: safety?.pack.analysis_mode ?? null,
    };

    return {
      me,
      case: row,
      messages,
      scores: scores.map((s) => ({
        score: s.score,
        risk_band: s.risk_band,
        contributing_factors: s.contributing_factors as import("../../json").Json,
        created_at: s.created_at,
      })),
      flags,
      stages,
      events: events.map((e) => ({
        event_type: e.event_type,
        payload: e.payload as import("../../json").Json,
        created_at: e.created_at,
      })),
      notes,
      safetyPack: safety?.pack ?? null,
      hasSealedIdentity: Boolean(identity),
      identitySealed: identity?.sealed ?? true,
      attachments,
      timeline,
    };
  }

  async listCases(userId: string): Promise<{ me: StaffProfile; cases: CaseRow[] }> {
    await this.ensureSeeded();
    const me = await this.ensureStaffProfile(userId, "Responder");

    const priorityRank: Record<Priority, number> = { P1: 1, P2: 2, P3: 3, P4: 4 };

    const casesList = Array.from(this.store.cases.values())
      .map((c) => {
        const staff = c.assigned_to ? this.store.staffProfiles.get(c.assigned_to) : null;
        const safety = this.store.safetyCases.get(c.id);
        const row: CaseRow = {
          ...c,
          assigned_name: staff?.display_name ?? null,
          analysis_mode: safety?.pack.analysis_mode ?? null,
        };
        return row;
      })
      .sort((a, b) => {
        const rankDiff = (priorityRank[a.priority] || 4) - (priorityRank[b.priority] || 4);
        if (rankDiff !== 0) return rankDiff;
        return new Date(a.sla_due_at).getTime() - new Date(b.sla_due_at).getTime();
      });

    await this.writeAccess({
      actorId: userId,
      resourceType: "case_list",
      resourceId: "queue",
      purpose: "queue.view",
    });

    return { me, cases: casesList };
  }

  async transitionCase(
    id: string,
    to: CaseStatus,
    userId: string,
    role: string,
    confirm: boolean,
  ): Promise<void> {
    const c = this.store.cases.get(id);
    if (!c) throw new Error("Case not found");

    const from = c.status;
    let assigned = c.assigned_to;
    if (to === "assigned" && from === "new") {
      assigned = userId;
    }

    assertTransition(from, to, confirm);

    if (to === "assigned" || to === "in_progress") {
      const due = new Date(Date.now() + SLA_MINUTES[c.priority] * 60_000);
      c.sla_due_at = due.toISOString();
    }

    c.status = to;
    c.assigned_to = assigned;
    c.last_activity_at = new Date().toISOString();
    c.updated_at = new Date().toISOString();

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
    const c = this.store.cases.get(id);
    if (!c) throw new Error("Case not found");

    this.store.caseNotes.push({
      id: nid("nte"),
      case_id: id,
      author_id: authorId,
      body: trimmed,
      created_at: new Date().toISOString(),
    });

    c.last_activity_at = new Date().toISOString();

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
    const c = this.store.cases.get(caseId);
    if (!c) throw new Error("Case not found");

    const idn = this.store.identities.get(caseId);
    if (!idn?.encrypted_blob) throw new Error("No sealed identity on this case");

    const { decryptField } = await import("../../privacy/crypto");
    const plain = decryptField(idn.encrypted_blob);

    idn.sealed = false;
    idn.reveal_authorized_by = userId;
    idn.reveal_authorized_at = new Date().toISOString();

    c.identity_sealed = false;
    c.updated_at = new Date().toISOString();

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
    const c = this.store.cases.get(caseId);
    if (!c) throw new Error("Case not found");

    c.risk_score = score;
    c.risk_band = band;
    c.stage = stage;
    c.updated_at = new Date().toISOString();

    this.store.safetyCases.set(caseId, {
      id: nid("sft"),
      case_id: caseId,
      pack,
      created_at: new Date().toISOString(),
    });

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
    const c = this.store.cases.get(caseId);
    if (!c) throw new Error("Case not found");
    const s = this.store.safetyCases.get(caseId);
    if (!s) throw new Error("No safety pack");

    await this.writeAccess({
      actorId: userId,
      resourceType: "case",
      resourceId: caseId,
      purpose: "export.safety_pack",
    });

    return { public_id: c.public_id, pack: s.pack };
  }

  async writeAudit(entry: AuditEntry): Promise<void> {
    this.store.auditLog.push({
      id: nid("aud"),
      actor_id: entry.actorId ?? null,
      actor_role: entry.actorRole ?? null,
      action: entry.action,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId ?? null,
      metadata: entry.metadata ?? null,
      created_at: new Date().toISOString(),
    });
  }

  async writeEvent(caseId: string, eventType: string, payload: Record<string, unknown>): Promise<void> {
    this.store.eventLog.push({
      id: nid("evt"),
      case_id: caseId,
      event_type: eventType,
      payload,
      created_at: new Date().toISOString(),
    });
  }

  async writeAccess(entry: AccessEntry): Promise<void> {
    this.store.accessLog.push({
      id: nid("acc"),
      actor_id: entry.actorId,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId,
      purpose: entry.purpose,
      created_at: new Date().toISOString(),
    });
  }

  async ensureStaffProfile(userId: string, displayName: string): Promise<StaffProfile> {
    const existing = this.store.staffProfiles.get(userId);
    if (existing) return existing;

    const role: StaffRole = this.store.staffProfiles.size === 0 ? "admin" : "responder";
    const profile: StaffProfile = {
      user_id: userId,
      role,
      display_name: displayName || "Responder",
      region: null,
      active: true,
    };
    this.store.staffProfiles.set(userId, profile);

    await this.writeAudit({
      actorId: userId,
      actorRole: role,
      action: "staff.provision",
      resourceType: "staff",
      resourceId: userId,
      metadata: { role },
    });

    return profile;
  }

  async listStaff(userId: string): Promise<{ me: StaffProfile; staff: StaffProfile[] }> {
    const me = await this.ensureStaffProfile(userId, "Responder");
    return { me, staff: Array.from(this.store.staffProfiles.values()) };
  }

  async setStaffRole(adminUserId: string, targetUserId: string, role: StaffRole): Promise<void> {
    const me = await this.ensureStaffProfile(adminUserId, "Responder");
    if (me.role !== "admin") throw new Error("Only admins can change roles");

    const target = this.store.staffProfiles.get(targetUserId);
    if (target) {
      target.role = role;
    }

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

    const cases = Array.from(this.store.cases.values());
    const countBy = <T extends string>(arr: T[]): { [key: string]: number } => {
      const counts: { [key: string]: number } = {};
      for (const item of arr) counts[item] = (counts[item] || 0) + 1;
      return counts;
    };

    const bandCounts = countBy(cases.map((c) => c.risk_band));
    const langCounts = countBy(cases.map((c) => c.language));
    const regionCounts = countBy(cases.map((c) => c.region_code || "unspecified"));
    const priorityCounts = countBy(cases.map((c) => c.priority));
    const statusCounts = countBy(cases.map((c) => c.status));
    const flagCounts = countBy(this.store.flags.map((f) => f.flag_type));

    const now = Date.now();
    const overdue = cases.filter(
      (c) => new Date(c.sla_due_at).getTime() < now && c.status !== "resolved" && c.status !== "closed",
    ).length;

    await this.writeAccess({
      actorId: userId,
      resourceType: "analytics",
      resourceId: "org",
      purpose: "analytics.view",
    });

    return {
      byBand: Object.entries(bandCounts).map(([risk_band, n]) => ({ risk_band, n })),
      byLang: Object.entries(langCounts).map(([language, n]) => ({ language, n })),
      byRegion: Object.entries(regionCounts).map(([region_code, n]) => ({ region_code, n })),
      byPriority: Object.entries(priorityCounts).map(([priority, n]) => ({ priority, n })),
      byStatus: Object.entries(statusCounts).map(([status, n]) => ({ status, n })),
      flagTypes: Object.entries(flagCounts)
        .map(([flag_type, n]) => ({ flag_type, n }))
        .sort((a, b) => b.n - a.n),
      overdue,
    };
  }

  async listAudit(userId: string): Promise<{ me: StaffProfile; rows: import("../analytics").AuditRow[] }> {
    const me = await this.ensureStaffProfile(userId, "Responder");
    const rows = [...this.store.auditLog]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 200)
      .map((r) => ({
        id: r.id,
        actor_id: r.actor_id,
        actor_role: r.actor_role,
        action: r.action,
        resource_type: r.resource_type,
        resource_id: r.resource_id,
        metadata: (r.metadata ?? {}) as import("../../json").Json,
        created_at: r.created_at,
      }));
    return { me, rows };
  }

  async ensureSeeded(): Promise<void> {
    if (this.store.isSeeded || this.store.cases.size > 0) return;
    this.store.isSeeded = true;

    // Seed synthetic cases without loading PGlite or WASM
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
