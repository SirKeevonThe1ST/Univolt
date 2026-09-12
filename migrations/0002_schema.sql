-- SurakshaNet core schema.
-- Identity (Better Auth "user") is separate from evidence tables.
-- Prefer snake_case. Staff user_id is TEXT to match Better Auth ids.

create table if not exists scoring_config (
  key text primary key,
  weight numeric not null,
  description text not null,
  updated_at timestamptz not null default now()
);

create table if not exists staff_profiles (
  user_id text primary key,
  role text not null check (role in ('admin', 'responder', 'ngo')),
  display_name text not null,
  region text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists cases (
  id text primary key,
  public_id text not null unique,
  source text not null check (source in (
    'anonymous_tip', 'anonymous_callback', 'ingested_thread', 'synthetic_seed'
  )),
  status text not null check (status in (
    'new', 'assigned', 'in_progress', 'escalated_to_authorities', 'resolved', 'closed'
  )),
  priority text not null check (priority in ('P1', 'P2', 'P3', 'P4')),
  risk_score integer not null check (risk_score between 0 and 100),
  risk_band text not null check (risk_band in ('low', 'med', 'high', 'critical')),
  stage text not null check (stage in (
    'contact', 'trust_building', 'isolation', 'exploitation_attempt'
  )),
  language text not null,
  region_code text,
  callback_requested boolean not null default false,
  distress_flag boolean not null default false,
  assigned_to text,
  sla_due_at timestamptz,
  last_activity_at timestamptz not null default now(),
  ai_generated boolean not null default true,
  identity_sealed boolean not null default true,
  retention_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cases_priority_idx on cases (priority, sla_due_at);
create index if not exists cases_status_idx on cases (status);
create index if not exists cases_assigned_idx on cases (assigned_to);
create index if not exists cases_region_idx on cases (region_code);
create index if not exists cases_lang_idx on cases (language);

create table if not exists messages (
  id text primary key,
  case_id text not null references cases(id) on delete cascade,
  turn_index integer not null,
  speaker text not null check (speaker in ('child', 'other', 'reporter')),
  lang text not null,
  redacted_text text not null,
  raw_hash text,
  created_at timestamptz not null default now()
);

create index if not exists messages_case_idx on messages (case_id, turn_index);

create table if not exists scores (
  id text primary key,
  case_id text not null references cases(id) on delete cascade,
  message_id text,
  score integer not null,
  risk_band text not null,
  contributing_factors jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists scores_case_idx on scores (case_id, created_at);

create table if not exists flags (
  id text primary key,
  case_id text not null references cases(id) on delete cascade,
  message_id text,
  flag_type text not null,
  present boolean not null,
  evidence_label text not null,
  created_at timestamptz not null default now()
);

create index if not exists flags_case_idx on flags (case_id);

create table if not exists stage_history (
  id text primary key,
  case_id text not null references cases(id) on delete cascade,
  stage text not null,
  entered_at timestamptz not null default now(),
  reason text not null
);

create table if not exists audit_log (
  id text primary key,
  actor_id text,
  actor_role text,
  action text not null,
  resource_type text not null,
  resource_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_created_idx on audit_log (created_at desc);
create index if not exists audit_log_resource_idx on audit_log (resource_type, resource_id);

create table if not exists event_log (
  id text primary key,
  case_id text not null references cases(id) on delete cascade,
  event_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists event_log_case_idx on event_log (case_id, created_at);

create table if not exists case_notes (
  id text primary key,
  case_id text not null references cases(id) on delete cascade,
  author_id text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists access_log (
  id text primary key,
  actor_id text not null,
  resource_type text not null,
  resource_id text not null,
  purpose text not null,
  created_at timestamptz not null default now()
);

-- Identity vault: physically separated from evidence (messages / flags).
create table if not exists reporter_identity (
  id text primary key,
  case_id text not null unique references cases(id) on delete cascade,
  sealed boolean not null default true,
  encrypted_blob text,
  reveal_authorized_by text,
  reveal_authorized_at timestamptz
);

create table if not exists safety_cases (
  id text primary key,
  case_id text not null unique references cases(id) on delete cascade,
  pack jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists attachments (
  id text primary key,
  case_id text not null references cases(id) on delete cascade,
  kind text not null check (kind in ('screenshot', 'voice', 'text')),
  storage_ref text not null,
  created_at timestamptz not null default now()
);

create table if not exists retention_policy (
  id integer primary key check (id = 1),
  retain_days integer not null default 365,
  notes text not null
);
