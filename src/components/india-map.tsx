import { useMemo, useState } from "react";
import { intensity, NATIONAL, STATE_TRENDS, type RiskMix, type StateTrend } from "@/lib/demo/india";
import { SimMark } from "./sim-mark";
import { cn } from "@/lib/utils";

type RiskFilter = keyof RiskMix | "all";

const AGES = ["all", "10–12", "13–15", "14–16"] as const;
const PERIODS = ["this week", "this month"] as const;

export function IndiaMap() {
  const [risk, setRisk] = useState<RiskFilter>("all");
  const [age, setAge] = useState<(typeof AGES)[number]>("all");
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("this week");
  const [lang, setLang] = useState("all");
  const [selected, setSelected] = useState<StateTrend>(STATE_TRENDS[0]);

  const langs = useMemo(
    () => ["all", ...Array.from(new Set(STATE_TRENDS.map((s) => s.topLang)))],
    [],
  );

  const shown = STATE_TRENDS.filter((s) => {
    if (age !== "all" && s.ageBand !== age) return false;
    if (lang !== "all" && s.topLang !== lang) return false;
    return true;
  });

  const max = Math.max(...shown.map((s) => intensity(s, risk)), 1);
  const factor = period === "this month" ? 3.4 : 1;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl font-medium">India safety intelligence</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Anonymised statewide trends. No individual child locations.
            </p>
          </div>
          <SimMark>Simulated data — for prototype demonstration</SimMark>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Filter label="Risk type" value={risk} onChange={(v) => setRisk(v as RiskFilter)} options={["all", "grooming", "cyberbullying", "blackmail", "other"]} />
          <Filter label="Age group" value={age} onChange={(v) => setAge(v as typeof age)} options={[...AGES]} />
          <Filter label="Language" value={lang} onChange={setLang} options={langs} />
          <Filter label="Time period" value={period} onChange={(v) => setPeriod(v as typeof period)} options={[...PERIODS]} />
        </div>
        <svg viewBox="0 0 420 460" className="mt-4 w-full" role="img" aria-label="India aggregated trend map">
          <path
            d="M198 18c22 6 48 18 58 42 10 22 28 28 42 48 12 16 18 38 10 58 14 18 22 32 18 54-6 22-8 40-28 52 6 22 2 40-10 62-8 16-6 34-18 50-12 18-22 40-40 52-20 14-28 32-48 36-22 4-36-10-52-6-18 4-28 22-48 18-16-4-28-18-32-34-10 4-28-6-34-22-8-18 2-34 8-50-16-12-22-32-16-50 6-16 8-34-2-48 14-16 22-34 20-54 24-8 36-24 42-42 8-22 32-28 52-36 12-6 18-18 32-24z"
            fill="#E7E0D3"
            stroke="#D4CCBE"
          />
          {shown.map((s) => {
            const v = intensity(s, risk) * (period === "this month" ? 1 : 1);
            const t = v / max;
            const r = 8 + t * 14;
            const fill = t > 0.75 ? "#0A524E" : t > 0.45 ? "#0E6B66" : t > 0.2 ? "#7AA8A4" : "#D5E8E6";
            const active = selected.code === s.code;
            return (
              <g key={s.code}>
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={r}
                  fill={fill}
                  opacity={0.9}
                  stroke={active ? "#1A2422" : "transparent"}
                  strokeWidth={active ? 2 : 0}
                  className="cursor-pointer"
                  onClick={() => setSelected(s)}
                />
                <text
                  x={s.x}
                  y={s.y + r + 11}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#3D4A47"
                  className="pointer-events-none"
                >
                  {s.code}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="text-xs text-muted">
          Circle size encodes report volume ({period}
          {factor > 1 ? ", scaled" : ""}). Colour encodes relative intensity. {shown.length} states in filter.
        </p>
      </section>

      <aside className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Reports this week" value={NATIONAL.reportsWeek} />
          <Stat label="High-risk growth" value={`+${NATIONAL.growth}%`} />
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Most common threat</p>
          <p className="mt-1 font-display text-2xl">{NATIONAL.topThreat}</p>
          <p className="mt-4 text-xs uppercase tracking-wide text-muted">Language distribution</p>
          <ul className="mt-2 space-y-1">
            {NATIONAL.languages.map((l) => (
              <li key={l.name} className="flex justify-between text-sm">
                <span className="text-ink-soft">{l.name}</span>
                <span className="tabular-nums">{l.n}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Selected state</p>
          <h3 className="mt-1 font-display text-2xl">{selected.name}</h3>
          <ul className="mt-3 space-y-1 text-sm">
            <Row k="Grooming" v={`${selected.mix.grooming}%`} />
            <Row k="Cyberbullying" v={`${selected.mix.cyberbullying}%`} />
            <Row k="Blackmail" v={`${selected.mix.blackmail}%`} />
            <Row k="Other" v={`${selected.mix.other}%`} />
            <Row k="Reports / week" v={String(selected.reportsWeek)} />
            <Row k="Pattern growth" v={`+${selected.growth}%`} />
            <Row k="Top language" v={selected.topLang} />
            <Row k="Age band" v={selected.ageBand} />
          </ul>
        </div>
      </aside>
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="text-xs font-medium text-ink-soft">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("mt-1 h-10 w-full rounded-xl border border-border bg-paper px-2 text-sm capitalize")}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl tabular-nums">{value}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex justify-between">
      <span className="text-ink-soft">{k}</span>
      <span className="tabular-nums">{v}</span>
    </li>
  );
}
