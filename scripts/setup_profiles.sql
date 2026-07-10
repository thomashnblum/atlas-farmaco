-- ============================================================================
-- Atlas Fármaco — camada de assinatura (perfis premium)
-- ============================================================================
-- Rode este script UMA vez no Supabase:
--   Painel do Supabase → SQL Editor → New query → cole tudo → Run.
--
-- O que ele faz:
--   1. Cria a tabela public.profiles (1 linha por usuário) com a flag is_premium.
--   2. Liga RLS: cada usuário só LÊ o próprio perfil e NÃO pode se tornar premium
--      sozinho (a flag só é alterada pelo painel ou, no futuro, pelo webhook de
--      pagamento com a Service Role Key).
--   3. Cria automaticamente um perfil quando um novo usuário se cadastra.
--   4. Preenche perfis para usuários que já existem hoje.
-- ============================================================================

-- 1. Tabela de perfis
create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text,
  is_premium          boolean not null default false,
  plan                text,
  subscription_status text,
  updated_at          timestamptz not null default now()
);

-- 2. Row Level Security
alter table public.profiles enable row level security;

-- Usuário lê apenas o próprio perfil.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Observação: NÃO criamos policy de UPDATE/INSERT para usuários comuns de
-- propósito. Assim ninguém consegue se marcar como premium pelo app. A flag é
-- alterada só pelo painel do Supabase ou pela Service Role Key (webhook futuro).

-- 3. Cria o perfil automaticamente a cada novo cadastro
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
  for each row execute function public.handle_new_user();

-- 4. Backfill: cria perfis para quem já se cadastrou antes desta migração
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;

-- ============================================================================
-- Como tornar alguém premium (manualmente, enquanto não há checkout):
--   update public.profiles set is_premium = true where email = 'pessoa@exemplo.com';
-- Como reverter:
--   update public.profiles set is_premium = false where email = 'pessoa@exemplo.com';
-- ============================================================================
