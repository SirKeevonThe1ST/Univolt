import type { GraphEdge, GraphNode } from "@/lib/demo/types";

const POS: Record<string, { x: number; y: number }> = {
  child: { x: 160, y: 36 },
  "acc-a": { x: 160, y: 140 },
  "acc-b": { x: 56, y: 232 },
  "acc-c": { x: 264, y: 232 },
};

export function ThreatGraph({
  nodes,
  edges,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h3 className="font-display text-xl font-medium">Relationship graph</h3>
      <p className="mt-1 text-sm text-ink-soft">
        Risk may exist in patterns across interactions, not just a single message. Fictional IDs only.
      </p>
      <svg viewBox="0 0 320 280" className="mt-4 w-full" role="img" aria-label="Anonymized account graph">
        {edges.map((e) => {
          const a = POS[e.from];
          const b = POS[e.to];
          if (!a || !b) return null;
          return (
            <g key={`${e.from}-${e.to}`}>
              <line
                x1={a.x}
                y1={a.y + 16}
                x2={b.x}
                y2={b.y - 16}
                stroke="#0E6B66"
                strokeOpacity={0.35 + e.strength * 0.5}
                strokeWidth={1 + e.strength * 4}
              />
              <text
                x={(a.x + b.x) / 2 + 10}
                y={(a.y + b.y) / 2}
                fill="#6B7370"
                fontSize="9"
              >
                {e.label}
              </text>
            </g>
          );
        })}
        {nodes.map((n) => {
          const p = POS[n.id];
          if (!p) return null;
          const child = n.kind === "child";
          return (
            <g key={n.id} transform={`translate(${p.x},${p.y})`}>
              <circle
                r={child ? 22 : 20}
                fill={child ? "#1A2422" : "#D5E8E6"}
                stroke={child ? "#1A2422" : "#0E6B66"}
              />
              <text
                textAnchor="middle"
                y="4"
                fill={child ? "#F3EEE4" : "#0A524E"}
                fontSize="8"
                fontWeight="600"
              >
                {n.label}
              </text>
              {!child && (
                <text textAnchor="middle" y="36" fill="#6B7370" fontSize="9">
                  risk {n.risk}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="text-xs text-muted">Interaction frequency encoded as connection strength. No personal identities.</p>
    </section>
  );
}
