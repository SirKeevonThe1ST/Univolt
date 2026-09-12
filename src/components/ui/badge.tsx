import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: ComponentProps<"span"> & {
  tone?: "neutral" | "teal" | "ok" | "warn" | "danger" | "ink";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-paper-2 text-ink-soft",
    teal: "bg-teal-mist text-teal-deep",
    ok: "bg-teal-mist text-ok",
    warn: "bg-[#f3e6c8] text-warn",
    danger: "bg-[#f0d9d6] text-danger",
    ink: "bg-ink text-paper",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
