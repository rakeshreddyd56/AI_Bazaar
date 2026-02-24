-- AI Bazaar v1 schema (PostgreSQL + pgvector)

create extension if not exists vector;

create table if not exists listings (
  id text primary key,
  slug text unique not null,
  name text not null,
  summary_en text not null,
  summary_hi text not null,
  modalities text[] not null default '{}',
  tags text[] not null default '{}',
  capabilities jsonb not null default '{}'::jsonb,
  limitations text[] not null default '{}',
  benchmarks jsonb not null default '{}'::jsonb,
  pricing_usd jsonb,
  quickstart jsonb not null default '[]'::jsonb,
  best_for jsonb not null default '[]'::jsonb,
  avoid_when jsonb not null default '[]'::jsonb,
  samples jsonb not null default '[]'::jsonb,
  integration jsonb not null,
  risk jsonb not null,
  compliance jsonb not null,
  provenance jsonb not null,
  published boolean not null default false,
  status text not null default 'unverified',
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_status_idx on listings(status, published);
create index if not exists listings_slug_idx on listings(slug);
create index if not exists listings_modalities_idx on listings using gin(modalities);
create index if not exists listings_tags_idx on listings using gin(tags);

create table if not exists reviews (
  id text primary key,
  listing_id text not null references listings(id) on delete cascade,
  user_id text not null,
  rating int not null check (rating between 1 and 5),
  title text not null,
  body text not null,
  locale text not null,
  flagged boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists reviews_listing_idx on reviews(listing_id);
create index if not exists reviews_user_listing_idx on reviews(user_id, listing_id);

create table if not exists submissions (
  id text primary key,
  name text not null,
  website_url text not null,
  description text not null,
  modalities text[] not null,
  submitted_by text not null,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists submissions_status_idx on submissions(status);

create table if not exists ingest_runs (
  id bigserial primary key,
  source text not null,
  fetched_at timestamptz not null,
  received int not null,
  normalized int not null,
  errors jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
