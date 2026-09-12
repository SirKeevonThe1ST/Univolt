import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChildChrome } from "@/components/child-chrome";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HumanLoopMark } from "@/components/sim-mark";
import { AnalysisModeMark } from "@/components/analysis-mode-mark";
import { DemoControls } from "@/components/demo-controls";
import { AnalysisStages } from "@/components/analysis-stages";
import { RiskTrajectory } from "@/components/risk-trajectory";
import { ExplainableAi } from "@/components/explainable-ai";
import { InterventionEngine } from "@/components/intervention-engine";
import { PrivacyDashboard } from "@/components/privacy-dashboard";
import { ResponsibleAi } from "@/components/responsible-ai";
import { BehaviouralRiskChain } from "@/components/behavioural-risk-chain";
import { CrossConversation } from "@/components/cross-conversation";
import { SafetyIntelligence } from "@/components/safety-intelligence";
import { LanguageAnalysis } from "@/components/language-analysis";
import { SimulationLauncher } from "@/components/simulation-overlay";
import { EvidenceComposer, type EvidenceBundle } from "@/components/evidence-composer";
import { PipelineDiagram } from "@/components/pipeline-diagram";
import { SafetyCopilot } from "@/components/safety-copilot";
import { WhatIfSimulator } from "@/components/what-if-simulator";
import type { AnalysisStage } from "@/lib/demo/types";
import { getScenario } from "@/lib/demo/scenarios";
import { useDemoStore } from "@/lib/demo/store";
import { analyzeEvidence } from "@/lib/server/ai";
import { analyseMessages } from "@/lib/demo/analysis";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/intelligence")({ component: Intelligence });

const STAGE_ORDER: AnalysisStage[] = ["message", "behaviour", "accumulation", "assessment", "done"];

function Intelligence() {
  const analysis = useDemoStore((s) => s.analysis);
  const stage = useDemoStore((s) => s.analysisStage);
  const kind = useDemoStore((s) => s.scenarioKind);
  const severity = useDemoStore((s) => s.scenarioSeverity);
  const lang = useDemoStore((s) => s.scenarioLang);
  const setStage = useDemoStore((s) => s.setAnalysisStage);
  const create = useDemoStore((s) => s.createCaseFromAnalysis);
  const applyLive = useDemoStore((s) => s.applyLiveAnalysis);
  const addAudit = useDemoStore((s) => s.addAudit);
  const navigate = useNavigate();
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seed, setSeed] = useState({ text: "", key: 0, synthetic: false });
  const [reveal, setReveal] = useState(0);

  function loadSynthetic() {
    const pack = getScenario(kind, lang, severity);
    const text = pack.messages.map((m) => `${m.speaker.toUpperCase()}: ${m.text}`).join("\n");
    setSeed({ text, key: Date.now(), synthetic: true });
    setStage("idle");
    setError(null);
  }

  async function runBundle(bundle: EvidenceBundle) {
    if (!bundle.messages.length && !bundle.images.length) {
      setError("Paste a conversation or attach evidence first.");
      return;
    }
    setRunning(true);
    setError(null);
    setReveal(0);
    setStage("message");
    const started = Date.now();
    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      const next = STAGE_ORDER[Math.min(i, STAGE_ORDER.length - 1)];
      setStage(next);
      setReveal((n) => n + 1);
      if (next === "assessment") window.clearInterval(tick);
    }, 550);

    try {
      const res = await analyzeEvidence({
        data: {
          messages: bundle.messages,
          images: bundle.images,
          isSynthetic: bundle.isSynthetic || seed.synthetic,
          transcriptionNote: bundle.transcriptionNote,
        },
      });
      window.clearInterval(tick);
      if (!res.ok) {
        const fallback = analyseMessages(bundle.messages, { curated: false });
        fallback.analysisMode = "fallback";
        fallback.confidenceLabel = "Fallback";
        fallback.modelStatus = "Unavailable";
        fallback.isSynthetic = bundle.isSynthetic || seed.synthetic;
        fallback.latencyMs = Date.now() - started;
        applyLive(fallback);
        setStage("done");
        setReveal(99);
        setError(`${res.error} Showing labelled demo fallback — not live AI.`);
        return;
      }
      applyLive(res.result);
      setStage("done");
      setReveal(99);
    } catch (e) {
      window.clearInterval(tick);
      const fallback = analyseMessages(bundle.messages, { curated: false });
      fallback.analysisMode = "fallback";
      fallback.confidenceLabel = "Fallback";
      fallback.modelStatus = "Unavailable";
      applyLive(fallback);
      setStage("done");
      setError(e instanceof Error ? `${e.message} Showing labelled demo fallback — not live AI.` : "AI service unavailable.");
    } finally {
      setRunning(false);
    }
  }

  const result = analysis;
  const done = result && stage === "done";

  return (
    <ChildChrome>
      <div className="space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-teal">Safety intelligence</p>
              <AnalysisModeMark mode={result?.analysisMode} isSynthetic={result?.isSynthetic} />
              <HumanLoopMark />
            </div>
            <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">
              Detect → Understand → Protect
            </h1>
            <p className="mt-3 max-w-2xl text-ink-soft leading-relaxed">
              Paste a conversation or upload screenshots, voice notes, or an exported conversation.
              A live model extracts behavioural signals. A deterministic engine scores risk. A human decides.
            </p>
          </div>
          <SimulationLauncher />
        </header>

        <PipelineDiagram compact />

        <EvidenceComposer
          key={seed.key}
          initialText={seed.text}
          analyzing={running}
          onAnalyze={(b) => void runBundle({ ...b, isSynthetic: b.isSynthetic || seed.synthetic })}
        />

        <details className="rounded-xl border border-dashed border-border bg-paper/80 p-4">
          <summary className="cursor-pointer text-sm font-medium">Load a synthetic demo conversation</summary>
          <p className="mt-2 text-xs text-muted">
            Synthetic demo · not a real child. Analysis still goes through the live model.
          </p>
          <div className="mt-3">
            <DemoControls onGenerate={loadSynthetic} />
            <Button className="mt-3" variant="outline" onClick={loadSynthetic}>
              Load into evidence editor
            </Button>
          </div>
        </details>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-wide text-muted">Evidence preview</p>
            {result?.messages?.length ? (
              <ol className="mt-4 space-y-3">
                {result.messages.map((m, i) => (
                  <li
                    key={`${m.text}-${i}`}
                    className={cn(
                      "max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                      m.speaker === "other"
                        ? "rounded-tl-md bg-paper-2"
                        : "ml-auto rounded-tr-md bg-teal-mist text-teal-deep",
                    )}
                  >
                    <span className="block text-[11px] uppercase tracking-wide opacity-70">
                      {m.sourceLabel ? `[${m.sourceLabel}] ` : ""}
                      {m.speaker}
                    </span>
                    {m.text}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-sm text-muted">Submitted evidence will appear here after analysis.</p>
            )}
          </section>

          <div className="space-y-4">
            <AnalysisStages stage={stage} />
            {error && (
              <p className="rounded-xl border border-warn/30 bg-[#f3e6c8]/60 px-4 py-3 text-sm text-warn">{error}</p>
            )}
            {result && stage !== "idle" ? (
              <div className="rounded-xl border border-border bg-surface p-5">
                <p className="text-xs uppercase tracking-wide text-muted">
                  {result.analysisMode === "live" ? "Risk · deterministic engine" : "Risk · labelled fallback"}
                </p>
                <div className="mt-2 flex items-end gap-3">
                  <p className="font-display text-6xl tabular-nums leading-none">{done ? result.risk : "—"}</p>
                  <p className="pb-1 text-muted">/ 100</p>
                  {done && (
                    <Badge tone={result.band === "critical" ? "ink" : result.band === "high" ? "danger" : result.band === "medium" ? "warn" : "ok"}>
                      {result.band}
                    </Badge>
                  )}
                </div>
                {done && (
                  <>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge tone="teal">{result.languageLabel}</Badge>
                      <Badge>{result.threatLabel}</Badge>
                      {result.modelName && <Badge>{result.modelName}</Badge>}
                      {typeof result.latencyMs === "number" && (
                        <Badge>{(result.latencyMs / 1000).toFixed(1)}s</Badge>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-ink-soft">Detected language: {result.languageLabel}.</p>
                    {typeof result.modelConfidence === "number" && (
                      <p className="mt-1 text-xs text-muted">
                        Model confidence {result.modelConfidence}% — model-reported; not a validated safety probability.
                      </p>
                    )}
                    {result.visionNote && <p className="mt-2 text-xs text-muted">{result.visionNote}</p>}
                  </>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-surface px-5 py-12 text-center text-sm text-muted">
                Run analysis to see the behavioural risk chain, trajectory, and why the system is concerned.
              </div>
            )}
          </div>
        </div>

        {result && stage !== "idle" && (
          <BehaviouralRiskChain
            stages={result.chain}
            revealUpTo={stage === "done" ? result.chain.length : Math.max(1, reveal + 1)}
          />
        )}

        {done && result && (
          <>
            <SafetyIntelligence result={result} />
            <div className="grid gap-6 lg:grid-cols-2">
              <CrossConversation
                sessions={result.sessions}
                patterns={result.crossPatterns}
                caseRisk={result.risk}
              />
              <LanguageAnalysis result={result} />
            </div>
            <RiskTrajectory
              points={result.timeline}
              current={result.risk}
              projected={result.projectedRisk}
              band={result.band}
              direction={result.trajectory}
            />
            <div className="grid gap-6 lg:grid-cols-2">
              <ExplainableAi result={result} indicators={result.indicators} />
              <InterventionEngine band={result.band} />
            </div>
            <PrivacyDashboard metrics={result.privacy} />
            <div className="grid gap-6 lg:grid-cols-2">
              <SafetyCopilot result={result} />
              <WhatIfSimulator result={result} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  const c = create("analysis");
                  addAudit(c.id, "LLM analysis requested", "system");
                  addAudit(c.id, `Risk engine calculated ${result.risk}`, "risk-engine");
                  void navigate({ to: "/console/cases/$caseId", params: { caseId: c.id } });
                }}
              >
                Create responder review case
              </Button>
              <p className="self-center text-xs text-muted">Human review required. Nothing is sent to authorities.</p>
            </div>
          </>
        )}

        <ResponsibleAi />
      </div>
    </ChildChrome>
  );
}
