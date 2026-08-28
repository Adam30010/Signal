-- ═══════════════════════════════════════════════════════════════════════
-- SIGNAL — Supabase schema (PostgreSQL + pgvector + PostGIS)
-- Run this in the Supabase SQL editor. Mirrors PRD §6.
-- ═══════════════════════════════════════════════════════════════════════

-- Extensions
create extension if not exists vector;
create extension if not exists postgis;

-- ── Core tables ─────────────────────────────────────────────────────────

create table if not exists public.quiz_sessions (
  session_id          uuid primary key default gen_random_uuid(),
  liquid_capital_cents bigint,
  weekly_hours        smallint check (weekly_hours between 0 and 60),
  risk_tolerance      text check (risk_tolerance in ('safe','balanced','degenerate')),
  time_horizon_days   smallint,
  trait_introversion  numeric(3,2),
  trait_conscientious numeric(3,2),
  trait_openness      numeric(3,2),
  hard_constraints    jsonb default '{}',
  existing_skills     text[],
  geo_point           geography(Point,4326),
  current_step        smallint default 1,
  completed_at        timestamptz,
  abandoned_at        timestamptz,
  created_at          timestamptz default now()
);

create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  email         citext unique not null,
  status        text not null default 'active',
  role          text not null default 'user',           -- user | support | moderator | editor | super_admin
  quiz_session_id uuid references public.quiz_sessions(session_id),
  geo_point     geography(Point,4326),
  consent_counted bool default true,
  locale        text default 'en',
  created_at    timestamptz default now()
);

create table if not exists public.oauth_connections (
  id             bigserial primary key,
  user_id        uuid not null references public.users(id),
  provider       text not null check (provider in ('youtube','instagram')),
  encrypted_token bytea not null,
  scopes         text[],
  expires_at     timestamptz,
  status         text default 'active',
  provider_user_id text,
  created_at     timestamptz default now(),
  unique (user_id, provider)
);

create table if not exists public.uploads (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id),
  storage_key  text not null,
  filename     text not null,
  format       text,
  status       text default 'uploaded',
  checkpoint   jsonb,
  byte_size    bigint,
  created_at   timestamptz default now()
);

create table if not exists public.consumption_events (
  id            bigserial primary key,
  user_id       uuid not null references public.users(id),
  source        text not null check (source in ('youtube','tiktok','instagram')),
  ingest_method text not null check (ingest_method in ('oauth','export')),
  provider_event_id text,
  title         text not null,
  channel       text,
  tags          text[],
  watched_at    timestamptz,
  raw           jsonb,
  embedding     vector(1536),
  created_at    timestamptz default now(),
  unique (source, provider_event_id)
);

create table if not exists public.consumption_clusters (
  id            bigserial primary key,
  user_id       uuid not null references public.users(id),
  cluster_index int not null,
  label         text,
  evidence_ids  bigint[],
  created_at    timestamptz default now(),
  unique (user_id, cluster_index)
);

create table if not exists public.user_skill_vectors (
  user_id        uuid references public.users(id),
  skill_label    text,
  embedding      vector(1536),
  confidence     numeric(3,2),
  recency_weight numeric(3,2),
  primary key (user_id, skill_label)
);

create table if not exists public.opportunities (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  title             text not null,
  category          text not null,
  description       text not null,
  capital_floor_cents bigint,
  min_weekly_hours  smallint,
  requires_camera   bool default false,
  requires_cold_calls bool default false,
  base_density_score numeric(4,1),
  status            text default 'draft',
  published_at      timestamptz,
  created_at        timestamptz default now()
);

create table if not exists public.opportunity_vectors (
  opportunity_id uuid primary key references public.opportunities(id),
  embedding      vector(1536),
  capital_floor_cents bigint,
  min_weekly_hours    smallint,
  requires_camera     bool,
  base_density_score  numeric(4,1)
);

create table if not exists public.blueprints (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users(id),
  opportunity_id   uuid not null references public.opportunities(id),
  tier             text not null default 'basic',
  nodes            jsonb not null,
  density_snapshot numeric(4,1),
  geo_point        geography(Point,4326),
  suppressed       bool default false,
  created_at       timestamptz default now()
);

create table if not exists public.local_licenses (
  id              uuid primary key default gen_random_uuid(),
  opportunity_id  uuid not null references public.opportunities(id),
  country_code    text not null,
  region_code     text not null,
  owner_user_id   uuid not null references public.users(id),
  stripe_event_id text unique not null,
  locked_at       timestamptz default now(),
  unique (opportunity_id, country_code, region_code)
);

create table if not exists public.density_snapshots (
  opportunity_id uuid not null references public.opportunities(id),
  global_density numeric(4,1) not null,
  components     jsonb not null,
  weight_version int not null,
  computed_at    timestamptz default now(),
  primary key (opportunity_id, computed_at)
);

create table if not exists public.search_trajectories (
  opportunity_id uuid not null references public.opportunities(id),
  sampled_on     date not null,
  search_volume  numeric(10,2),
  slope          numeric(10,4),
  primary key (opportunity_id, sampled_on)
);

create table if not exists public.provisioned_assets (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id),
  tool          text not null,
  resource_id   text,
  affiliate_ref text,
  status        text default 'provisioning',
  created_at    timestamptz default now()
);

create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  buyer_id          uuid not null references public.users(id),
  worker_id         uuid references public.users(id),
  opportunity_id    uuid references public.opportunities(id),
  amount_cents      bigint not null,
  platform_fee_cents bigint not null,
  currency          text not null default 'usd',
  status            text not null default 'created',
  stripe_intent_id  text unique,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Site admin / demo tables
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text not null,
  message    text not null,
  read       bool default false,
  created_at timestamptz default now()
);

create table if not exists public.utm_events (
  id           uuid primary key default gen_random_uuid(),
  source       text,
  medium       text,
  campaign     text,
  page         text,
  captured_at  timestamptz default now()
);

-- ── Indexes ─────────────────────────────────────────────────────────────

create index if not exists idx_blueprints_geo on public.blueprints using gist (geo_point);
create index if not exists idx_users_geo on public.users using gist (geo_point);
create index if not exists idx_ce_embedding on public.consumption_events using hnsw (embedding vector_cosine_ops);
create index if not exists idx_usv_embedding on public.user_skill_vectors using hnsw (embedding vector_cosine_ops);
create index if not exists idx_ov_embedding on public.opportunity_vectors using hnsw (embedding vector_cosine_ops);
create index if not exists idx_licenses_region on public.local_licenses (country_code, region_code);

-- ── RPC functions (called via lib/db.js rpc()) ─────────────────────────

create or replace function public.local_density_count(
  p_opp_id uuid,
  p_lat double precision,
  p_lng double precision,
  p_radius_m double precision default 40233.6
) returns integer
language sql stable
as $$
  select count(*)::int
  from public.blueprints b
  where b.opportunity_id = p_opp_id
    and b.suppressed = false
    and st_dwithin(b.geo_point, st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography, p_radius_m);
$$;

-- ── Row Level Security (production default: everything locked) ─────────

alter table public.quiz_sessions enable row level security;
alter table public.users enable row level security;
alter table public.consumption_events enable row level security;
alter table public.blueprints enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;

-- Authenticated users manage their own rows; admins via service role.
create policy "own quiz sessions" on public.quiz_sessions
  for all using (true) with check (true); -- anonymous sessions pre-auth

create policy "own users row" on public.users
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own events" on public.consumption_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own blueprints" on public.blueprints
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own orders" on public.orders
  for all using (auth.uid() = buyer_id) with check (auth.uid() = buyer_id);

create policy "messages insert only" on public.messages
  for insert with check (true);

-- ── Seed: curated opportunities (FR-VM-07) ─────────────────────────────

insert into public.opportunities (slug, title, category, description, capital_floor_cents, min_weekly_hours, requires_camera, requires_cold_calls, base_density_score, status, published_at)
values
  ('3d-environment-art-services', '3D Environment Art Services', 'creative-services', 'Sell environment art / scene asset services to indie game studios and archviz firms.', 0, 8, false, false, 42.3, 'published', now()),
  ('video-editing-for-creators', 'Video Editing Retainers for Creators', 'creative-services', 'Monthly editing retainers for YouTube/TikTok creators.', 0, 5, false, false, 57.8, 'published', now()),
  ('webflow-website-agency', 'Webflow / Framer Website Agency', 'agency', 'No-code website builds for local businesses.', 0, 10, false, false, 61.2, 'published', now()),
  ('notion-ops-consulting', 'Notion / Ops Systems Consulting', 'consulting', 'Sell Notion workspaces, SOPs, and automation setups to small teams.', 0, 5, false, false, 38.9, 'published', now()),
  ('local-seo-for-trades', 'Local SEO for Trades & Services', 'digital-marketing', 'Local SEO retainers for trades and service businesses.', 0, 8, false, false, 71.5, 'published', now()),
  ('scriptwriting-for-channels', 'Scriptwriting for YouTube Channels', 'creative-services', 'Research-driven scripts for faceless YouTube channels.', 0, 5, false, false, 33.4, 'published', now())
on conflict (slug) do nothing;
