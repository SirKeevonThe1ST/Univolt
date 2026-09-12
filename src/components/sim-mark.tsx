import { cn } from "@/lib/utils";

export function SimMark({
  children = "Simulated · prototype data",
  className,
}: {
  children?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-paper px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function HumanLoopMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-teal-mist px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-teal-deep",
        className,
      )}
    >
      AI-assisted. Human decision required.
    </span>
  );
}
