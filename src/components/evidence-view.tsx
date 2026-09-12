import type { DemoCase } from "@/lib/demo/types";

export function EvidenceView({ c }: { c: DemoCase }) {
  const shots = c.screenshots ?? [];
  const voice = c.voiceNote;
  const textOn = c.messages.length > 0;
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Evidence</p>
      <h3 className="mt-1 font-display text-xl">Original evidence vs AI extraction</h3>
      <dl className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Flag label="Text" on={textOn} detail={textOn ? `${c.messages.length} messages` : "None"} />
        <Flag label="Screenshots" on={shots.length > 0} detail={shots.length ? `${shots.length} attached` : "None"} />
        <Flag label="Voice note" on={Boolean(voice)} detail={voice ? "1 attached" : "None"} />
        <Flag
          label="Transcription"
          on={Boolean(voice?.transcription)}
          detail={voice?.transcription ? "Available" : voice ? "Unavailable" : "None"}
        />
      </dl>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted">Original evidence</p>
          <ol className="mt-2 max-h-72 space-y-2 overflow-auto rounded-xl bg-paper p-3 text-sm">
            {c.messages.map((m, i) => (
              <li key={`${m.text}-${i}`}>
                <span className="text-[11px] uppercase text-muted">
                  {m.sourceLabel ? `[${m.sourceLabel}] ` : ""}
                  {m.speaker}
                </span>
                <p className="text-ink-soft">“{m.text}”</p>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted">AI extracted information</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.normalizedMeaning}</p>
          {shots.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {shots.map((s) => (
                <figure key={s.name} className="w-24">
                  <img src={s.dataUrl} alt={s.name} className="h-24 w-24 rounded-lg object-cover" />
                  <figcaption className="mt-1 truncate text-[10px] text-muted">{s.name}</figcaption>
                </figure>
              ))}
            </div>
          )}
          {voice?.transcription && (
            <p className="mt-3 text-sm text-ink-soft">Voice: “{voice.transcription}”</p>
          )}
        </div>
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-wide text-muted">AI analysis is separate from original evidence and is never a finding of guilt.</p>
    </section>
  );
}

function Flag({ label, on, detail }: { label: string; on: boolean; detail: string }) {
  return (
    <div className="rounded-xl bg-paper px-3 py-3">
      <dt className="text-[11px] uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 text-sm font-medium">
        {on ? "Available" : "Not attached"}
        <span className="mt-0.5 block text-xs font-normal text-muted">{detail}</span>
      </dd>
    </div>
  );
}
