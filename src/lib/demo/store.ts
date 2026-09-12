import { create } from "zustand";
import { analyseMessages, analyseScenario } from "./analysis";
import { caseFromAnalysis, DEMO_CASE_ID, DEMO_CASE_PUBLIC_ID } from "./case-factory";
import { seedCases } from "./seed";
import type {
  AnalysisLang,
  AnalysisResult,
  AnalysisStage,
  DemoCase,
  DemoRole,
  Severity,
  ThreatKind,
} from "./types";
import { bandFromRisk, statusLabel } from "./types";

export { DEMO_CASE_ID, DEMO_CASE_PUBLIC_ID };

type SimPhase = "idle" | "running" | "done";

type SupportChoice =
  | "help"
  | "talk"
  | "report"
  | "danger"
  | "unsure"
  | null;

type TrustedAdult =
  | "parent"
  | "teacher"
  | "counsellor"
  | "relative"
  | "other"
  | null;

type State = {
  role: DemoRole;
  deskUnlocked: boolean;
  cases: DemoCase[];
  selectedCaseId: string | null;
  analysis: AnalysisResult | null;
  analysisStage: AnalysisStage;
  scenarioKind: ThreatKind;
  scenarioSeverity: Severity;
  scenarioLang: AnalysisLang;
  sim: { phase: SimPhase; step: number; label: string };
  supportOpen: boolean;
  supportChoice: SupportChoice;
  trustedAdult: TrustedAdult;
  lastChildCaseId: string | null;
  setRole: (role: DemoRole) => void;
  unlockDesk: () => void;
  setScenario: (p: Partial<{ kind: ThreatKind; severity: Severity; lang: AnalysisLang }>) => void;
  runAnalysis: (messages?: AnalysisResult["messages"]) => void;
  applyLiveAnalysis: (result: AnalysisResult) => void;
  setAnalysisStage: (s: AnalysisStage) => void;
  generateScenario: () => void;
  createCaseFromAnalysis: (source: DemoCase["source"]) => DemoCase;
  updateCase: (id: string, patch: Partial<DemoCase>) => void;
  addAudit: (id: string, action: string, actor?: string) => void;
  openSupport: (open: boolean) => void;
  setSupportChoice: (c: SupportChoice) => void;
  setTrustedAdult: (a: TrustedAdult) => void;
  createChildCase: (choice: SupportChoice) => DemoCase;
  ingestChildReport: (payload: {
    text: string;
    analysis?: AnalysisResult | null;
    screenshots?: { name: string; dataUrl: string }[];
    voice?: { durationSec: number; mime: string; transcription?: string };
    region?: string;
    anonymous: boolean;
  }) => DemoCase;
  startSim: () => void;
  setSimStep: (step: number, label: string) => void;
  endSim: () => void;
  resetSim: () => void;
};

function nextPublicId(cases: DemoCase[]): string {
  const n = 2100 + cases.length;
  return `SRK-${n}`;
}

export const useDemoStore = create<State>((set, get) => ({
  role: "responder",
  deskUnlocked: false,
  cases: seedCases(),
  selectedCaseId: DEMO_CASE_ID,
  analysis: null,
  analysisStage: "idle",
  scenarioKind: "grooming",
  scenarioSeverity: "critical",
  scenarioLang: "hi-Latn",
  sim: { phase: "idle", step: 0, label: "" },
  supportOpen: false,
  supportChoice: null,
  trustedAdult: null,
  lastChildCaseId: null,

  setRole: (role) => set({ role }),
  unlockDesk: () => set({ deskUnlocked: true }),

  setScenario: (p) =>
    set((s) => ({
      scenarioKind: p.kind ?? s.scenarioKind,
      scenarioSeverity: p.severity ?? s.scenarioSeverity,
      scenarioLang: p.lang ?? s.scenarioLang,
    })),

  runAnalysis: (messages) => {
    const { scenarioKind, scenarioSeverity, scenarioLang } = get();
    const result = messages
      ? analyseMessages(messages, {
          kind: scenarioKind,
          severity: scenarioSeverity,
          lang: scenarioLang,
          curated: true,
        })
      : analyseScenario(scenarioKind, scenarioLang, scenarioSeverity);
    result.analysisMode = result.analysisMode ?? "prototype";
    set({ analysis: result, analysisStage: "done" });
  },

  applyLiveAnalysis: (result) => set({ analysis: result, analysisStage: "done" }),

  setAnalysisStage: (analysisStage) => set({ analysisStage }),

  generateScenario: () => {
    const { scenarioKind, scenarioLang, scenarioSeverity } = get();
    const result = analyseScenario(scenarioKind, scenarioLang, scenarioSeverity);
    result.isSynthetic = true;
    result.analysisMode = "prototype";
    set({ analysis: result, analysisStage: "idle" });
  },

  createCaseFromAnalysis: (source) => {
    const { analysis, cases, scenarioLang } = get();
    const a =
      analysis ??
      analyseScenario(get().scenarioKind, get().scenarioLang, get().scenarioSeverity);
    const publicId = source === "simulation" ? DEMO_CASE_PUBLIC_ID : nextPublicId(cases);
    const id = source === "simulation" ? DEMO_CASE_ID : `demo-${publicId.toLowerCase()}`;
    const created = caseFromAnalysis(a, {
      id,
      publicId,
      language: scenarioLang,
      source,
    });
    set((s) => ({
      cases: [created, ...s.cases.filter((c) => c.id !== created.id)],
      selectedCaseId: created.id,
      analysis: a,
      deskUnlocked: true,
    }));
    return created;
  },

  updateCase: (id, patch) =>
    set((s) => ({
      cases: s.cases.map((c) => (c.id === id ? { ...c, ...patch, lastActivity: new Date().toISOString() } : c)),
    })),

  addAudit: (id, action, actor = "responder") =>
    set((s) => ({
      cases: s.cases.map((c) =>
        c.id === id
          ? {
              ...c,
              audit: [
                ...c.audit,
                {
                  id: `${id}-${c.audit.length}`,
                  at: new Date().toISOString(),
                  action,
                  actor,
                },
              ],
            }
          : c,
      ),
    })),

  openSupport: (supportOpen) => set({ supportOpen }),
  setSupportChoice: (supportChoice) => set({ supportChoice }),
  setTrustedAdult: (trustedAdult) => set({ trustedAdult }),

  createChildCase: (choice) => {
    const { trustedAdult } = get();
    const severity: Severity =
      choice === "danger" ? "critical" : choice === "unsure" ? "medium" : "high";
    const result = analyseScenario("grooming", "en", severity);
    result.summary =
      choice === "danger"
        ? "Child indicated immediate danger. Urgent human review. Childline 1098 offered. No autonomous contact with authorities."
        : "Child asked for help through the anonymous support path. Identity remains sealed.";
    set({ analysis: result });
    const created = get().createCaseFromAnalysis("child");
    get().addAudit(
      created.id,
      `Child pathway: ${choice}${trustedAdult ? ` · trusted adult preferred: ${trustedAdult}` : ""}`,
      "child-flow",
    );
    set({ lastChildCaseId: created.id, supportOpen: false });
    return created;
  },

  ingestChildReport: ({ text, analysis, screenshots, voice, region, anonymous }) => {
    const a =
      analysis ??
      analyseMessages(
        text
          ? [{ speaker: "child", text, source: "paste", sourceLabel: "Child report" }]
          : [{ speaker: "child", text: "No written note.", source: "paste", sourceLabel: "Child report" }],
        { curated: false },
      );
    set({ analysis: a });
    const created = get().createCaseFromAnalysis("child");
    get().updateCase(created.id, {
      screenshots,
      voiceNote: voice,
      region: region || created.region,
      summary: anonymous
        ? `${a.summary} Reporter chose to stay anonymous.`
        : `${a.summary} Reporter asked to be contacted.`,
    });
    get().addAudit(created.id, "Anonymous child report received", "child-flow");
    if (screenshots?.length) get().addAudit(created.id, `${screenshots.length} screenshot(s) attached`, "child-flow");
    if (voice) get().addAudit(created.id, "Voice note attached", "child-flow");
    set({ lastChildCaseId: created.id, deskUnlocked: true });
    return created;
  },

  startSim: () => {
    const result = analyseScenario("grooming", "hi-Latn", "critical");
    result.isSynthetic = true;
    set({
      sim: { phase: "running", step: 0, label: "DETECT" },
      deskUnlocked: true,
      scenarioKind: "grooming",
      scenarioSeverity: "critical",
      scenarioLang: "hi-Latn",
      analysis: result,
      analysisStage: "idle",
    });
  },
  setSimStep: (step, label) => set({ sim: { phase: "running", step, label } }),
  endSim: () => set({ sim: { phase: "done", step: 13, label: "INTERVENE" } }),
  resetSim: () => set({ sim: { phase: "idle", step: 0, label: "" } }),
}));

export function caseKpis(cases: DemoCase[]) {
  return {
    critical: cases.filter((c) => c.band === "critical" && c.status !== "closed").length,
    high: cases.filter((c) => c.band === "high" && c.status !== "closed").length,
    pending: cases.filter((c) => c.status === "human_review").length,
    support: cases.filter((c) => c.status === "support" || c.status === "counsellor").length,
  };
}

export { bandFromRisk, statusLabel };
