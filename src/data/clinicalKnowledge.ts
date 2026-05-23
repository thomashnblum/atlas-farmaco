export interface ReceptorClinicalProfile {
  id: string;
  blockadeEffects?: string[];
  activationEffects?: string[];
  clinicalSignificance?: string;
}

export const RECEPTOR_CLINICAL_PROFILES: Record<string, ReceptorClinicalProfile> = {
  // DOPAMINERGIC
  'D2': {
    id: 'D2',
    blockadeEffects: [
      'Efeito antipsicótico (via mesolímbica).',
      'Risco de Sintomas Extrapiramidais - SEP (via nigroestriatal).',
      'Hiperprolactinemia, galactorreia e disfunção sexual (via tuberoinfundibular).',
      'Piora da anedonia e sintomas negativos (via mesocortical).'
    ],
    activationEffects: [
      'Melhora da motivação e atenção.',
      'Risco de surtos psicóticos ou alucinações (se hiperativo).',
      'Náuseas e vômitos (na zona de gatilho quimiorreceptora).'
    ],
    clinicalSignificance: 'O D2 é o alvo principal e universal dos antipsicóticos. O grau de bloqueio (ocupação > 65% a 80%) dita tanto a eficácia terapêutica na psicose quanto o aparecimento de colaterais motores.'
  },
  'D3': {
    id: 'D3',
    blockadeEffects: [
      'Potencial melhora de sintomas negativos da esquizofrenia.',
      'Efeitos pró-cognitivos e antidepressivos.'
    ],
    activationEffects: [
      'Envolvimento no sistema de recompensa e vícios.'
    ],
    clinicalSignificance: 'Receptor intimamente ligado ao sistema límbico, foco de antipsicóticos mais novos (como Cariprazina) que buscam tratar a anedonia e depressão associada.'
  },
  
  // SEROTONERGIC
  '5-HT1A': {
    id: '5-HT1A',
    activationEffects: [
      'Efeito ansiolítico e antidepressivo robusto.',
      'Diminuição da liberação de serotonina se ativado como autorreceptor (pré-sináptico).',
      'Melhora da cognição e humor se ativado pós-sinapticamente.'
    ],
    blockadeEffects: [
      'Aumento imediato da liberação de serotonina (útil para acelerar efeito antidepressivo).'
    ],
    clinicalSignificance: 'O agonismo parcial no 5-HT1A é o "santo graal" de muitos antidepressivos modernos (Vilazodona, Vortioxetina) e antipsicóticos atípicos (Aripiprazol) para melhorar o humor e a tolerabilidade.'
  },
  '5-HT2A': {
    id: '5-HT2A',
    blockadeEffects: [
      'Aumento da liberação de dopamina no córtex pré-frontal e estriado.',
      'Prevenção de Sintomas Extrapiramidais (SEP) causados pelo bloqueio D2.',
      'Melhora do sono profundo (ondas lentas).'
    ],
    activationEffects: [
      'Alucinações visuais (mecanismo clássico de psicodélicos).',
      'Insônia e agitação.',
      'Disfunção sexual (inibição do orgasmo).'
    ],
    clinicalSignificance: 'A pedra angular dos "Antipsicóticos Atípicos". O bloqueio 5-HT2A em conjunto com o bloqueio D2 é o que separa um antipsicótico atípico de um típico, reduzindo o risco motor.'
  },
  '5-HT2C': {
    id: '5-HT2C',
    blockadeEffects: [
      'Aumento do apetite e ganho de peso severo.',
      'Aumento da liberação de dopamina e noradrenalina no córtex (efeito antidepressivo).'
    ],
    activationEffects: [
      'Supressão do apetite.',
      'Sensação de ansiedade ou agitação inicial.'
    ],
    clinicalSignificance: 'Alvo com um duplo gume perfeito: o bloqueio ajuda muito na depressão (Mirtazapina, Agomelatina), mas cobra o preço com um dos maiores fatores de ganho de peso da psicofarmacologia.'
  },
  '5-HT3': {
    id: '5-HT3',
    blockadeEffects: [
      'Forte efeito antiemético (previne náuseas).',
      'Efeito pró-cognitivo (aumenta ACh e monoaminas no córtex).'
    ],
    activationEffects: [
      'Náusea intensa e desconforto gastrointestinal.'
    ],
    clinicalSignificance: 'O único receptor serotoninérgico que é um canal iônico. Antagonistas puros (Ondansetrona) tratam vômitos. A Vortioxetina bloqueia o 5-HT3 para melhorar a cognição na depressão.'
  },
  
  // HISTAMINERGIC
  'H1': {
    id: 'H1',
    blockadeEffects: [
      'Sedação profunda e sonolência diurna.',
      'Aumento drástico do apetite e ganho de peso (via supressão da saciedade hipotalâmica).',
      'Efeito antialérgico e antipruriginoso.'
    ],
    activationEffects: [
      'Vigília, alerta e processamento cognitivo agudo.'
    ],
    clinicalSignificance: 'Geralmente considerado o principal vilão dos colaterais metabólicos em antipsicóticos (Olanzapina, Quetiapina) e tricíclicos, embora muito útil para tratar insônia.'
  },
  
  // ADRENERGIC
  'Alpha-1': {
    id: 'Alpha-1',
    blockadeEffects: [
      'Hipotensão ortostática (tontura ao levantar).',
      'Taquicardia reflexa.',
      'Congestão nasal.',
      'Possível auxílio na redução de pesadelos (Prazosina).'
    ],
    activationEffects: [
      'Aumento da pressão arterial.',
      'Alerta simpático.'
    ],
    clinicalSignificance: 'Um colateral quase universal entre antipsicóticos sedativos. Exige cautela em idosos pelo risco de quedas (hipotensão ortostática).'
  },
  'Alpha-2': {
    id: 'Alpha-2',
    blockadeEffects: [
      'Aumento da liberação de Noradrenalina (desliga o freio pré-sináptico).',
      'Aumento da liberação de Serotonina (via heterorreceptores).',
      'Efeito antidepressivo potente.'
    ],
    activationEffects: [
      'Diminuição do tônus simpático.',
      'Redução da pressão arterial (Clonidina) e do TDAH (Guanfacina).'
    ],
    clinicalSignificance: 'O bloqueio Alpha-2 é o segredo do efeito antidepressivo acelerado da Mirtazapina (pisar no acelerador cortando os freios da noradrenalina).'
  },
  
  // CHOLINERGIC
  'M1': {
    id: 'M1',
    blockadeEffects: [
      'Boca seca, constipação intestinal, retenção urinária.',
      'Turvação visual e taquicardia.',
      'Déficit de memória e delírio em idosos.'
    ],
    activationEffects: [
      'Aumento das secreções.',
      'Melhora na cognição e memória.'
    ],
    clinicalSignificance: 'O bloqueio colinérgico muscarínico "seca" o paciente e emburra a mente, sendo a principal restrição ao uso de antidepressivos tricíclicos e antipsicóticos de baixa potência.'
  },

  // TRANSPORTERS
  'SERT': {
    id: 'SERT',
    blockadeEffects: [
      'Aumento da Serotonina (5-HT) na fenda sináptica.',
      'Redução da ansiedade, TOC e melhora do humor após semanas.',
      'Disfunção sexual, náusea e apatia induzida por ISRS (longo prazo).'
    ],
    activationEffects: [
      'Efeitos da Inversão do Transportador (Substratos/Liberadores):',
      'Liberação maciça e não-vesicular de serotonina na fenda sináptica.',
      'Efeito entactógeno e empatógeno profundo (ex: MDMA).'
    ],
    clinicalSignificance: 'O alvo primário dos Inibidores Seletivos da Recaptação de Serotonina (ISRS) e Duais.'
  },
  'NET': {
    id: 'NET',
    blockadeEffects: [
      'Aumento de Noradrenalina.',
      'Aumento da energia, foco e frequência cardíaca.',
      'Efeito secundário no aumento de Dopamina no Córtex Pré-Frontal (onde não há DAT).'
    ],
    activationEffects: [
      'Efeitos da Inversão do Transportador (Substratos/Liberadores):',
      'Liberação excessiva e rápida de noradrenalina (ex: Anfetaminas).',
      'Aumento dramático no tônus simpático (alerta, taquicardia, pressão arterial elevada).'
    ],
    clinicalSignificance: 'Fundamental no tratamento do TDAH (Atomoxetina, Bupropiona, Estimulantes) e depressão melancólica ou com retardo motor.'
  },
  'DAT': {
    id: 'DAT',
    blockadeEffects: [
      'Aumento brusco de Dopamina no estriado e accumbens.',
      'Efeito estimulante clássico, melhora drástica da atenção e motivação.',
      'Potencial de dependência e euforia.'
    ],
    activationEffects: [
      'Efeitos da Inversão do Transportador (Substratos/Liberadores):',
      'Transporte reverso bombeando dopamina ativamente para fora do neurônio (ex: Anfetaminas).',
      'Euforia intensa, altíssimo potencial de abuso e neurotoxicidade em altas doses.'
    ],
    clinicalSignificance: 'Alvo chave de estimulantes (Metilfenidato, Anfetaminas) e responsável pelo alívio rápido dos sintomas de TDAH.'
  },

  // GABA & GLUTAMATE
  'GABA-A': {
    id: 'GABA-A',
    activationEffects: [
      'Sedação profunda, efeito ansiolítico rápido.',
      'Ação miorrelaxante e anticonvulsivante.',
      'Amnésia anterógrada e depressão respiratória em altas doses.'
    ],
    clinicalSignificance: 'Moduladores alostéricos positivos (Benzodiazepínicos e Drogas Z) se ligam a subunidades específicas para forçar o canal de cloro a abrir com mais frequência.'
  },
  'NMDA': {
    id: 'NMDA',
    blockadeEffects: [
      'Redução da excitotoxicidade.',
      'Efeito antidepressivo ultrarrápido e antisuicida (via Cetamina).',
      'Alucinações dissociativas em altas doses.'
    ],
    activationEffects: [
      'Necessário para o aprendizado e neuroplasticidade (LTP).',
      'Se excessivo: morte neuronal por entrada massiva de cálcio.'
    ],
    clinicalSignificance: 'O alvo da Cetamina revolucionou o tratamento da depressão resistente.'
  }
};
