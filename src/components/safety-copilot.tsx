import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/input";
import { askCopilot, requestBriefing } from "@/lib/server/ai";
import type { AnalysisResult } from "@/lib/demo/types";
import { HumanLoopMark } from "./sim-mark";

const PRESETS = [
  "Why is this case high risk?",
  "Summarize the escalation.",
  "What indicators were detected across sessions?",
  "What information is still missing?",
  "Generate a 30-second responder briefing.",
  "What intervention options should a human reviewer consider?",
];

export function SafetyCopilot({ result }: { result: AnalysisResult }) {
  const [question, setQuestion] = useState(PRESETS[0]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [briefing, setBriefing] = useState<string | null>(result.briefing ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask(q = question) {
    setBusy(true);
    setError(null);
    try {
      const res = await askCopilot({ data: { result, question: q } });
      if (!res.ok) {
        setError("error" in res ? res.error : "Copilot unavailable.");
        return;
      }
      setAnswer(res.answer);
      setMissing(res.missing_information ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Copilot unavailable.");
    } finally {
      setBusy(false);
    }
  }

  async function briefingNow() {
    setBusy(true);
    setError(null);
    try {
      const res = await requestBriefing({ data: { result } });
      if (!res.ok) {
        setError("error" in res ? String(res.error) : "Briefing unavailable.");
        return;
      }
      setBriefing(res.briefing);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Briefing unavailable.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Safety Copilot</p>
          <h3 className="mt-1 font-display text-xl">Ask about this case</h3>
        </div>
        <HumanLoopMark />
      </div>
      <p className="mt-2 text-xs text-muted">AI assistance. Human judgment required. The copilot cannot take safeguarding actions.</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <Button key={p} type="button" size="sm" variant={question === p ? "default" : "outline"} onClick={() => setQuestion(p)}>
            {p}
          </Button>
        ))}
      </div>

      <Textarea className="mt-3 min-h-20" value={question} onChange={(e) => setQuestion(e.target.value)} />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button disabled={busy} onClick={() => void ask()}>
          {busy ? "Thinking…" : "Ask copilot"}
        </Button>
        <Button variant="outline" disabled={busy} onClick={() => void briefingNow()}>
          Generate briefing
        </Button>
      </div>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      {answer && (
        <div className="mt-4 rounded-xl bg-paper px-4 py-3 text-sm leading-relaxed text-ink-soft">
          <p className="text-[11px] uppercase tracking-wide text-muted">Copilot</p>
          <p className="mt-1">{answer}</p>
          {missing.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-xs">
              {missing.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {briefing && (
        <div className="mt-3 rounded-xl border border-teal/30 bg-teal-mist/40 px-4 py-3 text-sm leading-relaxed text-teal-deep">
          <p className="text-[11px] uppercase tracking-wide">AI-generated briefing</p>
          <p className="mt-1">{briefing}</p>
        </div>
      )}
    </section>
  );
}
