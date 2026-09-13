import type { SafetyCasePack, ThreadTurn } from "../../nlp/types";
import type { CaseStatus } from "../../pipeline/lifecycle";
import type { Priority } from "../../pipeline/priority";
import type { StaffProfile, StaffRole } from "../staff";
import type { CaseDetail, CaseRow } from "../cases";

export type InitialReportInput = {
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

export type CaseAnalysisInput = {
  score: number;
  band: "low" | "med" | "high" | "critical";
  stage: "contact" | "trust_building" | "isolation" | "exploitation_attempt";
  priority: Priority;
  distress: boolean;
  factors: { key: string; label: string; points: number }[];
  flags: { flag: string; label: string }[];
  history: { stage: string; reason: string }[];
  pack: SafetyCasePack;
  analysisMode: "live" | "fallback";
  modelName?: string | null;
};

export type AuditEntry = {
  actorId?: string | null;
  actorRole?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
};

export type AccessEntry = {
  actorId: string;
  resourceType: string;
  resourceId: string;
  purpose: string;
};

export type AnalyticsData = {
  byBand: { risk_band: string; n: number }[];
  byLang: { language: string; n: number }[];
  byRegion: { region_code: string; n: number }[];
  byPriority: { priority: string; n: number }[];
  byStatus: { status: string; n: number }[];
  flagTypes: { flag_type: string; n: number }[];
  overdue: number;
};

export interface StorageRepository {
  /** Create initial report and stub case before AI analysis runs */
  createInitialReport(input: InitialReportInput): Promise<{ id: string; publicId: string }>;

  /** Attach or update analysis, scores, flags, safety pack, and timeline to an existing case */
  updateCaseAnalysis(caseId: string, analysis: CaseAnalysisInput): Promise<void>;

  /** Retrieve full case details by internal ID */
  getCaseDetail(id: string, userId: string): Promise<CaseDetail | null>;

  /** List cases ordered by priority and SLA */
  listCases(userId: string): Promise<{ me: StaffProfile; cases: CaseRow[] }>;

  /** Change case workflow status */
  transitionCase(
    id: string,
    to: CaseStatus,
    userId: string,
    role: string,
    confirm: boolean,
  ): Promise<void>;

  /** Add an operational note to a case */
  addCaseNote(id: string, authorId: string, role: string, body: string): Promise<void>;

  /** Unseal confidential reporter identity (authorised responder only) */
  revealIdentity(caseId: string, userId: string, role: string): Promise<string>;

  /** Regenerate and persist a safety case pack */
  saveSafetyPack(
    caseId: string,
    pack: SafetyCasePack,
    score: number,
    band: string,
    stage: string,
    userId: string,
    role: string,
  ): Promise<void>;

  /** Retrieve safety case pack for export */
  getSafetyPack(caseId: string, userId: string): Promise<{ public_id: string; pack: SafetyCasePack }>;

  /** Write an audit log entry */
  writeAudit(entry: AuditEntry): Promise<void>;

  /** Write a case-specific event log entry */
  writeEvent(caseId: string, eventType: string, payload: Record<string, unknown>): Promise<void>;

  /** Write an access log entry */
  writeAccess(entry: AccessEntry): Promise<void>;

  /** Ensure a staff profile exists for the user */
  ensureStaffProfile(userId: string, displayName: string): Promise<StaffProfile>;

  /** List all staff profiles */
  listStaff(userId: string): Promise<{ me: StaffProfile; staff: StaffProfile[] }>;

  /** Update role of a staff member (admin only) */
  setStaffRole(adminUserId: string, targetUserId: string, role: StaffRole): Promise<void>;

  /** Query analytics metrics */
  getAnalytics(userId: string): Promise<AnalyticsData>;

  /** List audit log entries */
  listAudit(userId: string): Promise<{ me: StaffProfile; rows: import("../analytics").AuditRow[] }>;

  /** Ensure baseline synthetic data is seeded if database is empty */
  ensureSeeded(): Promise<void>;
}
