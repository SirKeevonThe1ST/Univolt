import { createServerFn } from "@tanstack/react-start";
import { ingestThread } from "./ingest";
import { ensureSeeded } from "./seed";

export type ReportPayload = {
  text: string;
  severity: number;
  callback: boolean;
  contact?: string;
  region?: string | null;
  screenshot: boolean;
  voice: boolean;
};

export const submitAnonymousReport = createServerFn({ method: "POST" })
  .validator((d: ReportPayload) => d)
  .handler(async ({ data }) => {
    await ensureSeeded();
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
  });
