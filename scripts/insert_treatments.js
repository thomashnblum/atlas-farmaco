import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = 'https://dzckdgirwqpxmtjrmeag.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error("No service role key found!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const treatmentRules = [
  // TAG
  { disorder: 'tr_tag', drug: 'Escitalopram', line: '1ª Linha' },
  { disorder: 'tr_tag', drug: 'Sertralina', line: '1ª Linha' },
  { disorder: 'tr_tag', drug: 'Paroxetina', line: '1ª Linha' },
  { disorder: 'tr_tag', drug: 'Venlafaxina', line: '1ª Linha' },
  { disorder: 'tr_tag', drug: 'Duloxetina', line: '1ª Linha' },
  { disorder: 'tr_tag', drug: 'Pregabalina', line: '1ª Linha' },
  { disorder: 'tr_tag', drug: 'Clonazepam', line: '2ª Linha' },
  { disorder: 'tr_tag', drug: 'Buspirona', line: '2ª Linha' },
  { disorder: 'tr_tag', drug: 'Quetiapina', line: 'Adjuvante' },
  
  // TDM
  { disorder: 'tr_mdd', drug: 'Sertralina', line: '1ª Linha' },
  { disorder: 'tr_mdd', drug: 'Escitalopram', line: '1ª Linha' },
  { disorder: 'tr_mdd', drug: 'Fluoxetina', line: '1ª Linha' },
  { disorder: 'tr_mdd', drug: 'Bupropiona', line: '1ª Linha' },
  { disorder: 'tr_mdd', drug: 'Venlafaxina', line: '1ª Linha' },
  { disorder: 'tr_mdd', drug: 'Mirtazapina', line: '1ª Linha' },
  { disorder: 'tr_mdd', drug: 'Vortioxetina', line: '1ª Linha' },
  { disorder: 'tr_mdd', drug: 'Agomelatina', line: '1ª Linha' },
  { disorder: 'tr_mdd', drug: 'Amitriptilina', line: '2ª Linha' },
  { disorder: 'tr_mdd', drug: 'Nortriptilina', line: '2ª Linha' },
  { disorder: 'tr_mdd', drug: 'Aripiprazol', line: 'Adjuvante' },
  { disorder: 'tr_mdd', drug: 'Quetiapina', line: 'Adjuvante' },
  { disorder: 'tr_mdd', drug: 'Lítio', line: 'Adjuvante' },
  { disorder: 'tr_mdd', drug: 'Cetamina (Esketamina)', line: 'Refratária' },
  { disorder: 'tr_mdd', drug: 'Tranilcipromina', line: 'Refratária' },
  
  // TDAH
  { disorder: 'tr_tdah', drug: 'Lisdexanfetamina', line: '1ª Linha' },
  { disorder: 'tr_tdah', drug: 'Metilfenidato', line: '1ª Linha' },
  { disorder: 'tr_tdah', drug: 'Atomoxetina', line: '2ª Linha' },
  { disorder: 'tr_tdah', drug: 'Bupropiona', line: 'Off-label' },
  
  // Esquizofrenia
  { disorder: 'tr_sz', drug: 'Risperidona', line: '1ª Linha' },
  { disorder: 'tr_sz', drug: 'Olanzapina', line: '1ª Linha' },
  { disorder: 'tr_sz', drug: 'Aripiprazol', line: '1ª Linha' },
  { disorder: 'tr_sz', drug: 'Quetiapina', line: '1ª Linha' },
  { disorder: 'tr_sz', drug: 'Ziprasidona', line: '1ª Linha' },
  { disorder: 'tr_sz', drug: 'Haloperidol', line: '2ª Linha' },
  { disorder: 'tr_sz', drug: 'Clozapina', line: 'Refratária' },

  // Bipolar 1
  { disorder: 'tr_bipolar_1', drug: 'Lítio', line: '1ª Linha' },
  { disorder: 'tr_bipolar_1', drug: 'Valproato', line: '1ª Linha' },
  { disorder: 'tr_bipolar_1', drug: 'Quetiapina', line: '1ª Linha' },
  { disorder: 'tr_bipolar_1', drug: 'Aripiprazol', line: '1ª Linha' },
  { disorder: 'tr_bipolar_1', drug: 'Olanzapina', line: '1ª Linha' },
  { disorder: 'tr_bipolar_1', drug: 'Risperidona', line: '1ª Linha' },
  { disorder: 'tr_bipolar_1', drug: 'Carbamazepina', line: '2ª Linha' },
  { disorder: 'tr_bipolar_1', drug: 'Haloperidol', line: '2ª Linha' },
  { disorder: 'tr_bipolar_1', drug: 'Clozapina', line: 'Refratária' },
  
  // Bipolar 2
  { disorder: 'tr_bipolar_2', drug: 'Quetiapina', line: '1ª Linha' },
  { disorder: 'tr_bipolar_2', drug: 'Lamotrigina', line: '1ª Linha' },
  { disorder: 'tr_bipolar_2', drug: 'Lítio', line: '2ª Linha' },
  { disorder: 'tr_bipolar_2', drug: 'Valproato', line: '2ª Linha' },
  { disorder: 'tr_bipolar_2', drug: 'Sertralina', line: 'Adjuvante' }, // Cautela extrema

  // TOC
  { disorder: 'tr_ocd', drug: 'Fluoxetina', line: '1ª Linha' },
  { disorder: 'tr_ocd', drug: 'Fluvoxamina', line: '1ª Linha' },
  { disorder: 'tr_ocd', drug: 'Sertralina', line: '1ª Linha' },
  { disorder: 'tr_ocd', drug: 'Paroxetina', line: '1ª Linha' },
  { disorder: 'tr_ocd', drug: 'Clomipramina', line: '2ª Linha' },
  { disorder: 'tr_ocd', drug: 'Aripiprazol', line: 'Adjuvante' },
  { disorder: 'tr_ocd', drug: 'Risperidona', line: 'Adjuvante' },

  // TEPT
  { disorder: 'tr_ptsd', drug: 'Sertralina', line: '1ª Linha' },
  { disorder: 'tr_ptsd', drug: 'Paroxetina', line: '1ª Linha' },
  { disorder: 'tr_ptsd', drug: 'Fluoxetina', line: '1ª Linha' },
  { disorder: 'tr_ptsd', drug: 'Venlafaxina', line: '1ª Linha' },
  { disorder: 'tr_ptsd', drug: 'Mirtazapina', line: '2ª Linha' },
  { disorder: 'tr_ptsd', drug: 'Quetiapina', line: 'Adjuvante' },
  
  // Pânico
  { disorder: 'tr_panico', drug: 'Sertralina', line: '1ª Linha' },
  { disorder: 'tr_panico', drug: 'Paroxetina', line: '1ª Linha' },
  { disorder: 'tr_panico', drug: 'Escitalopram', line: '1ª Linha' },
  { disorder: 'tr_panico', drug: 'Venlafaxina', line: '1ª Linha' },
  { disorder: 'tr_panico', drug: 'Clonazepam', line: 'Adjuvante' },
  { disorder: 'tr_panico', drug: 'Alprazolam', line: 'Adjuvante' },
  
  // Fobia Social
  { disorder: 'tr_social', drug: 'Escitalopram', line: '1ª Linha' },
  { disorder: 'tr_social', drug: 'Sertralina', line: '1ª Linha' },
  { disorder: 'tr_social', drug: 'Paroxetina', line: '1ª Linha' },
  { disorder: 'tr_social', drug: 'Venlafaxina', line: '1ª Linha' },
  { disorder: 'tr_social', drug: 'Clonazepam', line: 'Adjuvante' },
  { disorder: 'tr_social', drug: 'Pregabalina', line: 'Adjuvante' },

  // Insônia
  { disorder: 'tr_insonia', drug: 'Zolpidem', line: '1ª Linha' },
  { disorder: 'tr_insonia', drug: 'Zopiclona', line: '1ª Linha' },
  { disorder: 'tr_insonia', drug: 'Eszopiclona', line: '1ª Linha' },
  { disorder: 'tr_insonia', drug: 'Trazodona', line: 'Off-label' },
  { disorder: 'tr_insonia', drug: 'Mirtazapina', line: 'Off-label' },
  { disorder: 'tr_insonia', drug: 'Quetiapina', line: 'Off-label' },
  
  // Borderline
  { disorder: 'tr_borderline', drug: 'Aripiprazol', line: 'Adjuvante' },
  { disorder: 'tr_borderline', drug: 'Olanzapina', line: 'Adjuvante' },
  { disorder: 'tr_borderline', drug: 'Quetiapina', line: 'Adjuvante' },
  { disorder: 'tr_borderline', drug: 'Valproato', line: 'Adjuvante' },
  { disorder: 'tr_borderline', drug: 'Lamotrigina', line: 'Adjuvante' },
  { disorder: 'tr_borderline', drug: 'Fluoxetina', line: 'Adjuvante' },

  // Anorexia
  { disorder: 'tr_eating_an', drug: 'Olanzapina', line: 'Adjuvante' },
  { disorder: 'tr_eating_an', drug: 'Fluoxetina', line: 'Adjuvante' }, // Apenas após restauração de peso
  
  // Bulimia
  { disorder: 'tr_eating_bn', drug: 'Fluoxetina', line: '1ª Linha' },
  { disorder: 'tr_eating_bn', drug: 'Sertralina', line: '2ª Linha' },
  { disorder: 'tr_eating_bn', drug: 'Lisdexanfetamina', line: 'Off-label' }, // Oficial p/ TCAP, não bulimia estrita

  // Álcool
  { disorder: 'tr_sud_alcohol', drug: 'Naltrexona', line: '1ª Linha' },
  { disorder: 'tr_sud_alcohol', drug: 'Diazepam', line: '1ª Linha' }, // Para desintoxicação aguda

  // TDPM
  { disorder: 'tr_pmdd', drug: 'Sertralina', line: '1ª Linha' },
  { disorder: 'tr_pmdd', drug: 'Fluoxetina', line: '1ª Linha' },
  { disorder: 'tr_pmdd', drug: 'Paroxetina', line: '1ª Linha' },
  { disorder: 'tr_pmdd', drug: 'Escitalopram', line: '1ª Linha' },

  // Alzheimer
  { disorder: 'tr_demencia_alz', drug: 'Memantina', line: 'Adjuvante' },
  { disorder: 'tr_demencia_alz', drug: 'Risperidona', line: 'Off-label' } // Para agitação severa (com blackbox warning)
];

async function run() {
  console.log("Fetching molecules...");
  const { data: molecules, error: errMol } = await supabase.from('molecules').select('id, name');
  if (errMol) throw errMol;

  const molMap = {};
  molecules.forEach(m => molMap[m.name.toLowerCase()] = m.id);

  console.log("Fetching disorders...");
  const { data: disorders, error: errDis } = await supabase.from('disorders').select('id, name');
  if (errDis) throw errDis;

  const disMap = {};
  disorders.forEach(d => disMap[d.id] = d.id);

  const treatmentsToInsert = [];

  for (const rule of treatmentRules) {
    const molId = molMap[rule.drug.toLowerCase()];
    if (!molId) {
      console.warn(`Molecule not found: ${rule.drug}`);
      continue;
    }
    if (!disMap[rule.disorder]) {
      console.warn(`Disorder not found: ${rule.disorder}`);
      continue;
    }
    treatmentsToInsert.push({
      id: crypto.randomUUID(),
      disorder_id: rule.disorder,
      molecule_id: molId,
      line: rule.line
    });
  }

  console.log(`Inserting ${treatmentsToInsert.length} treatments...`);
  
  // Limpar antigos para não duplicar se rodar de novo
  await supabase.from('disorder_treatments').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const { data, error } = await supabase.from('disorder_treatments').insert(treatmentsToInsert);
  
  if (error) {
    console.error("Error inserting treatments:", error);
  } else {
    console.log("Successfully inserted treatments!");
  }
}

run();
