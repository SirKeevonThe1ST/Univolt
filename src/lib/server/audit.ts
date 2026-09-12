import { getSql } from "@/lib/db";
import { nid } from "../utils";

export async function writeAudit(input: {
  actorId?: string | null;
  actorRole?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const sql = await getSql();
  await sql`
    insert into audit_log (id, actor_id, actor_role, action, resource_type, resource_id, metadata)
    values (
      ${nid("aud")},
      ${input.actorId ?? null},
      ${input.actorRole ?? null},
      ${input.action},
      ${input.resourceType},
      ${input.resourceId ?? null},
      ${JSON.stringify(input.metadata ?? {})}::jsonb
    )
  `;
}

export async function writeEvent(
  caseId: string,
  eventType: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const sql = await getSql();
  await sql`
    insert into event_log (id, case_id, event_type, payload)
    values (${nid("evt")}, ${caseId}, ${eventType}, ${JSON.stringify(payload)}::jsonb)
  `;
}

export async function writeAccess(input: {
  actorId: string;
  resourceType: string;
  resourceId: string;
  purpose: string;
}): Promise<void> {
  const sql = await getSql();
  await sql`
    insert into access_log (id, actor_id, resource_type, resource_id, purpose)
    values (${nid("acc")}, ${input.actorId}, ${input.resourceType}, ${input.resourceId}, ${input.purpose})
  `;
}
