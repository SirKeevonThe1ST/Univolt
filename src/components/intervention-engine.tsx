import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Severity } from "@/lib/demo/types";

const TREE: Record<
  Severity,
  { title: string; steps: string[]; tone: string }
> = {
  low: {
    title: "Low — guidance",
    steps: ["No urgent intervention", "Safety guidance for the child", "Door stays open"],
    tone: "border-ok/30 bg-ok/5",
  },
  medium: {
    title: "Medium — trusted adult",
    steps: ["Encourage a trusted adult", "Safety education", "Human review available"],
    tone: "border-warn/30 bg-[#f3e6c8]/40",
  },
  high: {
    title: "High — support pathway",
    steps: ["Offer counsellor / trusted adult", "Create responder review case", "No automatic authority contact"],
    tone: "border-danger/30 bg-danger/5",
  },
  critical: {
    title: "Critical — urgent human review",
    steps: ["Urgent human review", "Evidence preservation (redacted)", "Support pathway opened"],
    tone: "border-ink/40 bg-ink text-paper",
  },
};

export function InterventionEngine({ band }: { band: Severity }) {
  const order: Severity[] = ["low", "medium", "high", "critical"];
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Safety Response Engine</p>
      <h3 className="mt-1 font-display text-xl font-medium">Recommended next step</h3>
      <p className="mt-1 text-sm text-ink-soft">
        The engine never contacts police or authorities. A person confirms every irreversible action.
      </p>
      <ol className="mt-5 space-y-2">
        {order.map((key) => {
          const node = TREE[key];
          const active = key === band;
          return (
            <li key={key}>
              <div
                className={cn(
                  "rounded-xl border px-4 py-3 transition-colors",
                  active ? node.tone : "border-border bg-paper/60 opacity-60",
                )}
              >
                <p className="text-sm font-medium">{node.title}</p>
                {active && (
                  <ul className="mt-2 space-y-1 text-sm opacity-90">
                    {node.steps.map((s) => (
                      <li key={s}>· {s}</li>
                    ))}
                  </ul>
                )}
              </div>
              {key !== "critical" && (
                <div className="flex justify-center py-1 text-muted">
                  <ArrowDown className="size-3.5" />
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-xs text-muted">Human review required before any case movement.</p>
    </section>
  );
}
