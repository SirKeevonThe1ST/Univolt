import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  addNote,
  exportSafetyPack,
  getCase,
  regenerateSafetyCase,
  revealIdentity,
  transitionCase,
} from "@/lib/server/cases";
import { PriorityBadge, RiskBadge } from "@/components/risk-badge";
import { StageTimeline } from "@/components/stage-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import type { CaseStatus } from "@/lib/pipeline/lifecycle";
import { toast } from "sonner";
import type { SafetyCasePack } from "@/lib/nlp/types";

export const Route = createFileRoute("/console/cases/$caseId")({
  component: CaseDetail,
});

function CaseDetail() {
  const { caseId } = Route.useParams();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["case", caseId],
    queryFn: () => getCase({ data: caseId }),
  });
  const [note, setNote] = useState("");
  const [confirm, setConfirm] = useState("");
  const [revealed, setRevealed] = useState<string | null>(null);
  const [summaryDraft, setSummaryDraft] = useState<string | null>(null);
  const [editingSummary, setEditingSummary] = useState(false);

  const regen = useMutation({
    mutationFn: () => regenerateSafetyCase({ data: caseId }),
    onSuccess: (r) => {
      setSummaryDraft(null);
      setEditingSummary(false);
      toast.success(`Safety case regenerated — risk ${r.pack.risk_score}/100`);
      void qc.invalidateQueries({ queryKey: ["case", caseId] });
      void qc.invalidateQueries({ queryKey: ["cases"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveSummaryEdit = useMutation({
    mutationFn: () =>
      addNote({
        data: {
          id: caseId,
          body: `Responder-edited AI summary:\n${summaryDraft ?? ""}`,
        },
      }),
    onSuccess: () => {
      toast.success("Edit saved as a case note — original AI pack is untouched");
      setEditingSummary(false);
      void qc.invalidateQueries({ queryKey: ["case", caseId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const move = useMutation({
    mutationFn: (to: CaseStatus) =>
      transitionCase({
        data: { id: caseId, to, confirm: confirm === to },
      }),
    onSuccess: () => {
      setConfirm("");
      toast.success("Status updated");
      void qc.invalidateQueries({ queryKey: ["case", caseId] });
      void qc.invalidateQueries({ queryKey: ["cases"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const noteMut = useMutation({
    mutationFn: () => addNote({ data: { id: caseId, body: note } }),
    onSuccess: () => {
      setNote("");
      void qc.invalidateQueries({ queryKey: ["case", caseId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reveal = useMutation({
    mutationFn: () => revealIdentity({ data: { id: caseId, confirm: true } }),
    onSuccess: (r) => {
      setRevealed(r.contact);
      toast.success("Identity unsealed for this session");
      void qc.invalidateQueries({ queryKey: ["case", caseId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function onExport() {
    try {
      const pack = await exportSafetyPack({ data: caseId });
      const blob = new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${pack.public_id}-simulated-pocso.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Simulated pack downloaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    }
  }

  function onPrint() {
    window.print();
  }

  if (q.isPending) return <p className="text-muted">Loading case…</p>;
  if (q.error) return <p className="text-danger">{(q.error as Error).message}</p>;
  const data = q.data;
  if (!data) return null;
  const c = data.case;
  const pack = data.safetyPack as SafetyCasePack | null;
  const needsConfirm = (to: CaseStatus) =>
    to === "escalated_to_authorities" || to === "intervention" || to === "closed";

  const actions: { to: CaseStatus; label: string }[] = [];
  if (c.status === "detected") actions.push({ to: "reported", label: "Mark reported" });
  if (c.status === "reported") actions.push({ to: "under_review", label: "Start review" });
  if (c.status === "under_review") actions.push({ to: "prioritized", label: "Mark prioritized" });
  if (c.status === "prioritized") actions.push({ to: "new", label: "Queue for assignment" });
  if (c.status === "new") actions.push({ to: "assigned", label: "Assign to me" });
  if (c.status === "assigned") actions.push({ to: "in_progress", label: "Accept case" });
  if (c.status === "in_progress") {
    actions.push({ to: "escalated_to_authorities", label: "Escalate to authorities" });
    actions.push({ to: "resolved", label: "Mark resolved" });
  }
  if (c.status === "escalated_to_authorities") {
    actions.push({ to: "intervention", label: "Mark intervention started" });
    actions.push({ to: "resolved", label: "Mark resolved" });
  }
  if (c.status === "intervention") actions.push({ to: "follow_up", label: "Schedule follow-up" });
  if (c.status === "follow_up") {
    actions.push({ to: "resolved", label: "Resolve case" });
    actions.push({ to: "intervention", label: "Back to intervention" });
  }
  if (c.status === "resolved") actions.push({ to: "closed", label: "Close case" });

  return (
    <div className="space-y-6 print:max-w-none">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-muted">{c.public_id}</p>
          <h1 className="font-display text-3xl font-medium tracking-tight">Case review</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <PriorityBadge priority={c.priority} />
            <RiskBadge band={c.risk_band} />
            <Badge>{c.risk_score}/100</Badge>
            <Badge tone="teal">{c.language}</Badge>
            <Badge>{c.stage.replace(/_/g, " ")}</Badge>
            <Badge>{c.status.replace(/_/g, " ")}</Badge>
            {c.distress_flag && <Badge tone="danger">distress</Badge>}
            {c.ai_generated && <Badge>AI-generated</Badge>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={onExport}>
            Export JSON
          </Button>
          <Button variant="outline" size="sm" onClick={onPrint}>
            Print / PDF
          </Button>
        </div>
      </header>

      <p className="rounded-xl bg-teal-mist px-4 py-3 text-sm text-teal-deep">
        AI-generated — human review required. The model cannot escalate, unseal, or close this case.
      </p>

      {pack && (
        <section className="rounded-xl border border-border bg-surface p-5 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg">AI-assisted safety case</h2>
            <Button
              variant="outline"
              size="sm"
              disabled={regen.isPending}
              onClick={() => regen.mutate()}
            >
              {regen.isPending ? "Generating…" : "Regenerate safety case"}
            </Button>
          </div>
          <p className="mt-1 text-xs text-muted">
            Rebuilt from the redacted evidence already on this case — never re-reads raw input,
            never adds turns that aren't on record.
          </p>

          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-teal-deep">
              Detected evidence
            </p>
            <ol className="mt-2 space-y-2 text-sm">
              {pack.redacted_evidence.map((e) => (
                <li key={e.turn} className="text-ink-soft">
                  <span className="font-mono text-xs text-muted">#{e.turn} {e.speaker}</span>{" "}
                  {e.excerpt}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-teal-deep">
                AI interpretation — review before acting
              </p>
              {!editingSummary && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSummaryDraft(pack.incident_summary);
                    setEditingSummary(true);
                  }}
                >
                  Edit
                </Button>
              )}
            </div>
            {editingSummary ? (
              <div className="mt-2 space-y-2">
                <Textarea
                  value={summaryDraft ?? ""}
                  onChange={(e) => setSummaryDraft(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={saveSummaryEdit.isPending}
                    onClick={() => saveSummaryEdit.mutate()}
                  >
                    Save edit as note
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingSummary(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {pack.incident_summary}
                </p>
                <p className="mt-2 text-sm text-ink-soft">{pack.explanation.plain_summary}</p>
              </>
            )}
            <ul className="mt-4 space-y-1 text-sm">
              {pack.explanation.top_factors.map((f) => (
                <li key={f.label} className="flex justify-between gap-4">
                  <span>{f.label}</span>
                  <span className="tabular-nums text-muted">
                    {f.direction === "up" ? "+" : "−"}
                    {f.weight}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-xs text-muted">{pack.pocso_note}</p>
        </section>
      )}
      {!pack && (
        <section className="rounded-xl border border-border bg-surface p-5 print:hidden">
          <h2 className="font-display text-lg">AI-assisted safety case</h2>
          <p className="mt-1 text-sm text-ink-soft">
            No pack yet on this case.
          </p>
          <Button
            className="mt-3"
            disabled={regen.isPending}
            onClick={() => regen.mutate()}
          >
            {regen.isPending ? "Generating…" : "Generate safety case"}
          </Button>
        </section>
      )}
      {pack && (
        <section className="hidden rounded-xl border border-border bg-surface p-5 print:block">
          <h2 className="font-display text-lg">Incident summary</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{pack.incident_summary}</p>
          <p className="mt-3 text-sm text-ink-soft">{pack.explanation.plain_summary}</p>
        </section>
      )}

      <section className="rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-lg">Grooming progression timeline</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Behavioural stages the pipeline actually detected in this thread, with risk re-scored at
          each transition. Risk indicators for review — not proof of abuse.
        </p>
        <div className="mt-4">
          <StageTimeline timeline={data.timeline} />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg">Redacted evidence</h2>
          <ol className="mt-3 space-y-3">
            {data.messages.map((m) => (
              <li key={m.id} className="text-sm leading-relaxed">
                <span className="font-medium text-teal-deep">
                  {m.speaker} · {m.lang}
                </span>
                <p className="text-ink-soft">{m.redacted_text}</p>
              </li>
            ))}
          </ol>
          {data.attachments.length > 0 && (
            <p className="mt-3 text-xs text-muted">
              Sealed attachments: {data.attachments.map((a) => a.kind).join(", ")} (not displayed)
            </p>
          )}
        </section>
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg">Events</h2>
          <ul className="mt-4 space-y-1 text-xs text-muted">
            {data.events.map((e, i) => (
              <li key={i}>
                {e.event_type} · {new Date(e.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-1">
            {data.flags.map((f, i) => (
              <Badge key={i} tone="warn">
                {f.flag_type.replace(/_/g, " ")}
              </Badge>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-surface p-5 print:hidden">
        <h2 className="font-display text-lg">Responder actions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {actions.map((a) => {
            const lock = needsConfirm(a.to);
            const armed = !lock || confirm === a.to;
            return (
              <div key={a.to} className="flex items-center gap-2">
                {lock && confirm !== a.to && (
                  <Button variant="outline" size="sm" onClick={() => setConfirm(a.to)}>
                    {a.label} (confirm)
                  </Button>
                )}
                {armed && (
                  <Button
                    size="sm"
                    variant={lock ? "danger" : "default"}
                    disabled={move.isPending}
                    onClick={() => move.mutate(a.to)}
                  >
                    {lock ? `Confirm ${a.label}` : a.label}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        {data.hasSealedIdentity && (
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-sm text-ink-soft">
              A callback number is sealed on this case. Unsealing is logged and is for legal
              escalation only.
            </p>
            {revealed ? (
              <p className="mt-2 font-mono text-sm">{revealed}</p>
            ) : (
              <Button
                className="mt-2"
                variant="danger"
                size="sm"
                disabled={reveal.isPending || data.me.role === "ngo"}
                onClick={() => reveal.mutate()}
              >
                Reveal sealed identity
              </Button>
            )}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-border bg-surface p-5 print:hidden">
        <h2 className="font-display text-lg">Notes</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {data.notes.map((n) => (
            <li key={n.id}>
              <span className="text-muted">{n.author_name ?? n.author_id}</span>
              <p>{n.body}</p>
            </li>
          ))}
          {data.notes.length === 0 && <li className="text-muted">No notes yet.</li>}
        </ul>
        <Textarea
          className="mt-3"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Internal note — do not paste unredacted child data"
        />
        <Button
          className="mt-2"
          size="sm"
          disabled={!note.trim() || noteMut.isPending}
          onClick={() => noteMut.mutate()}
        >
          Add note
        </Button>
      </section>
    </div>
  );
}
