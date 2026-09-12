import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Play, X } from "lucide-react";
import { Button } from "./ui/button";
import { useDemoStore, DEMO_CASE_ID, DEMO_CASE_PUBLIC_ID } from "@/lib/demo/store";
import { analyseScenario } from "@/lib/demo/analysis";
import { SimMark } from "./sim-mark";
import { AnalysisModeMark } from "./analysis-mode-mark";
import { BehaviouralRiskChain } from "./behavioural-risk-chain";
import { RiskTrajectory } from "./risk-trajectory";
import { ExplainableAi } from "./explainable-ai";
import { CrossConversation } from "./cross-conversation";
import { SafetyIntelligence } from "./safety-intelligence";
import { PrivacyDashboard } from "./privacy-dashboard";
import { LanguageAnalysis } from "./language-analysis";
import { caseFromAnalysis } from "@/lib/demo/case-factory";
import { analyzeEvidence } from "@/lib/server/ai";
import { cn } from "@/lib/utils";

const PHASES = ["DETECT", "ANALYZE", "UNDERSTAND", "PROTECT", "HUMAN REVIEW", "INTERVENE"] as const;

type Phase = (typeof PHASES)[number];

const BEATS: { phase: Phase; ms: number; title: string; kicker: string }[] = [
  { phase: "DETECT", ms: 6500, title: "A fictional child receives suspicious messages.", kicker: "Step 1 · Synthetic thread" },
  { phase: "DETECT", ms: 7000, title: "The same account returns across five sessions.", kicker: "Step 2 · Cross-conversation" },
  { phase: "ANALYZE", ms: 6000, title: "The live model begins analysing the conversation.", kicker: "Step 3 · Live LLM" },
  { phase: "ANALYZE", ms: 7500, title: "Behaviour indicators appear one by one.", kicker: "Step 4 · Not just keywords" },
  { phase: "ANALYZE", ms: 7000, title: "Risk increases over multiple interactions.", kicker: "Step 5 · Accumulating score" },
  { phase: "UNDERSTAND", ms: 7500, title: "The Behavioural Risk Chain updates.", kicker: "Step 6 · Attack-chain" },
  { phase: "UNDERSTAND", ms: 7500, title: "The Risk Trajectory graph rises.", kicker: "Step 7 · Early warning" },
  { phase: "UNDERSTAND", ms: 7000, title: "Explainable AI shows why the system is concerned.", kicker: "Step 8 · Human-readable" },
  { phase: "PROTECT", ms: 6000, title: "A prioritised case is created for human review.", kicker: "Step 9 · Case file" },
  { phase: "HUMAN REVIEW", ms: 6000, title: "The responder console receives the case.", kicker: "Step 10 · Queue" },
  { phase: "HUMAN REVIEW", ms: 6500, title: "The responder opens the case.", kicker: "Step 11 · Desk" },
  { phase: "HUMAN REVIEW", ms: 7000, title: "Evidence and the AI explanation are reviewed.", kicker: "Step 12 · Sealed identity" },
  { phase: "INTERVENE", ms: 8000, title: "The responder selects a recommended intervention.", kicker: "Step 13 · Human decision" },
  { phase: "INTERVENE", ms: 6500, title: "The decision is recorded in the audit trail.", kicker: "Step 14 · Accountability" },
];

export function SimulationLauncher({ className }: { className?: string }) {
  const start = useDemoStore((s) => s.startSim);
  return (
    <Button className={className} variant="invert" onClick={() => start()}>
      <Play className="size-4" />
      Run safety simulation
    </Button>
  );
}

function finishSimulation() {
  const store = useDemoStore.getState();
  const result = store.analysis ?? analyseScenario("grooming", "hi-Latn", "critical");
  store.applyLiveAnalysis(result);
  const created = store.createCaseFromAnalysis("simulation");
  store.addAudit(created.id, "Simulation: case opened for human review", "system");
  store.addAudit(created.id, "Responder reviewed evidence and AI explanation", "responder");
  store.updateCase(created.id, { status: "counsellor" });
  store.addAudit(created.id, "Human confirmed: assign counsellor. Autonomous action disabled.", "responder");
}

export function SimulationOverlay() {
  const sim = useDemoStore((s) => s.sim);
  const start = useDemoStore((s) => s.startSim);
  const setStep = useDemoStore((s) => s.setSimStep);
  const end = useDemoStore((s) => s.endSim);
  const reset = useDemoStore((s) => s.resetSim);
  const create = useDemoStore((s) => s.createCaseFromAnalysis);
  const addAudit = useDemoStore((s) => s.addAudit);
  const updateCase = useDemoStore((s) => s.updateCase);
  const applyLive = useDemoStore((s) => s.applyLiveAnalysis);
  const live = useDemoStore((s) => s.analysis);
  const kpis = useDemoStore((s) => s.cases);
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);

  const canned = useMemo(() => {
    const r = analyseScenario("grooming", "hi-Latn", "critical");
    r.isSynthetic = true;
    return r;
  }, []);
  const result = live?.messages?.length ? live : canned;

  useEffect(() => {
    if (sim.phase !== "running" || sim.step !== 0) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await analyzeEvidence({
          data: { messages: canned.messages, isSynthetic: true },
        });
        if (cancelled) return;
        if (res.ok) applyLive(res.result);
      } catch {
        /* keep canned, labelled later */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sim.phase, sim.step, applyLive, canned.messages]);

  useEffect(() => {
    if (sim.phase !== "running") return;
    const beat = BEATS[sim.step];
    if (!beat) {
      end();
      return;
    }
    const t = window.setTimeout(() => {
      const next = sim.step + 1;
      if (next >= BEATS.length) end();
      else setStep(next, BEATS[next].phase);
    }, beat.ms);
    return () => window.clearTimeout(t);
  }, [sim.phase, sim.step, end, setStep]);

  useEffect(() => {
    if (sim.phase !== "running") return;
    if (sim.step === 8) {
      applyLive(result);
      const created = create("simulation");
      addAudit(created.id, "Simulation: case opened for human review", "system");
    }
    if (sim.step === 12) setConfirmed(false);
    if (sim.step === 13) {
      updateCase(DEMO_CASE_ID, { status: "counsellor" });
      addAudit(DEMO_CASE_ID, "Human confirmed: assign counsellor. Autonomous action disabled.", "responder");
    }
  }, [sim.phase, sim.step, addAudit, create, applyLive, result, updateCase]);

  if (sim.phase === "idle") return null;

  const beat = BEATS[Math.min(sim.step, BEATS.length - 1)];
  const phaseIdx = PHASES.indexOf(beat?.phase ?? "DETECT");
  const demoCase = caseFromAnalysis(result, {
    id: DEMO_CASE_ID,
    publicId: DEMO_CASE_PUBLIC_ID,
    language: "hi-Latn",
    source: "simulation",
  });

  function skip() {
    finishSimulation();
    end();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper text-ink">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <p className="font-display text-lg">Safety simulation</p>
        <SimMark>Synthetic demo · not a real child</SimMark>
        <AnalysisModeMark mode={result.analysisMode} isSynthetic />
        <div className="ml-auto flex items-center gap-2">
          {sim.phase === "running" && (
            <Button size="sm" variant="ghost" onClick={skip}>
              Skip to end
            </Button>
          )}
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg hover:bg-paper-2"
            onClick={() => reset()}
            aria-label="Close simulation"
          >
            <X className="size-4" />
          </button>
        </div>
      </header>

      <div className="flex gap-1 overflow-x-auto px-4 py-3">
        {PHASES.map((p, i) => (
          <div key={p} className="min-w-[4.5rem] flex-1">
            <div className={cn("h-1 rounded-full", i <= phaseIdx ? "bg-teal" : "bg-paper-2")} />
            <p className={cn("mt-1 text-[10px] uppercase tracking-wide", i <= phaseIdx ? "text-teal-deep" : "text-muted")}>
              {p}
            </p>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {sim.phase === "done" ? (
          <div className="mx-auto max-w-lg py-10 text-center">
            <p className="text-sm font-medium text-teal">Safety loop completed.</p>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight">
              Detected, explained, protected, reviewed.
            </h2>
            <ul className="mt-6 space-y-2 text-left text-sm text-ink-soft">
              <li className="rounded-xl border border-border bg-surface px-4 py-3">AI detected the pattern.</li>
              <li className="rounded-xl border border-border bg-surface px-4 py-3">AI explained the pattern.</li>
              <li className="rounded-xl border border-border bg-surface px-4 py-3">Human reviewed the evidence.</li>
              <li className="rounded-xl border border-ink bg-ink px-4 py-3 text-paper">
                Human decided the intervention.
              </li>
            </ul>
            <p className="mt-5 text-sm text-ink-soft">
              A counsellor was assigned. The model did not contact authorities. The audit trail recorded the decision.
            </p>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button
                onClick={() => {
                  reset();
                  void navigate({ to: "/console/cases/$caseId", params: { caseId: DEMO_CASE_ID } });
                }}
              >
                Open {DEMO_CASE_PUBLIC_ID}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  reset();
                  void navigate({ to: "/console" });
                }}
              >
                Response center
              </Button>
              <Button variant="ghost" onClick={() => start()}>
                Run again
              </Button>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-5xl">
            <p className="text-sm font-medium text-teal">{beat.kicker}</p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">{beat.title}</h2>
            <div className="mt-6">
              <BeatView
                step={sim.step}
                result={result}
                demoCase={demoCase}
                caseCount={kpis.length}
                confirmed={confirmed}
                onConfirm={() => {
                  setConfirmed(true);
                  updateCase(DEMO_CASE_ID, { status: "counsellor" });
                  addAudit(DEMO_CASE_ID, "Human confirmed: assign counsellor", "responder");
                  const next = sim.step + 1;
                  if (next >= BEATS.length) end();
                  else setStep(next, BEATS[next].phase);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BeatView({
  step,
  result,
  demoCase,
  caseCount,
  confirmed,
  onConfirm,
}: {
  step: number;
  result: ReturnType<typeof analyseScenario>;
  demoCase: ReturnType<typeof caseFromAnalysis>;
  caseCount: number;
  confirmed: boolean;
  onConfirm: () => void;
}) {
  const sessions = result.sessions;
  if (step === 0) {
    return (
      <div className="mx-auto max-w-sm rounded-xl border border-border bg-surface p-4">
        <p className="text-xs uppercase tracking-wide text-muted">Synthetic thread · Hinglish</p>
        <ul className="mt-3 space-y-2">
          {result.messages.slice(0, 3).map((m) => (
            <li
              key={m.text}
              className={cn(
                "rounded-2xl px-3 py-2 text-sm",
                m.speaker === "other" ? "rounded-tl-md bg-paper-2" : "ml-6 rounded-tr-md bg-teal-mist text-teal-deep",
              )}
            >
              {m.text}
              {m.gloss && <span className="mt-1 block text-[11px] text-muted">{m.gloss}</span>}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (step === 1) {
    return <CrossConversation sessions={sessions} patterns={result.crossPatterns} caseRisk={result.risk} revealUpTo={3} />;
  }
  if (step === 2) {
    return (
      <ol className="grid gap-2 sm:grid-cols-2">
        {["Message analysis", "Behaviour detection", "Risk accumulation", "Safety assessment"].map((s, i) => (
          <li
            key={s}
            className="sn-rise rounded-xl border border-teal bg-teal-mist px-4 py-3 text-sm text-teal-deep"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <span className="block font-mono text-[11px] opacity-70">0{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
    );
  }
  if (step === 3) {
    return <BehaviouralRiskChain stages={result.chain} revealUpTo={4} compact />;
  }
  if (step === 4) {
    return (
      <RiskTrajectory
        points={result.timeline}
        current={result.risk}
        projected={result.projectedRisk}
        band={result.band}
        direction={result.trajectory}
        revealUpTo={3}
      />
    );
  }
  if (step === 5) {
    return <BehaviouralRiskChain stages={result.chain} />;
  }
  if (step === 6) {
    return (
      <RiskTrajectory
        points={result.timeline}
        current={result.risk}
        projected={result.projectedRisk}
        band={result.band}
        direction={result.trajectory}
      />
    );
  }
  if (step === 7) {
    return <ExplainableAi result={result} indicators={result.indicators} />;
  }
  if (step === 8) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <p className="font-mono text-sm text-muted">{DEMO_CASE_PUBLIC_ID}</p>
        <p className="mt-2 font-display text-3xl">Queued for human review</p>
        <p className="mt-2 text-sm text-ink-soft">
          Risk {result.risk} / 100 · {result.band} · {result.threatLabel} · {result.languageLabel} · age band 13–15
        </p>
        <p className="mt-3 text-xs text-muted">Identity sealed. Evidence redacted. No autonomous contact.</p>
      </div>
    );
  }
  if (step === 9) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[
          ["Critical cases", String(Math.max(1, caseCount > 0 ? 2 : 1))],
          ["High risk", "2"],
          ["Pending review", "2"],
          ["Active support", "2"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-border bg-surface px-4 py-4">
            <p className="text-xs text-muted">{k}</p>
            <p className="font-display text-3xl tabular-nums">{v}</p>
          </div>
        ))}
        <p className="col-span-2 text-sm text-ink-soft">
          {DEMO_CASE_PUBLIC_ID} is now at the top of the responder queue.
        </p>
      </div>
    );
  }
  if (step === 10) {
    return <SafetyIntelligence demoCase={demoCase} />;
  }
  if (step === 11) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <LanguageAnalysis result={result} />
        <PrivacyDashboard metrics={result.privacy} />
      </div>
    );
  }
  if (step === 12) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-border bg-surface p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Recommended next step</p>
        <p className="mt-2 font-display text-2xl">{result.recommendation}</p>
        <p className="mt-3 text-sm text-ink-soft">
          Confirm human escalation? The model will not contact police, parents, or external organisations.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" size="sm" disabled>
            Cancel
          </Button>
          <Button size="sm" onClick={onConfirm} disabled={confirmed}>
            {confirmed ? "Confirmed" : "Confirm"}
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted">Human confirmation required. Autonomous action disabled.</p>
      </div>
    );
  }
  return (
    <ol className="space-y-2 font-mono text-sm">
      <li>Evidence uploaded · {DEMO_CASE_PUBLIC_ID}</li>
      <li>LLM analysis requested</li>
      <li>Risk engine calculated {result.risk}</li>
      <li>Responder opened case</li>
      <li>Human review confirmed · counsellor assigned</li>
    </ol>
  );
}
