-- Migration inicial do Supabase (§11.5)
-- Criação de tabelas, índices, função de admin e políticas de RLS

create extension if not exists pgcrypto;

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9-]{4,12}$'),
  name text not null,
  is_open boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.runs (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  player_name text not null check (char_length(player_name) between 2 and 60),
  attempt int not null default 1,
  client_token uuid not null default gen_random_uuid(),
  report_token uuid not null default gen_random_uuid(),
  content_version text not null,
  status text not null default 'in_progress'
    check (status in ('in_progress','completed','abandoned')),
  current_node text,
  state jsonb not null default '{}'::jsonb,
  scores jsonb,
  mirror jsonb,
  ending text check (ending in ('A','B','C','D')),
  consent_at timestamptz not null,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  total_ms int
);
create index runs_class_idx on public.runs (class_id, status);
create index runs_name_idx  on public.runs (class_id, lower(player_name));

create table public.choices (
  id bigint generated always as identity primary key,
  run_id uuid not null references public.runs(id) on delete cascade,
  decision_id text not null,
  option_id text not null,
  decision_type text not null check (decision_type in ('P','K','N')),
  response_ms int,
  timed_out boolean not null default false,
  chosen_at timestamptz not null default now(),
  unique (run_id, decision_id)
);
create index choices_decision_idx on public.choices (decision_id, option_id);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

alter table public.admins  enable row level security;
alter table public.classes enable row level security;
alter table public.runs    enable row level security;
alter table public.choices enable row level security;

create policy admins_self_read   on public.admins  for select using (user_id = auth.uid());
create policy classes_admin_all  on public.classes for all    using (public.is_admin()) with check (public.is_admin());
create policy runs_admin_read    on public.runs    for select using (public.is_admin());
create policy runs_admin_delete  on public.runs    for delete using (public.is_admin());
create policy choices_admin_read on public.choices for select using (public.is_admin());
-- Sem políticas para anon: alunos NUNCA acessam o banco direto.
-- Escritas de alunos passam pelas rotas /api com a chave secreta (service role), só no servidor.

-- Turma inicial para testes e partidas abertas (opcional):
insert into public.classes (code, name, is_open)
values ('GERAL', 'Turma Geral / Demonstração', true)
on conflict (code) do nothing;
