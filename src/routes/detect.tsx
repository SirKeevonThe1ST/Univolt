import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChildChrome } from "@/components/child-chrome";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/risk-badge";
import { SYNTHETIC_THREADS } from "@/lib/synthetic/conversations";
import { scoreThread } from "@/lib/pipeline/scoring";
import { analyseProgression } from "@/lib/pipeline/progression";
import { nlpProvider } from "@/lib/nlp/provider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/detect")({ component: Detect });

function Detect() {
  const [key, setKey] = useState(SYNTHETIC_THREADS[0].key);
  const thread = SYNTHETIC_THREADS.find((t) => t.key === key) ?? SYNTHETIC_THREADS[0];
  const scored = useMemo(() => scoreThread(thread.turns), [thread]);
  const prog = useMemo(() => analyseProgression(thread.turns), [thread]);
  const lang = nlpProvider.detect_language(thread.turns.map((t) => t.text).join(" "));

  return (
    <ChildChrome>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-teal">Labeled synthetic set only</p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">How detection works</h1>
        <p className="mt-3 max-w-2xl text-ink-soft leading-relaxed">
          Click a prepared example. The engine classifies language, extracts behavioural flags,
          advances a stage machine, and scores 0–100. No live predatory dialogue is generated.
          AI never decides an intervention.
        </p>
        <Button className="mt-4" asChild>
          <Link to="/intelligence">Open the full Safety Intelligence demo</Link>
        </Button>

        <div className="mt-6 flex flex-wrap gap-2">
          {SYNTHETIC_THREADS.map((t) => (
            <Button
              key={t.key}
              type="button"
              size="sm"
              variant={t.key === key ? "default" : "outline"}
              onClick={() => setKey(t.key)}
            >
              {t.title}
            </Button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-wide text-muted">Redacted thread</p>
            <ol className="mt-3 space-y-3">
              {thread.turns.map((turn, i) => (
                <li key={i} className="text-sm leading-relaxed">
                  <span className="font-medium text-teal-deep">{turn.speaker}</span>
                  <span className="text-ink-soft"> — {turn.text}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-muted">SYNTHETIC · labeled for tests · not a real child</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <RiskBadge band={scored.band} />
              <Badge>{scored.score}/100</Badge>
              <Badge tone="teal">{lang}</Badge>
              <Badge>{prog.stage.replace(/_/g, " ")}</Badge>
            </div>
            <p className="text-sm text-ink-soft">
              Classifier: {scored.classification.label.replace(/_/g, " ")} (
              {Math.round(scored.classification.confidence * 100)}%)
            </p>
            <ul className="space-y-1 text-sm">
              {scored.factors.map((f) => (
                <li key={f.key} className="flex justify-between gap-3">
                  <span className="text-ink-soft">{f.label}</span>
                  <span className="tabular-nums">{f.points}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1 pt-2">
              {scored.flags.hits.map((h) => (
                <Badge key={h.flag + h.label} tone="warn">
                  {h.flag.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted">AI-generated explanation. A human still decides.</p>
          </div>
        </div>

        <ol className="mt-8 grid gap-2 text-sm text-ink-soft sm:grid-cols-4">
          {["contact", "trust building", "isolation", "exploitation attempt"].map((s, i) => (
            <li
              key={s}
              className={cn(
                "rounded-xl border px-3 py-3",
                prog.stage.replace(/_/g, " ") === s ||
                  (prog.stage === "trust_building" && s === "trust building") ||
                  (prog.stage === "exploitation_attempt" && s === "exploitation attempt")
                  ? "border-teal bg-teal-mist text-teal-deep"
                  : "border-border bg-surface",
              )}
            >
              <span className="block text-xs text-muted">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>
    </ChildChrome>
  );
}
