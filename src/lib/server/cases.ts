import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getStorageRepository } from "./storage";
import { ensureStaffProfile } from "./staff";
import { ensureSeeded } from "./seed";
import { ingestThread, loadWeights } from "./ingest";
import { nlpProvider } from "../nlp/provider";
import { scoreThread } from "../pipeline/scoring";
import type { Json } from "../json";
import type { SafetyCasePack, LangCode, ThreadTurn } from "../nlp/types";
import type { StaffProfile } from "./staff";
import type { CaseStatus } from "../pipeline/lifecycle";
import type { Priority } from "../pipeline/priority";
import type { ThreadTimeline } from "../pipeline/timeline";

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
  analysis_mode: "live" | "fallback" | null;
};

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

export const listCases = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureSeeded();
    const repo = getStorageRepository();
    return repo.listCases(context.userId);
  });

export const getCase = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }): Promise<CaseDetail> => {
    await ensureSeeded();
    const repo = getStorageRepository();
    const detail = await repo.getCaseDetail(id, context.userId);
    if (!detail) throw new Error("Case not found");
    return detail;
  });

export const transitionCase = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; to: CaseStatus; confirm: boolean }) => d)
  .handler(async ({ context, data }) => {
    const me = await ensureStaffProfile(context.userId, "Responder");
    const repo = getStorageRepository();
    await repo.transitionCase(data.id, data.to, context.userId, me.role, data.confirm);
    return { ok: true as const };
  });

export const addNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; body: string }) => d)
  .handler(async ({ context, data }) => {
    const me = await ensureStaffProfile(context.userId, "Responder");
    const repo = getStorageRepository();
    await repo.addCaseNote(data.id, context.userId, me.role, data.body);
    return { ok: true as const };
  });

export const revealIdentity = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; confirm: boolean }) => d)
  .handler(async ({ context, data }) => {
    if (!data.confirm) throw new Error("Human confirmation required");
    const me = await ensureStaffProfile(context.userId, "Responder");
    const repo = getStorageRepository();
    const plain = await repo.revealIdentity(data.id, context.userId, me.role);
    return { contact: plain };
  });

export const regenerateSafetyCase = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const me = await ensureStaffProfile(context.userId, "Responder");
    const repo = getStorageRepository();
    const detail = await repo.getCaseDetail(id, context.userId);
    if (!detail) throw new Error("Case not found");

    if (!detail.messages.length) throw new Error("No evidence on this case to build a pack from");

    const turns: ThreadTurn[] = detail.messages.map((m) => ({
      speaker: (m.speaker === "child" || m.speaker === "reporter" ? m.speaker : "other") as
        | "child"
        | "other"
        | "reporter",
      text: m.redacted_text,
    }));

    const { analyzeConversation } = await import("@/lib/ai/analyze");
    const { scoreAnalysis } = await import("@/lib/ai/risk-engine");
    const { buildLiveSafetyCasePack } = await import("@/lib/ai/case-pack");

    let live: Awaited<ReturnType<typeof analyzeConversation>> = {
      ok: false,
      error: "AI unavailable",
      code: "no_key",
    };

    try {
      live = await analyzeConversation({
        messages: turns.map((t) => ({ speaker: t.speaker === "other" ? "other" : "child", text: t.text })),
      });
    } catch (err) {
      console.warn("[ai] analyzeConversation error during regenerate:", err);
    }

    const weights = await loadWeights();
    let pack: SafetyCasePack;
    let score: number;
    let band: string;
    let stage: string;

    if (live.ok) {
      const risk = scoreAnalysis(live.analysis);
      pack = buildLiveSafetyCasePack({
        analysis: live.analysis,
        risk,
        turns,
        modelName: live.result.modelName ?? "unknown",
      });
      score = risk.score;
      band = pack.risk_band;
      stage = pack.stage;
    } else {
      const scored = scoreThread(turns, weights);
      pack = {
        ...nlpProvider.draft_safety_case({
          evidence: turns,
          timeline: detail.stages.map((s) => ({ at: s.entered_at, event: `${s.stage}: ${s.reason}` })),
          classification: scored.classification,
          flags: scored.flags,
          stage: scored.stage,
          score: scored.score,
          band: scored.band,
          priority: detail.case.priority,
          language: detail.case.language as LangCode,
        }),
        analysis_mode: "fallback",
        pocso_note:
          `DEMO FALLBACK — AI SERVICE UNAVAILABLE. ${live.error ?? ""} ` +
          "This pack was built from the offline rule/lexicon classifier, not a live model call. " +
          "SIMULATED pack. Not a POCSO complaint, not e-evidence, and not a filing with any agency. " +
          "A designated human officer must confirm before any irreversible step.",
      };
      score = scored.score;
      band = scored.band;
      stage = scored.stage;
    }

    await repo.saveSafetyPack(id, pack, score, band, stage, context.userId, me.role);
    return { pack };
  });

export const exportSafetyPack = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    await ensureStaffProfile(context.userId, "Responder");
    const repo = getStorageRepository();
    const { public_id, pack } = await repo.getSafetyPack(id, context.userId);
    return {
      format: "simulated-pocso-e-evidence-v0" as const,
      disclaimer:
        "SIMULATED. Not a legal filing, not hash-chained e-evidence, and not submitted to any agency.",
      public_id,
      pack,
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
