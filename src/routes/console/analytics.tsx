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
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useDemoStore } from "@/lib/demo/store";
import { SimMark } from "@/components/sim-mark";
import { NATIONAL } from "@/lib/demo/india";

export const Route = createFileRoute("/console/analytics")({
  component: Analytics,
});

function Analytics() {
  const { user } = useCurrentUserState();
  const cases = useDemoStore((s) => s.cases);
  const q = useQuery({
    queryKey: ["analytics"],
    queryFn: () => getAnalytics(),
    enabled: Boolean(user),
  });

  const byBand = ["low", "medium", "high", "critical"].map((b) => ({
    name: b,
    n: cases.filter((c) => c.band === b).length,
  }));
  const byThreat = Array.from(new Set(cases.map((c) => c.threatLabel))).map((name) => ({
    name,
    n: cases.filter((c) => c.threatLabel === name).length,
  }));
  const byLang = Array.from(new Set(cases.map((c) => c.languageLabel))).map((name) => ({
    name,
    n: cases.filter((c) => c.languageLabel === name).length,
  }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-medium tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Aggregate only. Region is shown solely when the reporter opted in. No PII.
        </p>
      </header>

      <div className="flex items-center gap-2">
        <h2 className="font-display text-xl">Demo desk</h2>
        <SimMark />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Demo cases" value={cases.length} />
        <Stat label="Reports this week (sim)" value={NATIONAL.reportsWeek} />
        <Stat label="Pattern growth" value={NATIONAL.growth} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartBlock title="Risk band" data={byBand} />
        <ChartBlock title="Threat type" data={byThreat} />
        <ChartBlock title="Language" data={byLang} />
        <ChartBlock title="National language mix (sim)" data={NATIONAL.languages} />
      </div>

      {user && q.data && (
        <>
          <h2 className="font-display text-xl">Live queue</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartBlock title="Risk band" data={q.data.byBand.map((x) => ({ name: x.risk_band, n: x.n }))} />
            <ChartBlock title="Priority" data={q.data.byPriority.map((x) => ({ name: x.priority, n: x.n }))} />
            <ChartBlock title="Language" data={q.data.byLang.map((x) => ({ name: x.language, n: x.n }))} />
            <ChartBlock
              title="Region (opt-in)"
              data={q.data.byRegion.map((x) => ({ name: x.region_code, n: x.n }))}
            />
          </div>
        </>
      )}
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
