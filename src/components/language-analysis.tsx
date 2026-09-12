import type { AnalysisResult } from "@/lib/demo/types";
import { SimMark } from "./sim-mark";
import { Badge } from "./ui/badge";

export function LanguageAnalysis({ result }: { result: AnalysisResult }) {
  const hits = result.behaviours.filter((b) => b.present).slice(0, 4);
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Multilingual understanding</p>
          <h3 className="mt-1 font-display text-xl font-medium tracking-tight">Code-mixed analysis</h3>
        </div>
        <SimMark>Prototype multilingual understanding</SimMark>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-paper px-4 py-3">
          <dt className="text-[11px] uppercase tracking-wide text-muted">Detected language</dt>
          <dd className="mt-1 font-display text-2xl">{result.languageLabel}</dd>
        </div>
        <div className="rounded-xl bg-paper px-4 py-3">
          <dt className="text-[11px] uppercase tracking-wide text-muted">Risk</dt>
          <dd className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-2xl tabular-nums">{result.risk}</span>
            <Badge tone={result.band === "critical" ? "ink" : result.band === "high" ? "danger" : "warn"}>
              {result.band}
            </Badge>
          </dd>
        </div>
      </dl>

      <div className="mt-4 rounded-xl border border-border bg-paper px-4 py-3">
        <p className="text-[11px] uppercase tracking-wide text-muted">Normalized meaning</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{result.normalizedMeaning}</p>
      </div>

      <div className="mt-4">
        <p className="text-[11px] uppercase tracking-wide text-muted">Safety indicators</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {hits.map((h) => (
            <Badge key={h.id} tone="teal">
              {h.label}
            </Badge>
          ))}
        </ul>
      </div>
    </section>
  );
}
