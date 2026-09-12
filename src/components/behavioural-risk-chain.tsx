import { AlertTriangle, Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChainStage, ChainStatus } from "@/lib/demo/types";
import { SimMark } from "./sim-mark";

const STATUS_COPY: Record<ChainStatus, string> = {
  detected: "Detected",
  emerging: "Emerging",
  not_detected: "Not detected",
};

function StatusGlyph({ status }: { status: ChainStatus }) {
  if (status === "detected") {
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-teal text-surface">
        <Check className="size-4" strokeWidth={2.4} />
      </span>
    );
  }
  if (status === "emerging") {
    return (
      <span className="flex size-8 items-center justify-center rounded-full bg-warn text-surface">
        <AlertTriangle className="size-4" />
      </span>
    );
  }
  return (
    <span className="flex size-8 items-center justify-center rounded-full border border-border bg-paper text-muted">
      <Circle className="size-3.5" />
    </span>
  );
}

export function BehaviouralRiskChain({
  stages,
  revealUpTo,
  compact,
}: {
  stages: ChainStage[];
  /** How many stages to show as evaluated. Remaining appear idle. */
  revealUpTo?: number;
  compact?: boolean;
}) {
  const limit = revealUpTo ?? stages.length;
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Behavioural Risk Chain</p>
          <h3 className="mt-1 font-display text-xl font-medium tracking-tight">
            Behavioural progression detected
          </h3>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-soft">
            The system evaluates patterns across interactions rather than relying only on individual words.
          </p>
        </div>
        <SimMark>Simulated pattern</SimMark>
      </div>

      <ol className={cn("mt-6", compact ? "grid gap-2 sm:grid-cols-2" : "space-y-0")}>
        {stages.map((stage, i) => {
          const revealed = i < limit;
          const status: ChainStatus = revealed ? stage.status : "not_detected";
          const isLast = i === stages.length - 1;
          return (
            <li
              key={stage.id}
              className="sn-rise relative flex gap-3"
              style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}
            >
              {!compact && (
                <div className="flex flex-col items-center">
                  <StatusGlyph status={status} />
                  {!isLast && (
                    <span
                      className={cn(
                        "mt-1 w-px flex-1 min-h-6",
                        revealed && status !== "not_detected" ? "bg-teal/50" : "bg-border",
                      )}
                    />
                  )}
                </div>
              )}
              <div
                className={cn(
                  "mb-2 min-w-0 flex-1 rounded-xl border px-3 py-2.5",
                  !revealed && "opacity-40",
                  status === "detected" && "border-teal/40 bg-teal-mist/60",
                  status === "emerging" && "border-warn/30 bg-[#f3e6c8]/50",
                  status === "not_detected" && "border-border bg-paper",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {compact && <StatusGlyph status={status} />}
                    <p className="font-medium text-ink">{stage.label}</p>
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-medium uppercase tracking-wide",
                      status === "detected" && "text-teal-deep",
                      status === "emerging" && "text-warn",
                      status === "not_detected" && "text-muted",
                    )}
                  >
                    {revealed ? STATUS_COPY[status] : "Pending"}
                  </span>
                </div>
                {revealed && !compact && (
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">{stage.evidence}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
