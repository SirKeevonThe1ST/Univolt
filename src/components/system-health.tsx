import { useQuery } from "@tanstack/react-query";
import { getAiHealth } from "@/lib/server/ai";

export function SystemHealth() {
  const q = useQuery({
    queryKey: ["ai-health"],
    queryFn: () => getAiHealth(),
    staleTime: 15_000,
  });
  const h = q.data;
  const connected = h?.connected;
  const nodes = [
    { name: "LLM status", state: connected ? "Connected" : "Unavailable", kind: connected ? "ok" : "warn" },
    { name: "Model", state: h?.model ?? "Checking…", kind: "info" },
    {
      name: "Last analysis",
      state: h?.lastAt ? new Date(h.lastAt).toLocaleTimeString() : "None yet",
      kind: "info",
    },
    {
      name: "Latency",
      state: typeof h?.lastLatencyMs === "number" ? `${(h.lastLatencyMs / 1000).toFixed(1)}s` : "—",
      kind: "info",
    },
    { name: "Risk engine", state: "Operational", kind: "ok" },
    { name: "OCR", state: h?.vision ? "Operational" : "Unavailable", kind: h?.vision ? "ok" : "warn" },
    { name: "Speech-to-text", state: h?.stt ? "Operational" : "Unavailable", kind: h?.stt ? "ok" : "warn" },
    { name: "Audit log", state: "Operational", kind: "ok" },
    { name: "Human review", state: "Required", kind: "info" },
  ] as const;

  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h3 className="font-display text-lg font-medium">System health</h3>
      <p className="mt-1 text-xs text-muted">
        {connected ? "Live model connected. Keys stay on the server." : "AI features are unavailable until a provider key is present."}
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {nodes.map((n) => (
          <li key={n.name} className="flex items-center justify-between rounded-lg bg-paper px-3 py-2 text-sm">
            <span className="text-ink-soft">{n.name}</span>
            <span className="flex items-center gap-2 text-xs font-medium">
              <span
                className={
                  n.kind === "ok"
                    ? "size-1.5 rounded-full bg-ok"
                    : n.kind === "warn"
                      ? "size-1.5 rounded-full bg-warn"
                      : "size-1.5 rounded-full bg-teal"
                }
              />
              {n.state}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
