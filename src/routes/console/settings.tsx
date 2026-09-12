import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getScoringConfig, purgeDueCases, updateScoringConfig } from "@/lib/server/analytics";
import { listStaff, setStaffRole, type StaffRole } from "@/lib/server/staff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ResponsibleAi } from "@/components/responsible-ai";
import { SimMark } from "@/components/sim-mark";
import { useDemoStore } from "@/lib/demo/store";

export const Route = createFileRoute("/console/settings")({
  component: Settings,
});

function Settings() {
  const { user } = useCurrentUserState();
  const role = useDemoStore((s) => s.role);
  const qc = useQueryClient();
  const cfg = useQuery({
    queryKey: ["scoring"],
    queryFn: () => getScoringConfig(),
    enabled: Boolean(user),
  });
  const staff = useQuery({
    queryKey: ["staff"],
    queryFn: () => listStaff(),
    enabled: Boolean(user),
  });

  const save = useMutation({
    mutationFn: (d: { key: string; weight: number }) => updateScoringConfig({ data: d }),
    onSuccess: () => {
      toast.success("Weight saved — new cases use it immediately");
      void qc.invalidateQueries({ queryKey: ["scoring"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const roleMut = useMutation({
    mutationFn: (d: { userId: string; role: StaffRole }) => setStaffRole({ data: d }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Role updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const purge = useMutation({
    mutationFn: () => purgeDueCases({ data: { confirm: true } }),
    onSuccess: (r) => toast.success(`Purged ${r.purged} closed cases past retention`),
    onError: (e: Error) => toast.error(e.message),
  });

  if (user && cfg.isPending) return <p className="text-muted">Loading settings…</p>;
  const me = cfg.data?.me;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-medium tracking-tight">Scoring & retention</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Demo role on this desk: <span className="capitalize">{role}</span>. Live weights apply after sign-in.
        </p>
      </header>

      <ResponsibleAi />

      {!user && (
        <p className="rounded-xl border border-dashed border-border bg-surface px-4 py-3 text-sm text-ink-soft">
          <SimMark className="mr-2" />
          You are in the demo desk. Sign in as a responder to edit live scoring weights.
        </p>
      )}

      {cfg.data && (
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg">Score weights</h2>
          <ul className="mt-4 space-y-3">
            {cfg.data.weights.map((w) => (
              <WeightRow
                key={w.key}
                item={w}
                disabled={me?.role !== "admin" || save.isPending}
                onSave={(weight) => save.mutate({ key: w.key, weight })}
              />
            ))}
          </ul>
        </section>
      )}

      {cfg.data && (
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg">Retention</h2>
          <p className="mt-2 text-sm text-ink-soft">{cfg.data.retention?.notes}</p>
          {me?.role === "admin" && (
            <Button className="mt-4" variant="danger" size="sm" disabled={purge.isPending} onClick={() => purge.mutate()}>
              Purge overdue closed cases (confirm)
            </Button>
          )}
        </section>
      )}

      {staff.data && (
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg">Staff roles</h2>
          <ul className="mt-3 space-y-2">
            {staff.data.staff.map((s) => (
              <li key={s.user_id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span>{s.display_name}</span>
                <select
                  value={s.role}
                  disabled={me?.role !== "admin"}
                  onChange={(e) =>
                    roleMut.mutate({ userId: s.user_id, role: e.target.value as StaffRole })
                  }
                  className="h-9 rounded-lg border border-border bg-paper px-2"
                >
                  <option value="admin">admin</option>
                  <option value="responder">responder</option>
                  <option value="ngo">ngo</option>
                </select>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function WeightRow({
  item,
  disabled,
  onSave,
}: {
  item: { key: string; weight: string; description: string };
  disabled: boolean;
  onSave: (n: number) => void;
}) {
  const [v, setV] = useState(item.weight);
  return (
    <li className="grid gap-2 sm:grid-cols-[1fr_6rem_auto] sm:items-center">
      <div>
        <p className="font-medium capitalize">{item.key.replace(/_/g, " ")}</p>
        <p className="text-xs text-muted">{item.description}</p>
      </div>
      <Input value={v} disabled={disabled} onChange={(e) => setV(e.target.value)} inputMode="decimal" />
      <Button size="sm" variant="outline" disabled={disabled} onClick={() => onSave(Number(v))}>
        Save
      </Button>
    </li>
  );
}
