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

alter table public.contact_messages enable row level security;

grant insert on table public.contact_messages to anon;

drop policy if exists "anon can insert contact messages" on public.contact_messages;

create policy "anon can insert contact messages"
on public.contact_messages
for insert
to anon
with check (true);
