import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ingestDemoThread, listCases } from "@/lib/server/cases";
import { PriorityBadge, RiskBadge } from "@/components/risk-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { toast } from "sonner";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { caseKpis, useDemoStore, DEMO_CASE_ID } from "@/lib/demo/store";
import { statusLabel, type DemoCase } from "@/lib/demo/types";
import { SystemHealth } from "@/components/system-health";
import { SimMark } from "@/components/sim-mark";
import { SafetyIntelligence } from "@/components/safety-intelligence";

export const Route = createFileRoute("/console/")({ component: Queue });

function Queue() {
  const { user } = useCurrentUserState();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const demoCases = useDemoStore((s) => s.cases);
  const q = useQuery({
    queryKey: ["cases"],
    queryFn: () => listCases(),
    enabled: Boolean(user),
  });
  const [filter, setFilter] = useState<"all" | "P1" | "overdue" | "review">("all");
  const [lab, setLab] = useState("");

  const ingest = useMutation({
    mutationFn: () => ingestDemoThread({ data: { text: lab } }),
    onSuccess: (res) => {
      toast.success(
        `Thread ingested as ${res.publicId} — risk ${res.score}/100 (${res.band}). Opening case…`,
      );
      setLab("");
      void qc.invalidateQueries({ queryKey: ["cases"] });
      void navigate({ to: "/console/cases/$caseId", params: { caseId: res.id } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const kpis = caseKpis(demoCases);
  const live = q.data?.cases ?? [];
  const spotlight = demoCases.find((c) => c.id === DEMO_CASE_ID) ?? demoCases[0];

  const shownDemo = useMemo(() => {
    return demoCases.filter((c) => {
      if (filter === "review") return c.status === "human_review";
      if (filter === "P1") return c.band === "critical";
      return true;
    });
  }, [demoCases, filter]);

  const now = Date.now();
  const shownLive = useMemo(() => {
    return live.filter((c) => {
      if (filter === "P1") return c.priority === "P1";
      if (filter === "overdue") {
        return (
          new Date(c.sla_due_at).getTime() < now &&
          c.status !== "resolved" &&
          c.status !== "closed"
        );
      }
      return true;
    });
  }, [live, filter, now]);

  const overdueN = live.filter(
    (c) =>
      new Date(c.sla_due_at).getTime() < now &&
      c.status !== "resolved" &&
      c.status !== "closed",
  ).length;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Child Safety Response Center</p>
          <h1 className="font-display text-3xl font-medium tracking-tight">Case queue</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Synthetic demo cases plus live anonymous reports when signed in.
          </p>
        </div>
        <SimMark>Demo data clearly marked</SimMark>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Critical cases" value={kpis.critical} />
        <Kpi label="High risk" value={kpis.high} />
        <Kpi label="Pending human review" value={kpis.pending} />
        <Kpi label="Active support cases" value={kpis.support} />
      </div>

      {spotlight && <SafetyIntelligence demoCase={spotlight} />}

      <SystemHealth />

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl">Demo case queue</h2>
          <div className="flex gap-2">
            {(["all", "review", "P1"] as const).map((f) => (
              <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
                {f === "review" ? "Human review" : f === "P1" ? "Critical" : "All"}
              </Button>
            ))}
          </div>
        </div>
        <CaseTable cases={shownDemo} />
      </section>

      {user && (
        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl">Live queue</h2>
            <Button size="sm" variant={filter === "overdue" ? "default" : "outline"} onClick={() => setFilter("overdue")}>
              Overdue ({overdueN})
            </Button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Case</th>
                  <th className="px-4 py-3">Pri</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Lang</th>
                  <th className="px-4 py-3">SLA</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {shownLive.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-muted">
                      {q.isPending ? "Loading queue…" : "No cases in this filter."}
                    </td>
                  </tr>
                )}
                {shownLive.map((c) => {
                  const overdue =
                    new Date(c.sla_due_at).getTime() < now &&
                    c.status !== "resolved" &&
                    c.status !== "closed";
                  return (
                    <tr key={c.id} className="border-b border-border/70 last:border-0 hover:bg-paper/60">
                      <td className="px-4 py-3">
                        <Link
                          to="/console/cases/$caseId"
                          params={{ caseId: c.id }}
                          className="font-mono text-sm text-teal-deep underline-offset-4 hover:underline"
                        >
                          {c.public_id}
                        </Link>
                        {c.analysis_mode === "fallback" && (
                          <div className="mt-1">
                            <Badge tone="danger">fallback</Badge>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <RiskBadge band={c.risk_band} />
                          <span className="tabular-nums text-muted">{c.risk_score}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize">{c.stage.replace(/_/g, " ")}</td>
                      <td className="px-4 py-3">{c.language}</td>
                      <td className="px-4 py-3">
                        <span className={overdue ? "text-danger" : "text-ink-soft"}>
                          {overdue ? "Overdue · " : ""}
                          {formatDue(c.sla_due_at)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge>{c.status.replace(/_/g, " ")}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-medium">AI Threat Analyzer</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Paste a conversation to run it through the live pipeline. Use only synthetic or authorised
          evidence — this is a detector, not a generator.
        </p>
        <Textarea
          className="mt-3"
          value={lab}
          onChange={(e) => setLab(e.target.value)}
          placeholder={"other: You can tell me anything.\nchild: I am not sure."}
        />
        <Button
          className="mt-3"
          disabled={!lab.trim() || ingest.isPending || !user}
          onClick={() => ingest.mutate()}
        >
          {ingest.isPending ? "Analyzing…" : user ? "Analyze into live queue" : "Sign in to ingest live"}
        </Button>
      </section>
    </div>
  );
}

function CaseTable({ cases }: { cases: DemoCase[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3">Case ID</th>
            <th className="px-4 py-3">Risk</th>
            <th className="px-4 py-3">Threat type</th>
            <th className="px-4 py-3">Age band</th>
            <th className="px-4 py-3">Language</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Last activity</th>
          </tr>
        </thead>
        <tbody>
          {cases.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-muted">
                No demo cases in this filter.
              </td>
            </tr>
          )}
          {cases.map((c) => (
            <tr
              key={c.id}
              className={
                c.id === DEMO_CASE_ID
                  ? "border-b border-border/70 bg-teal-mist/30 last:border-0"
                  : "border-b border-border/70 last:border-0 hover:bg-paper/60"
              }
            >
              <td className="px-4 py-3">
                <Link
                  to="/console/cases/$caseId"
                  params={{ caseId: c.id }}
                  className="font-mono text-sm text-teal-deep underline-offset-4 hover:underline"
                >
                  {c.publicId}
                </Link>
                <div className="text-xs text-muted">{c.source} · {c.region}</div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <RiskBadge band={c.band === "medium" ? "med" : c.band} />
                  <span className="tabular-nums">{c.risk} / 100</span>
                </div>
              </td>
              <td className="px-4 py-3">{c.threatLabel}</td>
              <td className="px-4 py-3">{c.ageBand}</td>
              <td className="px-4 py-3">{c.languageLabel}</td>
              <td className="px-4 py-3">
                <Badge>{statusLabel(c.status)}</Badge>
              </td>
              <td className="px-4 py-3 text-xs text-muted">
                {new Date(c.lastActivity).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Kpi({ label, value }: { label: number | string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl tabular-nums">{value}</p>
    </div>
  );
}

function formatDue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const mins = Math.round((d.getTime() - Date.now()) / 60000);
  if (mins < 0) return `${Math.abs(mins)}m late`;
  if (mins < 120) return `${mins}m`;
  return `${Math.round(mins / 60)}h`;
}
