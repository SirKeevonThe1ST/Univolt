import { cn } from "@/lib/utils";
import type { AnalysisMode } from "@/lib/demo/types";

export function AnalysisModeMark({
  mode,
  isSynthetic,
  className,
}: {
  mode?: AnalysisMode | null;
  isSynthetic?: boolean;
  className?: string;
}) {
  if (mode === "live") {
    return (
      <span className={cn("inline-flex flex-wrap items-center gap-1.5", className)}>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-mist px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-teal-deep">
          <span className="size-1.5 rounded-full bg-ok" />
          Live LLM analysis
        </span>
        {isSynthetic && (
          <span className="inline-flex items-center rounded-full border border-border bg-paper px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted">
            Synthetic demo · not a real child
          </span>
        )}
      </span>
    );
  }
  if (mode === "fallback") {
    return (
      <span className={cn("inline-flex items-center rounded-full bg-[#f3e6c8] px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-warn", className)}>
        Demo fallback — AI service unavailable
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center rounded-full border border-border bg-paper px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted", className)}>
      Prototype
    </span>
  );
}
