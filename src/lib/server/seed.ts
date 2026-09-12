import { getSql } from "@/lib/db";
import { SYNTHETIC_THREADS } from "../synthetic/conversations";
import { ingestThread } from "./ingest";

const g = globalThis as typeof globalThis & { __surakshaSeeded__?: Promise<void> };

export async function ensureSeeded(): Promise<void> {
  if (!g.__surakshaSeeded__) {
    g.__surakshaSeeded__ = (async () => {
      const sql = await getSql();
      const rows = await sql<{ n: number }>`select count(*)::int as n from cases`;
      if ((rows[0]?.n ?? 0) > 0) return;
      for (const t of SYNTHETIC_THREADS) {
        await ingestThread({
          source: "synthetic_seed",
          turns: t.turns,
          regionCode: t.region ?? null,
        });
      }
    })().catch((err) => {
      g.__surakshaSeeded__ = undefined;
      throw err;
    });
  }
  await g.__surakshaSeeded__;
}
