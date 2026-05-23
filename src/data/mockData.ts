import {
  Molecule,
  Receptor,
  MetabolicEnzyme,
  MoleculeReceptorInteraction,
  MoleculeEnzymeInteraction
} from './schema';
import { getMoleculeDetails } from './moleculeDetails';

const baseMolecules: Molecule[] = [
  // ISRS
  { id: 'm1', name: 'Fluoxetina', tradeNames: ['Prozac', 'Daforin'], class: 'ISRS', clinicalAxes: ['Antidepressivo'], mechanisms: 'Inibição de SERT. Antagonismo fraco 5-HT2C.', notes: 'Meia-vida muito longa, não requer desmame rigoroso.' , sideEffects: ["Insônia","Náusea inicial","Disfunção sexual","Cefaleia"], contraindications: ["Uso concomitante com IMAO","Pimozida"], routes: ["Oral","Cápsula","Comprimido","Solução Oral"] },
  { id: 'm4', name: 'Sertralina', tradeNames: ['Zoloft', 'Tolrest'], class: 'ISRS', clinicalAxes: ['Antidepressivo', 'Ansiolitico'], mechanisms: 'Inibição de SERT. Fraca inibição DAT e ligação sigma-1.', notes: 'Bom perfil de segurança cardíaca (post-IAM).' , sideEffects: ["Diarreia","Náusea","Disfunção sexual","Insônia","Boca seca"], contraindications: ["Uso concomitante com IMAO"], routes: ["Oral","Comprimido"] },
  { id: 'm5', name: 'Paroxetina', tradeNames: ['Aropax', 'Pondera'], class: 'ISRS', clinicalAxes: ['Antidepressivo', 'Ansiolitico'], mechanisms: 'Inibição de SERT. Leve inibição NET e afinidade M1 (anticolinérgico).', notes: 'Alta incidência de síndrome de abstinência/descontinuação.' , sideEffects: ["Ganho de peso","Sonolência","Disfunção sexual acentuada","Sudorese"], contraindications: ["Uso concomitante com IMAO","Gravidez (Risco D)"], routes: ["Oral","Comprimido"] },
  { id: 'm6', name: 'Escitalopram', tradeNames: ['Lexapro'], class: 'ISRS', clinicalAxes: ['Antidepressivo', 'Ansiolitico'], mechanisms: 'Inibição alostérica altamente seletiva de SERT.', notes: 'Perfil bem tolerado. Risco de prolongamento QTc dependente da dose.' , sideEffects: ["Náusea","Ejaculação retardada","Fadiga","QTc prolongado"], contraindications: ["Uso concomitante com IMAO","Prolongamento QTc basal"], routes: ["Oral","Comprimido","Gotas"] },
  { id: 'm7', name: 'Citalopram', tradeNames: ['Cipramil'], class: 'ISRS', clinicalAxes: ['Antidepressivo', 'Ansiolitico'], mechanisms: 'Inibição de SERT (mistura racêmica R/S). Fraco antagonismo H1.', notes: 'Restrição de dose por risco documentado de prolongamento QTc.' , sideEffects: ["Prolongamento QTc","Náusea","Sudorese","Disfunção sexual"], contraindications: ["Uso concomitante com IMAO","Uso concomitante com Pimozida","Braquicardia congênita"], routes: ["Oral","Comprimido"] },
  { id: 'm8', name: 'Fluvoxamina', tradeNames: ['Luvox'], class: 'ISRS', clinicalAxes: ['Antidepressivo', 'Ansiolitico'], mechanisms: 'Inibição de SERT e potente agonismo sigma-1.', notes: 'Ouro no TOC. Interações medicamentosas extensas via inibição do CYP450.' , sideEffects: ["Náusea intensa","Sonolência","Astenia"], contraindications: ["Uso concomitante com IMAO","Tizanidina","Ramelteon"], routes: ["Oral","Comprimido"] },

  // Antipsicóticos Típicos (mantidos do mock base para manter estrutura, ou adicionados)
  { id: 'm2', name: 'Haloperidol', tradeNames: ['Haldol'], class: 'Antipsicótico Típico', clinicalAxes: ['Antipsicotico'], mechanisms: 'Bloqueio potente D2.', notes: 'Alto risco de sintomas extrapiramidais (SEP).' , sideEffects: ["Acatisia","Parkinsonismo","Distonia","Discinesia Tardia","Hiperprolactinemia"], contraindications: ["Coma","Doença de Parkinson","Depressão severa do SNC"], routes: ["Oral","Intramuscular (Decanoato)","Intravenoso (Agudo)"] },
  
  // Antipsicóticos Atípicos e Aripiprazol
  { id: 'm3', name: 'Aripiprazol', tradeNames: ['Abilify', 'Aristab'], class: 'Antipsicótico Atípico', clinicalAxes: ['Antipsicotico', 'Estabilizador'], mechanisms: 'Agonista parcial D2 e 5-HT1A, antagonista 5-HT2A.', notes: 'Acatisia é comum em início de tratamento.' , sideEffects: ["Acatisia","Insônia","Inquietação","Cefaleia"], contraindications: [], routes: ["Oral","Comprimido","Intramuscular (Mensal)"] },
  { id: 'm22', name: 'Clozapina', tradeNames: ['Leponex'], class: 'Antipsicótico Atípico', clinicalAxes: ['Antipsicotico'], mechanisms: 'Antagonista 5-HT2A e fraco D2. Antagonismo M1, H1 e Alpha-1.', notes: 'Risco de agranulocitose requer hemograma rígido. Uso apenas em esquizofrenia refratária.' , sideEffects: ["Sialorreia","Sedação profunda","Ganho de peso extremo","Taquicardia","Constipação severa"], contraindications: ["Mielossupressão prévia","Convulsões não controladas","Íleo paralítico"], routes: ["Oral","Comprimido"] },
  { id: 'm23', name: 'Quetiapina', tradeNames: ['Seroquel'], class: 'Antipsicótico Atípico', clinicalAxes: ['Antipsicotico', 'Estabilizador'], mechanisms: 'Antagonismo H1 e 5-HT2A, com fraco bloqueio D2 transiente.', notes: 'Efeito altamente sedativo. Metabólito norquetiapina atua na rede noradrenérgica.' , sideEffects: ["Sedação","Ganho de peso","Hipotensão ortostática","Boca seca"], contraindications: ["Prolongamento QTc severo"], routes: ["Oral","Comprimido","Comprimido de Liberação Prolongada (XR)"] },
  { id: 'm24', name: 'Risperidona', tradeNames: ['Risperdal'], class: 'Antipsicótico Atípico', clinicalAxes: ['Antipsicotico'], mechanisms: 'Antagonista potente D2 e 5-HT2A.', notes: 'Dentre os atípicos, tem alto risco de hiperprolactinemia e SEP dose-dependente.' , sideEffects: ["Hiperprolactinemia","Galactorreia","Sedação","Aumento de peso","Sintomas Extrapiramidais"], contraindications: [], routes: ["Oral","Comprimido","Gotas","Intramuscular (Depot)"] },
  { id: 'm25', name: 'Olanzapina', tradeNames: ['Zyprexa'], class: 'Antipsicótico Atípico', clinicalAxes: ['Antipsicotico', 'Estabilizador'], mechanisms: 'Amplo perfil antagonista em múltiplos receptores (D2, 5-HT2A, H1, M1).', notes: 'Elevado impacto metabólico (ganho de peso, hiperglicemia e dislipidemia).' , sideEffects: ["Ganho de peso drástico","Síndrome metabólica","Sedação","Boca seca"], contraindications: ["Risco de glaucoma de ângulo fechado"], routes: ["Oral","Comprimido","Comprimido Orodispersível"] },
  { id: 'm26', name: 'Ziprasidona', tradeNames: ['Geodon'], class: 'Antipsicótico Atípico', clinicalAxes: ['Antipsicotico'], mechanisms: 'Antagonismo 5-HT2A/D2, além de forte ação como inibidor de reuptake 5-HT/NE.', notes: 'Deve obrigatoriamente ser tomada com pelo menos 500 calorias. Pode alongar o QTc.' , sideEffects: ["Prolongamento QTc","Ondas de calor","Somnolência"], contraindications: ["Histórico de prolongamento QTc","Idosos com psicose relacionada à demência"], routes: ["Oral","Capsula"] },

  // ISRSN
  { id: 'm9', name: 'Venlafaxina', tradeNames: ['Effexor', 'Efexor XR'], class: 'ISRSN', clinicalAxes: ['Antidepressivo', 'Ansiolitico'], mechanisms: 'Inibe SERT em baixas doses; adição de inibição NET em doses mais altas.', notes: 'Pode induzir elevação sustentada da pressão arterial (dose-dependente).' },
  { id: 'm10', name: 'Desvenlafaxina', tradeNames: ['Pristiq'], class: 'ISRSN', clinicalAxes: ['Antidepressivo'], mechanisms: 'Metabólito ativo direto (O-desmetilvenlafaxina). Inibe SERT e NET.', notes: 'Eficácia previsível independente da metabolização do CYP2D6.' , sideEffects: ["Náusea","Tontura","Hiperidrose","Boca seca"], contraindications: ["Uso concomitante com IMAO"], routes: ["Oral","Comprimido de Liberação Prolongada"] },
  { id: 'm11', name: 'Duloxetina', tradeNames: ['Cymbalta', 'Velija'], class: 'ISRSN', clinicalAxes: ['Antidepressivo', 'Ansiolitico'], mechanisms: 'Inibição de SERT e NET equilibrada em todas as doses.', notes: 'Eficácia validada para fibromialgia, neuropatias pélvicas e dor lombar crônica.' , sideEffects: ["Náusea","Boca seca","Somnolência","Constipação"], contraindications: ["Uso concomitante com IMAO","Insuficiência Hepática e/ou Renal (CrCl < 30)"], routes: ["Oral","Cápsula com grânulos gastroresistentes"] },
  { id: 'm12', name: 'Milnaciprana', tradeNames: ['Ixel', 'Savella'], class: 'ISRSN', clinicalAxes: ['Antidepressivo'], mechanisms: 'Afinidade de bloqueio levemente maior em NET comparada a SERT.', notes: 'Maior uso em fibromialgia (Américas) e síndromes crônicas não-psiquiátricas.' , sideEffects: ["Náusea","Cefaleia","Palpitações","Constipação"], contraindications: ["Uso concomitante com IMAO"], routes: ["Oral","Comprimido"] },

  // Tricíclicos
  { id: 'm13', name: 'Amitriptilina', tradeNames: ['Tryptanol'], class: 'Tricíclico', clinicalAxes: ['Antidepressivo'], mechanisms: 'Bloqueio SERT/NET. Forte bloqueio H1, M1 e alfa-1.', notes: 'Letal em overdose. Extensão QTc. Risco arritmico alto.' , sideEffects: ["Retenção urinária","Constipação extrema","Sedação profunda","Visão turva","Hipotensão ortostática"], contraindications: ["Recuperação aguda de infarto do miocárdio","Uso de IMAO","Glaucoma de ângulo fechado"], routes: ["Oral","Comprimido"] },
  { id: 'm14', name: 'Imipramina', tradeNames: ['Tofranil'], class: 'Tricíclico', clinicalAxes: ['Antidepressivo'], mechanisms: 'Inibe primariamente SERT e NET. Perfil off-target anticolinérgico.', notes: 'Primeiro TCA. Foi muito usado para enurese infantil e dor neuropática.' , sideEffects: ["Taquicardia","Inquietação","Boca seca","Hipotensão"], contraindications: ["Uso concomitante com IMAO","Recuperação aguda pós-IAM"], routes: ["Oral","Grágea"] },
  { id: 'm15', name: 'Clomipramina', tradeNames: ['Anafranil'], class: 'Tricíclico', clinicalAxes: ['Antidepressivo'], mechanisms: 'Inibição de SERT muito intensa.', notes: 'Ainda considerado padrão de grande eficácia no Transtorno Obsessivo Compulsivo.' , sideEffects: ["Tremor","Boca seca","Ganho de peso","Disfunção sexual extrema","Convulsões (dose-dependente)"], contraindications: ["IAM recente","Risco alto de convulsões","Uso concomitante com IMAO"], routes: ["Oral","Comprimido"] },
  { id: 'm16', name: 'Nortriptilina', tradeNames: ['Pamelor'], class: 'Tricíclico', clinicalAxes: ['Antidepressivo'], mechanisms: 'Inibição seletiva de NET com efeitos anticolinérgicos menores.', notes: 'Melhor tolerabilidade entre os TCAs para uso na população geriátrica.' , sideEffects: ["Boca seca","Constipação","Tontura"], contraindications: ["Fase aguda após IAM"], routes: ["Oral","Cápsula"] },

  // Tetracíclicos
  { id: 'm17', name: 'Mirtazapina', tradeNames: ['Remeron'], class: 'Tetracíclico', clinicalAxes: ['Antidepressivo'], mechanisms: 'Antagonista alfa-2, H1 potente, 5-HT2A e 5-HT3.', notes: 'Em baixas doses o efeito H1 predomina gerando forte sedação e ganho de peso.' , sideEffects: ["Aumento de apetite drástico","Ganho de peso","Sedação","Boca seca"], contraindications: ["Uso concomitante com IMAO"], routes: ["Oral","Comprimido","Comprimido Orodispersível"] },
  { id: 'm18', name: 'Maprotilina', tradeNames: ['Ludiomil'], class: 'Tetracíclico', clinicalAxes: ['Antidepressivo'], mechanisms: 'Inibidor de recaptação de noradrenalina potente e antagonista H1.', notes: 'Eileptogênica, contraindicado em transtornos convulsivos.' , sideEffects: ["Convulsões","Sedação","Boca seca típica"], contraindications: ["Transtornos convulsivos prévios","IAM recente"], routes: ["Oral","Comprimido"] },

  // iMAOs
  { id: 'm19', name: 'Fenelzina', tradeNames: ['Nardil'], class: 'iMAO', clinicalAxes: ['Antidepressivo'], mechanisms: 'Inibição irreversível não-seletiva (MAO-A e MAO-B) derivado de hidrazina.', notes: 'Restrição nutricional estrita obrigatória por risco de crise simpática.' , sideEffects: ["Hipotensão ortostática grave","Ganho de peso","Insônia","Disfunção sexual"], contraindications: ["Uso concomitante com ISRS","Alimentos ricos em tiramina sem restrição dietética","Feocromocitoma"], routes: ["Oral","Comprimido"] },
  { id: 'm20', name: 'Tranilcipromina', tradeNames: ['Parnate'], class: 'iMAO', clinicalAxes: ['Antidepressivo'], mechanisms: 'Inibição irreversível da MAO-A e MAO-B. Semelhante química com anfetaminas.', notes: 'Efeito altamente ativador com riscos noradrenérgicos letais.' , sideEffects: ["Risco de crise hipertensiva aguda","Anorexia","Insônia","Inquietação excessiva"], contraindications: ["Doença cardiovascular preexistente","Uso concomitante com inibidores de recaptação de serotonina","Alimentos contendo tiramina"], routes: ["Oral","Comprimido"] },
  { id: 'm21', name: 'Moclobemida', tradeNames: ['Aurorix'], class: 'iMAO', clinicalAxes: ['Antidepressivo'], mechanisms: 'Inibidor Reversível da MAO-A (RIMA).', notes: 'Menor risco dietético perante a tiramina em comparação aos IMAOs tradicionais.' , sideEffects: ["Insônia","Tontura","Náusea"], contraindications: ["Uso com Selegilina","Tireotoxicose"], routes: ["Oral","Comprimido"] },

  // Estabilizadores de Humor
  { id: 'm27', name: 'Lítio', tradeNames: ['Carbolitium'], class: 'Estabilizador de Humor', clinicalAxes: ['Estabilizador'], mechanisms: 'Substituição iônica alterando via da IMPase e PKC, inibição de GSK-3 beta.', notes: 'Acompanhar litemia, TSH e creatinina. Interações farmacocinéticas predominantemente renais.' , sideEffects: ["Poliúria","Polidipsia","Tremor fino","Hipotireoidismo induzido","Ganho de peso","Náusea"], contraindications: ["Insuficiência renal grave","Doença cardiovascular grave","Desidratação e depleção de sódio"], routes: ["Oral","Comprimido","Comprimido de Liberação Modificada"] },
  { id: 'm28', name: 'Valproato', tradeNames: ['Depakene', 'Depakote'], class: 'Estabilizador de Humor', clinicalAxes: ['Estabilizador'], mechanisms: 'Múltiplos mecanismos: bloqueio de canais de sódio, potenciação GABAérgica, inibição de histona deacetilase.', notes: 'Extremamente teratogênico (DTNs em recém-nascidos). Forte inibidor UGT/fase II.' , sideEffects: ["Alopecia","Tremor","Hepatotoxicidade","Trombocitopenia","Teratogenicidade (Espinha bífida)"], contraindications: ["Doença hepática aguda","Distúrbios do ciclo da ureia","Gravidez"], routes: ["Oral","Comprimido","Xarope","Intravenoso"] },
  { id: 'm29', name: 'Lamotrigina', tradeNames: ['Lamictal'], class: 'Estabilizador de Humor', clinicalAxes: ['Estabilizador'], mechanisms: 'Bloqueio seletivo de VSSCs. Retarda ativação do glutamato central.', notes: 'Risco da Síndrome de Stevens-Johnson requer escalonamento milimétrico em 4 a 6 semanas.' , sideEffects: ["Rash cutâneo (benigno ou maligno SJS/TEN)","Cefaleia","Diplopia","Tontura"], contraindications: [], routes: ["Oral","Comprimido","Comprimido Mastigável"] },
  { id: 'm30', name: 'Carbamazepina', tradeNames: ['Tegretol'], class: 'Estabilizador de Humor', clinicalAxes: ['Estabilizador'], mechanisms: 'Bloqueio de canais de sódio voltagem-dependentes. Autoindutora do metabolismo.', notes: 'Um dos mais potentes atuadores nas enzimas do fígado (CYP3A4, 1A2, 2C9).' , sideEffects: ["Diplopia","Ataxia","Hiponatremia","Leucopenia","Exantema (HLA-B*1502 em asiáticos)"], contraindications: ["Depressão da medula óssea","Esmagar comprimido de liberação prolongada"], routes: ["Oral","Comprimido","Suspensão","Solução Injetável"] },

  // Alternativas/Outros
  { id: 'm31', name: 'Bupropiona', tradeNames: ['Wellbutrin', 'Bup'], class: 'Antidepressivo Atípico', clinicalAxes: ['Antidepressivo', 'Estimulante'], mechanisms: 'Inibidor da recaptação de noradrenalina e dopamina (IRND).', notes: 'Não prejudica a função sexual masculina e ajuda na cessação tabágica.' , sideEffects: ["Agitação","Insônia","Ansiedade","Redução de limiar convulsivo","Perda de peso"], contraindications: ["Transtorno convulsivo atual ou pregresso","Anorexia ou bulimia nervosa","Uso abrupto de descontinuação de álcool"], routes: ["Oral","Comprimido de Liberação Prologada (XL/SR)"] },
  { id: 'm32', name: 'Trazodona', tradeNames: ['Donaren'], class: 'SARI', clinicalAxes: ['Antidepressivo', 'Ansiolitico'], mechanisms: 'Antagonista 5-HT2A potente e inibidor SERT mais fraco. Bloqueador H1.', notes: 'Amplamente utilizada de forma off-label para insônia por ansiedade. Risco de priapismo.' , sideEffects: ["Sedação acentuada","Hipotensão ortostática","Boca seca","Priapismo (raro mas grave)"], contraindications: ["Uso concomitante com saquinavir/ritonavir (em teoria)"], routes: ["Oral","Comprimido"] },
  { id: 'm33', name: 'Vortioxetina', tradeNames: ['Brintellix', 'Trintellix'], class: 'Multimodal', clinicalAxes: ['Antidepressivo'], mechanisms: 'Inibe SERT (primário). Modula 5-HT1A, 5-HT3 e 5-HT7.', notes: 'Vem demonstrando superioridade restaurando disfunções cognitivas na DM.' , sideEffects: ["Náusea muito forte","Prurido","Sonolência"], contraindications: ["Uso concomitante com IMAO"], routes: ["Oral","Comprimido"] },
  { id: 'm34', name: 'Agomelatina', tradeNames: ['Valdoxan'], class: 'Melatoninérgico', clinicalAxes: ['Antidepressivo'], mechanisms: 'Agonista potentes MT1/MT2 e um antagonista 5-HT2C pre-sináptico.', notes: 'Restritivo a função hepática prévia, não usar em hepatopatas.' , sideEffects: ["Elevação sérica de transaminases hepáticas","Cefaleia","Hiperidrose"], contraindications: ["Insuficiência hepática prévia","Uso com fluvoxamina (inibidores potentes de CYP1A2)"], routes: ["Oral","Comprimido"] },
  { id: 'm35', name: 'Buspirona', tradeNames: ['Ansitec', 'Buspar'], class: 'Ansiolítico', clinicalAxes: ['Ansiolitico'], mechanisms: 'Agonista parcial 5-HT1A, inibição da regulação down dos receptores.', notes: 'Não oferece potencial de abuso, requerendo de 2 a 4 semanas para pleno efeito.' , sideEffects: ["Vertigem","Cefaleia","Nervosismo paradoxal","Tontura leve"], contraindications: ["Uso concomitante com IMAO (teórico)"], routes: ["Oral","Comprimido"] },

  // Benzodiazepínicos
  { id: 'm36', name: 'Clonazepam', tradeNames: ['Rivotril'], class: 'Benzodiazepínico', clinicalAxes: ['Ansiolitico', 'Anticonvulsivante'], mechanisms: 'Modulador alostérico positivo (MAP) do receptor GABA-A.', notes: 'Longa duração.', sideEffects: ["Sonolência", "Fadiga", "Comprometimento cognitivo leve", "Dependência"], contraindications: ["Miastenia gravis", "Glaucoma de ângulo fechado", "Insuficiência respiratória grave"], routes: ["Oral", "Comprimido", "Comprimido Sublingual", "Gotas"] },
  { id: 'm37', name: 'Diazepam', tradeNames: ['Valium'], class: 'Benzodiazepínico', clinicalAxes: ['Ansiolitico', 'Anticonvulsivante'], mechanisms: 'Modulador alostérico positivo do receptor GABA-A. Ação prolongada por metabólitos ativos.', notes: 'Metabólito ativo (desmetildiazepam) estende a meia-vida.', sideEffects: ["Sedação profunda", "Ataxia", "Fadiga", "Dependência"], contraindications: ["Miastenia gravis", "Apneia do sono", "Glaucoma de ângulo fechado"], routes: ["Oral", "Comprimido", "Intramuscular", "Intravenoso"] },
  { id: 'm38', name: 'Lorazepam', tradeNames: ['Lorax', 'Ativan'], class: 'Benzodiazepínico', clinicalAxes: ['Ansiolitico', 'Anticonvulsivante'], mechanisms: 'Modulador alostérico positivo do receptor GABA-A.', notes: 'Curta duração. Depuração por glucuronidação direta, preferível em hepatopatas.', sideEffects: ["Amnésia anterógrada", "Sonolência", "Ataxia", "Dependência"], contraindications: ["Glaucoma de ângulo estreito agudo", "Insuficiência respiratória severa"], routes: ["Oral", "Comprimido", "Intramuscular", "Intravenoso"] },
  { id: 'm39', name: 'Alprazolam', tradeNames: ['Frontal', 'Xanax'], class: 'Benzodiazepínico', clinicalAxes: ['Ansiolitico', 'Anticonvulsivante'], mechanisms: 'Modulador alostérico positivo do receptor GABA-A.', notes: 'Curta/intermediária duração, alta potência panicolítica.', sideEffects: ["Sonolência diurna", "Dependência rápida", "Rebote paradoxal", "Boca seca"], contraindications: ["Glaucoma de ângulo estreito", "Miastenia gravis"], routes: ["Oral", "Comprimido", "Comprimido Sublingual"] },
  { id: 'm40', name: 'Bromazepam', tradeNames: ['Lexotan'], class: 'Benzodiazepínico', clinicalAxes: ['Ansiolitico', 'Anticonvulsivante'], mechanisms: 'Modulador alostérico positivo do receptor GABA-A.', notes: 'Intermediária duração. Uso ansiolítico comum no Brasil.', sideEffects: ["Sonolência", "Reações lentificadas", "Amnésia", "Dependência"], contraindications: ["Miastenia gravis", "Dependência cruzada"], routes: ["Oral", "Comprimido"] },
  { id: 'm41', name: 'Midazolam', tradeNames: ['Dormonid'], class: 'Benzodiazepínico', clinicalAxes: ['Ansiolitico', 'Anticonvulsivante'], mechanisms: 'Modulador alostérico positivo do receptor GABA-A.', notes: 'Duração ultra-curta, uso primário em procedimentos e status epilepticus.', sideEffects: ["Depressão respiratória", "Amnésia anterógrada profunda", "Hipotensão", "Sedação excessiva"], contraindications: ["Glaucoma de ângulo fechado", "Choque ou depressão respiratória aguda"], routes: ["Oral", "Comprimido", "Intramuscular", "Intravenoso"] },

  // Hipnóticos Não-Benzodiazepínicos (Drogas-Z)
  { id: 'm42', name: 'Zolpidem', tradeNames: ['Stilnox'], class: 'Hipnótico-Z', clinicalAxes: ['Hipnotico'], mechanisms: 'Agonista seletivo do receptor GABA-A com preferência pela subunidade α1.', notes: 'Uso off-label frequente no Brasil para insônia.', sideEffects: ["Sonambulismo", "Amnésia anterógrada", "Alucinações", "Tontura"], contraindications: ["Histórico de parassonia complexa induzida por zolpidem"], routes: ["Oral", "Comprimido", "Comprimido Sublingual"] },
  { id: 'm43', name: 'Zopiclona', tradeNames: ['Imovane'], class: 'Hipnótico-Z', clinicalAxes: ['Hipnotico'], mechanisms: 'Agonista não seletivo do sítio benzodiazepínico no receptor GABA-A.', notes: 'Disponível no Brasil. Queixas frequentes de gosto metálico.', sideEffects: ["Gosto amargo/metálico", "Sonolência residual", "Boca seca", "Descoordenação"], contraindications: ["Insuficiência respiratória grave", "Miastenia gravis"], routes: ["Oral", "Comprimido"] },
  { id: 'm44', name: 'Eszopiclona', tradeNames: ['Prysma'], class: 'Hipnótico-Z', clinicalAxes: ['Hipnotico'], mechanisms: 'Enantiômero S ativo da zopiclona com afinidade extrínseca no GABA-A.', notes: 'Menor tolerância a longo prazo, mas com gosto desagradável associado.', sideEffects: ["Disgeusia (gosto ruim)", "Cefaleia", "Sonolência diurna", "Tontura"], contraindications: ["Depressão respiratória grave"], routes: ["Oral", "Comprimido"] },

  // GABAérgicos e Análogos do GABA
  { id: 'm45', name: 'Gabapentina', tradeNames: ['Neurontin'], class: 'Anticonvulsivante', clinicalAxes: ['Anticonvulsivante', 'Gabapentinoide', 'Ansiolitico'], mechanisms: 'Inibidor de canais de cálcio dependentes de voltagem (subunidade α2δ).', notes: 'Uso off-label para dor neuropática, ansiedade, abstinência. Sem interação CYP significativa.', sideEffects: ["Sedação", "Tontura", "Ganho de peso", "Edema periférico"], contraindications: [], routes: ["Oral", "Cápsula", "Comprimido"] },
  { id: 'm46', name: 'Pregabalina', tradeNames: ['Lyrica'], class: 'Anticonvulsivante', clinicalAxes: ['Anticonvulsivante', 'Gabapentinoide', 'Ansiolitico'], mechanisms: 'Inibidor de canais de cálcio dependentes de voltagem (subunidade α2δ).', notes: 'Farmacocinética linear previsível, sem CYP. Uso off-label para TAG e fibromialgia.', sideEffects: ["Tontura", "Sonolência", "Ganho de peso", "Edema periférico"], contraindications: [], routes: ["Oral", "Cápsula"] },

  // Off-Label com Evidência no Brasil
  { id: 'm47', name: 'Naltrexona', tradeNames: ['Revia', 'Univit'], class: 'Antagonista Opioide', clinicalAxes: ['Opioide'], mechanisms: 'Antagonista competitivo em receptores opioides \u00b5, \u03ba, e \u03b4.', notes: 'Usada tipicamente off-label em baixa dose (LDN: 1,5-4,5mg) para dor crônica, fibromialgia, doenças autoimunes.', sideEffects: ["Náusea leve", "Insônia inicial", "Cefaleia", "Pesadelos vívidos (apenas início)"], contraindications: ["Hepatite aguda ou falência hepática", "Uso atual de analgésicos opioides"], routes: ["Oral", "Comprimido", "Cápsula manipulada (LDN)"] },
  { id: 'm48', name: 'Memantina', tradeNames: ['Ebix', 'Namenda'], class: 'Antagonista NMDA', clinicalAxes: ['Neuroprotetor', 'Estabilizador'], mechanisms: 'Antagonista NMDA (canal iônico de glutamato dependente de voltagem).', notes: 'Uso off-label para TOC resistente, autismo, TDAH. Sem CYP significativo.', sideEffects: ["Tontura", "Cefaleia", "Constipação", "Confusão episódica"], contraindications: ["Hipersensibilidade conhecida"], routes: ["Oral", "Comprimido", "Solução Oral"] },
  { id: 'm49', name: 'N-Acetilcisteína (NAC)', tradeNames: ['Fluimucil', 'NAC'], class: 'Modulador Glutamatérgico', clinicalAxes: ['Neuroprotetor', 'Suplemento'], mechanisms: 'Modulador glutamatérgico (antiporter xCT, precursor de glutationa).', notes: 'Off-label em TOC, tricotilomania, dependência.', sideEffects: ["Desconforto gastrointestinal", "Náusea", "Exantema leve"], contraindications: ["Úlcera péptica ativa severa (precaução)"], routes: ["Oral", "Comprimido efervescente", "Cápsula", "Pó", "Granulado"] },
  { id: 'm50', name: 'Cetamina (Esketamina)', tradeNames: ['Spravato', 'Ketamin'], class: 'Antagonista NMDA', clinicalAxes: ['Anestesico', 'Antidepressivo'], mechanisms: 'Antagonista NMDA.', notes: 'Efeito rápido antidepressivo. Crescente uso off-label no Brasil em clínicas especializadas para depressão refratária.', sideEffects: ["Dissociação", "Aumento da pressão arterial", "Vertigem", "Náusea", "Sedação transitória"], contraindications: ["Histórico de aneurisma", "Hipertensão grave não controlada", "Hipersensibilidade"], routes: ["Intranasal", "Intravenoso", "Comprimido Sublingual (Magistral)"] },
  // Estimulantes (TDAH, Narcolepsia e Off-Label)
  { id: 'm51', name: 'Metilfenidato', tradeNames: ['Ritalina', 'Ritalina LA', 'Concerta'], class: 'Estimulante do SNC (Derivado Piperidínico)', clinicalAxes: ['Estimulante'], mechanisms: 'Inibidor da recaptação de dopamina e noradrenalina (bloqueio DAT e NET).', notes: 'Primeira linha para TDAH. Pode exacerbar ansiedade, tics e psicose.', sideEffects: ["Insônia", "Redução de apetite", "Ansiedade", "Taquicardia", "Cefaleia", "Irritabilidade"], contraindications: ["Glaucoma", "Hipertireoidismo", "Uso concomitante com IMAO"], routes: ["Oral", "Comprimido", "Cápsula de Liberação Modificada"] },
  { id: 'm52', name: 'Lisdexanfetamina', tradeNames: ['Venvanse', 'Vyvanse', 'Juneve'], class: 'Estimulante do SNC (Anfetamina Pró-droga)', clinicalAxes: ['Estimulante'], mechanisms: 'Pró-droga que sofre hidrólise nas hemácias liberando dextroanfetamina. Inibe a recaptação de DA e NE e promove liberação ativa via VMAT2/reversão de transportadores.', notes: 'Eficácia duradoura e menor potencial de abuso recreativo devido à conversão enzimática lenta. Aprovado para TDAH e Transtorno da Compulsão Alimentar Periódica.', sideEffects: ["Anorexia", "Insônia", "Boca seca", "Taquicardia", "Disforia fim de dose"], contraindications: ["Agitação severa", "Glaucoma", "Cardiopatia sintomática avançada", "Uso concomitante com IMAO"], routes: ["Oral", "Cápsula"] },
  { id: 'm53', name: 'Dextroanfetamina', tradeNames: ['Dexedrine'], class: 'Estimulante do SNC (Anfetamina)', clinicalAxes: ['Estimulante'], mechanisms: 'Amina simpatomimética de ação indireta. Inibe a recaptação de DA e NE e induz sua liberação massiva dos terminais nervosos e vesículas.', notes: 'Potencial de abuso substancial. Restrita/importada no Brasil na forma isolada.', sideEffects: ["Taquicardia", "Estimulação excessiva", "Hipertensão", "Agitação", "Perda de peso"], contraindications: ["Histórico de dependência", "Cardiopatias", "Uso concomitante com IMAO"], routes: ["Oral", "Comprimido", "Cápsula"] },
  { id: 'm54', name: 'Modafinil', tradeNames: ['Stavigile', 'Modiodal'], class: 'Estimulante do SNC (Eugeroico)', clinicalAxes: ['Estimulante'], mechanisms: 'Fraca inibição do transportador de dopamina (DAT). Também modula vias de histamina, orexina e glutamato focando promotores de vigília.', notes: 'Ouro em narcolepsia/hipersonia. Off-label pra sonolência/anergia psiquiátrica grave. Baixo perfil de dependência reportado.', sideEffects: ["Cefaleia", "Náusea", "Nervosismo", "Insônia", "Rash cutâneo (SJS raro mas grave)"], contraindications: ["Hipersensibilidade conhecida"], routes: ["Oral", "Comprimido"] },
  { id: 'm55', name: 'Armodafinil', tradeNames: ['Nuvigil'], class: 'Estimulante do SNC (Eugeroico)', clinicalAxes: ['Estimulante'], mechanisms: 'Enantiômero R purificado do modafinil. Efeito principal como inibidor longo do DAT.', notes: 'Perfil parecido com modafinil, porém pico sérico tardio conferiu maior duração durante o dia.', sideEffects: ["Cefaleia forte", "Palpitações", "Ansiedade aguda"], contraindications: ["Hipersensibilidade"], routes: ["Oral", "Comprimido"] },
  { id: 'm56', name: 'Cafeína', tradeNames: ['Vivendo', 'Dose extra'], class: 'Metilxantina', clinicalAxes: ['Estimulante', 'Suplemento'], mechanisms: 'Antagonista não seletivo dos receptores de adenosina (A1 e A2A), resultando em aumento secundário indireto nos disparos de dopamina e outras catecolaminas.', notes: 'Uso off-label em TDAH leve e astenia depressiva. Doses excessivas simulam/precipitam ataques de pânico.', sideEffects: ["Taquicardia", "Tremores", "Inquietação nervosa", "Diurese farta"], contraindications: ["Arritmias clinicamente instáveis", "Transtorno de Pânico Descompensado"], routes: ["Oral", "Comprimido", "Pó"] },
  { id: 'm57', name: 'Atomoxetina', tradeNames: ['Strattera', 'Atentina'], class: 'Inibidor de Recaptação (Não-estimulante)', clinicalAxes: ['Estimulante'], mechanisms: 'Inibidor seletivo e altamente potente do transportador de noradrenalina (NET). Aumenta DA em regiões específicas (córtex pré-frontal) onde o NET recolhe DA.', notes: 'É listado entre medicamentos de TDAH como "não-estimulante", possuindo atraso terapêutico semelhante aos antidepressivos (4-8 semanas).', sideEffects: ["Desconforto GI", "Náusea", "Astenia letárgica / Sonolência atípica", "Riscos hepáticos"], contraindications: ["Uso com IMAO", "Glaucoma de ângulo estreito", "Feocromocitoma"], routes: ["Oral", "Cápsula"] },
];

export const molecules: Molecule[] = baseMolecules.map(m => ({
  ...m,
  ...getMoleculeDetails(m)
}));

export const receptors: Receptor[] = [
  { id: 'r1', name: 'SERT', type: 'Transportador', neurotransmitterSystem: 'Serotoninérgico', description: 'Transportador mediando a recaptação de serotonina na fenda.' },
  { id: 'r2', name: 'D2', type: 'Receptor', neurotransmitterSystem: 'Dopaminérgico', description: 'Receptor metabotrópico inibitório associado primariamente a psicose.' },
  { id: 'r3', name: '5-HT2A', type: 'Receptor', neurotransmitterSystem: 'Serotoninérgico', description: 'Ação pós-sináptica, seu forte bloqueio diferencia os antipsicóticos atípicos.' },
  { id: 'r4', name: 'NET', type: 'Transportador', neurotransmitterSystem: 'Noradrenérgico', description: 'Responsável pela reabsorção da noradrenalina para o terminal axonal.' },
  { id: 'r5', name: 'DAT', type: 'Transportador', neurotransmitterSystem: 'Dopaminérgico', description: 'Recolhimento da dopamina da sinapse.' },
  { id: 'r6', name: 'H1', type: 'Receptor', neurotransmitterSystem: 'Histaminérgico', description: 'Alvo off-target que leva a efeitos centrais de sedação e ganho de peso.' },
  { id: 'r7', name: 'M1', type: 'Receptor', neurotransmitterSystem: 'Colinérgico', description: 'Bloqueios sistemicos afetam ritmo salivar, intestinal e cardíaco.' },
  { id: 'r8', name: 'Alpha-1', type: 'Receptor', neurotransmitterSystem: 'Noradrenérgico', description: 'Bloqueio contribui para disautonomias tipo hipotensão postural e tontura.' },
  { id: 'r9', name: '5-HT1A', type: 'Receptor', neurotransmitterSystem: 'Serotoninérgico', description: 'Auto-receptor termostático, comumente relacionado aos atrasos terapeuticos reativos.' },
  { id: 'r10', name: 'MAO-A', type: 'Enzima Alvo', neurotransmitterSystem: 'Aminas', description: 'Cataboliza a serotonina, a norepinefrina, e preferencialmente a tiramina dietética.' },
  { id: 'r11', name: 'MAO-B', type: 'Enzima Alvo', neurotransmitterSystem: 'Aminas', description: 'Catabolização extra focada em dopamina e tiramina.' },
  { id: 'r12', name: 'VSSC', type: 'Canal Iônico', neurotransmitterSystem: 'Geral', description: 'Canal Na+ voltagem-dependente responsável pelo spike pontencial neuronal bruto.' },
  { id: 'r13', name: 'GABA-A', type: 'Receptor', neurotransmitterSystem: 'GABAérgico', description: 'Canal iônico inibitório.' },
  { id: 'r14', name: 'MT1/MT2', type: 'Receptor', neurotransmitterSystem: 'Melatoninérgico', description: 'Receptores mimetizando ritmo circadiano no trato SCN.' },
  { id: 'r15', name: 'VGCC-α2δ', type: 'Canal Iônico', neurotransmitterSystem: 'GABAérgico/Glutamatérgico', description: 'Canal de cálcio dependente de voltagem, subunidade \u03B12\u03B4.' },
  { id: 'r16', name: 'µ-Opioide', type: 'Receptor', neurotransmitterSystem: 'Opioide', description: 'Alvo mediador de analgesia e efeitos euforizantes.' },
  { id: 'r17', name: 'κ-Opioide', type: 'Receptor', neurotransmitterSystem: 'Opioide', description: 'Receptor envolvido em disforia, analgesia e controle comportamental.' },
  { id: 'r18', name: 'δ-Opioide', type: 'Receptor', neurotransmitterSystem: 'Opioide', description: 'Envolvido em efeitos antidepressivos, neuroprotetores e analgesia.' },
  { id: 'r19', name: 'NMDA', type: 'Canal Iônico', neurotransmitterSystem: 'Glutamatérgico', description: 'Principal canal excitatório para neuroplasticidade.' },
  { id: 'r20', name: 'xCT', type: 'Enzima Alvo', neurotransmitterSystem: 'Glutamatérgico', description: 'Antiporter cistina-glutamato, modulador do glutamato na fenda extrassináptica.' },
  { id: 'r21', name: 'Sigma-1', type: 'Receptor', neurotransmitterSystem: 'Glutamatérgico / Geral', description: 'Receptor chaperona intracelular associado à neuroproteção, plasticidade sináptica e efeitos ansiolíticos.' },
  { id: 'r22', name: '5-HT3', type: 'Receptor', neurotransmitterSystem: 'Serotoninérgico', description: 'Canal iônico serotoninérgico; seu antagonismo alivia náuseas e aumenta acetilcolina/noradrenalina no córtex.' },
  { id: 'r23', name: '5-HT7', type: 'Receptor', neurotransmitterSystem: 'Serotoninérgico', description: 'Receptor metabotrópico regulador do sono, ritmo circadiano e cognição pré-frontal.' }
];

export const enzymes: MetabolicEnzyme[] = [
  { id: 'e1', name: 'CYP2D6', description: 'Atua extensivamente em fármacos cardiovasculares e psiquiátricos. Marcada por extremo polimorfismo genético.', location: 'Hepático' },
  { id: 'e2', name: 'CYP3A4', description: 'Enzima amplamente distribuída metabolizando metade de toda a farmacopeia global.', location: 'Hepático e Intestinal' },
  { id: 'e3', name: 'CYP1A2', description: 'Ligada estritamente aos produtos dos compostos do tabaco aquecido, induzindo-se.', location: 'Hepático' },
  { id: 'e4', name: 'CYP2C19', description: 'Enzima central em certos subgrupos (exóticos) metabolizadoras de es-citalopram.', location: 'Hepático' },
  { id: 'e5', name: 'CYP2C9', description: 'Responsável em sua maioria por eliminação de AINEs e estabilizadores.', location: 'Hepático' },
  { id: 'e6', name: 'UGT', description: 'Subfamilia das UDP-glucuronosiltransferases efetuando as fases secundárias de depuração.', location: 'Hepático / Renais' },
  { id: 'e7', name: 'CYP2C8', description: 'Ação em algumas drogas-Z, hipoglicemiantes e taxanos.', location: 'Hepático' },
  { id: 'e8', name: 'CYP2B6', description: 'Regula oxidação de compostos com relevância clínica como cetamina, bupropiona.', location: 'Hepático' },
];

// Many affinityKi values will be `null` due to lack of standard public consensus or extreme variability.
export const pdInteractions: MoleculeReceptorInteraction[] = [
  // ISRS
  { moleculeId: 'm1', receptorId: 'r1', actionType: 'Inibidor de Recaptação', affinityKi: 0.8 },
  { moleculeId: 'm4', receptorId: 'r1', actionType: 'Inibidor de Recaptação', affinityKi: 0.28 },
  { moleculeId: 'm4', receptorId: 'r5', actionType: 'Inibidor de Recaptação', affinityKi: 25 },
  { moleculeId: 'm5', receptorId: 'r1', actionType: 'Inibidor de Recaptação', affinityKi: 0.13 },
  { moleculeId: 'm5', receptorId: 'r4', actionType: 'Inibidor de Recaptação', affinityKi: 40 },
  { moleculeId: 'm5', receptorId: 'r7', actionType: 'Antagonista', affinityKi: 72 },
  { moleculeId: 'm6', receptorId: 'r1', actionType: 'Modulador Alostérico', affinityKi: 1.1 },
  { moleculeId: 'm7', receptorId: 'r1', actionType: 'Inibidor de Recaptação', affinityKi: 1.8 },
  { moleculeId: 'm8', receptorId: 'r1', actionType: 'Inibidor de Recaptação', affinityKi: 1.5 },
  
  // Antipsicoticos Tipicos
  { moleculeId: 'm2', receptorId: 'r2', actionType: 'Antagonista', affinityKi: 1.5 },

  // Antipsicoticos Atipicos
  { moleculeId: 'm3', receptorId: 'r2', actionType: 'Agonista Parcial', affinityKi: 0.34 },
  { moleculeId: 'm3', receptorId: 'r3', actionType: 'Antagonista', affinityKi: 3.4 },
  { moleculeId: 'm3', receptorId: 'r9', actionType: 'Agonista Parcial', affinityKi: 1.7 },
  { moleculeId: 'm22', receptorId: 'r2', actionType: 'Antagonista', affinityKi: 160 },
  { moleculeId: 'm22', receptorId: 'r3', actionType: 'Antagonista', affinityKi: 16 },
  { moleculeId: 'm22', receptorId: 'r6', actionType: 'Antagonista', affinityKi: 1.1 },
  { moleculeId: 'm22', receptorId: 'r7', actionType: 'Antagonista', affinityKi: 1.9 },
  { moleculeId: 'm23', receptorId: 'r2', actionType: 'Antagonista', affinityKi: 580 },
  { moleculeId: 'm23', receptorId: 'r6', actionType: 'Antagonista', affinityKi: 11 },
  { moleculeId: 'm24', receptorId: 'r2', actionType: 'Antagonista', affinityKi: 3.1 },
  { moleculeId: 'm24', receptorId: 'r3', actionType: 'Antagonista', affinityKi: 0.16 },
  { moleculeId: 'm25', receptorId: 'r2', actionType: 'Antagonista', affinityKi: 11 },
  { moleculeId: 'm25', receptorId: 'r3', actionType: 'Antagonista', affinityKi: 4 },
  { moleculeId: 'm25', receptorId: 'r6', actionType: 'Antagonista', affinityKi: 7 },
  { moleculeId: 'm25', receptorId: 'r7', actionType: 'Antagonista', affinityKi: 1.9 },
  { moleculeId: 'm26', receptorId: 'r2', actionType: 'Antagonista', affinityKi: 4.8 },

  // ISRSN
  { moleculeId: 'm9', receptorId: 'r1', actionType: 'Inibidor de Recaptação', affinityKi: 82 },
  { moleculeId: 'm9', receptorId: 'r4', actionType: 'Inibidor de Recaptação', affinityKi: 2480 },
  { moleculeId: 'm10', receptorId: 'r1', actionType: 'Inibidor de Recaptação', affinityKi: 40 },
  { moleculeId: 'm10', receptorId: 'r4', actionType: 'Inibidor de Recaptação', affinityKi: 558 },
  { moleculeId: 'm11', receptorId: 'r1', actionType: 'Inibidor de Recaptação', affinityKi: 0.8 },
  { moleculeId: 'm11', receptorId: 'r4', actionType: 'Inibidor de Recaptação', affinityKi: 7.5 },
  { moleculeId: 'm12', receptorId: 'r1', actionType: 'Inibidor de Recaptação', affinityKi: null },
  { moleculeId: 'm12', receptorId: 'r4', actionType: 'Inibidor de Recaptação', affinityKi: null },
  
  // Triciclicos
  { moleculeId: 'm13', receptorId: 'r1', actionType: 'Inibidor de Recaptação', affinityKi: 2.8 },
  { moleculeId: 'm13', receptorId: 'r4', actionType: 'Inibidor de Recaptação', affinityKi: 19 },
  { moleculeId: 'm13', receptorId: 'r6', actionType: 'Antagonista', affinityKi: 1.1 },
  { moleculeId: 'm13', receptorId: 'r7', actionType: 'Antagonista', affinityKi: 18 },
  { moleculeId: 'm14', receptorId: 'r1', actionType: 'Inibidor de Recaptação', affinityKi: 1.4 },
  { moleculeId: 'm14', receptorId: 'r4', actionType: 'Inibidor de Recaptação', affinityKi: 37 },
  { moleculeId: 'm15', receptorId: 'r1', actionType: 'Inibidor de Recaptação', affinityKi: 0.28 },
  { moleculeId: 'm16', receptorId: 'r4', actionType: 'Inibidor de Recaptação', affinityKi: 4.4 },
  { moleculeId: 'm16', receptorId: 'r1', actionType: 'Inibidor de Recaptação', affinityKi: 18 },

  // Tetracíclico
  { moleculeId: 'm17', receptorId: 'r8', actionType: 'Antagonista', affinityKi: null },
  { moleculeId: 'm17', receptorId: 'r6', actionType: 'Antagonista', affinityKi: 0.14 },
  { moleculeId: 'm17', receptorId: 'r3', actionType: 'Antagonista', affinityKi: 69 },
  { moleculeId: 'm18', receptorId: 'r4', actionType: 'Inibidor de Recaptação', affinityKi: 11 },

  // iMAOs
  { moleculeId: 'm19', receptorId: 'r10', actionType: 'Inibidor Enzimático', affinityKi: null },
  { moleculeId: 'm19', receptorId: 'r11', actionType: 'Inibidor Enzimático', affinityKi: null },
  { moleculeId: 'm20', receptorId: 'r10', actionType: 'Inibidor Enzimático', affinityKi: null },
  { moleculeId: 'm20', receptorId: 'r11', actionType: 'Inibidor Enzimático', affinityKi: null },
  { moleculeId: 'm21', receptorId: 'r10', actionType: 'Inibidor Enzimático', affinityKi: null },

  // Estabilizadores
  { moleculeId: 'm28', receptorId: 'r12', actionType: 'Outro', affinityKi: null },
  { moleculeId: 'm28', receptorId: 'r13', actionType: 'Outro', affinityKi: null },
  { moleculeId: 'm29', receptorId: 'r12', actionType: 'Modulador Alostérico', affinityKi: null },
  { moleculeId: 'm30', receptorId: 'r12', actionType: 'Outro', affinityKi: null },

  // Alternatives/Outros
  { moleculeId: 'm31', receptorId: 'r4', actionType: 'Inibidor de Recaptação', affinityKi: 52600 },
  { moleculeId: 'm31', receptorId: 'r5', actionType: 'Inibidor de Recaptação', affinityKi: null },
  { moleculeId: 'm32', receptorId: 'r3', actionType: 'Antagonista', affinityKi: 36 },
  { moleculeId: 'm32', receptorId: 'r6', actionType: 'Antagonista', affinityKi: 220 },
  { moleculeId: 'm32', receptorId: 'r1', actionType: 'Inibidor de Recaptação', affinityKi: 160 },
  { moleculeId: 'm33', receptorId: 'r1', actionType: 'Inibidor de Recaptação', affinityKi: 1.6 },
  { moleculeId: 'm33', receptorId: 'r9', actionType: 'Agonista Total', affinityKi: 15 },
  { moleculeId: 'm34', receptorId: 'r14', actionType: 'Agonista Total', affinityKi: 0.1 },
  { moleculeId: 'm35', receptorId: 'r9', actionType: 'Agonista Parcial', affinityKi: 15 },
  
  // Bensodiazepínicos
  { moleculeId: 'm36', receptorId: 'r13', actionType: 'Modulador Alostérico', affinityKi: null },
  { moleculeId: 'm37', receptorId: 'r13', actionType: 'Modulador Alostérico', affinityKi: null },
  { moleculeId: 'm38', receptorId: 'r13', actionType: 'Modulador Alostérico', affinityKi: null },
  { moleculeId: 'm39', receptorId: 'r13', actionType: 'Modulador Alostérico', affinityKi: null },
  { moleculeId: 'm40', receptorId: 'r13', actionType: 'Modulador Alostérico', affinityKi: null },
  { moleculeId: 'm41', receptorId: 'r13', actionType: 'Modulador Alostérico', affinityKi: null },

  // Drogas-Z
  { moleculeId: 'm42', receptorId: 'r13', actionType: 'Agonista Seletivo', affinityKi: null },
  { moleculeId: 'm43', receptorId: 'r13', actionType: 'Agonista Total', affinityKi: null },
  { moleculeId: 'm44', receptorId: 'r13', actionType: 'Agonista Total', affinityKi: null },

  // Gabapentinoides e outros
  { moleculeId: 'm45', receptorId: 'r15', actionType: 'Outro', affinityKi: null },
  { moleculeId: 'm46', receptorId: 'r15', actionType: 'Outro', affinityKi: null },
  { moleculeId: 'm28', receptorId: 'r13', actionType: 'Outro', affinityKi: null },

  // Off-label e outras neuro-ações
  { moleculeId: 'm47', receptorId: 'r16', actionType: 'Antagonista', affinityKi: 0.08 },
  { moleculeId: 'm47', receptorId: 'r17', actionType: 'Antagonista', affinityKi: 0.22 },
  { moleculeId: 'm47', receptorId: 'r18', actionType: 'Antagonista', affinityKi: 2.8 },
  { moleculeId: 'm48', receptorId: 'r19', actionType: 'Antagonista', affinityKi: null },
  { moleculeId: 'm49', receptorId: 'r20', actionType: 'Precursor / Modulador', affinityKi: null },
  { moleculeId: 'm49', receptorId: 'r19', actionType: 'Modulador Alostérico', affinityKi: null, notes: 'Modulação indireta do receptor NMDA via glutationa/xCT.' },
  { moleculeId: 'm50', receptorId: 'r19', actionType: 'Antagonista', affinityKi: null },
  { moleculeId: 'm50', receptorId: 'r5', actionType: 'Inibidor de Recaptação', affinityKi: null, notes: 'Inibição fraca do DAT contribui para efeitos estimulantes.' },
  { moleculeId: 'm28', receptorId: 'r15', actionType: 'Antagonista', affinityKi: null, notes: 'Inibição de canais de cálcio voltagem-dependentes (N e P/Q).' },
  
  // Estimulantes
  { moleculeId: 'm51', receptorId: 'r5', actionType: 'Inibidor de Recaptação', affinityKi: null },
  { moleculeId: 'm51', receptorId: 'r4', actionType: 'Inibidor de Recaptação', affinityKi: null },
  { moleculeId: 'm52', receptorId: 'r5', actionType: 'Inibidor de Recaptação', affinityKi: null },
  { moleculeId: 'm52', receptorId: 'r4', actionType: 'Inibidor de Recaptação', affinityKi: null },
  { moleculeId: 'm53', receptorId: 'r5', actionType: 'Inibidor de Recaptação', affinityKi: null },
  { moleculeId: 'm53', receptorId: 'r4', actionType: 'Inibidor de Recaptação', affinityKi: null },
  { moleculeId: 'm54', receptorId: 'r5', actionType: 'Inibidor de Recaptação', affinityKi: null },
  { moleculeId: 'm55', receptorId: 'r5', actionType: 'Inibidor de Recaptação', affinityKi: null },
  { moleculeId: 'm57', receptorId: 'r4', actionType: 'Inibidor de Recaptação', affinityKi: null },

  // Novas interações para Lítio (m27) para puxá-lo ao centro do Atlas
  { moleculeId: 'm27', receptorId: 'r19', actionType: 'Modulador Alostérico', affinityKi: null, notes: 'Inibe a sinalização excitotóxica hiperativa do receptor NMDA.' },
  { moleculeId: 'm27', receptorId: 'r9', actionType: 'Agonista', affinityKi: null, notes: 'Aumenta a liberação e eficácia da transmissão no receptor 5-HT1A.' },
  { moleculeId: 'm27', receptorId: 'r12', actionType: 'Outro', affinityKi: null, notes: 'Penetra nas células neuronais através de canais rápidos de sódio voltagem-dependentes.' },

  // Novas interações para Sigma-1 (r21) - Fluvoxamina (m8), Sertralina (m4), Fluoxetina (m1)
  { moleculeId: 'm8', receptorId: 'r21', actionType: 'Agonista', affinityKi: 36, notes: 'Elevada afinidade pelo Sigma-1, conferindo efeitos ansiolíticos e anti-inflamatórios proeminentes.' },
  { moleculeId: 'm4', receptorId: 'r21', actionType: 'Antagonista', affinityKi: 57, notes: 'Afinidade moderada que atua como antagonista ou agonista inverso.' },
  { moleculeId: 'm1', receptorId: 'r21', actionType: 'Agonista', affinityKi: 240, notes: 'Afinidade moderada a fraca pelo receptor Sigma-1.' },

  // Novas interações para 5-HT3 (r22) e 5-HT7 (r23) - Vortioxetina (m33), Trazodona (m32), Mirtazapina (m17)
  { moleculeId: 'm33', receptorId: 'r22', actionType: 'Antagonista', affinityKi: 3.7, notes: 'Bloqueio potente de 5-HT3, induzindo liberação de acetilcolina e dopamina.' },
  { moleculeId: 'm33', receptorId: 'r23', actionType: 'Antagonista', affinityKi: 19, notes: 'Antagonismo potente de 5-HT7, melhorando ritmos circadianos e cognição.' },
  { moleculeId: 'm32', receptorId: 'r23', actionType: 'Antagonista', affinityKi: 29, notes: 'Bloqueio de 5-HT7 contribui para a regulação do sono profundo.' },
  { moleculeId: 'm17', receptorId: 'r22', actionType: 'Antagonista', affinityKi: 8.1, notes: 'Forte antagonismo de 5-HT3, reduzindo propensões a náuseas e regulando o apetite.' }
];

export const pkInteractions: MoleculeEnzymeInteraction[] = [
  // Fluoxetina - Potente inibidor de 2D6 e fraco 3A4, 2C19. Substrato
  { moleculeId: 'm1', enzymeId: 'e1', role: 'Inibidor Forte', notes: 'Potencial de aumentar dramaticamente taxas de compostos cliváveis pelo CYP2D6.' },
  { moleculeId: 'm1', enzymeId: 'e2', role: 'Inibidor Fraco', notes: 'Leve restrição ao catabolismo endossômico.' },
  { moleculeId: 'm1', enzymeId: 'e1', role: 'Substrato' },
  
  // Paroxetina
  { moleculeId: 'm5', enzymeId: 'e1', role: 'Inibidor Forte', notes: 'Considerado talvez o mais forte inibidor de 2D6 em meio ISRS.' },
  { moleculeId: 'm5', enzymeId: 'e1', role: 'Substrato' },

  // Fluvoxamina
  { moleculeId: 'm8', enzymeId: 'e3', role: 'Inibidor Forte', notes: 'Notoriamente aumenta e inibe CYP1A2 em escalas perigosas (ex: toxicidade à teofilina, duloxetina).' },
  { moleculeId: 'm8', enzymeId: 'e4', role: 'Inibidor Forte' },
  { moleculeId: 'm8', enzymeId: 'e2', role: 'Inibidor Moderado' },

  // Sertralina
  { moleculeId: 'm4', enzymeId: 'e1', role: 'Inibidor Fraco', notes: 'Irrelevante clinicamente em baixas doses; inibição leve em 200mg.' },

  // Haloperidol
  { moleculeId: 'm2', enzymeId: 'e1', role: 'Substrato' },
  { moleculeId: 'm2', enzymeId: 'e2', role: 'Substrato' },

  // Aripiprazol
  { moleculeId: 'm3', enzymeId: 'e1', role: 'Substrato', notes: 'Doses devem ser ajustadas na presença coadmissão de prozac ou paroxetina.' },
  { moleculeId: 'm3', enzymeId: 'e2', role: 'Substrato' },

  // Venlafaxina
  { moleculeId: 'm9', enzymeId: 'e1', role: 'Substrato' },

  // Duloxetina
  { moleculeId: 'm11', enzymeId: 'e1', role: 'Inibidor Moderado' },
  { moleculeId: 'm11', enzymeId: 'e1', role: 'Substrato' },
  { moleculeId: 'm11', enzymeId: 'e3', role: 'Substrato', notes: 'Fluvoxamina bloqueia fortemente sua saída.' },

  // Triciclicos
  { moleculeId: 'm13', enzymeId: 'e1', role: 'Substrato' },
  { moleculeId: 'm13', enzymeId: 'e3', role: 'Substrato' },
  { moleculeId: 'm14', enzymeId: 'e1', role: 'Substrato' },
  { moleculeId: 'm15', enzymeId: 'e1', role: 'Substrato' },
  { moleculeId: 'm16', enzymeId: 'e1', role: 'Substrato' },
  
  // Mirtazapina
  { moleculeId: 'm17', enzymeId: 'e1', role: 'Substrato' },
  { moleculeId: 'm17', enzymeId: 'e2', role: 'Substrato' },
  { moleculeId: 'm17', enzymeId: 'e3', role: 'Substrato' },

  // Atipicos
  { moleculeId: 'm22', enzymeId: 'e3', role: 'Substrato', notes: 'Tabagismo induz e3 ativamente. Pacientes hospitalizados (sem fumar) geram níveis perigosamente altos subitamente.' },
  { moleculeId: 'm22', enzymeId: 'e1', role: 'Substrato' },
  { moleculeId: 'm23', enzymeId: 'e2', role: 'Substrato', notes: 'Não administrar via intravenosa cruzada. Forte relação ao CYP3A4.' },
  { moleculeId: 'm24', enzymeId: 'e1', role: 'Substrato', notes: 'Fluoxetina diminui os níveis de liberação da risperidona ativa.' },
  { moleculeId: 'm25', enzymeId: 'e3', role: 'Substrato', notes: 'Fumantes necessitam de doses de até 20 a 30mg dia contra nãofumantes a 10mg.' },

  // Estabilizadores
  { moleculeId: 'm28', enzymeId: 'e6', role: 'Inibidor Moderado', notes: 'Pode inibir via UGT; requer cautela e titulação com lamotrigina cruzada.' },
  { moleculeId: 'm28', enzymeId: 'e5', role: 'Inibidor Forte', notes: 'Inibidor farmacológico importante e substrato da UGT.' },
  { moleculeId: 'm29', enzymeId: 'e6', role: 'Substrato', notes: 'Sofrimento de inibição do valproato ou rápida eliminação por carbamazepina (via UGT).' },
  { moleculeId: 'm30', enzymeId: 'e2', role: 'Indutor Forte', notes: 'Ativa sua própria metabolização, destruindo também meia-vida de inumeros atípicos (quetiapina) se juntos.' },
  { moleculeId: 'm30', enzymeId: 'e3', role: 'Indutor Moderado' },
  { moleculeId: 'm30', enzymeId: 'e4', role: 'Indutor Moderado' },

  // Others
  { moleculeId: 'm31', enzymeId: 'e1', role: 'Inibidor Forte', notes: 'Bupropiona bloqueia metabolização de betabloqueadores, aripiprazol.' },
  { moleculeId: 'm31', enzymeId: 'e2', role: 'Substrato' }, 
  { moleculeId: 'm32', enzymeId: 'e2', role: 'Substrato' },
  { moleculeId: 'm33', enzymeId: 'e1', role: 'Substrato' },
  { moleculeId: 'm34', enzymeId: 'e3', role: 'Substrato' },

  // ADIs e PKs para os BZDs, Drogas-Z e novas adições
  { moleculeId: 'm36', enzymeId: 'e2', role: 'Substrato' },
  { moleculeId: 'm37', enzymeId: 'e2', role: 'Substrato' },
  { moleculeId: 'm37', enzymeId: 'e4', role: 'Substrato' },
  { moleculeId: 'm38', enzymeId: 'e6', role: 'Substrato' },
  { moleculeId: 'm39', enzymeId: 'e2', role: 'Substrato' },
  { moleculeId: 'm40', enzymeId: 'e2', role: 'Substrato' },
  { moleculeId: 'm41', enzymeId: 'e2', role: 'Substrato' },

  { moleculeId: 'm42', enzymeId: 'e2', role: 'Substrato' },
  { moleculeId: 'm42', enzymeId: 'e5', role: 'Substrato' },
  { moleculeId: 'm43', enzymeId: 'e2', role: 'Substrato' },
  { moleculeId: 'm43', enzymeId: 'e7', role: 'Substrato' },
  { moleculeId: 'm44', enzymeId: 'e2', role: 'Substrato' },
  
  { moleculeId: 'm47', enzymeId: 'e2', role: 'Substrato' },
  { moleculeId: 'm50', enzymeId: 'e2', role: 'Substrato' },
  { moleculeId: 'm50', enzymeId: 'e8', role: 'Substrato' },

  // Estimulantes
  { moleculeId: 'm54', enzymeId: 'e2', role: 'Indutor Moderado', notes: 'Reduz níveis de contraceptivos orais e outros fármacos via indução.' },
  { moleculeId: 'm56', enzymeId: 'e3', role: 'Substrato', notes: 'Uso de fluvoxamina pode gerar intoxicação grave.' },
  { moleculeId: 'm57', enzymeId: 'e1', role: 'Substrato', notes: 'Metabolizadores lentos de 2D6 apresentam níveis plasmáticos muito maiores.' },

  // Novas interações farmacocinéticas para os iMAOs (m19, m20, m21) para conectá-los ao sistema CYP450
  { moleculeId: 'm21', enzymeId: 'e4', role: 'Substrato', notes: 'Metabolizada majoritariamente pelo CYP2C19.' },
  { moleculeId: 'm21', enzymeId: 'e1', role: 'Substrato', notes: 'Metabolização secundária via CYP2D6.' },
  { moleculeId: 'm20', enzymeId: 'e1', role: 'Substrato', notes: 'Depurada por vias do CYP2D6.' },
  { moleculeId: 'm20', enzymeId: 'e4', role: 'Inibidor Moderado', notes: 'Inibe secundariamente o CYP2C19.' },
  { moleculeId: 'm19', enzymeId: 'e1', role: 'Substrato', notes: 'Metabolizada por vias do CYP2D6.' },
  { moleculeId: 'm19', enzymeId: 'e2', role: 'Substrato', notes: 'Metabolizada secundariamente pelo CYP3A4.' }
];
