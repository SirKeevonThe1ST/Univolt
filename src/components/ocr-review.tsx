import { Button } from "./ui/button";
import { Textarea } from "./ui/input";
import type { DemoMessage } from "@/lib/demo/types";

export function OcrReview({
  messages,
  onChange,
  lowConfidence,
  onConfirm,
  busy,
}: {
  messages: DemoMessage[];
  onChange: (next: DemoMessage[]) => void;
  lowConfidence?: boolean;
  onConfirm: () => void;
  busy?: boolean;
}) {
  function update(i: number, patch: Partial<DemoMessage>) {
    onChange(messages.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  }

  function remove(i: number) {
    onChange(messages.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= messages.length) return;
    const next = [...messages];
    const tmp = next[i];
    next[i] = next[j];
    next[j] = tmp;
    onChange(next);
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Reconstructed conversation</p>
      <h3 className="mt-1 font-display text-xl">Review extracted messages</h3>
      <p className="mt-1 text-sm text-ink-soft">
        Correct speaker, wording, or order before analysis. Original screenshots stay attached as evidence.
      </p>
      {lowConfidence && (
        <p className="mt-3 rounded-lg bg-[#f3e6c8] px-3 py-2 text-sm text-warn">
          Some text could not be read confidently.
        </p>
      )}
      <ol className="mt-4 space-y-3">
        {messages.map((m, i) => (
          <li key={`${m.text}-${i}`} className="rounded-xl border border-border bg-paper p-3">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={m.speaker}
                onChange={(e) => update(i, { speaker: e.target.value as DemoMessage["speaker"] })}
                className="h-9 rounded-lg border border-border bg-surface px-2 text-sm"
              >
                <option value="other">OTHER</option>
                <option value="child">CHILD</option>
              </select>
              {m.sourceLabel && <span className="text-[11px] uppercase tracking-wide text-muted">{m.sourceLabel}</span>}
              <div className="ml-auto flex gap-1">
                <Button type="button" size="sm" variant="ghost" onClick={() => move(i, -1)}>
                  Up
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => move(i, 1)}>
                  Down
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => remove(i)}>
                  Remove
                </Button>
              </div>
            </div>
            <Textarea
              className="mt-2 min-h-16"
              value={m.text}
              onChange={(e) => update(i, { text: e.target.value })}
            />
          </li>
        ))}
      </ol>
      <Button className="mt-4" size="lg" disabled={busy || messages.length === 0} onClick={onConfirm}>
        {busy ? "Analyzing…" : "Confirm & analyze"}
      </Button>
    </section>
  );
}
