import { createServerFn } from "@tanstack/react-start";
import type { ReportPayload } from "./report-handler.ts";

export type { ReportPayload };

export const submitAnonymousReport = createServerFn({ method: "POST" })
  .validator((d: ReportPayload) => d)
  .handler(async ({ data }) => {
    const { handleAnonymousReport } = await import("./report-handler.ts");
    return handleAnonymousReport(data);
  });
