import { Check, Minus } from "lucide-react";
import type { ConversationSession, CrossPattern } from "@/lib/demo/types";
import { SimMark } from "./sim-mark";
import { cn } from "@/lib/utils";

export function CrossConversation({
  sessions,
  patterns,
  caseRisk,
  revealUpTo,
}: {
  sessions: ConversationSession[];
  patterns: CrossPattern[];
  caseRisk: number;
  revealUpTo?: number;
}) {
  const visible = sessions.slice(0, revealUpTo ?? sessions.length);
  const last = visible[visible.length - 1];
  const single = last?.singleMessageRisk ?? sessions[0]?.singleMessageRisk ?? 0;

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Cross-conversation analysis</p>
          <h3 className="mt-1 font-display text-xl font-medium tracking-tight">
            Pattern accumulation detected
          </h3>
          <p className="mt-1 max-w-xl text-sm text-ink-soft">
            Single message risk is not the same as total case risk. The score rises as sessions accumulate.
          </p>
        </div>
        <SimMark>Synthetic sessions</SimMark>
      </div>

      <ol className="mt-5 space-y-0">
        {sessions.map((s, i) => {
          const shown = i < visible.length;
          return (
            <li key={s.label} className="relative flex gap-4 pb-5 last:pb-0">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full font-mono text-xs",
                    shown ? "bg-ink text-paper" : "border border-border bg-paper text-muted",
                  )}
                >
                  {s.index}
                </span>
                {i < sessions.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
              </div>
              <div
                className={cn(
                  "min-w-0 flex-1 rounded-xl border px-4 py-3",
                  shown ? "border-border bg-paper sn-rise" : "border-dashed border-border opacity-40",
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    {s.label} · {s.day}
                  </p>
                  <p className="font-mono text-[11px] tabular-nums text-muted">
                    Single-message risk {shown ? s.singleMessageRisk : "—"}
                  </p>
                </div>
                <p className="mt-1 text-sm text-ink">{shown ? s.text : "Waiting for next session…"}</p>
                {shown && s.gloss && <p className="mt-1 text-xs text-muted">{s.gloss}</p>}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-paper px-4 py-3">
          <p className="text-[11px] uppercase tracking-wide text-muted">Single message risk</p>
          <p className="mt-1 font-display text-3xl tabular-nums">{single}</p>
        </div>
        <div className="rounded-xl bg-ink px-4 py-3 text-paper">
          <p className="text-[11px] uppercase tracking-wide text-paper/60">Total case risk</p>
          <p className="mt-1 font-display text-3xl tabular-nums">{caseRisk}</p>
          <p className="mt-1 text-xs text-paper/70">Single message risk ≠ total case risk</p>
        </div>
      </div>

      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {patterns.map((p) => (
          <li
            key={p.id}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
              p.present ? "bg-teal-mist/70 text-teal-deep" : "bg-paper text-muted",
            )}
          >
            {p.present ? <Check className="size-4 shrink-0" /> : <Minus className="size-4 shrink-0" />}
            <span>{p.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
