import type { AnalysisLang, AnalysisResult, DemoCase } from "./types";

export const DEMO_CASE_ID = "demo-srk-2048";
export const DEMO_CASE_PUBLIC_ID = "SRK-DEMO-2048";

function graphFor(risk: number) {
  return {
    nodes: [
      { id: "child", label: "CHILD", kind: "child" as const, risk: 0 },
      { id: "acc-a", label: "ACCOUNT A", kind: "account" as const, risk },
      { id: "acc-b", label: "ACCOUNT B", kind: "account" as const, risk: Math.max(10, risk - 30) },
      { id: "acc-c", label: "ACCOUNT C", kind: "account" as const, risk: Math.max(8, risk - 48) },
    ],
    edges: [
      { from: "child", to: "acc-a", strength: 0.92, label: "repeated interaction" },
      { from: "acc-a", to: "acc-b", strength: 0.5, label: "shared behaviour" },
      { from: "acc-a", to: "acc-c", strength: 0.32, label: "weak overlap" },
    ],
  };
}

export function caseFromAnalysis(
  a: AnalysisResult,
  opts: {
    id: string;
    publicId: string;
    language: AnalysisLang;
    source: DemoCase["source"];
    ageBand?: string;
    region?: string;
  },
): DemoCase {
  return {
    id: opts.id,
    publicId: opts.publicId,
    risk: a.risk,
    projectedRisk: a.projectedRisk,
    singleMessageRisk: a.singleMessageRisk,
    band: a.band,
    threatType: a.threatType,
    threatLabel: a.threatLabel,
    ageBand: opts.ageBand ?? "13–15",
    language: opts.language,
    languageLabel: a.languageLabel,
    status: a.band === "critical" || a.band === "high" ? "human_review" : "monitoring",
    lastActivity: new Date().toISOString(),
    summary: a.summary,
    recommendation: a.recommendation,
    why: a.why,
    behaviours: a.behaviours,
    chain: a.chain,
    sessions: a.sessions,
    crossPatterns: a.crossPatterns,
    indicators: a.indicators,
    timeline: a.timeline,
    trajectory: a.trajectory,
    messages: a.messages,
    evidence: a.messages.filter((m) => m.speaker === "other").map((m) => m.text),
    graph: graphFor(a.risk),
    audit: [
      {
        id: `${opts.id}-0`,
        at: new Date().toISOString(),
        action: "Evidence uploaded",
        actor: "system",
      },
      {
        id: `${opts.id}-1`,
        at: new Date().toISOString(),
        action:
          a.analysisMode === "live"
            ? "LLM analysis requested"
            : a.analysisMode === "fallback"
              ? "Demo fallback — AI service unavailable"
              : "Prototype analysis generated — human review required",
        actor: "system",
      },
      {
        id: `${opts.id}-2`,
        at: new Date().toISOString(),
        action: `Risk engine calculated ${a.risk}`,
        actor: "risk-engine",
      },
    ],
    privacy: a.privacy,
    detectedLanguage: a.languageLabel,
    normalizedMeaning: a.normalizedMeaning,
    region: opts.region ?? "MH",
    source: opts.source,
    analysisMode: a.analysisMode ?? (opts.source === "seed" ? "prototype" : "live"),
    isSynthetic: a.isSynthetic ?? opts.source !== "analysis",
    modelName: a.modelName,
    modelConfidence: a.modelConfidence,
    briefing: a.briefing,
    uncertainty: a.uncertainty,
  };
}
