import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listAudit } from "@/lib/server/analytics";
import { useDemoStore } from "@/lib/demo/store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SimMark } from "@/components/sim-mark";

export const Route = createFileRoute("/console/audit")({ component: Audit });

function Audit() {
  const { user } = useCurrentUserState();
  const cases = useDemoStore((s) => s.cases);
  const q = useQuery({
    queryKey: ["audit"],
    queryFn: () => listAudit(),
    enabled: Boolean(user),
  });

  const demoRows = cases.flatMap((c) =>
    c.audit.map((a) => ({
      id: a.id,
      at: a.at,
      actor: a.actor,
      action: a.action,
      resource: c.publicId,
    })),
  ).sort((a, b) => +new Date(b.at) - +new Date(a.at));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-medium tracking-tight">Audit trail</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Actor, time, action. Message bodies are never written here.
        </p>
      </header>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="font-display text-xl">Demo desk</h2>
          <SimMark />
        </div>
        <AuditTable
          rows={demoRows.map((r) => ({
            when: r.at,
            actor: r.actor,
            action: r.action,
            resource: r.resource,
            id: r.id,
          }))}
        />
      </section>

      {user && (
        <section>
          <h2 className="mb-3 font-display text-xl">Live log</h2>
          {q.isPending && <p className="text-muted">Loading audit…</p>}
          {q.error && <p className="text-danger">{(q.error as Error).message}</p>}
          {q.data && (
            <AuditTable
              rows={q.data.rows.map((r) => ({
                id: r.id,
                when: r.created_at,
                actor: r.actor_role ?? "system",
                action: r.action,
                resource: `${r.resource_type}${r.resource_id ? ` · ${r.resource_id.slice(0, 12)}` : ""}`,
              }))}
            />
          )}
        </section>
      )}
    </div>
  );
}

function AuditTable({
  rows,
}: {
  rows: { id: string; when: string; actor: string; action: string; resource: string }[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3">When</th>
            <th className="px-4 py-3">Actor</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Resource</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-muted">
                No entries yet.
              </td>
            </tr>
          )}
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-border/70 last:border-0">
              <td className="px-4 py-2 font-mono text-xs text-muted">
                {new Date(r.when).toLocaleString()}
              </td>
              <td className="px-4 py-2">{r.actor}</td>
              <td className="px-4 py-2">{r.action}</td>
              <td className="px-4 py-2 text-ink-soft">{r.resource}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
