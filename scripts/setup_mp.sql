-- ============================================================================
-- Atlas Fármaco — integração Mercado Pago (Assinaturas)
-- ============================================================================
-- Rode DEPOIS de setup_profiles.sql, uma vez, no SQL Editor do Supabase.
-- Adiciona à tabela profiles o vínculo com a assinatura do Mercado Pago.
-- (as colunas plan e subscription_status já vêm de setup_profiles.sql)
-- ============================================================================

alter table public.profiles
  add column if not exists mp_preapproval_id text;

-- Busca por e-mail é usada pelo webhook para casar o pagamento com a conta.
create index if not exists profiles_email_idx on public.profiles (lower(email));
