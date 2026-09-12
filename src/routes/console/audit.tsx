import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listAudit } from "@/lib/server/analytics";

export const Route = createFileRoute("/console/audit")({ component: Audit });

function Audit() {
  const q = useQuery({ queryKey: ["audit"], queryFn: () => listAudit() });
  if (q.isPending) return <p className="text-muted">Loading audit…</p>;
  if (q.error) return <p className="text-danger">{(q.error as Error).message}</p>;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-medium tracking-tight">Immutable audit log</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Actor, time, action. Message bodies are never written here.
        </p>
      </header>
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
            {q.data?.rows.map((r) => (
              <tr key={r.id} className="border-b border-border/70 last:border-0">
                <td className="px-4 py-2 font-mono text-xs text-muted">
                  {new Date(r.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {r.actor_role ?? "system"}
                  <span className="block font-mono text-xs text-muted">
                    {r.actor_id ? `${r.actor_id.slice(0, 8)}…` : "—"}
                  </span>
                </td>
                <td className="px-4 py-2">{r.action}</td>
                <td className="px-4 py-2 text-ink-soft">
                  {r.resource_type}
                  {r.resource_id ? ` · ${r.resource_id.slice(0, 12)}` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
