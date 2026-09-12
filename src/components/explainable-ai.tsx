import { Check } from "lucide-react";
import type { AnalysisResult, ExplainIndicator, Severity } from "@/lib/demo/types";
import { AnalysisModeMark } from "./analysis-mode-mark";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const SEV_TONE: Record<Severity, "ok" | "warn" | "danger" | "ink"> = {
  low: "ok",
  medium: "warn",
  high: "danger",
  critical: "ink",
};

export function ExplainableAi({
  result,
  indicators,
  revealUpTo,
}: {
  result: Pick<
    AnalysisResult,
    | "why"
    | "escalationNote"
    | "modelStatus"
    | "autonomousAction"
    | "humanReview"
    | "analysisMode"
    | "isSynthetic"
    | "modelConfidence"
    | "uncertainty"
  >;
  indicators: ExplainIndicator[];
  revealUpTo?: number;
}) {
  const shown = indicators.slice(0, revealUpTo ?? indicators.length);
  const confidence = result.modelConfidence;
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Explainable AI</p>
          <h3 className="mt-1 font-display text-xl font-medium tracking-tight">Why was this flagged?</h3>
        </div>
        <AnalysisModeMark mode={result.analysisMode} isSynthetic={result.isSynthetic} />
      </div>
      <p className="mt-2 text-sm text-ink-soft">
        Written for a non-technical responder. These are risk indicators, not findings of guilt.
      </p>

      {typeof confidence === "number" && (
        <p className="mt-3 text-xs text-muted">
          Model confidence {confidence}% — model-reported confidence; not a validated safety probability.
          {confidence < 55 ? " Insufficient evidence for a confident assessment." : ""}
        </p>
      )}

      <ul className="mt-4 space-y-2">
        {(result.why.length ? result.why : ["No high-concern behavioural pattern was accumulated in this sample."]).map(
          (line) => (
            <li key={line} className="flex gap-2 text-sm leading-relaxed text-ink-soft">
              <Check className="mt-0.5 size-4 shrink-0 text-teal" />
              <span>{line}</span>
            </li>
          ),
        )}
      </ul>

      <div className="mt-5 space-y-2">
        {shown.map((ind) => (
          <article key={ind.id} className="sn-rise rounded-xl border border-border bg-paper px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium uppercase tracking-wide text-ink">{ind.label}</p>
              <Badge tone={SEV_TONE[ind.severity]}>{ind.severity}</Badge>
            </div>
            <dl className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
              <div>
                <dt className="text-muted">What was detected</dt>
                <dd className="mt-0.5 text-ink-soft">{ind.label}</dd>
              </div>
              <div>
                <dt className="text-muted">Why it matters</dt>
                <dd className="mt-0.5 text-ink-soft">{ind.whyItMatters || "Behavioural safety signal for human review."}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted">Evidence</dt>
                <dd className="mt-0.5 text-ink-soft">{ind.evidence ? `“${ind.evidence}”` : "Pattern inferred across the thread."}</dd>
              </div>
              <div>
                <dt className="text-muted">Source</dt>
                <dd className="mt-0.5 text-ink-soft">{ind.source}</dd>
              </div>
              <div>
                <dt className="text-muted">Model confidence</dt>
                <dd className="mt-0.5 font-mono tabular-nums">
                  {typeof ind.confidence === "number" ? `${Math.round(ind.confidence * 100)}%` : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Risk contribution</dt>
                <dd className="mt-0.5 font-mono tabular-nums text-teal-deep">+{ind.contribution}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      {result.uncertainty && result.uncertainty.length > 0 && (
        <div className="mt-4 rounded-lg bg-paper px-3 py-2 text-xs text-muted">
          Uncertainty: {result.uncertainty.join(" · ")}
        </div>
      )}

      <dl className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg bg-paper px-2 py-3">
          <dt className="text-muted">Model status</dt>
          <dd className="mt-1 font-medium text-ink">{result.modelStatus}</dd>
        </div>
        <div className="rounded-lg bg-paper px-2 py-3">
          <dt className="text-muted">Autonomous action</dt>
          <dd className="mt-1 font-medium text-ink">Disabled</dd>
        </div>
        <div className="rounded-lg bg-paper px-2 py-3">
          <dt className="text-muted">Human review</dt>
          <dd className="mt-1 font-medium text-danger">Required</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-muted">{result.escalationNote}</p>
    </section>
  );
}

export function IndicatorSeverity({ severity }: { severity: Severity }) {
  return (
    <span
      className={cn(
        "text-[11px] font-medium uppercase tracking-wide",
        severity === "critical" && "text-ink",
        severity === "high" && "text-danger",
        severity === "medium" && "text-warn",
        severity === "low" && "text-ok",
      )}
    >
      {severity}
    </span>
  );
}
