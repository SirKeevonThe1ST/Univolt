import { ingestThread } from "./ingest.ts";
import { getStorageRepository } from "./storage/index.ts";

export type ReportPayload = {
  text: string;
  severity: number;
  callback: boolean;
  contact?: string;
  region?: string | null;
  screenshot: boolean;
  voice: boolean;
};

export async function handleAnonymousReport(data: ReportPayload): Promise<{ publicId: string; received: boolean }> {
  try {
    const repo = getStorageRepository();
    await repo.ensureSeeded();

    const text = (data.text ?? "").trim();
    const severity = Math.max(1, Math.min(4, Number(data.severity) || 1));
    let encrypted: string | null = null;

    if (data.callback && data.contact && data.contact.trim()) {
      const { encryptField } = await import("../privacy/crypto");
      encrypted = encryptField(data.contact.trim());
    }

    const result = await ingestThread({
      source: data.callback ? "anonymous_callback" : "anonymous_tip",
      turns: text
        ? [{ speaker: "reporter", text }]
        : [{ speaker: "reporter", text: `Severity ${severity} — no written note.` }],
      regionCode: data.region || null,
      callbackRequested: Boolean(data.callback),
      encryptedContact: encrypted,
      screenshot: Boolean(data.screenshot),
      voice: Boolean(data.voice),
      severity,
    });

    return {
      publicId: result.publicId,
      received: true,
    };
  } catch (err) {
    console.error("[report] Report submission error:", err);
    // Clean, user-friendly error message; no filesystem paths or internal errors exposed
    throw new Error("We couldn't send this right now. Please try again.");
  }
}
