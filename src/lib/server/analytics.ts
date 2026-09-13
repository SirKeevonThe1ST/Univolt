import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { ensureStaffProfile } from "./staff";
import { ensureSeeded } from "./seed";
import { writeAccess } from "./audit";
import type { Json } from "../json";
import type { StaffProfile } from "./staff";

import { getStorageRepository } from "./storage";

export const getAnalytics = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const repo = getStorageRepository();
    return repo.getAnalytics(context.userId);
  });

export type AuditRow = {
  id: string;
  actor_id: string | null;
  actor_role: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  metadata: Json;
  created_at: string;
};

export const listAudit = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<{ me: StaffProfile; rows: AuditRow[] }> => {
    const repo = getStorageRepository();
    return repo.listAudit(context.userId);
  });

export const getScoringConfig = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const me = await ensureStaffProfile(context.userId, "Responder");
    const sql = await getSql();
    const weights = await sql<{ key: string; weight: string; description: string }>`
      select key, weight::text as weight, description from scoring_config order by key
    `;
    const retention = await sql<{ retain_days: number; notes: string }>`
      select retain_days, notes from retention_policy where id = 1
    `;
    return { me, weights, retention: retention[0] ?? null };
  });

export const updateScoringConfig = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { key: string; weight: number }) => d)
  .handler(async ({ context, data }) => {
    const me = await ensureStaffProfile(context.userId, "Responder");
    if (me.role !== "admin") throw new Error("Only admins can change scoring weights");
    const sql = await getSql();
    await sql`
      update scoring_config set weight = ${data.weight}, updated_at = now()
      where key = ${data.key}
    `;
    return { ok: true as const };
  });

export const purgeDueCases = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { confirm: boolean }) => d)
  .handler(async ({ context, data }) => {
    if (!data.confirm) throw new Error("Human confirmation required");
    const me = await ensureStaffProfile(context.userId, "Responder");
    if (me.role !== "admin") throw new Error("Only admins can purge");
    const sql = await getSql();
    const due = await sql<{ id: string }>`
      select id from cases where status = 'closed' and retention_until < now()
    `;
    for (const row of due) {
      await sql`delete from cases where id = ${row.id}`;
    }
    return { purged: due.length };
  });
