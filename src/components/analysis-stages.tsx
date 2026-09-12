import { cn } from "@/lib/utils";
import type { AnalysisStage } from "@/lib/demo/types";

const STAGES: { id: AnalysisStage; label: string }[] = [
  { id: "message", label: "Message analysis" },
  { id: "behaviour", label: "Behaviour detection" },
  { id: "accumulation", label: "Risk accumulation" },
  { id: "assessment", label: "Safety assessment" },
];

export function AnalysisStages({ stage }: { stage: AnalysisStage }) {
  const idx = STAGES.findIndex((s) => s.id === stage);
  const done = stage === "done";
  return (
    <ol className="grid gap-2 sm:grid-cols-4">
      {STAGES.map((s, i) => {
        const active = done || i <= idx;
        return (
          <li
            key={s.id}
            className={cn(
              "rounded-xl border px-3 py-3 text-sm",
              active ? "border-teal bg-teal-mist text-teal-deep" : "border-border bg-surface text-muted",
            )}
          >
            <span className="block font-mono text-[11px] tabular-nums opacity-70">0{i + 1}</span>
            {s.label}
          </li>
        );
      })}
    </ol>
  );
}
