-- One row per signed visitor session (see src/middleware.ts).
-- Run once in the portfolio project SQL Editor (https://supabase.com/dashboard/project/upoemmwpwqxhqfpzqmkn).
-- Safe to re-run.
--
-- The Data API cannot read or write this table: RLS is on, there are no policies,
-- and anon/authenticated have no grants. Writes go through record_site_session as service_role.

create table if not exists public.site_sessions (
  token_id uuid primary key,
  ip inet not null,
  landing_path text not null,
  last_path text not null,
  referrer text,
  user_agent text,
  country text,
  hit_count integer not null default 1,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  label text
);

alter table public.site_sessions add column if not exists label text;

create index if not exists site_sessions_last_seen_idx on public.site_sessions (last_seen desc);

alter table public.site_sessions enable row level security;

revoke all on table public.site_sessions from anon, authenticated;
grant select, insert, update on table public.site_sessions to service_role;

-- Insert, or refresh the latest IP and path without touching landing_path, referrer, or first_seen.
-- label is a readable name for this cookie (calm-otter-3dcd). Kept once it is set.
drop function if exists public.record_site_session(uuid, inet, text, text, text, text);

create or replace function public.record_site_session(
  p_token_id uuid,
  p_ip inet,
  p_path text,
  p_referrer text,
  p_user_agent text,
  p_country text,
  p_label text
) returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  insert into public.site_sessions (
    token_id,
    ip,
    landing_path,
    last_path,
    referrer,
    user_agent,
    country,
    label
  ) values (
    p_token_id,
    p_ip,
    p_path,
    p_path,
    p_referrer,
    p_user_agent,
    p_country,
    p_label
  )
  on conflict (token_id) do update set
    ip = excluded.ip,
    last_path = excluded.last_path,
    user_agent = excluded.user_agent,
    country = excluded.country,
    hit_count = public.site_sessions.hit_count + 1,
    last_seen = now(),
    label = coalesce(public.site_sessions.label, excluded.label);
end;
$$;

revoke all on function public.record_site_session(uuid, inet, text, text, text, text, text) from public;
revoke all on function public.record_site_session(uuid, inet, text, text, text, text, text) from anon, authenticated;
grant execute on function public.record_site_session(uuid, inet, text, text, text, text, text) to service_role;
