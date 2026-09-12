import { ArrowDown } from "lucide-react";
import type { PrivacyMetrics } from "@/lib/demo/types";
import { PrivacyDashboard } from "./privacy-dashboard";
import { DEMO_PRIVACY_ORIGINAL, DEMO_PRIVACY_REDACTED } from "@/lib/demo/intelligence";

const STEPS = [
  "Raw input",
  "PII detection",
  "Redaction",
  "Safety analysis",
  "Encrypted / controlled access",
  "Human review",
];

const FALLBACK: PrivacyMetrics = {
  piiDetected: 3,
  redacted: 3,
  identityExposed: false,
  autonomousEscalation: false,
  humanApproval: true,
  originalSample: DEMO_PRIVACY_ORIGINAL,
  redactedSample: DEMO_PRIVACY_REDACTED,
};

export function PrivacyFlow({ metrics, compact }: { metrics?: PrivacyMetrics; compact?: boolean }) {
  const m = metrics ?? FALLBACK;
  if (!compact) return <PrivacyDashboard metrics={m} />;
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Privacy by design</p>
      <h3 className="mt-1 font-display text-xl font-medium">How data moves</h3>
      <ol className="mt-5 flex flex-col items-stretch gap-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span className="rounded-lg border border-border bg-paper px-3 py-2 text-xs font-medium sm:text-sm">
              {s}
            </span>
            {i < STEPS.length - 1 && <ArrowDown className="size-3.5 text-muted sm:-rotate-90" />}
          </li>
        ))}
      </ol>
    </section>
  );
}
