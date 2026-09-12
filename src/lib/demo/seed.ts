import { analyseScenario } from "./analysis";
import { caseFromAnalysis, DEMO_CASE_ID, DEMO_CASE_PUBLIC_ID } from "./case-factory";
import type { AuditEntry, DemoCase, DemoRole } from "./types";

function stamp(offsetMin: number): string {
  const d = new Date(Date.now() - offsetMin * 60_000);
  return d.toISOString();
}

function audit(publicId: string, offset: number): AuditEntry[] {
  const t0 = Date.now() - offset * 60_000;
  const row = (min: number, action: string, actor = "system"): AuditEntry => ({
    id: `${publicId}-${min}`,
    at: new Date(t0 + min * 1000).toISOString(),
    action,
    actor,
  });
  return [
    row(0, "Case created"),
    row(2, "AI analysis generated — human review required"),
    row(6, "Risk trajectory updated: 67 → 87"),
    row(21, "Queued for human review"),
  ];
}

function fromScenario(
  publicId: string,
  id: string,
  kind: Parameters<typeof analyseScenario>[0],
  lang: Parameters<typeof analyseScenario>[1],
  severity: Parameters<typeof analyseScenario>[2],
  status: DemoCase["status"],
  ageBand: string,
  region: string,
  minsAgo: number,
  source: DemoCase["source"] = "seed",
): DemoCase {
  const a = analyseScenario(kind, lang, severity);
  const created = caseFromAnalysis(a, {
    id,
    publicId,
    language: lang,
    source,
    ageBand,
    region,
  });
  created.status = status;
  created.lastActivity = stamp(minsAgo);
  created.audit = audit(publicId, minsAgo);
  return created;
}

export function seedCases(): DemoCase[] {
  return [
    fromScenario(DEMO_CASE_PUBLIC_ID, DEMO_CASE_ID, "grooming", "hi-Latn", "critical", "human_review", "13–15", "MH", 18),
    fromScenario("SRK-1991", "demo-srk-1991", "cyberbullying", "en", "high", "support", "11–13", "DL", 42),
    fromScenario("SRK-1877", "demo-srk-1877", "blackmail", "ta", "critical", "human_review", "14–16", "TN", 55),
    fromScenario("SRK-1760", "demo-srk-1760", "suspicious", "mr", "medium", "monitoring", "10–12", "MH", 90),
    fromScenario("SRK-1652", "demo-srk-1652", "grooming", "hi", "high", "counsellor", "13–15", "UP", 140),
    fromScenario("SRK-1544", "demo-srk-1544", "cyberbullying", "en", "low", "closed", "12–14", "KA", 400),
  ];
}

export const ROLE_ACTIONS: Record<DemoRole, string[]> = {
  responder: ["confirm_risk", "request_info", "escalate_review"],
  counsellor: ["support_path", "assign_counsellor", "request_info"],
  supervisor: ["confirm_risk", "assign_counsellor", "escalate_review", "close"],
};
