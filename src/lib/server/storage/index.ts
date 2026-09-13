import { MemoryStorageRepository } from "./memory-repository.ts";
import { PostgresStorageRepository } from "./postgres-repository.ts";
import type { StorageRepository } from "./types.ts";

let repoInstance: StorageRepository | null = null;

export function getStorageRepository(): StorageRepository {
  if (!repoInstance) {
    const databaseUrl = process.env.DATABASE_URL?.trim();
    if (databaseUrl) {
      repoInstance = new PostgresStorageRepository();
    } else {
      repoInstance = new MemoryStorageRepository();
    }
  }
  return repoInstance;
}

export * from "./types.ts";
