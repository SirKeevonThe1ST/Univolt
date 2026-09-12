import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/lib/server/analytics";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/console/analytics")({
  component: Analytics,
});

function Analytics() {
  const q = useQuery({ queryKey: ["analytics"], queryFn: () => getAnalytics() });
  if (q.isPending) return <p className="text-muted">Loading analytics…</p>;
  if (q.error) return <p className="text-danger">{(q.error as Error).message}</p>;
  const d = q.data!;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-medium tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Aggregate only. Region is shown solely when the reporter opted in. No PII.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Overdue open cases" value={d.overdue} />
        <Stat
          label="Languages"
          value={d.byLang.reduce((a, x) => a + x.n, 0)}
        />
        <Stat label="Flag types" value={d.flagTypes.length} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartBlock title="Risk band" data={d.byBand.map((x) => ({ name: x.risk_band, n: x.n }))} />
        <ChartBlock title="Priority" data={d.byPriority.map((x) => ({ name: x.priority, n: x.n }))} />
        <ChartBlock title="Language" data={d.byLang.map((x) => ({ name: x.language, n: x.n }))} />
        <ChartBlock
          title="Region (opt-in)"
          data={d.byRegion.map((x) => ({ name: x.region_code, n: x.n }))}
        />
      </div>
      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg">Flag mix</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {d.flagTypes.map((f) => (
            <li key={f.flag_type} className="flex justify-between text-sm">
              <span className="capitalize text-ink-soft">{f.flag_type.replace(/_/g, " ")}</span>
              <span className="tabular-nums">{f.n}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl tabular-nums">{value}</p>
    </div>
  );
}

function ChartBlock({ title, data }: { title: string; data: { name: string; n: number }[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h2 className="mb-3 font-display text-lg">{title}</h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#E7E0D3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7370" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6B7370" }} />
            <Tooltip
              contentStyle={{
                background: "#FBF8F2",
                border: "1px solid #D4CCBE",
                borderRadius: 12,
              }}
            />
            <Bar dataKey="n" fill="#0E6B66" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
