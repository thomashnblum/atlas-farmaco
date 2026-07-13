-- ============================================================================
-- Atlas Fármaco — potência funcional (IC50/EC50) nas interações PD
-- ============================================================================
-- Já aplicado em produção (2026-07-12) via Management API. Este arquivo documenta
-- a mudança e serve para reprovisionar o schema se necessário.
--
-- Motivo: o campo `affinity_ki` (Ki de LIGAÇÃO) só faz sentido para quem se liga a
-- receptor/transportador. Para canais iônicos e enzimas (ex.: memantina/cetamina
-- no NMDA), a métrica correta é a potência FUNCIONAL (IC50/EC50). Estas colunas
-- guardam esse valor (em nM) para exibição quando o Ki é nulo.
-- ============================================================================

alter table public.pd_interactions add column if not exists functional_potency numeric;
alter table public.pd_interactions add column if not exists potency_type text;  -- 'IC50' | 'EC50'

-- Valores consolidados (os demais alvos de canal/enzima seguem sem número por não
-- terem IC50 de consenso; a NAC segue sem métrica por agir de forma indireta):
update public.pd_interactions
  set functional_potency = 1000, potency_type = 'IC50'
  where molecule_id = 'm48' and receptor_id = 'r19';  -- Memantina @ NMDA (~1 µM, baixa afinidade)

update public.pd_interactions
  set functional_potency = 500, potency_type = 'IC50'
  where molecule_id = 'm50' and receptor_id = 'r19';  -- Cetamina/Esketamina @ NMDA (~0,5 µM)
