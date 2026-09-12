-- Expand the case status lifecycle from the original 6 states to the fuller
-- Detected -> Reported -> Under Review -> Prioritized -> Assigned ->
-- In Progress -> Escalated -> Intervention -> Follow-up -> Resolved -> Closed
-- workflow. Additive only: existing states and existing rows are untouched,
-- new intermediate/tail states are added to the check constraint.

alter table cases drop constraint if exists cases_status_check;

alter table cases add constraint cases_status_check check (status in (
  'detected', 'reported', 'under_review', 'prioritized',
  'new', 'assigned', 'in_progress', 'escalated_to_authorities',
  'intervention', 'follow_up', 'resolved', 'closed'
));
