import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ingestDemoThread, listCases } from "@/lib/server/cases";
import { PriorityBadge, RiskBadge } from "@/components/risk-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/console/")({ component: Queue });

function Queue() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const q = useQuery({ queryKey: ["cases"], queryFn: () => listCases() });
  const [filter, setFilter] = useState<"all" | "P1" | "overdue">("all");
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

  const cases = q.data?.cases ?? [];
  const now = Date.now();
  const shown = useMemo(() => {
    return cases.filter((c) => {
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
  }, [cases, filter, now]);

  const overdueN = cases.filter(
    (c) =>
      new Date(c.sla_due_at).getTime() < now &&
      c.status !== "resolved" &&
      c.status !== "closed",
  ).length;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">Priority queue</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Seeded synthetic cases plus live anonymous reports. SLA clocks run from ingest.
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "P1", "overdue"] as const).map((f) => (
            <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
              {f === "overdue" ? `Overdue (${overdueN})` : f}
            </Button>
          ))}
        </div>
      </header>

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
            {shown.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  {q.isPending ? "Loading queue…" : "No cases in this filter."}
                </td>
              </tr>
            )}
            {shown.map((c) => {
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
                    <div className="text-xs text-muted">
                      {c.source.replace(/_/g, " ")}
                      {c.distress_flag ? " · distress" : ""}
                      {c.region_code ? ` · ${c.region_code}` : ""}
                    </div>
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

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-medium">AI Threat Analyzer</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Paste a conversation to run it through the live pipeline — language detection,
          behavioural flags, grooming-stage progression, and an explainable risk score. Works on
          text supplied here, not on any live social-media feed. Format:{" "}
          <code className="font-mono text-xs">other: …</code> or{" "}
          <code className="font-mono text-xs">child: …</code> per line. Use only synthetic or
          authorised evidence — this is a detector, not a generator.
        </p>
        <Textarea
          className="mt-3"
          value={lab}
          onChange={(e) => setLab(e.target.value)}
          placeholder={"other: You can tell me anything.\nchild: I am not sure."}
        />
        <Button
          className="mt-3"
          disabled={!lab.trim() || ingest.isPending}
          onClick={() => ingest.mutate()}
        >
          {ingest.isPending ? "Analyzing…" : "Analyze"}
        </Button>
      </section>
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
