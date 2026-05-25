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

export interface DisorderClinicalProfile {
  id: string;
  epidemiology?: string;
  neurobiology?: string[];
  clinicalMarkers?: string[];
  prognosis?: string;
}

export const DISORDER_CLINICAL_PROFILES: Record<string, DisorderClinicalProfile> = {
  'tr_tag': {
    id: 'tr_tag',
    epidemiology: 'Prevalência ao longo da vida de ~5-6%. Mais comum em mulheres. Frequentemente comórbido com TDM.',
    neurobiology: [
      'Hiperatividade da amígdala e ínsula.',
      'Hipoatividade do córtex pré-frontal ventromedial (falha no "freio" top-down).',
      'Desregulação nos sistemas GABAérgico e serotoninérgico.'
    ],
    clinicalMarkers: [
      'Tensão muscular crônica (frequentemente relatada como dores no corpo).',
      'Hipervigilância e perturbação do sono.',
      'Sintomas autonômicos (taquicardia leve, sudorese).'
    ],
    prognosis: 'Crônico e flutuante. A maioria dos pacientes experimenta exacerbações durante períodos de estresse. A remissão completa é difícil sem tratamento adequado a longo prazo.'
  },
  'tr_mdd': {
    id: 'tr_mdd',
    epidemiology: 'Prevalência ao longo da vida de ~15-20%. A principal causa de incapacidade no mundo.',
    neurobiology: [
      'Atrofia hipocampal mediada por estresse crônico e excesso de cortisol.',
      'Hipoatividade no córtex pré-frontal dorsolateral e hiperatividade no córtex cingulado anterior subgenual.',
      'Deficiências na sinalização de BDNF (Fator Neurotrófico Derivado do Cérebro) limitando a neuroplasticidade.'
    ],
    clinicalMarkers: [
      'Anedonia profunda (incapacidade de sentir prazer).',
      'Despertar matinal precoce (insônia terminal) em formas melancólicas.',
      'Retardo ou agitação psicomotora evidente.'
    ],
    prognosis: 'Episódico, mas com alto risco de recorrência. O risco aumenta substancialmente a cada novo episódio. Cerca de 30% evoluem para Depressão Resistente ao Tratamento.'
  },
  'tr_tdah': {
    id: 'tr_tdah',
    epidemiology: 'Prevalência de ~5% em crianças e ~2.5% em adultos. Forte componente genético (herdabilidade > 70%).',
    neurobiology: [
      'Hipoatividade dopaminérgica e noradrenérgica no córtex pré-frontal e estriado.',
      'Atraso na maturação cortical (especialmente em regiões frontais).',
      'Disfunção na rede de modo padrão (DMN), que falha em "desligar" durante tarefas cognitivas.'
    ],
    clinicalMarkers: [
      'Dificuldade sustentada de manter a atenção em tarefas monótonas.',
      'Impulsividade verbal e motora (interrupções constantes).',
      'Desregulação emocional secundária (frustração rápida).'
    ],
    prognosis: 'Para muitos, os sintomas de hiperatividade diminuem na idade adulta, mas os déficits de atenção e funções executivas frequentemente persistem e causam prejuízo ocupacional crônico.'
  },
  'tr_sz': {
    id: 'tr_sz',
    epidemiology: 'Prevalência mundial de ~1%. Início típico no fim da adolescência ou início da fase adulta.',
    neurobiology: [
      'Hiperatividade dopaminérgica mesolímbica (causa os sintomas positivos/psicose).',
      'Hipoatividade dopaminérgica mesocortical (causa os sintomas negativos/cognitivos).',
      'Hipoatividade dos receptores NMDA (hipótese glutamatérgica).'
    ],
    clinicalMarkers: [
      'Alucinações auditivas (vozes de comando ou comentários).',
      'Delírios persecutórios ou bizarros.',
      'Achatamento afetivo e alogia (pobreza do discurso).'
    ],
    prognosis: 'Curso crônico com exacerbações agudas. O prognóstico é melhor quando o primeiro episódio é tratado rapidamente (Duração da Psicose Não Tratada curta). O declínio funcional é comum.'
  },
  'tr_bipolar_1': {
    id: 'tr_bipolar_1',
    epidemiology: 'Prevalência de ~1%. Taxa igual entre homens e mulheres. Alto risco de suicídio (15-20%).',
    neurobiology: [
      'Desregulação das vias de sinalização intracelular (ex: GSK-3, inositol trifosfato).',
      'Hiperatividade da amígdala e disfunção do córtex pré-frontal durante fases de mania.',
      'Anormalidades na homeostase de cálcio intracelular.'
    ],
    clinicalMarkers: [
      'Necessidade reduzida de sono (acordar descansado após poucas horas).',
      'Logorreia (pressão por falar) e fuga de ideias.',
      'Comportamentos de risco grandiosos (gastos excessivos, indiscrições sexuais).'
    ],
    prognosis: 'Condição para a vida toda. O tratamento profilático (estabilizadores de humor) é quase sempre necessário para prevenir recorrências destrutivas.'
  },
  'tr_bipolar_2': {
    id: 'tr_bipolar_2',
    epidemiology: 'Prevalência de ~1.1%. Maior risco em mulheres para rápida ciclagem.',
    neurobiology: [
      'Similar ao Bipolar I, porém com flutuações menos extremas na excitabilidade cortical.',
      'Forte componente de desregulação circadiana e vulnerabilidade ao estresse.'
    ],
    clinicalMarkers: [
      'Episódios depressivos maiores (geralmente mais frequentes e longos que no Tipo I).',
      'Hipomania (euforia ou irritabilidade sem sintomas psicóticos e sem grave prejuízo funcional).',
      'Aumento de energia percebido por outros como "mudança de personalidade".'
    ],
    prognosis: 'Alta morbidade devido à fase depressiva crônica. Alto risco de letalidade por suicídio. Requer monitoramento contínuo.'
  },
  'tr_ocd': {
    id: 'tr_ocd',
    epidemiology: 'Prevalência de 1-2%. Idade média de início aos 19 anos.',
    neurobiology: [
      'Hiperatividade no circuito Córtico-Estriado-Tálamo-Cortical (CSTC).',
      'Disfunção na sinalização serotoninérgica e glutamatérgica.'
    ],
    clinicalMarkers: [
      'Obsessões: Pensamentos ou imagens intrusivas que geram ansiedade extrema.',
      'Compulsões: Comportamentos repetitivos ou atos mentais visando neutralizar a ansiedade.',
      'Egodistonia (o paciente reconhece que os sintomas são irracionais).'
    ],
    prognosis: 'Curso frequentemente crônico e flutuante. Responde a ISRS em altas doses e Terapia Cognitivo-Comportamental (EPR).'
  },
  'tr_ptsd': {
    id: 'tr_ptsd',
    epidemiology: 'Prevalência de ~7% a 9% ao longo da vida. Maior incidência em mulheres após trauma.',
    neurobiology: [
      'Hiperreatividade da amígdala à estímulos ameaçadores.',
      'Hipoatividade do córtex pré-frontal medial (falha na extinção do medo).',
      'Hipersensibilidade dos receptores glicocorticoides e níveis anormais de cortisol.'
    ],
    clinicalMarkers: [
      'Flashbacks ou pesadelos intrusivos relacionados ao trauma.',
      'Evitação persistente de gatilhos.',
      'Hipervigilância e resposta de sobressalto exagerada.'
    ],
    prognosis: 'Variável. Pode cronificar se não tratado. Responde bem a terapias de exposição e dessensibilização (EMDR, TCC).'
  },
  'tr_panico': {
    id: 'tr_panico',
    epidemiology: 'Prevalência de 2-3%. Muitas vezes cursa com agorafobia.',
    neurobiology: [
      'Aumento da sensibilidade do Locus Coeruleus (descargas súbitas de noradrenalina).',
      'Disfunção do circuito de alarme ("suffocation false alarm network").'
    ],
    clinicalMarkers: [
      'Ataques súbitos de medo intenso que atingem o pico em minutos.',
      'Sintomas somáticos intensos (palpitações, falta de ar, tontura).',
      'Ansiedade antecipatória (medo de ter outro ataque).'
    ],
    prognosis: 'Bom com tratamento (ISRS e TCC). Sem tratamento, pode levar a reclusão severa (agorafobia).'
  },
  'tr_social': {
    id: 'tr_social',
    epidemiology: 'Prevalência de ~7%. Início precoce na infância ou adolescência.',
    neurobiology: [
      'Hiperatividade da amígdala em resposta a faces humanas avaliativas.',
      'Desregulação dopaminérgica no estriado (relacionada ao medo de julgamento social).'
    ],
    clinicalMarkers: [
      'Medo intenso e persistente de situações onde possa ser julgado.',
      'Sintomas autonômicos em exposição (rubor facial, tremores).',
      'Evitação de contato visual ou interações.'
    ],
    prognosis: 'Crônico se não tratado. Remissão possível com exposição contínua e farmacologia.'
  },
  'tr_insonia': {
    id: 'tr_insonia',
    epidemiology: 'Afeta 10-30% dos adultos de forma crônica.',
    neurobiology: [
      'Hiperativação fisiológica e cortical 24h ("hyperarousal").',
      'Déficit na sinalização inibitória de GABA e orexina (hipocretina) hiperativa.'
    ],
    clinicalMarkers: [
      'Dificuldade de iniciar ou manter o sono (>3 vezes por semana).',
      'Fadiga diurna, prejuízo cognitivo e irritabilidade.',
      'Preocupação excessiva com o sono.'
    ],
    prognosis: 'Pode cronificar e desencadear outros transtornos (Depressão). TCC para insônia (TCC-I) é a primeira linha, acompanhada de hipnóticos conforme necessidade.'
  },
  'tr_borderline': {
    id: 'tr_borderline',
    epidemiology: 'Prevalência de 1-2%. Alta mortalidade por suicídio (até 10%).',
    neurobiology: [
      'Hiperreatividade da amígdala e hipoatividade do córtex pré-frontal orbital.',
      'Desregulação nos sistemas de opioides endógenos e oxitocina (dificuldade de apego/vínculo).'
    ],
    clinicalMarkers: [
      'Medo crônico de abandono real ou imaginário.',
      'Instabilidade afetiva extrema (mudanças de humor em horas).',
      'Comportamentos automutilatórios e impulsividade.'
    ],
    prognosis: 'Tende a estabilizar na meia-idade. A Terapia Comportamental Dialética (DBT) é o tratamento padrão ouro. Fármacos são usados para sintomas alvo (ex: impulsividade).'
  },
  'tr_eating_an': {
    id: 'tr_eating_an',
    epidemiology: 'Prevalência de ~0.4%. Uma das maiores taxas de mortalidade em psiquiatria.',
    neurobiology: [
      'Disfunção nos circuitos de recompensa (restrição calórica passa a ser recompensadora).',
      'Alterações na sinalização de serotonina e dopamina nos gânglios da base.'
    ],
    clinicalMarkers: [
      'Recusa em manter peso corporal mínimo normal.',
      'Medo intenso de ganhar peso.',
      'Distorção severa da imagem corporal.'
    ],
    prognosis: 'Cerca de 50% recuperam-se totalmente, mas 20-30% tornam-se crônicos. Tratamento multidisciplinar é vital.'
  },
  'tr_eating_bn': {
    id: 'tr_eating_bn',
    epidemiology: 'Prevalência de 1-1.5%. Mais comum no fim da adolescência.',
    neurobiology: [
      'Disfunção serotoninérgica associada à saciedade e impulsividade.',
      'Hipofunção do controle inibitório pré-frontal.'
    ],
    clinicalMarkers: [
      'Episódios de compulsão alimentar seguidos de culpa.',
      'Comportamentos purgativos (vômitos, laxantes, exercícios excessivos).',
      'Sinais físicos (Sinal de Russell nos dedos, desgaste do esmalte dentário).'
    ],
    prognosis: 'Frequentemente responde a ISRS (Fluoxetina) e TCC. Prognóstico ligeiramente melhor que Anorexia.'
  },
  'tr_sud_alcohol': {
    id: 'tr_sud_alcohol',
    epidemiology: 'Prevalência de até 8% em algumas populações. Causa massiva de morbidade médica.',
    neurobiology: [
      'Recompensas agudas via liberação de Dopamina no Núcleo Accumbens e GABA no estriado.',
      'Uso crônico causa regulação negativa (down-regulation) de GABA e up-regulation de Glutamato, gerando hiperexcitabilidade na abstinência.'
    ],
    clinicalMarkers: [
      'Tolerância e síndrome de abstinência (tremores, delírio).',
      'Gasto de tempo significativo em obter ou se recuperar do uso.',
      'Uso persistente apesar das consequências físicas/sociais.'
    ],
    prognosis: 'Recaídas são comuns. Grupos de apoio e farmacoterapia (Naltrexona, Acamprosato, Dissulfiram) aumentam o sucesso a longo prazo.'
  },
  'tr_pmdd': {
    id: 'tr_pmdd',
    epidemiology: 'Afeta 3-8% das mulheres em idade reprodutiva.',
    neurobiology: [
      'Sensibilidade anormal do cérebro às flutuações hormonais normais (estrogênio e progesterona).',
      'Disfunção do metabólito da progesterona (Alopregnanolona) no receptor GABA-A.'
    ],
    clinicalMarkers: [
      'Labilidade emocional, irritabilidade severa e tensão na semana anterior à menstruação.',
      'Alívio total dos sintomas após o início do fluxo.',
      'Sintomas físicos (inchaço, dor nas mamas).'
    ],
    prognosis: 'Altamente responsivo a ISRS de uso contínuo ou apenas na fase lútea. Cessa após a menopausa.'
  },
  'tr_demencia_alz': {
    id: 'tr_demencia_alz',
    epidemiology: 'Crescente com o envelhecimento populacional (afeta >10% dos >65 anos).',
    neurobiology: [
      'Acúmulo de placas de beta-amiloide extracelulares.',
      'Emaranhados neurofibrilares intracelulares de proteína Tau hiperfosforilada.',
      'Morte de neurônios colinérgicos no Núcleo Basal de Meynert.'
    ],
    clinicalMarkers: [
      'Déficit de memória episódica (esquecimento de eventos recentes).',
      'Dificuldades de linguagem (anomia) e desorientação espacial.',
      'Declínio funcional progressivo para AVDs.'
    ],
    prognosis: 'Incurável e progressivo. Tratamentos (Inibidores da Colinesterase) apenas lentificam o declínio cognitivo transitoriamente.'
  }
};
