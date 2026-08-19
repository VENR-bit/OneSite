-- ═══════════════════════════════════════════════════════════════
--  Rideekanda — Herbal Plant Planting Programme
--  Database setup. Run ONCE in the Supabase SQL Editor:
--    Supabase dashboard → SQL Editor → New query → paste → Run
--
--  Safe to re-run: every statement is idempotent.
-- ═══════════════════════════════════════════════════════════════

-- ── 1. The pledge table ────────────────────────────────────────
-- One row per pledge: someone promising to bring and plant a tree.
-- `token` is the private key that lets that person (and nobody else)
-- attach their planting photo later. It is never exposed publicly.
create table if not exists public.plant_pledges (
  id             bigint generated always as identity primary key,
  plant_no       integer,
  plant_list     text        not null check (plant_list in ('programme','reference')),
  sinhala        text,
  sinhala_script text,
  english        text,
  scientific     text        not null,
  pledger_name   text        not null check (length(trim(pledger_name)) between 1 and 80),
  contact        text        check (contact is null or length(contact) <= 120),
  qty            integer     not null default 1 check (qty between 1 and 50),
  note           text        check (note is null or length(note) <= 300),
  photo_path     text,
  photo_status   text        not null default 'none'
                             check (photo_status in ('none','pending','approved','rejected')),
  planted_at     timestamptz,
  created_at     timestamptz not null default now(),
  token          uuid        not null default gen_random_uuid()
);

create index if not exists plant_pledges_scientific_idx on public.plant_pledges (scientific);
create index if not exists plant_pledges_created_idx    on public.plant_pledges (created_at desc);
create unique index if not exists plant_pledges_token_idx on public.plant_pledges (token);

-- ── 2. Public view — everything EXCEPT the token ───────────────
-- The site reads this. Because a view runs with its owner's rights,
-- visitors can read pledges without being able to read tokens.
create or replace view public.plant_pledges_public as
  select id, plant_no, plant_list, sinhala, sinhala_script, english, scientific,
         pledger_name, qty, note, photo_path, photo_status, planted_at, created_at
  from public.plant_pledges;

-- ── 3. Attaching a planting photo ──────────────────────────────
-- Called by the pledger's private link. Verifies the token server-side,
-- so a photo can only ever be attached to the matching pledge, and marks
-- it 'pending' so it stays hidden until the monastery approves it.
create or replace function public.attach_plant_photo(p_token uuid, p_path text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.plant_pledges
     set photo_path   = p_path,
         photo_status = 'pending',
         planted_at   = coalesce(planted_at, now())
   where token = p_token;
  return found;
end;
$$;

-- ── 4. Permissions ─────────────────────────────────────────────
alter table public.plant_pledges enable row level security;

-- Visitors may create a pledge, and nothing else on the base table.
drop policy if exists "anon can pledge" on public.plant_pledges;
create policy "anon can pledge" on public.plant_pledges
  for insert to anon with check (true);

-- Moderation (approve / reject a submitted photo) from the admin page.
drop policy if exists "anon can moderate photos" on public.plant_pledges;
create policy "anon can moderate photos" on public.plant_pledges
  for update to anon using (true) with check (true);

revoke all on public.plant_pledges from anon;
grant insert on public.plant_pledges to anon;
grant update (photo_status) on public.plant_pledges to anon;  -- moderation only
grant select on public.plant_pledges_public to anon;
grant execute on function public.attach_plant_photo(uuid, text) to anon;

-- ── 5. Photo storage ───────────────────────────────────────────
-- A public-read bucket; uploads are named after the secret token, so
-- the path cannot be guessed.
insert into storage.buckets (id, name, public)
  values ('plant-photos', 'plant-photos', true)
  on conflict (id) do update set public = true;

drop policy if exists "anon can upload plant photos" on storage.objects;
create policy "anon can upload plant photos" on storage.objects
  for insert to anon with check (bucket_id = 'plant-photos');

drop policy if exists "anyone can view plant photos" on storage.objects;
create policy "anyone can view plant photos" on storage.objects
  for select using (bucket_id = 'plant-photos');

-- ═══════════════════════════════════════════════════════════════
--  Done. Check it worked:
--    select count(*) from public.plant_pledges_public;   -- should return 0
-- ═══════════════════════════════════════════════════════════════
