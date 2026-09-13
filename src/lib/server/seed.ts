import { getStorageRepository } from "./storage";

export async function ensureSeeded(): Promise<void> {
  const repo = getStorageRepository();
  await repo.ensureSeeded();
}
