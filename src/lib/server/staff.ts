import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { writeAudit } from "./audit";

export type StaffRole = "admin" | "responder" | "ngo";

export type StaffProfile = {
  user_id: string;
  role: StaffRole;
  display_name: string;
  region: string | null;
  active: boolean;
};

export async function ensureStaffProfile(
  userId: string,
  displayName: string,
): Promise<StaffProfile> {
  const sql = await getSql();
  const existing = await sql<StaffProfile>`
    select user_id, role, display_name, region, active
    from staff_profiles where user_id = ${userId}
  `;
  if (existing[0]) return existing[0];

  const countRows = await sql<{ n: number }>`select count(*)::int as n from staff_profiles`;
  const role: StaffRole = (countRows[0]?.n ?? 0) === 0 ? "admin" : "responder";
  await sql`
    insert into staff_profiles (user_id, role, display_name, region, active)
    values (${userId}, ${role}, ${displayName || "Responder"}, ${null}, ${true})
  `;
  await writeAudit({
    actorId: userId,
    actorRole: role,
    action: "staff.provision",
    resourceType: "staff",
    resourceId: userId,
    metadata: { role },
  });
  return {
    user_id: userId,
    role,
    display_name: displayName || "Responder",
    region: null,
    active: true,
  };
}

export const getMyStaff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const users = await sql<{ name: string; email: string }>`
      select name, email from "user" where id = ${context.userId}
    `;
    const name = users[0]?.name || users[0]?.email || "Responder";
    return ensureStaffProfile(context.userId, name);
  });

export const listStaff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const me = await ensureStaffProfile(context.userId, "Responder");
    const sql = await getSql();
    const rows = await sql<StaffProfile>`
      select user_id, role, display_name, region, active
      from staff_profiles order by created_at asc
    `;
    return { me, staff: rows };
  });

export const setStaffRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { userId: string; role: StaffRole }) => d)
  .handler(async ({ context, data }) => {
    const me = await ensureStaffProfile(context.userId, "Responder");
    if (me.role !== "admin") throw new Error("Only admins can change roles");
    const sql = await getSql();
    await sql`update staff_profiles set role = ${data.role} where user_id = ${data.userId}`;
    await writeAudit({
      actorId: context.userId,
      actorRole: me.role,
      action: "staff.role_change",
      resourceType: "staff",
      resourceId: data.userId,
      metadata: { role: data.role },
    });
    return { ok: true };
  });
