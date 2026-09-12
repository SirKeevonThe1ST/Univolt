-- Default scoring weights. Admins can change these from the console.
-- Weights are relative; the engine normalises them to sum 100 at score time.

insert into scoring_config (key, weight, description) values
  ('classifier_confidence', 22, 'Classifier confidence on the highest-risk label'),
  ('stage', 20, 'Progression stage along contact → exploitation attempt'),
  ('persistence', 12, 'Repeated flags across turns in the same thread'),
  ('secrecy', 12, 'Requests to hide the conversation from caregivers'),
  ('pii_request', 12, 'Requests for phone, school, address, or similar identifiers'),
  ('image_request', 10, 'Requests for photos or media of the child'),
  ('age_gap', 7, 'Adult-minor age-gap linguistic signal (heuristic)'),
  ('prior_flags', 5, 'Historical flags already on the case')
on conflict (key) do nothing;

insert into retention_policy (id, retain_days, notes) values
  (1, 365, 'Default 12-month retention aligned to POCSO evidentiary windows. Closed cases may be purged earlier on human confirm. Simulated policy — replace with organisational legal hold.')
on conflict (id) do nothing;
