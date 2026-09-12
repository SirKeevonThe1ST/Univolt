import type { ProgressionStage } from "../nlp/types.ts";

export type Priority = "P1" | "P2" | "P3" | "P4";
export type RiskBand = "low" | "med" | "high" | "critical";

export const SLA_MINUTES: Record<Priority, number> = {
  P1: 15,
  P2: 120,
  P3: 480,
  P4: 1440,
};

export function prioritise(input: {
  band: RiskBand;
  stage: ProgressionStage;
  distress: boolean;
  minutesSinceActivity?: number;
}): { priority: Priority; slaMinutes: number } {
  const stale = input.minutesSinceActivity ?? 0;
  let priority: Priority = "P4";

  if (input.band === "critical" || input.distress) priority = "P1";
  else if (input.band === "high" || input.stage === "exploitation_attempt") priority = "P2";
  else if (input.band === "med" || input.stage === "isolation") priority = "P3";
  else priority = "P4";

  if (input.stage === "exploitation_attempt" && input.band !== "low") {
    priority = bump(priority);
  }
  if (stale > 180 && priority !== "P1") {
    // Overdue inactivity on an open high-signal thread escalates one step.
    if (input.band === "high" || input.band === "critical") priority = bump(priority);
  }

  return { priority, slaMinutes: SLA_MINUTES[priority] };
}

export function slaDueAt(from: Date, priority: Priority): Date {
  return new Date(from.getTime() + SLA_MINUTES[priority] * 60_000);
}

export function isOverdue(due: Date, now = new Date()): boolean {
  return due.getTime() < now.getTime();
}

function bump(p: Priority): Priority {
  if (p === "P4") return "P3";
  if (p === "P3") return "P2";
  if (p === "P2") return "P1";
  return "P1";
}
