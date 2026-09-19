create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_scholarships (
  user_id uuid not null references auth.users(id) on delete cascade,
  scholarship_id text not null,
  stage text not null default 'Interested',
  saved_at timestamptz not null default now(),
  primary key (user_id, scholarship_id)
);

create table if not exists public.user_notes (
  user_id uuid not null references auth.users(id) on delete cascade,
  scholarship_id text not null,
  note text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, scholarship_id)
);

alter table public.profiles enable row level security;
alter table public.user_scholarships enable row level security;
alter table public.user_notes enable row level security;

drop policy if exists "profiles_self_select" on public.profiles;
drop policy if exists "profiles_self_insert" on public.profiles;
drop policy if exists "profiles_self_update" on public.profiles;
drop policy if exists "saved_self_all" on public.user_scholarships;
drop policy if exists "notes_self_all" on public.user_notes;

create policy "profiles_self_select" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_self_insert" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_self_update" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "saved_self_all" on public.user_scholarships for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "notes_self_all" on public.user_notes for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
