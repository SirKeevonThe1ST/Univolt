import type { ReactNode } from "react";
import type { AnalysisResult, DemoCase } from "@/lib/demo/types";
import { TrajectoryChip } from "./risk-trajectory";
import { AnalysisModeMark } from "./analysis-mode-mark";
import { statusLabel } from "@/lib/demo/types";

type Summary = {
  risk: number;
  projectedRisk: number;
  band: string;
  trajectory: DemoCase["trajectory"] | AnalysisResult["trajectory"];
  pattern: string;
  language: string;
  piiProtected: boolean;
  explanationAvailable: boolean;
  humanReview: string;
  nextAction: string;
  publicId?: string;
  mode?: AnalysisResult["analysisMode"];
  isSynthetic?: boolean;
};

function fromCase(c: DemoCase): Summary {
  return {
    risk: c.risk,
    projectedRisk: c.projectedRisk,
    band: c.band,
    trajectory: c.trajectory,
    pattern: c.threatType === "grooming" ? "Grooming progression" : c.threatLabel,
    language: c.languageLabel,
    piiProtected: !c.privacy.identityExposed,
    explanationAvailable: c.indicators.length > 0,
    humanReview: statusLabel(c.status),
    nextAction: c.recommendation,
    publicId: c.publicId,
    mode: c.analysisMode,
    isSynthetic: c.isSynthetic,
  };
}

function fromResult(r: AnalysisResult): Summary {
  return {
    risk: r.risk,
    projectedRisk: r.projectedRisk,
    band: r.band,
    trajectory: r.trajectory,
    pattern: r.threatType === "grooming" ? "Grooming progression" : r.threatLabel,
    language: r.languageLabel,
    piiProtected: !r.privacy.identityExposed,
    explanationAvailable: r.indicators.length > 0,
    humanReview: "Required",
    nextAction: r.recommendation,
    mode: r.analysisMode,
    isSynthetic: r.isSynthetic,
  };
}

export function SafetyIntelligence({
  result,
  demoCase,
}: {
  result?: AnalysisResult | null;
  demoCase?: DemoCase | null;
}) {
  const s = demoCase ? fromCase(demoCase) : result ? fromResult(result) : null;
  if (!s) {
    return (
      <section className="rounded-xl border border-dashed border-border bg-surface px-5 py-10 text-center">
        <p className="text-sm text-muted">Run analysis to open the Safety Intelligence summary.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Safety Intelligence</p>
          <h3 className="mt-1 font-display text-2xl font-medium tracking-tight">
            {s.publicId ?? "Live analysis"}
          </h3>
        </div>
        <AnalysisModeMark mode={s.mode} isSynthetic={s.isSynthetic} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Current risk" value={`${s.risk} / 100`} detail={s.band} emphasis />
        <Tile
          label="Trajectory"
          value={<TrajectoryChip direction={s.trajectory} />}
          detail={`Projected ${s.projectedRisk} · simulated trajectory`}
        />
        <Tile label="Pattern" value={s.pattern} detail={s.language} />
        <Tile label="PII" value={s.piiProtected ? "Protected" : "Exposed"} detail="Privacy-preserving analysis" />
        <Tile label="AI explanation" value={s.explanationAvailable ? "Available" : "Pending"} />
        <Tile label="Human review" value={s.humanReview} />
        <Tile label="Next action" value={s.nextAction} span />
      </div>
    </section>
  );
}

function Tile({
  label,
  value,
  detail,
  emphasis,
  span,
}: {
  label: string;
  value: ReactNode;
  detail?: string;
  emphasis?: boolean;
  span?: boolean;
}) {
  return (
    <div
      className={
        emphasis
          ? "rounded-xl bg-ink px-4 py-4 text-paper sm:col-span-1"
          : span
            ? "rounded-xl border border-border bg-paper px-4 py-4 sm:col-span-2"
            : "rounded-xl border border-border bg-paper px-4 py-4"
      }
    >
      <p className={emphasis ? "text-[11px] uppercase tracking-wide text-paper/60" : "text-[11px] uppercase tracking-wide text-muted"}>
        {label}
      </p>
      <div className={`mt-1 text-sm font-medium ${emphasis ? "font-display text-3xl tabular-nums" : "text-ink"}`}>
        {value}
      </div>
      {detail && (
        <p className={emphasis ? "mt-1 text-xs capitalize text-paper/70" : "mt-1 text-xs text-muted"}>{detail}</p>
      )}
    </div>
  );
}
