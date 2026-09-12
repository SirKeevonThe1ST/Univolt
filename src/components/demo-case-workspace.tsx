import { ConfirmAction } from "./confirm-action";
import { RiskBadge } from "./risk-badge";
import { Badge } from "./ui/badge";
import { RiskTrajectory } from "./risk-trajectory";
import { ThreatGraph } from "./threat-graph";
import { InterventionEngine } from "./intervention-engine";
import { ExplainableAi } from "./explainable-ai";
import { BehaviouralRiskChain } from "./behavioural-risk-chain";
import { CrossConversation } from "./cross-conversation";
import { SafetyIntelligence } from "./safety-intelligence";
import { PrivacyDashboard } from "./privacy-dashboard";
import { LanguageAnalysis } from "./language-analysis";
import { AnalysisModeMark } from "./analysis-mode-mark";
import { SafetyCopilot } from "./safety-copilot";
import { WhatIfSimulator } from "./what-if-simulator";
import { EvidenceView } from "./evidence-view";
import { useDemoStore } from "@/lib/demo/store";
import { statusLabel, type DemoCase } from "@/lib/demo/types";
import { toast } from "sonner";
import { analyseMessages } from "@/lib/demo/analysis";

export function DemoCaseWorkspace({ c }: { c: DemoCase }) {
  const role = useDemoStore((s) => s.role);
  const update = useDemoStore((s) => s.updateCase);
  const addAudit = useDemoStore((s) => s.addAudit);
  const storeResult = useDemoStore((s) => s.analysis);
  const result =
    storeResult && storeResult.messages === c.messages
      ? storeResult
      : analyseMessages(c.messages, {
          kind: c.threatType,
          severity: c.band,
          lang: c.language,
          curated: c.source !== "analysis",
        });
  const live = {
    ...result,
    analysisMode: c.analysisMode ?? result.analysisMode,
    isSynthetic: c.isSynthetic ?? result.isSynthetic,
    modelConfidence: c.modelConfidence ?? result.modelConfidence,
    uncertainty: c.uncertainty ?? result.uncertainty,
    summary: c.summary,
    recommendation: c.recommendation,
    indicators: c.indicators.length ? c.indicators : result.indicators,
    messages: c.messages,
  };

  function act(action: string, patch?: Partial<DemoCase>) {
    if (patch) update(c.id, patch);
    addAudit(c.id, action, role);
    toast.success(`${action} · recorded in audit`);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-muted">{c.publicId}</p>
          <h1 className="font-display text-3xl font-medium tracking-tight">Case intelligence</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <RiskBadge band={c.band === "medium" ? "med" : c.band} />
            <Badge>{c.risk} / 100</Badge>
            <Badge tone="teal">{c.languageLabel}</Badge>
            <Badge>{c.threatLabel}</Badge>
            <Badge>{c.ageBand}</Badge>
            <Badge>{statusLabel(c.status)}</Badge>
            <AnalysisModeMark mode={c.analysisMode} isSynthetic={c.isSynthetic ?? c.source !== "analysis"} />
          </div>
        </div>
      </header>

      <p className="rounded-xl bg-teal-mist px-4 py-3 text-sm text-teal-deep">
        AI-generated — human review required. The model cannot escalate, unseal, or close this case.
      </p>

      <SafetyIntelligence demoCase={c} />
      <EvidenceView c={c} />

      <section className="rounded-xl border border-border bg-surface p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Recommended next step</p>
        <h2 className="mt-1 font-display text-lg">{c.recommendation}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <ConfirmAction
            role={role}
            label="Review case"
            description="Record that a trained responder has opened and reviewed the evidence. This does not accuse anyone."
            onConfirm={() => act("Case reviewed by human")}
          />
          <ConfirmAction
            role={role}
            label="Assign counsellor"
            description="Open a support pathway. The counsellor still reviews before any contact."
            onConfirm={() => act("Counsellor assigned", { status: "counsellor" })}
          />
          <ConfirmAction
            role={role}
            label="Request more information"
            description="Ask the pipeline for additional context. No message is sent to the child automatically."
            onConfirm={() => act("More information requested")}
          />
          <ConfirmAction
            role={role}
            label="Escalate for human review"
            description="Confirm human escalation? The system will not contact police, parents, or external organisations."
            confirmLabel="Confirm"
            onConfirm={() => act("Escalated for human review", { status: "human_review" })}
          />
          <ConfirmAction
            role={role}
            label="Close case"
            danger
            requiredRole="supervisor"
            description="Closing is irreversible in this prototype. Confirm only if a human has completed the review."
            confirmLabel="Confirm close"
            onConfirm={() => act("Case closed", { status: "closed" })}
          />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <BehaviouralRiskChain stages={c.chain} />
        <CrossConversation
          sessions={c.sessions}
          patterns={c.crossPatterns}
          caseRisk={c.risk}
        />
      </div>

      <RiskTrajectory
        points={c.timeline}
        current={c.risk}
        projected={c.projectedRisk}
        band={c.band}
        direction={c.trajectory}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <ExplainableAi result={live} indicators={c.indicators} />
        <LanguageAnalysis result={live} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SafetyCopilot result={live} />
        <WhatIfSimulator result={live} />
      </div>

      <PrivacyDashboard metrics={c.privacy} />

      <div className="grid gap-4 lg:grid-cols-2">
        <ThreatGraph nodes={c.graph.nodes} edges={c.graph.edges} />
        <InterventionEngine band={c.band} />
      </div>

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg">Audit trail</h2>
        <p className="mt-1 text-xs text-muted">Every human decision is recorded. The model cannot write an intervention.</p>
        <ol className="mt-3 space-y-2 font-mono text-xs text-ink-soft">
          {c.audit.map((a) => (
            <li key={a.id} className="flex flex-wrap gap-3">
              <span className="tabular-nums text-muted">
                {new Date(a.at).toLocaleTimeString()}
              </span>
              <span>{a.action}</span>
              <span className="text-muted">{a.actor}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
