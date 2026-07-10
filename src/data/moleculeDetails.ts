import { Molecule, OffLabelUse, OnLabelUse, ProfileSymbolKey } from './schema';

interface MoleculeDetails {
  psychiatryUse: string;
  offLabelUses: OffLabelUse[];
  onLabelUses: OnLabelUse[];
  profileSymbols: ProfileSymbolKey[];
}

export function getMoleculeDetails(molecule: Pick<Molecule, 'class' | 'name' | 'id'>): MoleculeDetails {
  const cls = molecule.class.toLowerCase();
  const name = molecule.name.toLowerCase();
  
  const isISRS = cls.includes('isrs') && !cls.includes('isrsn');
  const isISRSN = cls.includes('isrsn');
  const isAtypicalAntipsychotic = cls.includes('atípico') && cls.includes('antipsicótico');
  const isTypicalAntipsychotic = cls.includes('típico') && cls.includes('antipsicótico');
  const isTricyclic = cls.includes('tricíclico');
  const isTetracyclic = cls.includes('tetracíclico');
  const isBZD = cls.includes('benzodiazepínico');
  const isZDrug = cls.includes('hipnótico-z');
  const isStimulant = cls.includes('estimulante') || cls.includes('metilxantina') || cls.includes('atomoxetina') || name.includes('atomoxetina');
  const isMoodStabilizer = cls.includes('estabilizador');
  const isMAOI = cls.includes('imao');
  
  if (name.includes('lítio')) {
    const profileSymbols: ProfileSymbolKey[] = ['gold_standard', 'cardiac_risk'];
    return {
      psychiatryUse: "O Carbonato de Lítio é o estabilizador de humor padrão-ouro absoluto na psiquiatria. Seu mecanismo de ação é multifatorial e altamente especializado no nível intracelular: (1) entra nos neurônios através de canais de sódio rápidos; (2) inibe a enzima Inositol Monofosfatase (IMPase), esgotando os níveis de inositol celular e atenuando a sinalização do fosfatidilinositol hiperativo; (3) inibe diretamente a Glicogênio Sintase Quinase-3 beta (GSK-3β), promovendo fatores de sobrevivência celular, neuroplasticidade e aumento de BDNF; (4) modula a liberação de neurotransmissores, reduzindo o excesso de glutamato e dopamina enquanto facilita a transmissão serotoninérgica (especialmente via receptores pós-sinápticos 5-HT1A) e gabaérgica. Destaca-se também como o único agente farmacológico com eficácia robusta e direta na redução de taxas de suicídio consumado em pacientes bipolares.",
      onLabelUses: [
        {
          condition: "Transtorno Bipolar (Prevenção e Manutenção de Fases)",
          line: "1ª Linha",
          evidence: "Padrão-Ouro",
          justification: "Demonstra eficácia superior a longo prazo na prevenção de novos episódios de mania e de depressão crônica."
        },
        {
          condition: "Mania Bipolar Aguda",
          line: "1ª Linha",
          evidence: "Robusto",
          justification: "Desacelera rapidamente o taquipsiquismo, a grandiosidade ideativa e a impulsividade motora em episódios de euforia extrema."
        },
        {
          condition: "Redução do Risco de Suicídio no Transtorno Bipolar",
          line: "1ª Linha",
          evidence: "Padrão-Ouro",
          justification: "Apresenta propriedades antisuicidas exclusivas e diretas comprovadas por amplos estudos epidemiológicos observacionais."
        }
      ],
      offLabelUses: [
        { condition: "Potencialização de Antidepressivos na Depressão Maior Refratária", evidence: "Alto", justification: "Estratégia de potencialização clássica de primeira linha com altíssima taxa de eficácia clínica na reversão de apatia." },
        { condition: "Transtorno Esquizoafetivo", evidence: "Moderado", justification: "Auxilia no controle dos sintomas cíclicos afetivos de mania/depressão sobrepostos aos sintomas psicóticos." },
        { condition: "Agressividade e Impulsividade Grave", evidence: "Moderado", justification: "Modula o comportamento explosivo e explosões de fúria refratárias em pacientes de alta vulnerabilidade neurológica." }
      ],
      profileSymbols
    };
  }

  if (name.includes('topiramato')) {
    return {
      psychiatryUse: "Neuromodulador e anticonvulsivante de amplo espectro com propriedades estabilizadoras de humor e profiláticas secundárias. Atua por múltiplos eixos sinápticos: (1) bloqueio de canais de sódio voltagem-dependentes (VSSC); (2) potenciação da atividade do GABA no receptor GABA-A; (3) antagonismo de receptores glutamatérgicos do tipo AMPA/Kainato; e (4) inibição fraca da Anidrase Carbônica. Muito utilizado em psiquiatria de forma adjuvante para controle de impulsividade, compulsão alimentar e controle de peso corporal.",
      onLabelUses: [
        { condition: "Profilaxia de Enxaqueca (Migrânea)", line: "1ª Linha", evidence: "Robusto", justification: "Eficácia consistente na redução da frequência, intensidade e duração das crises de cefaleia em adultos." },
        { condition: "Crises Convulsivas Parciais e Tônico-Clônicas", line: "1ª Linha", evidence: "Robusto", justification: "Neuromodulação de amplo espectro estabilizando disparos neuronais anômalos." }
      ],
      offLabelUses: [
        { condition: "Compulsão Alimentar Periódica (TCAP) / Obesidade", evidence: "Alto", justification: "Modulação gaba-glutamato auxilia no controle do apetite e no controle da fissura alimentar impulsiva." },
        { condition: "Transtorno por Uso de Álcool (Prevenção de Recaídas)", evidence: "Moderado", justification: "Ajuda a reduzir a fissura (craving) pelo álcool através do reequilíbrio excitatório/inibitório central." },
        { condition: "Estabilização de Humor (Adjuvante no Transtorno Bipolar)", evidence: "Moderado", justification: "Auxilia no controle de ganho de peso e sintomas de impulsividade associada sem induzir ciclagens afetivas." }
      ],
      profileSymbols: ['gabaergic', 'glutamatergic']
    };
  }

  if (name.includes('bupropiona')) {
    const profileSymbols: ProfileSymbolKey[] = ['dopaminergic', 'noradrenergic'];
    return {
      psychiatryUse: "Antidepressivo atípico que atua como Inibidor de Recaptação de Dopamina e Noradrenalina (IRND). Destaca-se na prática clínica por sua ausência de efeitos colaterais sexuais significativos e por não promover o ganho de peso, sendo frequentemente utilizado para combater sintomas de apatia, fadiga e anedonia.",
      onLabelUses: [
        {
          condition: "Depressão Maior (TDM)",
          line: "1ª Linha",
          evidence: "Robusto",
          justification: "Excelente alternativa ou adjuvante para quadros com marcante lentificação psicomotora, fadiga física ou ganho de peso sob outros antidepressivos."
        },
        {
          condition: "Cessação do Tabagismo",
          line: "1ª Linha",
          evidence: "Padrão-Ouro",
          justification: "Antagonismo de receptores nicotínicos e modulação dopaminérgica reduzem substancialmente a fissura (craving) e sintomas de abstinência de nicotina."
        }
      ],
      offLabelUses: [
        { condition: "TDAH (Intolerância ou Refratariedade a Estimulantes)", evidence: "Alto", justification: "Aumenta o tônus adrenérgico/dopaminérgico pré-frontal, melhorando foco e organização de forma suave." },
        { condition: "Disfunção Sexual Induzida por ISRS/ISRSN", evidence: "Alto", justification: "Potencializa a atividade dopaminérgica mesolímbica, revertendo a anedonia sexual e o atraso ejaculatório." },
        { condition: "Transtorno Compulsivo Alimentar / Obesidade", evidence: "Moderado", justification: "Reduz apetite e impulsos por doces; potencializado quando combinado com naltrexona." }
      ],
      profileSymbols
    };
  }

  if (name.includes('trazodona')) {
    const profileSymbols: ProfileSymbolKey[] = ['serotonergic', 'antihistaminic'];
    return {
      psychiatryUse: "Antidepressivo pertencente à classe dos Inibidores de Recaptação e Antagonistas de Serotonina (SARI). Possui uma farmacologia dependente da dose: em baixas dosagens (25-100mg) atua como um potente hipnótico devido ao seu forte bloqueio de receptores 5-HT2A, H1 e alfa-1 adrenérgicos; em dosagens elevadas (150-300mg) exibe efeitos antidepressivos consistentes pela inibição do SERT.",
      onLabelUses: [
        {
          condition: "Depressão Maior (TDM)",
          line: "2ª Linha",
          evidence: "Moderado",
          justification: "Eficaz em monoterapia em doses elevadas, mas comumente associada como adjuvante em depressões acompanhadas de forte insônia."
        }
      ],
      offLabelUses: [
        { condition: "Insônia Secundária a Antidepressivos / Ansiedade", evidence: "Alto", justification: "Considerado um padrão clínico prático excelente para indução e consolidação do sono profundo de ondas lentas sem causar dependência ou tolerância." },
        { condition: "Disfunção Cognitiva e Agitação em Demências", evidence: "Moderado", justification: "Auxilia a atenuar quadros de agitação psicomotora noturna (síndrome do pôr do sol) e descontrole em idosos com demência." }
      ],
      profileSymbols
    };
  }

  if (name.includes('vortioxetina')) {
    const profileSymbols: ProfileSymbolKey[] = ['serotonergic', 'gold_standard'];
    return {
      psychiatryUse: "Antidepressivo de mecanismo de ação multimodal único. Além de inibir o SERT, atua como agonista 5-HT1A, agonista parcial 5-HT1B e antagonista dos receptores 5-HT3, 5-HT1D e 5-HT7. Essa modulação sináptica complexa promove a elevação sustentada de serotonina, noradrenalina, dopamina, acetilcolina e histamina no córtex pré-frontal, resultando em uma potente ação pró-cognitiva e antidepressiva.",
      onLabelUses: [
        {
          condition: "Depressão Maior (TDM) com Disfunção Cognitiva",
          line: "1ª Linha",
          evidence: "Padrão-Ouro",
          justification: "Único antidepressivo aprovado com forte evidência científica direta na melhora de sintomas cognitivos (concentração, foco e memória de trabalho) associados à depressão."
        }
      ],
      offLabelUses: [
        { condition: "Transtorno de Ansiedade Generalizada (TAG)", evidence: "Alto", justification: "Regula com excelência o humor e diminui a preocupação patológica por meio da modulação sináptica do sistema serotoninérgico." },
        { condition: "Disfunção Sexual induzida por ISRSs", evidence: "Moderado", justification: "Apresenta excelente taxa de tolerabilidade sexual devido ao seu antagonismo específico 5-HT3." }
      ],
      profileSymbols
    };
  }

  if (name.includes('agomelatina')) {
    const profileSymbols: ProfileSymbolKey[] = ['serotonergic'];
    return {
      psychiatryUse: "Antidepressivo melatoninérgico atípico de ação inovadora. Atua como agonista seletivo e potente dos receptores MT1 e MT2 de melatonina, associado a um antagonismo dos receptores serotoninérgicos 5-HT2C. Esse sinergismo resincroniza os ritmos circadianos desregulados na depressão, restaurando a arquitetura do sono e aliviando a anedonia e prostração diurna, livre de efeitos colaterais sexuais ou metabólicos. Requer controle periódico de enzimas hepáticas.",
      onLabelUses: [
        {
          condition: "Depressão Maior (TDM) com Sintomas Ansiosos ou de Sono",
          line: "1ª Linha",
          evidence: "Robusto",
          justification: "Promove melhora rápida da qualidade do sono e anedonia, sendo muito bem tolerado quanto à libido e peso corporal."
        }
      ],
      offLabelUses: [
        { condition: "Ansiedade Generalizada (TAG)", evidence: "Moderado", justification: "O bloqueio de receptores 5-HT2C promove uma regulação ansiolítica suave e aumento secundário de DA/NE pré-frontal." },
        { condition: "Distúrbio do Ritmo Sono-Vigília", evidence: "Alto", justification: "Rápida resincronização do relógio biológico central no núcleo supraquiasmático." }
      ],
      profileSymbols
    };
  }

  if (name.includes('buspirona')) {
    const profileSymbols: ProfileSymbolKey[] = ['serotonergic'];
    return {
      psychiatryUse: "Ansiolítico puro não-benzodiazepínico. Atua especificamente como agonista parcial de alta afinidade dos receptores serotoninérgicos 5-HT1A, promovendo a regulação adaptativa pré-sináptica (down-regulation de autorreceptores) e regulação pós-sináptica límbica. Alivia a ansiedade crônica de forma gradual, sem causar sedação, relaxamento muscular, dependência física, tolerância ou síndromes de abstinência.",
      onLabelUses: [
        {
          condition: "Transtorno de Ansiedade Generalizada (TAG)",
          line: "1ª Linha",
          evidence: "Robusto",
          justification: "Excelente opção para tratamento crônico e de longo prazo de sintomas ansiosos leves a moderados, especialmente em pacientes intolerantes a BZDs ou com histórico de adição."
        }
      ],
      offLabelUses: [
        { condition: "Potencialização de Antidepressivos na Depressão ou TOC", evidence: "Alto", justification: "Adicionada a ISRS para amplificar a resposta terapêutica global e mitigar a disfunção sexual induzida pelos mesmos." }
      ],
      profileSymbols
    };
  }

  if (isISRS) {
    const profileSymbols: ProfileSymbolKey[] = ['serotonergic'];
    if (name.includes('escitalopram') || name.includes('sertralina')) {
      profileSymbols.push('gold_standard');
    }
    if (name.includes('citalopram')) {
      profileSymbols.push('cardiac_risk');
    }
    if (name.includes('paroxetina')) {
      profileSymbols.push('anticholinergic');
    }

    const onLabelUses: OnLabelUse[] = [
      {
        condition: "Depressão Maior (TDM)",
        line: "1ª Linha",
        evidence: name.includes('escitalopram') || name.includes('sertralina') ? "Padrão-Ouro" : "Robusto",
        justification: "Tratamento de primeira escolha reconhecido por diretrizes internacionais pela excelente relação eficácia/tolerabilidade."
      },
      {
        condition: "Transtorno de Ansiedade Generalizada (TAG)",
        line: "1ª Linha",
        evidence: "Robusto",
        justification: "Excelente controle crônico de preocupações excessivas, sintomas de tensão somática e estabilização de humor."
      },
      {
        condition: "Transtorno de Pânico",
        line: "1ª Linha",
        evidence: "Robusto",
        justification: "Reduz a frequência e severidade dos ataques de pânico espontâneos, atenuando a ansiedade antecipatória."
      },
      {
        condition: "Transtorno Obsessivo-Compulsivo (TOC)",
        line: "1ª Linha",
        evidence: "Robusto",
        justification: "Requer doses mais elevadas do que na depressão (ex: Sertralina 200mg) para modular vias cortico-estriato-talâmicas."
      }
    ];

    return {
      psychiatryUse: "Na prática clínica psiquiátrica, é o tratamento de escolha (primeira linha) para depressão maior, ansiedade generalizada, pânico, fobia social e TOC. Atua primariamente aumentando a serotonina disponível para modulação do estado de humor e regulação emocional a longo prazo. É amplamente indicado pela boa segurança terapêutica, sobretudo quando o paciente apresenta humor depressivo crônico cruzado com sintomas ansiosos.",
      offLabelUses: [
        { condition: "Ejaculação Precoce", evidence: "Alto", justification: "Aumenta o limiar de excitação temporal central, prolongando o tempo antes da ejaculação." },
        { condition: "Síndrome do Intestino Irritável (SII)", evidence: "Moderado", justification: "Auxilia na neuromodulação do plexo entérico e na hiperalgesia visceral através do aumento da serotonina." },
        { condition: "Sintomas Vasomotores da Menopausa", evidence: "Moderado", justification: "Pode reduzir fogachos e ondas de calor não responsivos à reposição hormonal." }
      ],
      onLabelUses,
      profileSymbols
    };
  }

  if (isISRSN) {
    const profileSymbols: ProfileSymbolKey[] = ['serotonergic', 'noradrenergic'];
    if (name.includes('duloxetina') || name.includes('venlafaxina')) {
      profileSymbols.push('gold_standard');
    }

    const onLabelUses: OnLabelUse[] = [
      {
        condition: "Depressão Maior (TDM)",
        line: "1ª Linha",
        evidence: "Robusto",
        justification: "Excelente indicação para quadros depressivos severos, com apatia intensa, fadiga física ou lentificação motora."
      },
      {
        condition: "Transtorno de Ansiedade Generalizada (TAG)",
        line: "1ª Linha",
        evidence: "Robusto",
        justification: "A inibição da recaptação de noradrenalina em doses médias a altas estabiliza as vias de alerta límbicas a longo prazo."
      }
    ];

    if (name.includes('duloxetina')) {
      onLabelUses.push({
        condition: "Dor Neuropática Diabética / Fibromialgia",
        line: "1ª Linha",
        evidence: "Padrão-Ouro",
        justification: "Ativação potente das vias serotoninérgicas e noradrenérgicas descendentes na medula, inibindo sinais aferentes de dor."
      });
    }

    return {
      psychiatryUse: "Tratamento de primeira linha para depressão maior estrutural, sendo especialmente útil em pacientes apáticos, sem iniciativa ou com lentificação psicomotora, onde a inibição potente paralela da noradrenalina ajuda a 'energizar' o humor. Utilizado igualmente em quadros ansiosos severos crônicos.",
      offLabelUses: [
        { condition: "Dor Crônica Neuropática / Dor Lombar", evidence: "Alto", justification: "A ação da serotonina juntamente com a noradrenalina reforça ativamente as vias inibitórias descendentes da dor na medula." },
        { condition: "Fibromialgia", evidence: "Alto", justification: "Suprime de maneira consistente a hipersensibilidade periférica e alivia o binômio dor-depressão inerente ao quadro." },
        { condition: "TDAH em adultos", evidence: "Anedótico", justification: "Pode proporcionar aumento tímido da cognição via atividade da noradrenalina cortical, caso estimulantes clássicos sejam proibitivos." }
      ],
      onLabelUses,
      profileSymbols
    };
  }
  
  if (isAtypicalAntipsychotic) {
    const profileSymbols: ProfileSymbolKey[] = ['dopaminergic'];
    if (name.includes('quetiapina') || name.includes('olanzapina') || name.includes('clozapina')) {
      profileSymbols.push('antihistaminic');
      profileSymbols.push('metabolic_risk');
    }
    if (name.includes('olanzapina') || name.includes('clozapina') || name.includes('aripiprazol')) {
      profileSymbols.push('gold_standard');
    }
    if (name.includes('clozapina')) {
      profileSymbols.push('anticholinergic');
    }
    if (name.includes('aripiprazol')) {
      profileSymbols.push('serotonergic'); // D2 + 5-HT1A partial agonism
    }

    const onLabelUses: OnLabelUse[] = [
      {
        condition: "Esquizofrenia e Quadros Psicóticos",
        line: name.includes('clozapina') ? "Refratária" : "1ª Linha",
        evidence: name.includes('clozapina') ? "Padrão-Ouro" : "Robusto",
        justification: name.includes('clozapina') 
          ? "Tratamento padrão-ouro absoluto para esquizofrenia resistente a múltiplos antipsicóticos. Reduz tendências suicidas." 
          : "Tratamento de escolha para controlar sintomas psicóticos positivos e negativos com menor risco de sintomas extrapiramidais."
      },
      {
        condition: "Transtorno Bipolar (Mania Aguda)",
        line: "1ª Linha",
        evidence: "Padrão-Ouro",
        justification: "Rápida desaceleração psicomotora, redução da euforia ideativa e reestabelecimento do sono em episódios maníacos."
      }
    ];

    if (name.includes('quetiapina') || name.includes('aripiprazol')) {
      onLabelUses.push({
        condition: "Depressão Unipolar Refratária (Potencialização)",
        line: "Adjuvante",
        evidence: "Robusto",
        justification: "Usado em doses baixas para acelerar e potencializar a resposta clínica dos antidepressivos primários."
      });
    }

    if (name.includes('quetiapina')) {
      onLabelUses.push({
        condition: "Depressão Bipolar",
        line: "1ª Linha",
        evidence: "Padrão-Ouro",
        justification: "Um dos poucos medicamentos aprovados em monoterapia com alta eficácia para a fase depressiva no transtorno bipolar."
      });
    }

    return {
      psychiatryUse: "Essencialmente desenvolvidos para o tratamento de espectros esquizofreniformes e crises do transtorno bipolar. Contudo, seu principal papel tem evoluído para o uso como adjuvante impulsionador na depressão maior refratária de difícil tratamento (como potencializador do antidepressivo primário). Recomendados também para acalmar quadros graves de agitação e severa impulsividade.",
      offLabelUses: [
        { condition: "Insônia Primária Refratária", evidence: "Moderado", justification: "Extremo poder anticolinérgico/anti-histamínico gera sedação química (Quetiapina é amplamente abusada nesse fim, com ressalvas metabólicas graves)." },
        { condition: "Transtorno da Personalidade Borderline (TPB)", evidence: "Baixo", justification: "Utilizado em baixas dosagens para atenuar a instabilidade afetiva explosiva e pseudo-sintomas psicóticos passageiros." },
        { condition: "Agitação em Demências", evidence: "Moderado", justification: "Último recurso pra descontrole comportamental grave.", notes: "Nota: O uso na demência porta 'Black Box Warning' para mortalidade cardiovascular idosa." }
      ],
      onLabelUses,
      profileSymbols
    };
  }

  if (isTypicalAntipsychotic) {
    const profileSymbols: ProfileSymbolKey[] = ['dopaminergic', 'cardiac_risk'];
    if (name.includes('clorpromazina')) {
      profileSymbols.push('antihistaminic');
      profileSymbols.push('anticholinergic');
    }

    const onLabelUses: OnLabelUse[] = [
      {
        condition: "Esquizofrenia / Surto Psicótico Agudo",
        line: "2ª Linha",
        evidence: "Robusto",
        justification: "Eficácia histórica inquestionável no bloqueio dopaminérgico mesolímbico, mas com alto risco de tremores extrapiramidais."
      },
      {
        condition: "Agitação Psicomotora Grave (Emergência)",
        line: "1ª Linha",
        evidence: "Robusto",
        justification: "Efeito antipsicótico e sedativo imediato para contenção química segura de pacientes delirantes agressivos."
      }
    ];

    return {
      psychiatryUse: "Reservados tipicamente para o controle agudo, fulminante, de episódios refratários de delírios, alucinações e agressividade psicótica primária. Por causa do extenso impacto no sistema dopaminérgico motor (sintomas extrapiramidais), deixou de ser primeira linha crônica na maioria das psicoses ambulatoriais silenciosas.",
      offLabelUses: [
        { condition: "Delirium Refratário Hospitalar/UTI", evidence: "Alto", justification: "Haloperidol é usado para controle de emergência de agitação no doente crítico por ausência de impacto respiratório letal." },
        { condition: "Soluços Severos Incoercíveis", evidence: "Anedótico", justification: "Mecanismo central exato não mapeado, mas o bloqueio dopaminérgico pode frear hiperreflexias do arco diafragmático." }
      ],
      onLabelUses,
      profileSymbols
    };
  }
  
  if (isTricyclic || isTetracyclic) {
    const profileSymbols: ProfileSymbolKey[] = ['serotonergic', 'noradrenergic', 'anticholinergic', 'antihistaminic'];
    if (name.includes('amitriptilina') || name.includes('clomipramina')) {
      profileSymbols.push('cardiac_risk');
    }
    if (name.includes('clomipramina')) {
      profileSymbols.push('gold_standard');
    }
    if (name.includes('mirtazapina')) {
      // Mirtazapina profile
      const mirtSymbols: ProfileSymbolKey[] = ['serotonergic', 'noradrenergic', 'antihistaminic', 'metabolic_risk', 'gold_standard'];
      const onLabelUsesMirt: OnLabelUse[] = [
        {
          condition: "Depressão Maior (TDM)",
          line: "1ª Linha",
          evidence: "Padrão-Ouro",
          justification: "Antidepressivo tetracíclico atípico. Fantástica eficácia contra ansiedade, insônia e sintomas somáticos acoplados."
        }
      ];
      return {
        psychiatryUse: "Antidepressivo tetracíclico atípico de alta eficácia (bloqueio de receptores Alfa-2 adrenérgicos e receptores de serotonina 5-HT2 e 5-HT3). Carrega excelente efeito ansiolítico e indutor do sono.",
        offLabelUses: [
          { condition: "Insônia Secundária à Depressão", evidence: "Alto", justification: "Bloqueio histamínico H1 superpotente gera forte sonolência à noite (curiosamente, doses menores de 15mg induzem mais sono do que 45mg)." },
          { condition: "Estimulação de Apetite em Idosos/Câncer", evidence: "Alto", justification: "Intenso aumento de apetite pelo sinergismo de antagonismo H1 e 5-HT2C, combatendo a caquexia." }
        ],
        onLabelUses: onLabelUsesMirt,
        profileSymbols: mirtSymbols
      };
    }

    const onLabelUses: OnLabelUse[] = [
      {
        condition: "Depressão Maior Refratária",
        line: "3ª Linha",
        evidence: "Robusto",
        justification: "A eficácia crua é espetacular, mas seu uso é relegado para linhas tardias devido à alta toxicidade e intolerabilidade dos efeitos colaterais."
      }
    ];

    if (name.includes('clomipramina')) {
      onLabelUses.push({
        condition: "Transtorno Obsessivo-Compulsivo (TOC)",
        line: "1ª Linha",
        evidence: "Padrão-Ouro",
        justification: "Único antidepressivo não-ISRS com eficácia comprovada equivalente ou superior no TOC pela sua avassaladora potência serotoninérgica."
      });
    }

    if (name.includes('amitriptilina')) {
      onLabelUses.push({
        condition: "Enxaqueca e Dores Neuropáticas",
        line: "1ª Linha",
        evidence: "Robusto",
        justification: "Ação de reforço de vias de controle de dor independente do humor. Amplamente usada na neurologia em doses baixas."
      });
    }

    return {
      psychiatryUse: "Considerados como opção robusta de segunda, terceira ou quarta linha nos fluxogramas de depressões unipolares difíceis de tratar ou TOCs graves. São os representantes mais antigos de agentes monoaminérgicos e ainda carregam uma das eficácias brutas mais consistentes na psiquiatria, mas são tolhidos frequentemente pelo perfil tóxico de efeitos colaterais cardíacos e anticolinérgicos.",
      offLabelUses: [
        { condition: "Profilaxia de Enxaqueca", evidence: "Alto", justification: "A ação crônica multifatorial estabiliza os limiares vasculares neurogênicos da dor cefálica contínua (ex: Amitriptilina)." },
        { condition: "Enurese Noturna (Infantil / Adulta)", evidence: "Moderado", justification: "A grande afinidade anticolinérgica (M1) deprime a contração tônica da bexiga noturna." },
        { condition: "Neuralgia do Trigêmeo e Herpes", evidence: "Alto", justification: "Modulam efetivamente os impulsos neurais somatossensoriais hiperativos não-responsivos a AINEs." }
      ],
      onLabelUses,
      profileSymbols
    };
  }
  
  if (isBZD) {
    const profileSymbols: ProfileSymbolKey[] = ['gabaergic'];
    if (name.includes('clonazepam')) {
      profileSymbols.push('gold_standard');
    }

    const onLabelUses: OnLabelUse[] = [
      {
        condition: "Crise de Ansiedade / Ataque de Pânico Agudo",
        line: "1ª Linha",
        evidence: "Robusto",
        justification: "Tratamento de socorro para alívio imediato (minutos) de crises de pânico descontroladas."
      },
      {
        condition: "Estado de Mal Epiléptico e Crises Convulsivas",
        line: "1ª Linha",
        evidence: "Padrão-Ouro",
        justification: "O aumento na condutância de cloreto induz hiperpolarização central imediata, cessando disparos elétricos generalizados."
      },
      {
        condition: "Prevenção de Abstinência Alcoólica Grave",
        line: "1ª Linha",
        evidence: "Padrão-Ouro",
        justification: "Substituição cruzada crucial de receptores de GABA para evitar delirium tremens, alucinações e convulsões por retirada súbita de álcool."
      }
    ];

    return {
      psychiatryUse: "Fármacos sintomáticos essenciais para alívio imediatista, rápido e ponte provisória para quadros de agitação em internamentos e neutralização instantânea de ataques de pânico avassaladores. Sua inclusão deve prever sempre a retirada a curto prazo (2-6 semanas) pela escalada de neuro-tolerância anatômica subjacente que cronicamente prejudica o prognóstico cognitivo e aditivo do paciente.",
      offLabelUses: [
        { condition: "Espasmos Musculares Complexos / Cãibras Rígidas", evidence: "Moderado", justification: "Propriedade original robusta miorrelaxante, deprimindo a espasticidade motora voluntária." },
        { condition: "Status Epilepticus / Epilepsia Aguda", evidence: "Alto", justification: "Redução maciça do limiar convulsivo ao deflagrar GABA, hiperpolarizando os feixes elétricos excessivos temporariamente." },
        { condition: "Síndrome de Abstinência Alcoólica Grave", evidence: "Alto", justification: "Uso mandatório cruzado para evitar morte induzida e delerium tremens quando da retirada crônica exógena do álcool cerebral." }
      ],
      onLabelUses,
      profileSymbols
    };
  }
  
  if (isMoodStabilizer) {
    const profileSymbols: ProfileSymbolKey[] = [];
    if (name.includes('lítio')) {
      profileSymbols.push('gold_standard');
      profileSymbols.push('cardiac_risk');
    }
    if (name.includes('valproato')) {
      profileSymbols.push('gabaergic');
      profileSymbols.push('metabolic_risk');
    }
    if (name.includes('lamotrigina')) {
      profileSymbols.push('glutamatergic');
    }
    if (name.includes('carbamazepina')) {
      profileSymbols.push('cardiac_risk');
    }

    const onLabelUses: OnLabelUse[] = [
      {
        condition: "Transtorno Bipolar (Manutenção e Prevenção de Fases)",
        line: "1ª Linha",
        evidence: "Padrão-Ouro",
        justification: "Reduz drasticamente taxas de recaídas em ambas as polaridades (principalmente mania para Lítio/Valproato e depressão para Lamotrigina)."
      }
    ];

    // A Lamotrigina NÃO tem eficácia antimaníaca aguda — atua no polo depressivo/manutenção.
    if (name.includes('lamotrigina')) {
      onLabelUses.push({
        condition: "Prevenção de Episódios Depressivos no Transtorno Bipolar",
        line: "1ª Linha",
        evidence: "Padrão-Ouro",
        justification: "Eficácia consolidada na prevenção do polo depressivo do bipolar. Não é indicada para mania aguda."
      });
    } else {
      onLabelUses.push({
        condition: "Mania Bipolar Aguda",
        line: "1ª Linha",
        evidence: "Robusto",
        justification: "Doses otimizadas de Lítio, Ácido Valproico ou Carbamazepina desaceleram o surto psicomotor maníaco em poucos dias."
      });
    }

    if (name.includes('lítio')) {
      onLabelUses.push({
        condition: "Redução do Risco de Suicídio no Transtorno Bipolar",
        line: "1ª Linha",
        evidence: "Padrão-Ouro",
        justification: "O único medicamento psicotrópico com evidência direta e categórica de redução nas taxas de suicídio consumado a longo prazo."
      });
    }

    return {
      psychiatryUse: "Ancoram toda a prática bipolar psiquiátrica clínica, inibindo mecanicamente flutuações e descargas drásticas de polarizações afetivas da mania impulsora fulminante. Funcionam também em depressões não reativas unipolares de traços melancólicos instáveis como tratamento ponte principal a longo prazo por prevenir ciclagens contínuas.",
      offLabelUses: [
        { condition: "Prevenção da Ideação Suicida Crônica", evidence: "Alto", justification: "Estilo e dados em base inquestionável em pacientes responsivos ao lítio (exigido com dosagens de manutenção)." },
        { condition: "Transtorno Neurocognitivo Frontotemporal de Impulsividade", evidence: "Baixo", justification: "Valproato tem demonstrado acalmar explosões atreladas à disfunção orbitofrontal por lesão, minimamente." },
        { condition: "Dores Crônicas em 'Gatilho'", evidence: "Alto", justification: "Ouvimos relatos (anticonvulsivantes como Pregabalina ou Carbamazepina) desativando fluxos sensoriais na neuropatia de origem diabética." }
      ],
      onLabelUses,
      profileSymbols
    };
  }
  
  if (isZDrug) {
    const profileSymbols: ProfileSymbolKey[] = ['gabaergic'];
    const onLabelUses: OnLabelUse[] = [
      {
        condition: "Insônia de Curta Duração (Dificuldade de Indução)",
        line: "1ª Linha",
        evidence: "Robusto",
        justification: "Agonistas seletivos da subunidade alfa-1 do receptor GABA-A. Indução extremamente rápida e preservação de arquitetura do sono."
      }
    ];

    return {
      psychiatryUse: "Os indutores de ação preferencial do receptor GABA em subunidade sedativa. Altamente seletivo pra iniciação e manutenção (com liberação prolongada) para pânico de arquitetura noturna, o tempo percorrido total deve ser acompanhado não excedendo prazos breves (dias a raramente poucas semanas) face que comportamentos automáticos amnésicos (parassonias complexas) são perigos comuns em excessos.",
      offLabelUses: [
        { condition: "Cura Temporária Paradoxal na Catatonia", evidence: "Baixo", justification: "'Despertar de Lázaro': o reestabelecimento surpreendente por instantes (horas) da fala e coordenação da fase dura catatônica sem causa metabólica direta subjacente." }
      ],
      onLabelUses,
      profileSymbols
    };
  }

  if (isStimulant) {
    const profileSymbols: ProfileSymbolKey[] = ['dopaminergic', 'noradrenergic'];
    if (name.includes('metilfenidato') || name.includes('lisdexanfetamina')) {
      profileSymbols.push('gold_standard');
    }
    if (name.includes('modafinil')) {
      // Modafinil has a slightly weaker stimulant profile
      const modafinilSymbols: ProfileSymbolKey[] = ['dopaminergic'];
      const onLabelUsesMod: OnLabelUse[] = [
        {
          condition: "Narcolepsia e Hipersonia Idiopática",
          line: "1ª Linha",
          evidence: "Padrão-Ouro",
          justification: "Excelente indutor de vigília focada no aumento de histamina/orexina por inibição leve do DAT, sem causar rebote adrenérgico severo."
        }
      ];
      return {
        psychiatryUse: "Indutor de vigília (eugeroico) que estimula o alerta cerebral central, sendo o padrão de ouro para narcolepsia e distúrbios do sono do trabalhador de turno alternado.",
        offLabelUses: [
          { condition: "Sonolência Residual Associada à Depressão", evidence: "Moderado", justification: "Auxilia a debelar a anergia e o cansaço mental matinal crônico em pacientes deprimidos estabilizados." },
          { condition: "Fadiga na Esclerose Múltipla", evidence: "Moderado", justification: "Melhora o rendimento motor diário e a exaustão neurológica nesses pacientes." }
        ],
        onLabelUses: onLabelUsesMod,
        profileSymbols: modafinilSymbols
      };
    }

    // Cafeína NÃO é tratamento de TDAH — é uma metilxantina de alerta leve.
    if (name.includes('cafeína')) {
      return {
        psychiatryUse: "Metilxantina de ação estimulante leve por antagonismo dos receptores de adenosina (A1/A2A). Não tem indicação psiquiátrica formal; na clínica psiquiátrica importa mais pelos efeitos adversos (ansiedade, insônia, precipitação de crises de pânico) do que como tratamento.",
        onLabelUses: [],
        offLabelUses: [
          { condition: "Astenia / Sonolência Leve", evidence: "Baixo", justification: "Aumento transitório do alerta e redução da percepção de fadiga pelo bloqueio da adenosina." },
          { condition: "Adjuvante Analgésico (Cefaleia)", evidence: "Moderado", justification: "Potencializa analgésicos em formulações para cefaleia (uso clínico consagrado)." }
        ],
        profileSymbols: ['dopaminergic']
      };
    }

    // Atomoxetina é a opção NÃO-estimulante do TDAH — não é o padrão-ouro.
    if (name.includes('atomoxetina')) {
      return {
        psychiatryUse: "Inibidor seletivo da recaptação de noradrenalina (NET) — a principal opção NÃO-estimulante para o TDAH. Início de efeito lento (4-8 semanas) e sem potencial de abuso; preferida quando há risco de abuso de estimulantes, tiques ou ansiedade comórbida.",
        onLabelUses: [
          {
            condition: "TDAH (Transtorno de Déficit de Atenção e Hiperatividade)",
            line: "1ª Linha",
            evidence: "Robusto",
            justification: "Alternativa não-estimulante de primeira escolha; aumenta noradrenalina e, no córtex pré-frontal, também dopamina. Eficácia consolidada, porém com início bem mais lento que os estimulantes."
          }
        ],
        offLabelUses: [
          { condition: "TDAH com Ansiedade Comórbida", evidence: "Moderado", justification: "Menos ativadora que os estimulantes, útil quando a ansiedade limita o uso destes." }
        ],
        profileSymbols: ['noradrenergic']
      };
    }

    const onLabelUses: OnLabelUse[] = [
      {
        condition: "TDAH (Transtorno de Déficit de Atenção e Hiperatividade)",
        line: "1ª Linha",
        evidence: "Padrão-Ouro",
        justification: "Aumento robusto na disponibilidade cortical de dopamina e noradrenalina, otimizando o controle inibitório e foco."
      }
    ];

    if (name.includes('lisdexanfetamina')) {
      onLabelUses.push({
        condition: "Transtorno de Compulsão Alimentar Periódica (TCAP)",
        line: "1ª Linha",
        evidence: "Robusto",
        justification: "Modulação estriatal de recompensa e controle de impulsos reduz substancialmente episódios de compulsão alimentar."
      });
    }

    return {
      psychiatryUse: "O alvo matriz central no cerco e manejo do TDAH ou nos extremos narcolépticos/eugeroicos, resultando numa ampliação frontal direta do controle volitivo sobre distrações e limiares letárgicos basais de cansaço extremo. Usualmente associado em baixas dosagens à prática off-label astenica geriátrica se cardiopatias forem extintas.",
      offLabelUses: [
        { condition: "Depressão Resistente / Apática / Geriátrica", evidence: "Moderado", justification: "Promete contornar refratariedades pela melindrosa ação combinada ativando vias mesolímbicas a exaustão." },
        { condition: "Fadiga Extrema na Esclerose Múltipla ou Quimioterapia Tumoral", evidence: "Moderado", justification: "Restaura pontualmente qualidade operante mínima frente à anergia central das desmielinizações imunes e destruições quimioterápicas base de letargia aguda." },
        { condition: "Transtorno de Compulsão Alimentar", evidence: "Alto", justification: "Lisdexanfetamina é estritamente aprovada nos EUA (bula) na modelagem dopaminérgica saciando refratariedades crônicas obesogênicas graves, minimizando binges mastigatórios automáticos." }
      ],
      onLabelUses,
      profileSymbols
    };
  }

  if (isMAOI) {
    const profileSymbols: ProfileSymbolKey[] = ['serotonergic', 'noradrenergic', 'dopaminergic', 'cardiac_risk'];
    const onLabelUses: OnLabelUse[] = [
      {
        condition: "Depressão Refratária / Atípica com Anedonia Grave",
        line: "Refratária",
        evidence: "Robusto",
        justification: "Eficácia biológica incomparável pela inibição profunda e irreversível da quebra de todas as três principais monoaminas."
      }
    ];

    return {
      psychiatryUse: "São drogas inestimáveis, e ultimamente pouco utilizadas, com perfis curativos incomparáveis para quem exibe fobias atípicas sociais, ou depressões reativas com ganho de peso, paralisias hiperssoníferas e chumbo emocional ('Leaden Paralysis'). Sua complexa margem de dieta em compostos tiramínicos exige alta competência e monitoria, fazendo dessa uma quarta linha excepcional pra nichos.",
      offLabelUses: [
        { condition: "Anedonia Refratária Absoluta e Retardo Psicomotor Isolado", evidence: "Anedótico", justification: "Promissora elevação brutal da neuro-volição quando a ausência da quebra orgânica da Monoamina Oxidase reverte déficits mesolímbicos inertes de anos a fio." },
        { condition: "Fobia Social / Ansiedade Social Refratária", evidence: "Moderado", justification: "Classe historicamente eficaz na ansiedade social grave resistente a ISRS; a inibição da MAO eleva as monoaminas envolvidas na regulação do medo social (fenelzina e moclobemida têm evidência específica)." }
      ],
      onLabelUses,
      profileSymbols
    };
  }
  
  if (name.includes('naltrexona')) {
    const onLabelUses: OnLabelUse[] = [
      {
        condition: "Dependência de Álcool e Prevenção de Recaídas",
        line: "1ª Linha",
        evidence: "Robusto",
        justification: "Bloqueia receptores mu-opioides centrais, interrompendo a ativação da via de recompensa dopaminérgica desencadeada pelo etanol."
      },
      {
        condition: "Dependência de Opioides (Pós-Desintoxicação)",
        line: "1ª Linha",
        evidence: "Padrão-Ouro",
        justification: "Antagonismo competitivo completo contra opioides exógenos, impedindo qualquer efeito euforizante de recaídas."
      }
    ];

    return {
      psychiatryUse: "Usada na psiquiatria prioritariamente para tratar dependência química (álcool e opioides) inibindo a via de recompensa por vias endorfinérgicas quando consumindo. Diminui os episódios compulsivos (cravings) sem criar dependência.",
      offLabelUses: [
        { condition: "Fibromialgia / Doenças Autoimunes Inflamatórias", evidence: "Moderado", justification: "O formato 'LDN' (Low Dose Naltrexone ~3mg) modula as células microgliais (anti-inflamatório cerebral), aplacando manifestações nervosas sistêmicas dolorosas excruciantes sem uso imunosupressor." }
      ],
      onLabelUses,
      profileSymbols: []
    };
  }

  if (name.includes('pregabalina') || name.includes('gabapentina')) {
    const profileSymbols: ProfileSymbolKey[] = ['gabaergic'];
    const onLabelUses: OnLabelUse[] = [
      {
        condition: "Transtorno de Ansiedade Generalizada (TAG)",
        line: "1ª Linha",
        evidence: "Robusto",
        justification: "Ligação na subunidade alfa-2-delta de canais de cálcio voltagem-dependentes, deprimindo a liberação excessiva de neurotransmissores excitatórios."
      },
      {
        condition: "Dor Neuropática / Dor Crônica",
        line: "1ª Linha",
        evidence: "Padrão-Ouro",
        justification: "Estabilização das vias hiperativas de dor central na medula e cérebro."
      }
    ];

    return {
      psychiatryUse: "Moduladores dos canais de cálcio voltagem-dependentes que acalmam a excitabilidade neuronal excessiva. Excelente atuação em ansiedade somática grave e quadros dolorosos associados.",
      offLabelUses: [
        { condition: "Insônia Secundária à Dor/Ansiedade", evidence: "Alto", justification: "Arquitetura do sono mantida, prolongando as fases de sono profundo (ondas lentas) reparador." }
      ],
      onLabelUses,
      profileSymbols
    };
  }

  if (name.includes('memantina')) {
    const profileSymbols: ProfileSymbolKey[] = ['glutamatergic'];
    const onLabelUses: OnLabelUse[] = [
      {
        condition: "Demência de Alzheimer (Moderada a Grave)",
        line: "1ª Linha",
        evidence: "Robusto",
        justification: "Antagonismo não competitivo do receptor NMDA, bloqueando ruídos patológicos de glutamato de forma voltagem-dependente."
      }
    ];

    return {
      psychiatryUse: "Antagonista NMDA de afinidade moderada que atua protegendo neurônios contra a excitotoxicidade do glutamato crônico, preservando canais normais para aprendizado.",
      offLabelUses: [
        { condition: "Transtorno Obsessivo-Compulsivo Refratário (Adjuvante)", evidence: "Moderado", justification: "Útil em casos severos para frear a hiperatividade glutamatérgica no circuito córtico-estriatal." }
      ],
      onLabelUses,
      profileSymbols
    };
  }

  if (name.includes('cetamina') || name.includes('esketamina')) {
    const profileSymbols: ProfileSymbolKey[] = ['glutamatergic', 'gold_standard'];
    const onLabelUses: OnLabelUse[] = [
      {
        condition: "Depressão Resistente ao Tratamento (DRT)",
        line: "Refratária",
        evidence: "Padrão-Ouro",
        justification: "Antagonismo NMDA robusto que desencadeia surtos rápidos de liberação de BDNF e restabelece conexões sinápticas em poucas horas."
      },
      {
        condition: "Comportamento e Ideação Suicida Aguda de Emergência",
        line: "1ª Linha",
        evidence: "Padrão-Ouro",
        justification: "Efeito antisuicida ultrarrápido comprovado clinicamente, permitindo ponte de internação segura para ajuste de outros psicotrópicos."
      }
    ];

    return {
      psychiatryUse: "Modulador glutamatérgico ultrarrápido. O uso de Esketamina intranasal ou Cetamina intravenosa revolucionou o tratamento de crises suicidas agudas e depressões refratárias a múltiplos antidepressivos orais.",
      offLabelUses: [
        { condition: "Dor Crônica Neuropática Refratária", evidence: "Alto", justification: "Infusões seriadas resetam a sensibilização central de receptores de dor crônica." }
      ],
      onLabelUses,
      profileSymbols
    };
  }

  if (name.includes('acetilcisteína')) {
    const profileSymbols: ProfileSymbolKey[] = ['glutamatergic'];
    const onLabelUses: OnLabelUse[] = [
      {
        condition: "Intoxicação por Paracetamol (Antídoto)",
        line: "1ª Linha",
        evidence: "Padrão-Ouro",
        justification: "Precursor direto da glutationa, restabelecendo as reservas de antioxidante hepático contra metabólitos tóxicos."
      }
    ];

    return {
      psychiatryUse: "Modulador glutamatérgico indireto (via transportador cistina-glutamato xCT) com potentes efeitos antioxidantes sistêmicos e no SNC.",
      offLabelUses: [
        { condition: "Tricotilomania e Dermatotilomania (Escoriação)", evidence: "Moderado", justification: "A atenuação do glutamato na fenda atenua comportamentos repetitivos de 'grooming' focados no corpo." },
        { condition: "Potencialização em TOC e Adições", evidence: "Moderado", justification: "Ajuda a regular disparos compulsivos e fissura (craving) no abuso de substâncias químicas." }
      ],
      onLabelUses,
      profileSymbols
    };
  }

  // Fallback
  return {
    psychiatryUse: "Medicamento auxiliar com atuação direta nas desregulações patológicas ou disfuncionais nos pólos corticais nervosos sistêmicos, adequando os impulsos fisiológicos.",
    offLabelUses: [
      { condition: "Dores Refratárias Generalizadas e Uso Empírico Geral", evidence: "Baixo", justification: "Auxilia ocasionalmente a debelar focos desconhecidos via modulação mista difusa perante tolerabilidades individuais." }
    ],
    onLabelUses: [
      {
        condition: "Condição Geral Psiquiátrica",
        line: "3ª Linha",
        evidence: "Moderado",
        justification: "Modulação de alvos secundários para estabilização de neurotransmissores no sistema nervoso central."
      }
    ],
    profileSymbols: []
  };
}
