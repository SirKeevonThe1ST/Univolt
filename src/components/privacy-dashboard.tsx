import type { PrivacyMetrics } from "@/lib/demo/types";
import { SimMark } from "./sim-mark";

export function PrivacyDashboard({ metrics }: { metrics: PrivacyMetrics }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Privacy-preserving analysis</p>
          <h3 className="mt-1 font-display text-xl font-medium tracking-tight">Identity stays sealed</h3>
          <p className="mt-1 max-w-xl text-sm text-ink-soft">
            The system minimises unnecessary exposure of child identity. Analysis runs on redacted text.
          </p>
        </div>
        <SimMark>Privacy demonstration</SimMark>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <figure className="rounded-xl bg-paper px-4 py-4">
          <figcaption className="text-[11px] uppercase tracking-wide text-muted">Example input</figcaption>
          <p className="mt-2 text-sm leading-relaxed text-ink">{metrics.originalSample}</p>
        </figure>
        <figure className="rounded-xl border border-teal/30 bg-teal-mist/40 px-4 py-4">
          <figcaption className="text-[11px] uppercase tracking-wide text-teal-deep">After redaction</figcaption>
          <p className="mt-2 text-sm leading-relaxed text-teal-deep">{metrics.redactedSample}</p>
        </figure>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Metric label="PII detected" value={String(metrics.piiDetected)} />
        <Metric label="PII redacted" value={String(metrics.redacted)} />
        <Metric label="Identity exposure" value={metrics.identityExposed ? "Yes" : "No"} />
        <Metric label="Autonomous escalation" value="Disabled" />
        <Metric label="Human approval" value="Required" />
      </dl>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-paper px-3 py-3">
      <dt className="text-[11px] uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 font-display text-xl font-medium tabular-nums">{value}</dd>
    </div>
  );
}
