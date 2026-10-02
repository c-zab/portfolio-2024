-- HB34 guests (flat, online)
-- Run once in Supabase Dashboard → SQL Editor.
--
-- Seed in Table Editor (or INSERT) with what you already know:
--   name, from_canada, avatar_seed
-- Leave phone / attending / meats / note / plus_one for RSVP later.
-- Example:
--   insert into public.guests (name, from_canada, avatar_seed)
--   values ('Diego', false, 'diego'), ('Alex', true, 'alex');
--
-- Phone is dashboard/API-only — not in guests_public.
-- Canada / not-attending → all wants_* must stay false (CHECK + enforce in API later).

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  from_canada boolean not null default false,
  avatar_seed text not null,
  attending boolean,
  plus_one boolean not null default false,
  note text,
  wants_chorizo boolean not null default false,
  wants_pollo boolean not null default false,
  wants_chuleta boolean not null default false,
  wants_costilla boolean not null default false,
  wants_vacio boolean not null default false,
  wants_cuadril boolean not null default false,
  wants_picana boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint guests_meats_off_when_canada_or_declined check (
    (
      not from_canada
      and (attending is distinct from false)
    )
    or (
      wants_chorizo = false
      and wants_pollo = false
      and wants_chuleta = false
      and wants_costilla = false
      and wants_vacio = false
      and wants_cuadril = false
      and wants_picana = false
    )
  )
);

create index if not exists guests_attending_idx on public.guests (attending);
create index if not exists guests_name_idx on public.guests (name);

create or replace function public.set_guests_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists guests_set_updated_at on public.guests;

create trigger guests_set_updated_at
before update on public.guests
for each row
execute function public.set_guests_updated_at();

alter table public.guests enable row level security;

-- Public-safe projection (no phone). Wire grants/policies when the HB34 API lands.
create or replace view public.guests_public
with (security_invoker = true)
as
select
  id,
  name,
  from_canada,
  avatar_seed,
  attending,
  plus_one,
  note,
  wants_chorizo,
  wants_pollo,
  wants_chuleta,
  wants_costilla,
  wants_vacio,
  wants_cuadril,
  wants_picana,
  created_at,
  updated_at
from public.guests;

-- Totals example (run in SQL Editor when you want counts):
--   select count(*) from public.guests
--   where attending = true and not from_canada and wants_chorizo;
