-- Services contact form (separate from party RSVPs).
-- Run once in Supabase Dashboard → SQL Editor if you use /api/contact.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  package text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Signed visitor token id (see src/utils/visitor-token.ts). Safe to re-run on an existing table.
alter table public.contact_messages add column if not exists token_id uuid;

create index if not exists contact_messages_token_id_idx on public.contact_messages (token_id);

alter table public.contact_messages enable row level security;

grant insert on table public.contact_messages to anon;

drop policy if exists "anon can insert contact messages" on public.contact_messages;

create policy "anon can insert contact messages"
on public.contact_messages
for insert
to anon
with check (true);

-- Rate limiting (see /api/contact). The client IP is stored only as an HMAC hash, never raw.
alter table public.contact_messages add column if not exists ip_hash text;

create index if not exists contact_messages_ip_hash_idx on public.contact_messages (ip_hash, created_at);

-- Rejects inserts over the limits with 'rate_limited'; /api/contact turns that into a 429.
-- security definer: the count reads rows that anon itself cannot select.
create or replace function public.contact_messages_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- One insert at a time per IP, so parallel requests can't slip past the count.
  perform pg_advisory_xact_lock(hashtext(coalesce(new.ip_hash, new.token_id::text, '')));

  if new.token_id is not null and (
    select count(*) from public.contact_messages
    where token_id = new.token_id and created_at > now() - interval '1 hour'
  ) >= 3 then
    raise exception 'rate_limited';
  end if;

  if new.ip_hash is not null and (
    select count(*) from public.contact_messages
    where ip_hash = new.ip_hash and created_at > now() - interval '1 day'
  ) >= 10 then
    raise exception 'rate_limited';
  end if;

  return new;
end;
$$;

drop trigger if exists contact_messages_rate_limit on public.contact_messages;

create trigger contact_messages_rate_limit
before insert on public.contact_messages
for each row execute function public.contact_messages_rate_limit();
