import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/console/architecture")({
  component: Architecture,
});

function Architecture() {
  return (
    <article className="max-w-3xl space-y-6">
      <h1 className="font-display text-3xl font-medium tracking-tight">Architecture</h1>
      <p className="text-sm leading-relaxed text-ink-soft">
        Production topology is ingestion → scoring → case generation → prioritisation →
        assignment → human action → resolution. The live app runs this loop in one service
        with a swappable NLPProvider. A Python microservice and Redis bus are documented as
        the split deployment; they are not required for this preview.
      </p>
      <pre className="overflow-x-auto rounded-xl border border-border bg-ink p-4 text-xs leading-relaxed text-paper">
{`flowchart LR
  subgraph Ingest
    A[Anonymous report] --> B[Code-mixed preprocess]
    C[Thread ingest] --> B
  end
  B --> D[NLPProvider]
  D --> E[Flags + classify]
  E --> F[Stage machine]
  F --> G[Risk score 0-100]
  G --> H[Priority P1-P4]
  H --> I[AI safety case]
  I --> J[Responder queue]
  J --> K{Human confirm}
  K -->|yes| L[Assign / escalate / close]
  K -->|no| J
  L --> M[Audit + event log]
  M --> N[Simulated POCSO export]`}
      </pre>
      <section className="space-y-2 text-sm text-ink-soft">
        <h2 className="font-display text-xl text-ink">OpenAPI-style routes</h2>
        <ul className="space-y-1 font-mono text-xs">
          <li>POST /report — anonymous tip (no auth)</li>
          <li>GET /console — priority queue (staff)</li>
          <li>GET /console/cases/:id — case + explainability</li>
          <li>POST transitionCase — status machine, confirm on escalate/close</li>
          <li>POST revealIdentity — unseal callback number</li>
          <li>GET exportSafetyPack — simulated e-evidence JSON</li>
          <li>GET analytics / audit / scoring_config</li>
        </ul>
      </section>
      <p className="text-xs text-muted">
        All agency webhooks, KMS, and e-evidence hashing are labeled SIMULATED.
      </p>
    </article>
  );
}
