import { getStorageRepository } from "./storage";

export async function writeAudit(input: {
  actorId?: string | null;
  actorRole?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const repo = getStorageRepository();
  await repo.writeAudit(input);
}

export async function writeEvent(
  caseId: string,
  eventType: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const repo = getStorageRepository();
  await repo.writeEvent(caseId, eventType, payload);
}

export async function writeAccess(input: {
  actorId: string;
  resourceType: string;
  resourceId: string;
  purpose: string;
}): Promise<void> {
  const repo = getStorageRepository();
  await repo.writeAccess(input);
}
