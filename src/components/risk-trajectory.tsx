import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Severity, TimelinePoint, TrajectoryDirection } from "@/lib/demo/types";
import { SimMark } from "./sim-mark";
import { cn } from "@/lib/utils";

export function RiskTrajectory({
  points,
  current,
  projected,
  band,
  direction,
  revealUpTo,
}: {
  points: TimelinePoint[];
  current: number;
  projected: number;
  band: Severity;
  direction: TrajectoryDirection;
  revealUpTo?: number;
}) {
  const visible = points.slice(0, revealUpTo ?? points.length);
  const last = visible[visible.length - 1];
  const displayRisk = last?.score ?? current;
  const escalating = direction === "Escalating";

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Risk Trajectory</p>
          <h3 className="mt-1 font-display text-xl font-medium tracking-tight">Behaviour over time</h3>
          <p className="mt-1 max-w-xl text-sm text-ink-soft">
            SurakshaNet looks for emerging risk before harm necessarily reaches its final stage.
          </p>
        </div>
        <SimMark>Simulated trajectory — not a validated prediction</SimMark>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="h-56 min-w-0">
          {visible.length === 0 ? (
            <div className="grid h-full place-items-center rounded-xl border border-dashed border-border text-sm text-muted">
              Waiting for behavioural signals…
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visible} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0E6B66" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#0E6B66" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E7E0D3" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#6B7370", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#6B7370", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#FBF8F2",
                    border: "1px solid #D4CCBE",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(value, _n, item) => {
                    const p = item?.payload as TimelinePoint | undefined;
                    return [`${value}  (+${p?.delta ?? 0} ${p?.event ?? ""})`, "Simulated risk"];
                  }}
                />
                {visible.length === points.length && projected > current && (
                  <ReferenceLine
                    y={projected}
                    stroke="#8A5A12"
                    strokeDasharray="4 4"
                    label={{ value: "Projected", fill: "#8A5A12", fontSize: 10, position: "insideTopRight" }}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#0A524E"
                  strokeWidth={2}
                  fill="url(#riskFill)"
                  dot={{ r: 4, fill: "#0E6B66", stroke: "#FBF8F2", strokeWidth: 2 }}
                  isAnimationActive
                  animationDuration={600}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-xl bg-ink px-4 py-4 text-paper">
            <p className="text-[11px] uppercase tracking-wide text-paper/60">Current risk</p>
            <p className="mt-1 font-display text-4xl tabular-nums leading-none">{displayRisk}</p>
            <p className="mt-1 text-sm text-paper/70">/ 100</p>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide">{band}</p>
          </div>
          {escalating && (
            <div className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-danger">Escalation signal</p>
              <p className="mt-1 text-sm text-ink">Behavioural escalation detected</p>
            </div>
          )}
          <div className="rounded-xl border border-border bg-paper px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-muted">Projected risk</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-sm text-ink-soft">Current {displayRisk}</span>
              <span className="text-ink-soft">→</span>
              <span className="font-display text-2xl tabular-nums">{projected}</span>
            </div>
            <p className="mt-1 text-[11px] text-muted">If the pattern continues. Simulated.</p>
          </div>
        </div>
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {visible.map((p) => (
          <li key={p.day} className="flex items-center justify-between rounded-lg bg-paper px-3 py-2 text-sm">
            <span className="text-ink-soft">
              <span className="font-medium text-ink">{p.day}</span>
              {" · "}
              {p.event}
            </span>
            <span className="tabular-nums text-teal-deep">
              +{p.delta} → {p.score}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TrajectoryChip({ direction }: { direction: TrajectoryDirection }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        direction === "Escalating" && "bg-danger/10 text-danger",
        direction === "Stable" && "bg-paper-2 text-ink-soft",
        direction === "Declining" && "bg-ok/10 text-ok",
      )}
    >
      {direction === "Escalating" ? "↑ Escalating" : direction === "Declining" ? "↓ Declining" : "→ Stable"}
    </span>
  );
}
