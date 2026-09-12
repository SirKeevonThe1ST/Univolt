import { useState } from "react";
import { Button } from "./ui/button";
import { requestWhatIf } from "@/lib/server/ai";
import type { AnalysisResult } from "@/lib/demo/types";

const OPTIONS = [
  { id: "continue" as const, label: "Continue interaction" },
  { id: "block" as const, label: "Block contact" },
  { id: "tell_adult" as const, label: "Tell trusted adult" },
  { id: "counsellor" as const, label: "Request counsellor support" },
];

export function WhatIfSimulator({ result }: { result: AnalysisResult }) {
  const [choice, setChoice] = useState<(typeof OPTIONS)[number]["id"]>("tell_adult");
  const [out, setOut] = useState<{
    scenario: string;
    plausible_description: string;
    illustrative_projection: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const res = await requestWhatIf({ data: { result, scenario: choice } });
      if (!res.ok) {
        setError("error" in res ? String(res.error) : "Simulator unavailable.");
        return;
      }
      setOut({
        scenario: res.scenario,
        plausible_description: res.plausible_description,
        illustrative_projection: res.illustrative_projection,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Simulator unavailable.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">What-if safety simulator</p>
      <h3 className="mt-1 font-display text-xl">Simulate next step</h3>
      <p className="mt-1 text-sm text-ink-soft">
        Plausible scenario. Illustrative projection. Not a guaranteed prediction.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {OPTIONS.map((o) => (
          <Button key={o.id} size="sm" variant={choice === o.id ? "default" : "outline"} onClick={() => setChoice(o.id)}>
            {o.label}
          </Button>
        ))}
      </div>
      <Button className="mt-3" variant="outline" disabled={busy} onClick={() => void run()}>
        {busy ? "Simulating…" : "Run scenario"}
      </Button>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      {out && (
        <div className="mt-4 space-y-2 rounded-xl bg-paper px-4 py-3 text-sm text-ink-soft">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted">{out.scenario}</p>
          <p>{out.plausible_description}</p>
          <p className="text-xs">{out.illustrative_projection}</p>
          <p className="text-[11px] uppercase tracking-wide text-muted">Not a scientifically validated prediction.</p>
        </div>
      )}
    </section>
  );
}
