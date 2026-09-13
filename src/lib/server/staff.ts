import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getStorageRepository } from "./storage";

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
  const repo = getStorageRepository();
  return repo.ensureStaffProfile(userId, displayName);
}

export const getMyStaff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return ensureStaffProfile(context.userId, "Responder");
  });

export const listStaff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const repo = getStorageRepository();
    return repo.listStaff(context.userId);
  });

export const setStaffRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { userId: string; role: StaffRole }) => d)
  .handler(async ({ context, data }) => {
    const repo = getStorageRepository();
    await repo.setStaffRole(context.userId, data.userId, data.role);
    return { ok: true };
  });
