-- AI Bazaar v1.5 migration: console + inference runtime tables

create table if not exists organizations (
  id text primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists organization_members (
  org_id text not null references organizations(id) on delete cascade,
  user_id text not null,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create table if not exists api_keys (
  id text primary key,
  org_id text not null references organizations(id) on delete cascade,
  label text not null,
  key_hash text not null,
  prefix text not null,
  scopes text[] not null default '{}',
  status text not null check (status in ('active', 'revoked')),
  created_by text not null,
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  revoked_at timestamptz
);

create index if not exists api_keys_org_idx on api_keys(org_id, status);

create table if not exists model_registry (
  id text primary key,
  name text not null,
  family text not null,
  provider text not null,
  provider_key text not null,
  model_class text not null check (model_class in ('open', 'closed')),
  context_length int not null,
  max_output_tokens int not null,
  runtime_state text not null check (runtime_state in ('warm', 'loading', 'cold')),
  pricing_usd jsonb,
  tags text[] not null default '{}',
  modalities text[] not null default '{}',
  source text not null,
  source_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists model_registry_family_idx on model_registry(family);
create index if not exists model_registry_state_idx on model_registry(runtime_state);

create table if not exists model_capabilities (
  model_id text primary key references model_registry(id) on delete cascade,
  supports jsonb not null default '{}'::jsonb,
  parameter_support jsonb not null default '{}'::jsonb,
  benchmark_highlights jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists model_runtime_state (
  model_id text primary key references model_registry(id) on delete cascade,
  runtime_state text not null check (runtime_state in ('warm', 'loading', 'cold')),
  queue_depth int not null default 0,
  inflight int not null default 0,
  success_rate_24h numeric(5,2) not null default 100,
  p95_latency_ms int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists provider_routes (
  id bigserial primary key,
  model_id text not null references model_registry(id) on delete cascade,
  provider_key text not null,
  route_class text not null check (route_class in ('external', 'self-hosted')),
  priority int not null default 0,
  enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists provider_routes_model_idx on provider_routes(model_id, priority desc);

create table if not exists usage_events (
  id text primary key,
  org_id text not null references organizations(id) on delete cascade,
  user_id text not null,
  key_id text references api_keys(id) on delete set null,
  model_id text not null references model_registry(id) on delete cascade,
  provider_key text not null,
  status_code int not null,
  latency_ms int not null,
  input_tokens int not null,
  output_tokens int not null,
  heavy_model boolean not null default false,
  stream boolean not null default false,
  error_code text,
  created_at timestamptz not null default now()
);

create index if not exists usage_events_org_created_idx on usage_events(org_id, created_at desc);
create index if not exists usage_events_model_created_idx on usage_events(model_id, created_at desc);

create table if not exists usage_daily_rollups (
  org_id text not null references organizations(id) on delete cascade,
  day date not null,
  requests int not null default 0,
  input_tokens bigint not null default 0,
  output_tokens bigint not null default 0,
  heavy_requests int not null default 0,
  error_count int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (org_id, day)
);

create table if not exists quota_policies (
  org_id text primary key references organizations(id) on delete cascade,
  user_daily_requests int not null default 200,
  user_daily_input_tokens int not null default 200000,
  user_daily_output_tokens int not null default 200000,
  org_daily_requests int not null default 2000,
  org_daily_input_tokens int not null default 2000000,
  org_daily_output_tokens int not null default 2000000,
  heavy_user_daily_requests int not null default 20,
  heavy_org_daily_requests int not null default 200,
  max_concurrent_user int not null default 2,
  max_concurrent_org int not null default 20,
  max_queued_user int not null default 5,
  max_queued_org int not null default 50,
  updated_at timestamptz not null default now()
);

create table if not exists request_errors (
  id text primary key,
  org_id text not null references organizations(id) on delete cascade,
  user_id text not null,
  model_id text references model_registry(id) on delete set null,
  status_code int not null,
  error_code text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists request_errors_org_created_idx on request_errors(org_id, created_at desc);

create table if not exists integration_guides (
  id text primary key,
  name text not null,
  slug text unique not null,
  content_md text not null,
  tags text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists listing_model_links (
  listing_id text not null references listings(id) on delete cascade,
  model_id text not null references model_registry(id) on delete cascade,
  confidence numeric(4,3) not null default 1.0,
  created_at timestamptz not null default now(),
  primary key (listing_id, model_id)
);
