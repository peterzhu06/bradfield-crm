-- ============================================================
-- Bradfield Advisors CRM — Supabase schema
-- Run this once in the Supabase SQL editor (Dashboard → SQL).
-- ============================================================

-- One generic table holds every collection as JSON documents.
-- collection = 'DEALS' | 'TASKS' | 'CONTACTS' | ... | '_settings'
create table if not exists public.records (
  collection  text        not null,
  id          text        not null,
  position    integer     not null default 0,
  data        jsonb       not null,
  updated_at  timestamptz not null default now(),
  updated_by  uuid        references auth.users (id) on delete set null,
  primary key (collection, id)
);

create index if not exists records_collection_position_idx on public.records (collection, position);

-- Keep updated_at honest even if a client forgets to set it
create or replace function public.records_touch() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  if new.updated_by is null then new.updated_by := auth.uid(); end if;
  return new;
end $$;

drop trigger if exists records_touch on public.records;
create trigger records_touch before insert or update on public.records
  for each row execute function public.records_touch();

-- ── Security: only signed-in users, and they can do everything ──
alter table public.records enable row level security;

drop policy if exists "authenticated read"   on public.records;
drop policy if exists "authenticated insert" on public.records;
drop policy if exists "authenticated update" on public.records;
drop policy if exists "authenticated delete" on public.records;

create policy "authenticated read"   on public.records for select to authenticated using (true);
create policy "authenticated insert" on public.records for insert to authenticated with check (true);
create policy "authenticated update" on public.records for update to authenticated using (true) with check (true);
create policy "authenticated delete" on public.records for delete to authenticated using (true);

-- No anonymous access at all
revoke all on public.records from anon;
grant select, insert, update, delete on public.records to authenticated;

-- ── Realtime: broadcast every change so other users' screens update ──
alter table public.records replica identity full;
do $$
begin
  if not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'records'
  ) then
    alter publication supabase_realtime add table public.records;
  end if;
end $$;

-- ── Optional: simple audit trail of every write ──
create table if not exists public.records_history (
  seq         bigserial primary key,
  collection  text not null,
  id          text not null,
  action      text not null,          -- INSERT / UPDATE / DELETE
  data        jsonb,
  changed_at  timestamptz not null default now(),
  changed_by  uuid
);
alter table public.records_history enable row level security;
drop policy if exists "authenticated read history" on public.records_history;
create policy "authenticated read history" on public.records_history for select to authenticated using (true);

create or replace function public.records_audit() returns trigger
language plpgsql security definer as $$
begin
  if tg_op = 'DELETE' then
    insert into public.records_history (collection, id, action, data, changed_by)
      values (old.collection, old.id, tg_op, old.data, auth.uid());
    return old;
  else
    insert into public.records_history (collection, id, action, data, changed_by)
      values (new.collection, new.id, tg_op, new.data, auth.uid());
    return new;
  end if;
end $$;

drop trigger if exists records_audit on public.records;
create trigger records_audit after insert or update or delete on public.records
  for each row execute function public.records_audit();
