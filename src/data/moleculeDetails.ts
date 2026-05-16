import { Molecule, OffLabelUse } from './schema';

interface MoleculeDetails {
  psychiatryUse: string;
  offLabelUses: OffLabelUse[];
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
  
  if (isISRS) {
    return {
      psychiatryUse: "Na prática clínica psiquiátrica, é o tratamento de escolha (primeira linha) para depressão maior, ansiedade generalizada, pânico, fobia social e TOC. Atua primariamente aumentando a serotonina disponível para modulação do estado de humor e regulação emocional a longo prazo. É amplamente indicado pela boa segurança terapêutica, sobretudo quando o paciente apresenta humor depressivo crônico cruzado com sintomas ansiosos.",
      offLabelUses: [
        { condition: "Ejaculação Precoce", evidence: "Alto", justification: "Aumenta o limiar de excitação temporal central, prolongando o tempo antes da ejaculação." },
        { condition: "Síndrome do Intestino Irritável (SII)", evidence: "Moderado", justification: "Auxilia na neuromodulação do plexo entérico e na hiperalgesia visceral através do aumento da serotonina." },
        { condition: "Sintomas Vasomotores da Menopausa", evidence: "Moderado", justification: "Pode reduzir fogachos e ondas de calor não responsivos à reposição hormonal." }
      ]
    };
  }

  if (isISRSN) {
    return {
      psychiatryUse: "Tratamento de primeira linha para depressão maior estrutural, sendo especialmente útil em pacientes apáticos, sem iniciativa ou com lentificação psicomotora, onde a inibição potente paralela da noradrenalina ajuda a 'energizar' o humor. Utilizado igualmente em quadros ansiosos severos crônicos.",
      offLabelUses: [
        { condition: "Dor Crônica Neuropática / Dor Lombar", evidence: "Alto", justification: "A ação da serotonina juntamente com a noradrenalina reforça ativamente as vias inibitórias descendentes da dor na medula." },
        { condition: "Fibromialgia", evidence: "Alto", justification: "Suprime de maneira consistente a hipersensibilidade periférica e alivia o binômio dor-depressão inerente ao quadro." },
        { condition: "TDAH em adultos", evidence: "Anedótico", justification: "Pode proporcionar aumento tímido da cognição via atividade da noradrenalina cortical, caso estimulantes clássicos sejam proibitivos." }
      ]
    };
  }
  
  if (isAtypicalAntipsychotic) {
    return {
      psychiatryUse: "Essencialmente desenvolvidos para o tratamento de espectros esquizofreniformes e crises do transtorno bipolar. Contudo, seu principal papel tem evoluído para o uso como adjuvante impulsionador na depressão maior refratária de difícil tratamento (como potencializador do antidepressivo primário). Recomendados também para acalmar quadros graves de agitação e severa impulsividade.",
      offLabelUses: [
        { condition: "Insônia Primária Refratária", evidence: "Moderado", justification: "Extremo poder anticolinérgico/anti-histamínico gera sedação química (Quetiapina é amplamente abusada nesse fim, com ressalvas metabólicas graves)." },
        { condition: "Transtorno da Personalidade Borderline (TPB)", evidence: "Baixo", justification: "Utilizado em baixas dosagens para atenuar a instabilidade afetiva explosiva e pseudo-sintomas psicóticos passageiros." },
        { condition: "Agitação em Demências", evidence: "Moderado", justification: "Último recurso pra descontrole comportamental grave.", notes: "Nota: O uso na demência porta 'Black Box Warning' para mortalidade cardiovascular idosa." }
      ]
    };
  }

  if (isTypicalAntipsychotic) {
    return {
      psychiatryUse: "Reservados tipicamente para o controle agudo, fulminante, de episódios refratários de delírios, alucinações e agressividade psicótica primária. Por causa do extenso impacto no sistema dopaminérgico motor (sintomas extrapiramidais), deixou de ser primeira linha crônica na maioria das psicoses ambulatoriais silenciosas.",
      offLabelUses: [
        { condition: "Delirium Refratário Hospitalar/UTI", evidence: "Alto", justification: "Haloperidol é usado para controle de emergência de agitação no doente crítico por ausência de impacto respiratório letal." },
        { condition: "Soluços Severos Incoercíveis", evidence: "Anedótico", justification: "Mecanismo central exato não mapeado, mas o bloqueio dopaminérgico pode frear hiperreflexias do arco diafragmático." }
      ]
    };
  }
  
  if (isTricyclic || isTetracyclic) {
    return {
      psychiatryUse: "Considerados como opção robusta de segunda, terceira ou quarta linha nos fluxogramas de depressões unipolares difíceis de tratar ou TOCs graves. São os representantes mais antigos de agentes monoaminérgicos e ainda carregam uma das eficácias brutas mais consistentes na psiquiatria, mas são tolhidos frequentemente pelo perfil tóxico de efeitos colaterais cardíacos e anticolinérgicos.",
      offLabelUses: [
        { condition: "Profilaxia de Enxaqueca", evidence: "Alto", justification: "A ação crônica multifatorial estabiliza os limiares vasculares neurogênicos da dor cefálica contínua (ex: Amitriptilina)." },
        { condition: "Enurese Noturna (Infantil / Adulta)", evidence: "Moderado", justification: "A grande afinidade anticolinérgica (M1) deprime a contração tônica da bexiga noturna." },
        { condition: "Neuralgia do Trigêmeo e Herpes", evidence: "Alto", justification: "Modulam efetivamente os impulsos neurais somatossensoriais hiperativos não-responsivos a AINEs." }
      ]
    };
  }
  
  if (isBZD) {
    return {
      psychiatryUse: "Fármacos sintomáticos essenciais para alívio imediatista, rápido e ponte provisória para quadros de agitação em internamentos e neutralização instantânea de ataques de pânico avassaladores. Sua inclusão deve prever sempre a retirada a curto prazo (2-6 semanas) pela escalada de neuro-tolerância anatômica subjacente que cronicamente prejudica o prognóstico cognitivo e aditivo do paciente.",
      offLabelUses: [
        { condition: "Espasmos Musculares Complexos / Cãibras Rígidas", evidence: "Moderado", justification: "Propriedade original robusta miorrelaxante, deprimindo a espasticidade motora voluntária." },
        { condition: "Status Epilepticus / Epilepsia Aguda", evidence: "Alto", justification: "Redução maciça do limiar convulsivo ao deflagrar GABA, hiperpolarizando os feixes elétricos excessivos temporariamente." },
        { condition: "Síndrome de Abstinência Alcoólica Grave", evidence: "Alto", justification: "Uso mandatório cruzado para evitar morte induzida e delerium tremens quando da retirada crônica exógena do álcool cerebral." }
      ]
    };
  }
  
  if (isMoodStabilizer) {
    return {
      psychiatryUse: "Ancoram toda a prática bipolar psiquiátrica clínica, inibindo mecanicamente flutuações e descargas drásticas de polarizações afetivas da mania impulsora fulminante. Funcionam também em depressões não reativas unipolares de traços melancólicos instáveis como tratamento ponte principal a longo prazo por prevenir ciclagens contínuas.",
      offLabelUses: [
        { condition: "Prevenção da Ideação Suicida Crônica", evidence: "Alto", justification: "Estilo e dados em base inquestionável em pacientes responsivos ao lítio (exigido com dosagens de manutenção)." },
        { condition: "Transtorno Neurocognitivo Frontotemporal de Impulsividade", evidence: "Baixo", justification: "Valproato tem demonstrado acalmar explosões atreladas à disfunção orbitofrontal por lesão, minimamente." },
        { condition: "Dores Crônicas em 'Gatilho'", evidence: "Alto", justification: "Ouvimos relatos (anticonvulsivantes como Pregabalina ou Carbamazepina) desativando fluxos sensoriais na neuropatia de origem diabética." }
      ]
    };
  }
  
  if (isZDrug) {
    return {
      psychiatryUse: "Os indutores de ação preferencial do receptor GABA em subunidade sedativa. Altamente seletivo pra iniciação e manutenção (com liberação prolongada) para pânico de arquitetura noturna, o tempo percorrido total deve ser acompanhado não excedendo prazos breves (dias a raramente poucas semanas) face que comportamentos automáticos amnésicos (parassonias complexas) são perigos comuns em excessos.",
      offLabelUses: [
        { condition: "Cura Temporária Paradoxal na Catatonia", evidence: "Baixo", justification: "'Despertar de Lázaro': o reestabelecimento surpreendente por instantes (horas) da fala e coordenação da fase dura catatônica sem causa metabólica direta subjacente." }
      ]
    };
  }

  if (isStimulant) {
    return {
      psychiatryUse: "O alvo matriz central no cerco e manejo do TDAH ou nos extremos narcolépticos/eugeroicos, resultando numa ampliação frontal direta do controle volitivo sobre distrações e limiares letárgicos basais de cansaço extremo. Usualmente associado em baixas dosagens à prática off-label astenica geriátrica se cardiopatias forem extintas.",
      offLabelUses: [
        { condition: "Depressão Resistente / Apática / Geriátrica", evidence: "Moderado", justification: "Promete contornar refratariedades pela melindrosa ação combinada ativando vias mesolímbicas a exaustão." },
        { condition: "Fadiga Extrema na Esclerose Múltipla ou Quimioterapia Tumoral", evidence: "Moderado", justification: "Restaura pontualmente qualidade operante mínima frente à anergia central das desmielinizações imunes e destruições quimioterápicas base de letargia aguda." },
        { condition: "Transtorno de Compulsão Alimentar", evidence: "Alto", justification: "Lisdexanfetamina é estritamente aprovada nos EUA (bula) na modelagem dopaminérgica saciando refratariedades crônicas obesogênicas graves, minimizando binges mastigatórios automáticos." }
      ]
    };
  }

  if (isMAOI) {
    return {
      psychiatryUse: "São drogas inestimáveis, e ultimamente pouco utilizadas, com perfis curativos incomparáveis para quem exibe fobias atípicas sociais, ou depressões reativas com ganho de peso, paralisias hiperssoníferas e chumbo emocional ('Leaden Paralysis'). Sua complexa margem de dieta em compostos tiramínicos exige alta competência e monitoria, fazendo dessa uma quarta linha excepcional pra nichos.",
      offLabelUses: [
        { condition: "Anedonia Refratária Absoluta e Retardo Psicomotor Isolado", evidence: "Anedótico", justification: "Promissora elevação brutal da neuro-volição quando a ausência da quebra orgânica da Monoamina Oxidase reverte déficits mesolímbicos inertes de anos a fio." },
        { condition: "Doença de Parkinson Adjuvante", evidence: "Moderado", justification: "Ao pararem a degradação da dopamina em níveis profundos por vias B nos ganglios de base, aliviam os sintomas distônicos parkinsonianos atípicos." }
      ]
    };
  }
  
  // Naltrexona, Memantina, Ketamina
  if (name.includes('naltrexona')) {
    return {
      psychiatryUse: "Usada na psiquiatria prioritariamente para tratar dependência química (álcool e opioides) inibindo a via de recompensa por vias endorfinérgicas quando consumindo. Diminui os episódios compulsivos (cravings) sem criar dependência.",
      offLabelUses: [
        { condition: "Fibromialgia / Doenças Autoimunes Inflamatórias", evidence: "Moderado", justification: "O formato 'LDN' (Low Dose Naltrexone ~3mg) modula as células microgliais (anti-inflamatório cerebral), aplacando manifestações nervosas sistêmicas dolorosas excruciantes sem uso imunosupressor." }
      ]
    };
  }

  if (name.includes('memantina') || name.includes('acetilcisteína') || name.includes('cetamina') || name.includes('gabapentina') || name.includes('pregabalina')) {
    return {
      psychiatryUse: "Ativos glutamatérgicos amplamente discutidos na modernidade para modulação do aprendizado obsessivo compulsivo ou a indução aguda plástica nos focos centrais da plasticidade depressiva e dos transtornos do neuro-desenvolvimento atípicos agudos autistas para restabelecer limiares comportamentais perdidos ou inabilitados ao estresse grave sistêmico.",
      offLabelUses: [
        { condition: "Tricotilomania, Comorbidades Obsessivas / TOC Extremo Refratário", evidence: "Moderado", justification: "Sinais claros de enfraquecimento em vias neuroquímicas na cascatas hiperativas de glutamato inibindo pensamentos recorrentes e arrancar cabelos/pele." },
        { condition: "Alívio Rápido de Ideação Suicida / Depressão Resistente (Cetamina)", evidence: "Alto", justification: "Reconexão sináptica imediata do tecido por pulsos de crescimento neurogênico promovendo escape instantâneo biológico na primeira dose emergencial a despeito das dissociações psíquicas transientes." }
      ]
    };
  }

  // Fallback
  return {
    psychiatryUse: "Medicamento auxiliar com atuação direta nas desregulações patológicas ou disfuncionais nos pólos corticais nervosos sistêmicos, adequando os impulsos fisiológicos.",
    offLabelUses: [
      { condition: "Dores Refratárias Generalizadas e Uso Empírico Geral", evidence: "Baixo", justification: "Auxilia ocasionalmente a debelar focos desconhecidos via modulação mista difusa perante tolerabilidades individuais." }
    ]
  };
}
