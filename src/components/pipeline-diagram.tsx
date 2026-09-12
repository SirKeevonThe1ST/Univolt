import { ArrowDown } from "lucide-react";

const STEPS = [
  "User evidence",
  "OCR / speech-to-text",
  "LLM",
  "Structured safety signals",
  "Deterministic risk engine",
  "Explainable result",
  "Human review",
];

export function PipelineDiagram({ compact }: { compact?: boolean }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Technical path</p>
      <h3 className="mt-1 font-display text-lg">{compact ? "How analysis runs" : "AI-assisted, human-controlled"}</h3>
      <ol className="mt-4 flex flex-col gap-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span className="rounded-lg border border-border bg-paper px-3 py-2 text-xs font-medium">{s}</span>
            {i < STEPS.length - 1 && <ArrowDown className="size-3.5 shrink-0 text-muted sm:-rotate-90" />}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-muted">The model extracts signals. Application logic scores risk. A person decides.</p>
    </section>
  );
}
