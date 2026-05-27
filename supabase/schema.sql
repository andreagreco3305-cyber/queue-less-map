-- ============================================================
-- QUEUE LESS — Script database Supabase
-- ============================================================
-- COME USARLO:
-- 1. Vai su https://supabase.com/dashboard → apri il tuo progetto
-- 2. Menu sinistro → SQL Editor → + New query
-- 3. Seleziona TUTTO questo file (Cmd+A), copia (Cmd+C)
-- 4. Incolla nell'editor Supabase (Cmd+V)
-- 5. Clicca RUN (verde) oppure Cmd+Enter
-- 6. Deve comparire "Success" (verde)
-- ============================================================

-- Tabella profili (collegata agli utenti che si registrano)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Tabella ordini
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  bar_id text not null,
  bar_name text not null,
  items jsonb not null default '[]'::jsonb,
  pickup_at timestamptz not null,
  pickup_label text,
  total numeric(10, 2) not null,
  status text not null default 'confirmed',
  pickup_code text not null,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);

alter table public.orders enable row level security;

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Alla registrazione crea automaticamente il profilo
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
