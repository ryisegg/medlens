-- MedLens Supabase schema foundation
-- Run this in the Supabase SQL editor after creating a Supabase project.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  plan text not null default 'free' check (plan in ('free', 'plus', 'pro')),
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.medication_schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  medication_name text not null,
  dosage text not null default '',
  frequency text not null,
  times text[] not null default '{}',
  start_date date not null,
  end_date date,
  notes text,
  linked_cabinet_item_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dose_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  schedule_id uuid not null references public.medication_schedules(id) on delete cascade,
  dose_date date not null,
  dose_time time not null,
  status text not null check (status in ('upcoming', 'taken', 'missed', 'skipped')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (schedule_id, dose_date, dose_time)
);

create table if not exists public.cabinet_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  medication_name text not null,
  generic_name text,
  strength text,
  quantity integer not null default 0 check (quantity >= 0),
  dosage_form text,
  expiration_date date,
  type text not null check (type in ('OTC', 'Prescription')),
  storage_location text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.medication_schedules
  add constraint medication_schedules_linked_cabinet_item_id_fkey
  foreign key (linked_cabinet_item_id)
  references public.cabinet_items(id)
  on delete set null;

alter table public.profiles enable row level security;
alter table public.medication_schedules enable row level security;
alter table public.dose_logs enable row level security;
alter table public.cabinet_items enable row level security;

create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can read own schedules" on public.medication_schedules
  for select using (auth.uid() = user_id);

create policy "Users can insert own schedules" on public.medication_schedules
  for insert with check (auth.uid() = user_id);

create policy "Users can update own schedules" on public.medication_schedules
  for update using (auth.uid() = user_id);

create policy "Users can delete own schedules" on public.medication_schedules
  for delete using (auth.uid() = user_id);

create policy "Users can read own dose logs" on public.dose_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert own dose logs" on public.dose_logs
  for insert with check (auth.uid() = user_id);

create policy "Users can update own dose logs" on public.dose_logs
  for update using (auth.uid() = user_id);

create policy "Users can delete own dose logs" on public.dose_logs
  for delete using (auth.uid() = user_id);

create policy "Users can read own cabinet items" on public.cabinet_items
  for select using (auth.uid() = user_id);

create policy "Users can insert own cabinet items" on public.cabinet_items
  for insert with check (auth.uid() = user_id);

create policy "Users can update own cabinet items" on public.cabinet_items
  for update using (auth.uid() = user_id);

create policy "Users can delete own cabinet items" on public.cabinet_items
  for delete using (auth.uid() = user_id);
