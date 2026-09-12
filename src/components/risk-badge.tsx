import { Badge } from "./ui/badge";

const TONE: Record<string, "ok" | "warn" | "danger" | "ink" | "teal"> = {
  low: "ok",
  med: "warn",
  high: "danger",
  critical: "ink",
  P1: "ink",
  P2: "danger",
  P3: "warn",
  P4: "teal",
};

export function RiskBadge({ band }: { band: string }) {
  return <Badge tone={TONE[band] ?? "neutral"}>{band}</Badge>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  return <Badge tone={TONE[priority] ?? "neutral"}>{priority}</Badge>;
}
