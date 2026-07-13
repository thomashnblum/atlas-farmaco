import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { molecules, receptors, enzymes, pdInteractions, pkInteractions } from '../src/data/mockData';

// Carrega as variáveis do .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('ERRO: VITE_SUPABASE_URL ou VITE_SUPABASE_SERVICE_ROLE_KEY não encontrados no .env.local');
  process.exit(1);
}

// Inicializa o cliente com a chave mestra (ignora RLS)
const supabase = createClient(supabaseUrl.replace('/rest/v1/', ''), serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSeed() {
  console.log('Iniciando o envio de dados para o Supabase...');

  // 1. Inserir Molecules
  const { error: errMol } = await supabase.from('molecules').upsert(molecules.map(m => ({
    id: m.id,
    name: m.name,
    trade_names: m.tradeNames,
    class: m.class,
    clinical_axes: m.clinicalAxes,
    mechanisms: m.mechanisms,
    notes: m.notes,
    side_effects: m.sideEffects,
    contraindications: m.contraindications,
    routes: m.routes,
    psychiatry_use: m.psychiatryUse,
    off_label_uses: m.offLabelUses,
    on_label_uses: m.onLabelUses,
    profile_symbols: m.profileSymbols
  })));
  if (errMol) console.error('Erro em molecules:', errMol);
  else console.log('✅ Moléculas inseridas com sucesso!');

  // 2. Inserir Receptors
  const { error: errRec } = await supabase.from('receptors').upsert(receptors.map(r => ({
    id: r.id,
    name: r.name,
    type: r.type,
    neurotransmitter_system: r.neurotransmitterSystem,
    description: r.description
  })));
  if (errRec) console.error('Erro em receptors:', errRec);
  else console.log('✅ Receptores inseridos com sucesso!');

  // 3. Inserir Enzymes
  const { error: errEnz } = await supabase.from('enzymes').upsert(enzymes.map(e => ({
    id: e.id,
    name: e.name,
    description: e.description,
    location: e.location
  })));
  if (errEnz) console.error('Erro em enzymes:', errEnz);
  else console.log('✅ Enzimas inseridas com sucesso!');

  // Deduplicate PD Interactions
  const uniquePd = Array.from(new Map(pdInteractions.map(pd => [`${pd.moleculeId}-${pd.receptorId}`, pd])).values());
  const { error: errPd } = await supabase.from('pd_interactions').upsert(uniquePd.map(pd => ({
    molecule_id: pd.moleculeId,
    receptor_id: pd.receptorId,
    action_type: pd.actionType,
    affinity_ki: pd.affinityKi,
    functional_potency: pd.functionalPotency ?? null,
    potency_type: pd.potencyType ?? null,
    notes: pd.notes,
    sources: pd.sources || []
  })), { onConflict: 'molecule_id,receptor_id' });
  if (errPd) console.error('Erro em PD interactions:', errPd);
  else console.log('✅ Interações PD inseridas!');

  // Deduplicate PK Interactions
  const uniquePk = Array.from(new Map(pkInteractions.map(pk => [`${pk.moleculeId}-${pk.enzymeId}`, pk])).values());
  const { error: errPk } = await supabase.from('pk_interactions').upsert(uniquePk.map(pk => ({
    molecule_id: pk.moleculeId,
    enzyme_id: pk.enzymeId,
    role: pk.role,
    notes: pk.notes,
    sources: pk.sources || []
  })), { onConflict: 'molecule_id,enzyme_id' });
  if (errPk) console.error('Erro em PK interactions:', errPk);
  else console.log('✅ Interações PK inseridas!');

  console.log('🚀 SEED FINALIZADO COM SUCESSO!');
}

runSeed();
