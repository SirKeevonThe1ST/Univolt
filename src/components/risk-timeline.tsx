import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TimelinePoint } from "@/lib/demo/types";

export function RiskTimeline({
  points,
  highlight,
}: {
  points: TimelinePoint[];
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Risk trajectory</p>
          <h3 className="mt-1 font-display text-xl font-medium">Behaviour over time</h3>
        </div>
        {highlight && (
          <span className="rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
            Escalation pattern detected
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Detect behaviour over time, not just harmful words. Simulated prototype scores.
      </p>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
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
                return [`${value}  (+${p?.delta ?? 0} ${p?.event ?? ""})`, "Risk"];
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#0A524E"
              strokeWidth={2}
              fill="url(#riskFill)"
              dot={{ r: 4, fill: "#0E6B66", stroke: "#FBF8F2", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {points.map((p) => (
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
    </div>
  );
}
