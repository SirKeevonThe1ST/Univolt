import { createFileRoute, Link } from "@tanstack/react-router";
import { ChildChrome } from "@/components/child-chrome";
import { Button } from "@/components/ui/button";
import { SimMark } from "@/components/sim-mark";
import { SimulationLauncher } from "@/components/simulation-overlay";

const CAPS = [
  {
    title: "Faster risk identification",
    body: "Behaviour accumulates across turns so a desk can see a pattern forming, not only a single flagged phrase.",
  },
  {
    title: "Explainable decisions",
    body: "Every score ships with human-readable reasons. Responders can disagree, edit, and record that disagreement.",
  },
  {
    title: "Privacy-preserving workflow",
    body: "PII is detected and redacted before analysis. Identity stays sealed. Access is logged.",
  },
  {
    title: "Multilingual support",
    body: "English, Hindi, Hinglish, and other Indian languages — child safety cannot depend on formal English alone.",
  },
  {
    title: "Human-in-the-loop intervention",
    body: "Recommended next steps only. No autonomous accusation, no automatic call to police, no irreversible action without confirm.",
  },
];

export const Route = createFileRoute("/impact")({ component: Impact });

function Impact() {
  return (
    <ChildChrome>
      <SimMark>Prototype capabilities — not real-world impact claims</SimMark>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">What this prototype is built to show</h1>
      <p className="mt-4 max-w-2xl text-ink-soft leading-relaxed">
        SurakshaNet is an AI-powered child safety early-warning and intervention platform.
        These are capabilities of the prototype, not statistics from a live deployment.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {CAPS.map((c) => (
          <article key={c.title} className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-display text-xl font-medium">{c.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.body}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <SimulationLauncher />
        <Button variant="outline" asChild>
          <Link to="/intelligence">Open safety intelligence</Link>
        </Button>
      </div>
    </ChildChrome>
  );
}
