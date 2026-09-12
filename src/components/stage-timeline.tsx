import type { ThreadTimeline } from "@/lib/pipeline/timeline";
import { Badge } from "./ui/badge";
import { RiskBadge } from "./risk-badge";
import { cn } from "@/lib/utils";

const STAGE_LABEL: Record<string, string> = {
  contact: "Contact",
  trust_building: "Trust Building",
  isolation: "Isolation",
  exploitation_attempt: "Exploitation Attempt",
};

const SPEED_LABEL: Record<ThreadTimeline["speedLabel"], string> = {
  flat: "Flat",
  gradual: "Gradual",
  escalating: "Escalating",
  rapid: "Rapid",
};

const SPEED_TONE: Record<ThreadTimeline["speedLabel"], "neutral" | "teal" | "warn" | "danger"> = {
  flat: "neutral",
  gradual: "teal",
  escalating: "warn",
  rapid: "danger",
};

/**
 * Visual behavioural-progression timeline. Renders one node per stage
 * transition the engine actually detected — never invents stages the
 * conversation doesn't support.
 */
export function StageTimeline({ timeline }: { timeline: ThreadTimeline }) {
  const { points, startScore, currentScore, escalation, speedLabel } = timeline;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 rounded-xl border border-border bg-surface p-4 text-center sm:grid-cols-4">
        <Stat label="Risk started at" value={`${startScore}/100`} />
        <Stat label="Current risk" value={`${currentScore}/100`} />
        <Stat
          label="Escalation"
          value={`${escalation >= 0 ? "+" : ""}${escalation} pts`}
          emphasis={escalation > 0}
        />
        <div className="hidden sm:block">
          <p className="text-xs uppercase tracking-wide text-muted">Escalation speed</p>
          <p className="mt-1">
            <Badge tone={SPEED_TONE[speedLabel]}>{SPEED_LABEL[speedLabel]}</Badge>
          </p>
        </div>
        <div className="sm:hidden">
          <p className="text-xs uppercase tracking-wide text-muted">Speed</p>
          <p className="mt-1">
            <Badge tone={SPEED_TONE[speedLabel]}>{SPEED_LABEL[speedLabel]}</Badge>
          </p>
        </div>
      </div>

      <ol className="relative space-y-0 border-l border-border pl-6">
        {points.map((p, i) => (
          <li key={i} className="relative pb-6 last:pb-0">
            <span
              className={cn(
                "absolute -left-[29px] top-1 flex size-4 items-center justify-center rounded-full border-2",
                i === points.length - 1
                  ? "border-teal bg-teal"
                  : "border-teal bg-surface",
              )}
            />
            <div className="flex flex-wrap items-center gap-2">
              {p.at && (
                <span className="font-mono text-xs text-muted">
                  {new Date(p.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
              <span className="font-display text-base font-medium">
                {STAGE_LABEL[p.stage] ?? p.stage.replace(/_/g, " ")}
              </span>
              <RiskBadge band={p.band} />
              <span className="text-xs tabular-nums text-muted">{p.scoreAtStage}/100</span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">{p.reason}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Stat({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p
        className={cn(
          "mt-1 font-display text-lg font-medium tabular-nums",
          emphasis && "text-danger",
        )}
      >
        {value}
      </p>
    </div>
  );
}
