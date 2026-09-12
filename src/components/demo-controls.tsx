import { Button } from "./ui/button";
import { ANALYSIS_LANGS, type AnalysisLang, type Severity, type ThreatKind } from "@/lib/demo/types";
import { useDemoStore } from "@/lib/demo/store";

const KINDS: { id: ThreatKind; label: string }[] = [
  { id: "grooming", label: "Grooming" },
  { id: "cyberbullying", label: "Cyberbullying" },
  { id: "blackmail", label: "Blackmail" },
  { id: "threat", label: "Threat" },
  { id: "suspicious", label: "Suspicious contact" },
];

const SEV: Severity[] = ["low", "medium", "high", "critical"];

export function DemoControls({ onGenerate }: { onGenerate?: () => void }) {
  const kind = useDemoStore((s) => s.scenarioKind);
  const severity = useDemoStore((s) => s.scenarioSeverity);
  const lang = useDemoStore((s) => s.scenarioLang);
  const setScenario = useDemoStore((s) => s.setScenario);
  const generate = useDemoStore((s) => s.generateScenario);

  return (
    <section className="rounded-xl border border-dashed border-border bg-paper/80 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Demo controls · judges</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Field label="Scenario">
          <select
            value={kind}
            onChange={(e) => setScenario({ kind: e.target.value as ThreatKind })}
            className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm"
          >
            {KINDS.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Severity">
          <select
            value={severity}
            onChange={(e) => setScenario({ severity: e.target.value as Severity })}
            className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm capitalize"
          >
            {SEV.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Language">
          <select
            value={lang}
            onChange={(e) => setScenario({ lang: e.target.value as AnalysisLang })}
            className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm"
          >
            {ANALYSIS_LANGS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.native}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Button
        className="mt-3"
        onClick={() => {
          generate();
          onGenerate?.();
        }}
      >
        Generate safety scenario
      </Button>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-ink-soft">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
