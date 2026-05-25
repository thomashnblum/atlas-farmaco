import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

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

const disorders = [
  { id: 'tr_tag', name: 'Transtorno de Ansiedade Generalizada (TAG)', description: 'Caracterizado por ansiedade e preocupação excessivas e de difícil controle, ocorrendo na maioria dos dias por pelo menos 6 meses, associadas a sintomas físicos como tensão muscular, irritabilidade, fadiga e perturbação do sono.', cid10: 'F41.1', dsm5: '300.02' },
  { id: 'tr_mdd', name: 'Transtorno Depressivo Maior (TDM)', description: 'Presença de humor deprimido, perda de interesse ou prazer (anedonia), alterações de sono/apetite, culpa excessiva e ideação suicida por pelo menos 2 semanas, causando prejuízo significativo.', cid10: 'F32', dsm5: '296.xx' },
  { id: 'tr_tdah', name: 'Transtorno do Déficit de Atenção com Hiperatividade (TDAH)', description: 'Padrão persistente de desatenção e/ou hiperatividade-impulsividade que interfere no funcionamento ou no desenvolvimento, com início na infância.', cid10: 'F90', dsm5: '314.xx' },
  { id: 'tr_sz', name: 'Esquizofrenia', description: 'Transtorno psicótico crônico caracterizado por delírios, alucinações, discurso desorganizado, comportamento grosseiramente desorganizado e sintomas negativos (embotamento, alogia, avolia).', cid10: 'F20', dsm5: '295.90' },
  { id: 'tr_bipolar_1', name: 'Transtorno Bipolar Tipo I', description: 'Caracterizado pela ocorrência de pelo menos um episódio maníaco completo, frequentemente alternando com episódios depressivos maiores. Pode apresentar sintomas psicóticos na mania.', cid10: 'F31.1', dsm5: '296.4x' },
  { id: 'tr_bipolar_2', name: 'Transtorno Bipolar Tipo II', description: 'Caracterizado por episódios depressivos maiores alternando com pelo menos um episódio hipomaníaco (mania leve sem prejuízo extremo ou psicose).', cid10: 'F31.8', dsm5: '296.89' },
  { id: 'tr_ocd', name: 'Transtorno Obsessivo-Compulsivo (TOC)', description: 'Presença de obsessões (pensamentos intrusivos) e/ou compulsões (comportamentos repetitivos) que consomem tempo e causam sofrimento clínico significativo.', cid10: 'F42', dsm5: '300.3' },
  { id: 'tr_ptsd', name: 'Transtorno de Estresse Pós-Traumático (TEPT)', description: 'Sintomas intrusivos, evitação, alterações negativas em cognições/humor e hiperestimulação após exposição a um evento traumático extremo.', cid10: 'F43.1', dsm5: '309.81' },
  { id: 'tr_panico', name: 'Transtorno de Pânico', description: 'Ataques de pânico recorrentes e inesperados, seguidos por pelo menos um mês de preocupação persistente com novos ataques ou suas consequências.', cid10: 'F41.0', dsm5: '300.01' },
  { id: 'tr_social', name: 'Transtorno de Ansiedade Social (Fobia Social)', description: 'Medo ou ansiedade acentuados sobre uma ou mais situações sociais onde o indivíduo é exposto a possível escrutínio por outros.', cid10: 'F40.1', dsm5: '300.23' },
  { id: 'tr_insonia', name: 'Transtorno de Insônia', description: 'Insatisfação com a quantidade ou qualidade do sono (dificuldade em iniciar, manter ou despertar precoce) ocorrendo pelo menos 3 noites por semana por 3 meses.', cid10: 'G47.0 / F51.01', dsm5: '780.52' },
  { id: 'tr_borderline', name: 'Transtorno da Personalidade Borderline', description: 'Padrão de instabilidade nas relações interpessoais, autoimagem e afetos, com impulsividade acentuada, esforços frenéticos para evitar abandono e risco suicida/parassuicida.', cid10: 'F60.3', dsm5: '301.83' },
  { id: 'tr_eating_an', name: 'Anorexia Nervosa', description: 'Restrição da ingestão calórica levando a um peso corporal significativamente baixo, medo intenso de ganhar peso e perturbação na autoimagem.', cid10: 'F50.0', dsm5: '307.1' },
  { id: 'tr_eating_bn', name: 'Bulimia Nervosa', description: 'Episódios recorrentes de compulsão alimentar seguidos por comportamentos compensatórios inadequados (vômitos, laxantes, jejum) para evitar ganho de peso.', cid10: 'F50.2', dsm5: '307.51' },
  { id: 'tr_sud_alcohol', name: 'Transtorno por Uso de Álcool', description: 'Padrão problemático de uso de álcool levando a comprometimento clínico, incluindo tolerância, abstinência e uso em maiores quantidades que o pretendido.', cid10: 'F10.20', dsm5: '303.90' },
  { id: 'tr_pmdd', name: 'Transtorno Disfórico Pré-Menstrual (TDPM)', description: 'Sintomas de labilidade afetiva, irritabilidade, disforia e ansiedade que ocorrem na fase lútea tardia e remitem com a menstruação.', cid10: 'N94.3', dsm5: '625.4' },
  { id: 'tr_demencia_alz', name: 'Doença de Alzheimer (Transtorno Neurocognitivo Maior)', description: 'Declínio neurocognitivo insidioso e progressivo, afetando predominantemente memória e aprendizado, sem outra etiologia aparente.', cid10: 'G30.9', dsm5: '331.0' }
];

async function run() {
  console.log("Upserting disorders...");
  const { data, error } = await supabase.from('disorders').upsert(disorders, { onConflict: 'id' });
  
  if (error) {
    console.error("Error inserting data:", error);
  } else {
    console.log("Successfully inserted/updated disorders!");
  }
}

run();
