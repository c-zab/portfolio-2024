-- Clicks tied to a visitor session (see src/pages/api/event.ts and /api/contact).
-- Run once in the portfolio project SQL Editor (https://supabase.com/dashboard/project/upoemmwpwqxhqfpzqmkn).
-- Safe to re-run.
--
-- The Data API cannot read or write this table: RLS is on, there are no policies,
-- and anon/authenticated have no grants. The server writes with the service role.

create table if not exists public.site_events (
  id uuid primary key default gen_random_uuid(),
  token_id uuid not null,
  label text,
  name text not null,
  detail text,
  path text,
  created_at timestamptz not null default now(),
  constraint site_events_name_check check (
    name in ('contact_open', 'contact_mode', 'contact_sent', 'mailto', 'outbound')
  )
);

alter table public.site_events add column if not exists label text;

create index if not exists site_events_token_id_idx on public.site_events (token_id, created_at desc);
create index if not exists site_events_label_idx on public.site_events (label, created_at desc);
create index if not exists site_events_name_idx on public.site_events (name, created_at desc);

alter table public.site_events enable row level security;

revoke all on table public.site_events from anon, authenticated;
grant select, insert on table public.site_events to service_role;
