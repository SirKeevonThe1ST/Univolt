/**
 * Case status lifecycle.
 *
 * Extends the original 6-state machine (new / assigned / in_progress /
 * escalated_to_authorities / resolved / closed) with the intake and
 * post-escalation stages requested for the full pipeline:
 *
 *   detected -> reported -> under_review -> prioritized -> assigned
 *   -> in_progress -> escalated_to_authorities -> intervention
 *   -> follow_up -> resolved -> closed
 *
 * The original 6 states and their edges are unchanged, so existing cases and
 * existing callers keep working — this only adds states before "assigned"
 * and after "escalated_to_authorities".
 */
export const CASE_STATUSES = [
  "detected",
  "reported",
  "under_review",
  "prioritized",
  "new",
  "assigned",
  "in_progress",
  "escalated_to_authorities",
  "intervention",
  "follow_up",
  "resolved",
  "closed",
] as const;

export type CaseStatus = (typeof CASE_STATUSES)[number];

const EDGES: Record<CaseStatus, CaseStatus[]> = {
  // Intake stages. Automated ingestion (ingestThread) still drops a case
  // straight into "new" for backward compatibility with the original flow;
  // these earlier states are available for a slower, human-paced intake path.
  detected: ["reported", "closed"],
  reported: ["under_review", "closed"],
  under_review: ["prioritized", "closed"],
  prioritized: ["assigned", "new"],

  new: ["assigned", "closed"],
  assigned: ["in_progress", "new"],
  in_progress: ["escalated_to_authorities", "resolved", "assigned"],
  escalated_to_authorities: ["intervention", "resolved"],
  intervention: ["follow_up", "resolved"],
  follow_up: ["resolved", "intervention"],
  resolved: ["closed"],
  closed: [],
};

export const HUMAN_CONFIRM_STATUSES: CaseStatus[] = [
  "escalated_to_authorities",
  "intervention",
  "closed",
];

export function canTransition(from: CaseStatus, to: CaseStatus): boolean {
  return EDGES[from]?.includes(to) ?? false;
}

export function assertTransition(
  from: CaseStatus,
  to: CaseStatus,
  confirmed: boolean,
): void {
  if (!canTransition(from, to)) {
    throw new Error(`Illegal status change ${from} → ${to}`);
  }
  if (HUMAN_CONFIRM_STATUSES.includes(to) && !confirmed) {
    throw new Error("Human confirmation required for this action");
  }
}
