import { Molecule, InteractionAlert } from '../types';

export const MOLECULES: Molecule[] = [
  {
    id: 'fluoxetina',
    name: 'Fluoxetina',
    class: 'Inibidores Seletivos da Recaptação de Serotonina (ISRS)',
    classAbbr: 'ISR',
    description: 'Um dos primeiros ISRS, muito utilizado em transtorno depressivo maior, TOC e bulimia nervosa. Possui um longo período de meia-vida.',
    mechanism: 'Inibe seletivamente a recaptação pré-sináptica da serotonina (5-HT) por meio do bloqueio do transportador SERT, aumentando a neurotransmissão serotoninérgica.',
    halfLife: '2-4 dias (metabólito ativo norfluoxetina dura até 15 dias)',
    indications: ['Transtorno Depressivo Maior', 'Transtorno Obsessivo-Compulsivo (TOC)', 'Bulimia Nervosa', 'Transtorno de Pânico'],
    receptors: [
      { receptor: 'SERT', intensity: 'critical', valueHex: '#0284c7', description: 'Bloqueio seletivo primário que causa o efeito terapêutico primário.' },
      { receptor: '5-HT2C', intensity: 'moderate', valueHex: '#f59e0b', description: 'Desbloqueio indireto de dopamina e noradrenalina no córtex, o que em alguns pacientes causa ativação inicial.' },
      { receptor: 'NET', intensity: 'none', valueHex: '#6b7280', description: 'Sem afinidade mensurável por transportador de noradrenalina.' },
      { receptor: 'H1', intensity: 'low', valueHex: '#ef4444', description: 'Afinidade negligenciável por receptores histaminérgicos.' },
      { receptor: 'M1', intensity: 'low', valueHex: '#10b981', description: 'Afinidade negligenciável por receptores muscarínicos.' },
      { receptor: 'alpha-1', intensity: 'none', valueHex: '#8b5cf6', description: 'Sem efeitos alfa-adrenérgicos clínicos relevantes.' }
    ],
    cyp450: [
      { enzyme: 'CYP2D6', role: 'inhibitor', strength: 'strong' },
      { enzyme: 'CYP2C19', role: 'inhibitor', strength: 'moderate' },
      { enzyme: 'CYP3A4', role: 'substrate' }
    ],
    cautionPoints: [
      'Inibidor potente de CYP2D6, aumentando consideravelmente os níveis séricos de outros fármacos que dependem deste citocromo.',
      'Risco moderado de prolongamento de intervalo QTc em doses mais elevadas.',
      'Meia-vida biológica longa exige janela de interrupção (washout) de pelo menos 5 semanas antes de iniciar um IMAO.'
    ]
  },
  {
    id: 'sertralina',
    name: 'Sertralina',
    class: 'Inibidores Seletivos da Recaptação de Serotonina (ISRS)',
    classAbbr: 'ISR',
    description: 'ISRS amplamente estudado e seguro para cardiopatas e idosos. Conhecido por sua leve capacidade de inibição de dopamina.',
    mechanism: 'Bloqueia o transportador de serotonina (SERT), com uma discreta propriedade secundária indutora/bloqueadora de transportadores de dopamina (DAT).',
    halfLife: '26 horas (metabólito desmetilsertralina dura 62-104 horas)',
    indications: ['Transtorno Depressivo Maior', 'Ansiedade Social', 'Transtorno de Pânico', 'TEPT', 'TOC'],
    receptors: [
      { receptor: 'SERT', intensity: 'critical', valueHex: '#0284c7', description: 'Inibição forte e sustentada do transportador de serotonina.' },
      { receptor: 'DAT', intensity: 'low', valueHex: '#ec4899', description: 'Afinidade fraca pelo transportador de dopamina; contribui para o perfil levemente ativador.' },
      { receptor: 'NET', intensity: 'none', valueHex: '#6b7280', description: 'Sem bloqueio pré-sináptico de noradrenalina.' },
      { receptor: '5-HT1A', intensity: 'low', valueHex: '#10b981', description: 'Afinidade mínima mediada por transdução de sinal secundária.' },
      { receptor: 'H1', intensity: 'none', valueHex: '#6b7280', description: 'Sem propensão à sonolência antihistaminérgica.' },
      { receptor: 'M1', intensity: 'none', valueHex: '#6b7280', description: 'Livre de atividade anticolinérgica.' }
    ],
    cyp450: [
      { enzyme: 'CYP2D6', role: 'inhibitor', strength: 'weak' },
      { enzyme: 'CYP3A4', role: 'substrate' },
      { enzyme: 'CYP2C19', role: 'substrate' }
    ],
    cautionPoints: [
      'Iniciar sempre com doses baixas para evitar queixas do trato gastrointestinal (decorrentes do excesso de estimulação serotoninérgica periférica).',
      'Fármaco metabólico bem-comportado com poucas interações CYP450 sérias.'
    ]
  },
  {
    id: 'escitalopram',
    name: 'Escitalopram',
    class: 'Inibidores Seletivos da Recaptação de Serotonina (ISRS)',
    classAbbr: 'ISR',
    description: 'Enanciômero S purificado do citalopram. É tido na literatura científica como o ISRS mais seletivo e previsível do ponto de vista molecular.',
    mechanism: 'Inibidor altamente específico e alostérico do receptor SERT com efeitos mínimos em outros transportadores ou receptores secundários.',
    halfLife: '27-32 horas',
    indications: ['Transtorno Ansioso Generalizado (TAG)', 'Transtorno Depressivo Maior', 'Transtorno de Pânico', 'Fobia Social'],
    receptors: [
      { receptor: 'SERT', intensity: 'critical', valueHex: '#0284c7', description: 'Seletividade pura e ultra-potente sobre o transportador de serotonina.' },
      { receptor: 'NET', intensity: 'none', valueHex: '#6b7280', description: 'Afinidade zero.' },
      { receptor: 'DAT', intensity: 'none', valueHex: '#6b7280', description: 'Afinidade zero.' },
      { receptor: 'H1', intensity: 'none', valueHex: '#6b7280', description: 'Sem indução de ganho de peso ou bloqueio H1.' },
      { receptor: 'M1', intensity: 'none', valueHex: '#6b7280', description: 'Sem xerostomia ou efeitos anticolinérgicos.' }
    ],
    cyp450: [
      { enzyme: 'CYP2C19', role: 'substrate' },
      { enzyme: 'CYP2D6', role: 'substrate' },
      { enzyme: 'CYP3A4', role: 'substrate' }
    ],
    cautionPoints: [
      'Alargamento dose-dependente do intervalo QT cardíaco, devendo ser vigiado acima de 20mg/dia ou em pacientes de risco cardíaco aumentado.',
      'Altamente tolerável, raramente envolve conflitos cinéticos significativos de CYP450.'
    ]
  },
  {
    id: 'amitriptilina',
    name: 'Amitriptilina',
    class: 'Antidepressivos Tricíclicos (ADTC)',
    classAbbr: 'AD-TRICICLICO',
    description: 'Antidepressivo clássico de terceira geração, potente, de amplo espectro de afinidade e amplamente utilizado também na dor crônica e prevenção de migrânea.',
    mechanism: 'Inibe vigorosamente os transportadores NET e SERT, mas atua pesadamente como antagonista de receptores pós-sinápticos histamínicos (H1), muscarínicos (M1) e alfa-adrenérgicos (alpha-1).',
    halfLife: '15-30 horas',
    indications: ['Depressão refratária', 'Dor neuropática crônica', 'Profilaxia de Enxaqueca', 'Fibromialgia'],
    receptors: [
      { receptor: 'SERT', intensity: 'high', valueHex: '#0284c7', description: 'Forte potência serotoninérgica.' },
      { receptor: 'NET', intensity: 'high', valueHex: '#f59e0b', description: 'Inibição acentuada da recaptação de noradrenalina.' },
      { receptor: 'H1', intensity: 'critical', valueHex: '#ef4444', description: 'Antagonismo H1 extremamente alto, gerando forte sedação e apetite.' },
      { receptor: 'M1', intensity: 'critical', valueHex: '#10b981', description: 'Antagonismo M1 potente que acarreta boca seca, obstipação, retenção urinária e taquicardia.' },
      { receptor: 'alpha-1', intensity: 'high', valueHex: '#8b5cf6', description: 'Bloqueio alfa-1 causa vasodilatação e risco severo de hipotensão ortostática com risco de queda.' }
    ],
    cyp450: [
      { enzyme: 'CYP2D6', role: 'substrate' },
      { enzyme: 'CYP2C19', role: 'substrate' },
      { enzyme: 'CYP1A2', role: 'substrate' }
    ],
    cautionPoints: [
      'Alto risco de toxicidade cardíaca em superdosagem devido a bloqueio rápido de canais de sódio (alargamento de QRS).',
      'Muito vulnerável a inibidores de CYP2D6 que podem fazer a concentração sérica atingir limites perigosos para arritmias cardíacas.'
    ]
  },
  {
    id: 'venlafaxina',
    name: 'Venlafaxina',
    class: 'Inibidores da Recaptação de Serotonina e Noradrenalina (IRSN)',
    classAbbr: 'IRSN',
    description: 'Antidepressivo dual clássico. Atua de maneira dose-dependente, alterando o seu perfil farmacológico.',
    mechanism: 'Bloqueia prioritariamente o transportador SERT em baixas doses (<150mg/dia). Em subdoses maiores (>150mg/dia), passa a bloquear significativamente o transportador NET.',
    halfLife: '5 horas (seu metabólito ativo O-desmetilvenlafaxina dura 11 horas)',
    indications: ['Transtorno Depressivo Maior', 'Transtorno de Ansiedade Generalizada (TAG)', 'Fobia Social', 'Transtorno de Pânico'],
    receptors: [
      { receptor: 'SERT', intensity: 'high', valueHex: '#0284c7', description: 'Afinidade predominante em dosagens convencionais.' },
      { receptor: 'NET', intensity: 'moderate', valueHex: '#f59e0b', description: 'Recaptação noradrenérgica recrutada em doses terapêuticas altas.' },
      { receptor: 'DAT', intensity: 'low', valueHex: '#ec4899', description: 'Potência insignificante de dopamina sob doses clínicas habituais.' },
      { receptor: 'H1', intensity: 'none', valueHex: '#6b7280', description: 'Inexistente.' },
      { receptor: 'M1', intensity: 'none', valueHex: '#6b7280', description: 'Sem efeitos colaterais urinários ou secos.' }
    ],
    cyp450: [
      { enzyme: 'CYP2D6', role: 'substrate' },
      { enzyme: 'CYP3A4', role: 'substrate' }
    ],
    cautionPoints: [
      'Pode induzir aumentos dependentes de dose na pressão arterial sistólica pós-recrutamento de NET.',
      'Sintomas severos de abstinência (descontinuação) ao esquecer ou reduzir a dosagem abruptamente.'
    ]
  },
  {
    id: 'bupropiona',
    name: 'Bupropiona',
    class: 'Inibidores de Recaptação de Noradrenalina e Dopamina (IRND)',
    classAbbr: 'IRND',
    description: 'Antidepressivo com mecanismo atípico, não serotoninérgico. Bastante prescrito como terapia de cessação tabágica e TDAH pré-tratado.',
    mechanism: 'Bloqueio seletivo dos transportadores de dopamina (DAT) e noradrenalina (NET). Sem efeito clínico em receptores serotoninérgicos.',
    halfLife: '20 horas',
    indications: ['Transtorno Depressivo Maior', 'Transtorno Afetivo Sazonal', 'Tabagismo (Cessação)', 'Transtorno de Déficit de Atenção (TDAH - offlabel)'],
    receptors: [
      { receptor: 'NET', intensity: 'moderate', valueHex: '#f59e0b', description: 'Inibe a recaptação de noradrenalina.' },
      { receptor: 'DAT', intensity: 'moderate', valueHex: '#ec4899', description: 'Inibe levemente o transportador de dopamina no estriado e córtex frontal.' },
      { receptor: 'SERT', intensity: 'none', valueHex: '#6b7280', description: 'Sem nenhuma afinidade pelo receptor de serotonina.' },
      { receptor: 'H1', intensity: 'none', valueHex: '#6b7280', description: 'Sem afinidade.' },
      { receptor: 'M1', intensity: 'none', valueHex: '#6b7280', description: 'Sem efeitos anticolinérgicos.' }
    ],
    cyp450: [
      { enzyme: 'CYP2D6', role: 'inhibitor', strength: 'strong' }
    ],
    cautionPoints: [
      'Inibidor potente de CYP2D6, similar à fluoxetina; pode quadruplicar o nível sérico de tricíclicos, risperidona e bloqueadores de receptor beta.',
      'Associação firme com redução do limiar convulsivo. Expressamente contra-indicado em portadores de epilepsia, anorexia nervosa e bulimia.'
    ]
  },
  {
    id: 'quetiapina',
    name: 'Quetiapina',
    class: 'Antipsicóticos Atípicos de Segunda Geração',
    classAbbr: 'APS-ATIPICO',
    description: 'Antipsicótico multifuncional usado em baixas doses para indução do sono, doses médias para depressão bipolar e doses altas para esquizofrenia.',
    mechanism: 'Exibe afinidade moderada para receptores de dopamina D2 combinada a alta afinidade antagonista serotoninérgica (5-HT2A) e histaminérgica (H1).',
    halfLife: '6-7 horas (metabólito ativo norquetiapina dura 12 horas)',
    indications: ['Bipolaridade (Manejo de fases depressivas)', 'Esquizofrenia', 'Insônia (Uso adjuvante em subdosagem / offlabel)'],
    receptors: [
      { receptor: 'H1', intensity: 'critical', valueHex: '#ef4444', description: 'Afinidade imensa. Responsável pela sedação profunda mesmo em microdosagem (25mg).' },
      { receptor: '5-HT2A', intensity: 'high', valueHex: '#0284c7', description: 'Equilibra os efeitos motores dopaminérgicos típicos na via piramidal.' },
      { receptor: 'alpha-1', intensity: 'high', valueHex: '#8b5cf6', description: 'Risco mediano de hipotensão postural.' },
      { receptor: 'D2', intensity: 'moderate', valueHex: '#38bdf8', description: 'Afinidade baixa-moderada, com constante dissociação rápida; menor probabilidade de parkinsonismo induzido.' },
      { receptor: 'M1', intensity: 'low', valueHex: '#10b981', description: 'Baixa afinidade muscarínica.' }
    ],
    cyp450: [
      { enzyme: 'CYP3A4', role: 'substrate' }
    ],
    cautionPoints: [
      'Associação relevante de longo prazo com alterações glicêmicas, ganho ponderal e síndrome metabólica.',
      'Sua cinética de eliminação é acelerada caso associada a indutores potentes de CYP3A4, como carbamazepina.'
    ]
  },
  {
    id: 'risperidona',
    name: 'Risperidona',
    class: 'Antipsicóticos Atípicos de Segunda Geração',
    classAbbr: 'APS-ATIPICO',
    description: 'Antipsicótico amplamente documentado, com altíssima afinidade pós-sináptica D2 pós-sinapse dopaminérgica.',
    mechanism: 'Antagonista potente de receptores de dopamina D2 e receptores de serotonina 5-HT2A de altíssima afinidade celular prévia.',
    halfLife: '20 horas',
    indications: ['Esquizofrenia', 'Irritabilidade no Autismo infantil', 'Mania Bipolar Aguda'],
    receptors: [
      { receptor: 'D2', intensity: 'critical', valueHex: '#ef4444', description: 'Antagonismo D2 acentuado em vias mesolímbicas.' },
      { receptor: '5-HT2A', intensity: 'critical', valueHex: '#0284c7', description: 'Bloqueio estrito de modulação serotoninérgica.' },
      { receptor: 'alpha-1', intensity: 'high', valueHex: '#8b5cf6', description: 'Pode ocasionar episódios moderados de queda pressórica ortostática.' },
      { receptor: 'H1', intensity: 'moderate', valueHex: '#f59e0b', description: 'Afinidade moderada causadora de sedação e eventual ganho ponderal ponderado.' },
      { receptor: 'M1', intensity: 'none', valueHex: '#6b7280', description: 'Ausência total de afinidade colinérgica.' }
    ],
    cyp450: [
      { enzyme: 'CYP2D6', role: 'substrate' },
      { enzyme: 'CYP3A4', role: 'substrate' }
    ],
    cautionPoints: [
      'Elevada capacidade de elevar níveis de prolactina no sangue (hiperprolactinemia, galactorreia e ginecomastia).',
      'Em dosagens elevadas (>6mg ao dia), comporta-se quase como um neuroléptico típico com riscos nítidos de Parkinsonismo e acatisia.'
    ]
  }
];

export function formatListPortuguese(arr: string[]): string {
  if (arr.length === 0) return '';
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} e ${arr[1]}`;
  return `${arr.slice(0, -1).join(', ')} e ${arr[arr.length - 1]}`;
}

export function calculateInteractions(selected: Molecule[]): {
  alerts: InteractionAlert[];
  receptorOverlap: { name: string; count: number; maxIntensity: string; scale: number }[];
  metabolicWarnings: string[];
} {
  const alerts: InteractionAlert[] = [];
  const metabolicWarnings: string[] = [];

  if (selected.length === 0) {
    return { alerts: [], receptorOverlap: [], metabolicWarnings: [] };
  }

  // Calculate receptor overlap overview (runs for any selection count >= 1)
  // Build a map of receptor -> list of active intensities
  const receptorMap: { [key: string]: { intensities: string[]; count: number } } = {};
  
  for (const m of selected) {
    for (const r of m.receptors) {
      if (r.intensity !== 'none') {
        if (!receptorMap[r.receptor]) {
          receptorMap[r.receptor] = { intensities: [], count: 0 };
        }
        receptorMap[r.receptor].intensities.push(r.intensity);
        receptorMap[r.receptor].count += 1;
      }
    }
  }

  const receptorOverlap = Object.keys(receptorMap).map(name => {
    const data = receptorMap[name];
    const intensities = data.intensities;
    let max = 'low';
    if (intensities.includes('critical')) max = 'critical';
    else if (intensities.includes('high')) max = 'high';
    else if (intensities.includes('moderate')) max = 'moderate';

    // scale: a percentage score indicating cumulative receptor occupancy pressure (0-100)
    let scale = 0;
    intensities.forEach(i => {
      if (i === 'critical') scale += 45;
      else if (i === 'high') scale += 30;
      else if (i === 'moderate') scale += 15;
      else scale += 5;
    });
    scale = Math.min(100, scale);

    return {
      name,
      count: data.count,
      maxIntensity: max,
      scale
    };
  }).filter(r => r.count > 0);

  if (selected.length < 2) {
    return { alerts: [], receptorOverlap, metabolicWarnings: [] };
  }

  const ids = selected.map(s => s.id);

  // 1. Check CYP450 conflicts physically
  // We check if we have active inhibitors along with substrates of the identical cytochromes.
  // Find inhibitors
  const inhibitors = selected.flatMap(m => 
    m.cyp450.filter(c => c.role === 'inhibitor').map(c => ({
      molecule: m.name,
      enzyme: c.enzyme,
      strength: c.strength
    }))
  );

  // Find substrates
  const substrates = selected.flatMap(m => 
    m.cyp450.filter(c => c.role === 'substrate').map(c => ({
      molecule: m.name,
      enzyme: c.enzyme
    }))
  );

  // Cross check inhibitors with substrates (exclude self-medication kinetics)
  for (const inh of inhibitors) {
    for (const sub of substrates) {
      if (inh.enzyme === sub.enzyme && inh.molecule !== sub.molecule) {
        if (inh.strength === 'strong') {
          metabolicWarnings.push(
            `⚠️ ALTA PERICULOSIDADE: A ${inh.molecule} funciona como INIBIDOR FORTE da enzima cromossomática ${inh.enzyme}. Isto diminui drasticamente o metabolismo hepático da ${sub.molecule}, podendo elevar suas taxas plasmáticas a patamares potencialmente tóxicos.`
          );

          // Customize specific high-risk interactions
          if ((inh.molecule === 'Fluoxetina' || inh.molecule === 'Bupropiona') && sub.molecule === 'Amitriptilina') {
            alerts.push({
              severity: 'high',
              title: `Risco Cardinal de Cardiotoxicidade e Síndrome Anticolinérgica`,
              description: `A associação de ${inh.molecule} com Amitriptilina provoca elevação substancial e descontrolada dos níveis da Amitriptilina pelo bloqueio intenso da ${inh.enzyme}.`,
              mechanism: `A inibição da ${inh.enzyme} sabota a via de eliminação principal da Amitriptilina, prolongando a condução cardíaca do sódio (risco de arritmia letal e intervalo QRS largo) e provocando xerostomia extrema, delirium e delírios.`
            });
          } else if ((inh.molecule === 'Fluoxetina' || inh.molecule === 'Bupropiona') && sub.molecule === 'Risperidona') {
            alerts.push({
              severity: 'moderate',
              title: `Instabilidade de Sintomas Extrapiramidais`,
              description: `A ${inh.molecule} inibe a via de metabolização que transforma Risperidona em 9-hidroxirisperidona (metabólito ativo principal), acumulando a Risperidona pura no trato sináptico.`,
              mechanism: `Isto eleva dramaticamente o risco de Síndrome Extrapiramidal, tremor grave, acatisia crônica e elevação crítica de prolactina cardíaca.`
            });
          }
        } else if (inh.strength === 'moderate') {
          metabolicWarnings.push(
            `⚡ ATENÇÃO MODERADA: A ${inh.molecule} é INIBIDORA MODERADA do ${inh.enzyme}, retardando a taxa de atenuação da molécula de ${sub.molecule}.`
          );
        }
      }
    }
  }

  // 2. Class-specific synergies (e.g. serotonin syndrome if multi serotonin, etc.)
  const totalSerotonergic = selected.filter(m => 
    m.receptors.some(r => r.receptor === 'SERT' && (r.intensity === 'critical' || r.intensity === 'high'))
  ).length;

  if (totalSerotonergic >= 2) {
    const serotonergicNames = selected.filter(m => m.receptors.some(r => r.receptor === 'SERT' && (r.intensity === 'critical' || r.intensity === 'high'))).map(m => m.name);
    alerts.push({
      severity: 'moderate',
      title: 'Sinergia Serotoninérgica (Alerta de Síndrome Serotoninérgica)',
      description: `Uso concomitante de ${formatListPortuguese(serotonergicNames)} constitui múltiplos eixos de acúmulo neuro-receptor serotoninérgico.`,
      mechanism: 'A hiperestimulação cumulativa dos receptores 5-HT1A e 5-HT2A no tronco encefálico pode induzir instabilidade autonômica, hipertermia, tremores involuntários, clonus espontâneo, agitação extrema e diarreia.'
    });
  }

  // Dual sedatives
  const totalSedatives = selected.filter(m => 
    m.receptors.some(r => r.receptor === 'H1' && (r.intensity === 'critical' || r.intensity === 'high'))
  ).length;

  if (totalSedatives >= 2) {
    alerts.push({
      severity: 'low',
      title: 'Somatório de Sedação e Risco Cognitivo / Motor',
      description: `Ambas as substâncias administradas possuem afinidade expressiva ou crítica de antagonismo histaminérgico H1.`,
      mechanism: 'Depressão sináptica cumulativa que compromete reflexos de trânsito, processamento de escrita escolar e causa sonolência diurna intratável, especialmente em idosos sob risco de quedas noturnas.'
    });
  }

  // Duplicating pharmacological classes
  const classes = selected.map(s => s.classAbbr);
  const duplicates = classes.filter((item, index) => classes.indexOf(item) !== index);
  if (duplicates.length > 0) {
    alerts.push({
      severity: 'high',
      title: 'Duplicidade de Classe Terapêutica Desconhecida',
      description: 'Prescrever simultaneamente duas medicações da mesma classe com mecanismos químicos análogos raramente apresenta ganho clínico palpável.',
      mechanism: 'A saturação do transportador alvo (como o bloqueio massivo de SERT quando se usa dois ISRS) apenas amplia de forma nociva a incidência de reações adversas e estresse hepático sem acréscimo de eficácia analgésica ou ansiolítica.'
    });
  }

  return { alerts, receptorOverlap, metabolicWarnings };
}

export const FAQS = [
  {
    question: "O que está incluído na assinatura?",
    answer: "Acesso total e irrestrito a todas as ferramentas do Atlas Fármaco: banco dinâmico com mais de 160 psicofármacos, mapeamento espacial de afinidades constantes Ki, simulação avançada de polifarmácia na cascata de enzimas CYP450, atualizações contínuas de novos lançamentos farmacêuticos e materiais didáticos de suporte."
  },
  {
    question: "Existe plano mensal e anual?",
    answer: "Sim. Oferecemos o Plano Mensal (R$ 19,90/mês) para total flexibilidade de renovação a curto prazo, e o Plano Anual (R$ 167,90/ano), ideal para profissionais e estudantes que consultam e estudam o material com regularidade."
  },
  {
    question: "O que significa a condição antecipada de lançamento?",
    answer: "Trata-se de uma oferta promocional de lançamento por tempo limitado para incentivar novas adesões. Quem assinar no lote atual adquire o primeiro ano por apenas R$ 127,90. Após os 12 meses iniciais, as renovações subsequentes ocorrem no valor normal anual vigente."
  },
  {
    question: "O preço promocional é vitalício?",
    answer: "Não. A condição antecipada é uma bonificação exclusiva aplicada apenas ao primeiro ciclo anual (primeiros 12 meses). Após esse período, as renovações são cobradas pelo preço regular anual."
  },
  {
    question: "Para quem o Atlas Fármaco foi feito?",
    answer: "O Atlas foi desenhado especialmente para médicos pré e pós-graduandos, residentes em Psiquiatria, neurologistas, clínicos gerais, generalistas, psicólogos, farmacêuticos e acadêmicos que buscam consolidar conhecimentos profundos do comportamento celular e metabólico de psicotrópicos."
  },
  {
    question: "É voltado apenas para psiquiatras?",
    answer: "Não. Embora a psiquiatria clínica seja uma das grandes beneficiadas, o material visual e espacial do Atlas é incrivelmente valioso para qualquer profissional de saúde ou acadêmico envolvido no manejo, estudo ou acompanhamento de patologias mentais e psicofármacos."
  },
  {
    question: "O aplicativo substitui o julgamento médico?",
    answer: "De forma alguma. O aplicativo é estritamente educacional e serve como suporte de memorização e consulta acadêmica visual de dados consolidados na literatura científica. Toda conduta terapêutica e decisão clínica devem se pautar inteiramente na avaliação humana, respeitando a autonomia e o julgamento exclusivo do profissional de saúde assistente."
  },
  {
    question: "Posso cancelar depois?",
    answer: "Sim. A gestão da sua assinatura é simples e flexível. Você pode cancelar a renovação automática a qualquer momento com apenas um clique nas configurações do seu perfil, mantendo o acesso ativo até o término do ciclo de vigência pago."
  },
  {
    question: "Como funciona o suporte em caso de problemas técnicos?",
    answer: "Oferecemos suporte técnico humano dedicado. Em caso de dúvidas sobre login, carregamento ou checkout, você conta com um atendimento direto em nossos canais oficiais de suporte via WhatsApp e Slack."
  },
  {
    question: "O simulador interativo na landing page é o aplicativo real?",
    answer: "O simulador interativo desta página é uma versão demonstrativa simplificada (web-concept) construída para exibição visual prática de interações básicas. O aplicativo oficial de uso integrado dispõe de ambiente refinado, banco de dados completo, indexadores profundos e maior agilidade analítica."
  },
  {
    question: "O conteúdo é estritamente educacional?",
    answer: "Sim. Todo o ecossistema gráfico, escalas de Ki e agrupamentos metabólicos são puramente educacionais e teóricos, servindo como modelo didático constante para estruturar a neurociência psiquiátrica clínica moderna de forma clara."
  }
];
