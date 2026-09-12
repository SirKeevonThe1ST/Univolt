import { createFileRoute } from "@tanstack/react-router";
import { PipelineDiagram } from "@/components/pipeline-diagram";

export const Route = createFileRoute("/console/architecture")({
  component: Architecture,
});

function Architecture() {
  return (
    <article className="max-w-3xl space-y-6">
      <h1 className="font-display text-3xl font-medium tracking-tight">Architecture</h1>
      <p className="text-sm leading-relaxed text-ink-soft">
        User evidence is processed on the server: OCR / speech-to-text, then a live LLM extracts
        behavioural signals as structured JSON. A deterministic risk engine scores those signals.
        A human reviews every consequential action. AI-assisted, human-controlled.
      </p>
      <PipelineDiagram />
      <pre className="overflow-x-auto rounded-xl border border-border bg-ink p-4 text-xs leading-relaxed text-paper">
{`USER EVIDENCE
        ↓
FRONTEND
        ↓
SECURE SERVER / API ROUTE
        ↓
OCR / SPEECH-TO-TEXT / IMAGE PROCESSING
        ↓
LLM PROVIDER (structured JSON)
        ↓
SCHEMA VALIDATION
        ↓
DETERMINISTIC RISK ENGINE
        ↓
EXPLAINABLE SAFETY RESULT
        ↓
RESPONDER CASE
        ↓
HUMAN REVIEW`}
      </pre>
      <section className="space-y-2 text-sm text-ink-soft">
        <h2 className="font-display text-xl text-ink">OpenAPI-style routes</h2>
        <ul className="space-y-1 font-mono text-xs">
          <li>POST analyzeEvidence — live LLM analysis (no auth)</li>
          <li>POST extractScreenshots — vision OCR reconstruction</li>
          <li>POST transcribeVoice — speech-to-text</li>
          <li>POST askCopilot / requestBriefing / requestWhatIf</li>
          <li>POST /report — anonymous tip (no auth)</li>
          <li>GET /console — priority queue (staff or demo desk)</li>
        </ul>
      </section>
      <p className="text-xs text-muted">
        API keys stay on the server. The model never contacts police, parents, or authorities.
      </p>
    </article>
  );
}
