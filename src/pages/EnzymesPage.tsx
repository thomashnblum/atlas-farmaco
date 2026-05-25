import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Shield, Search, AlertTriangle, HelpCircle, Activity, Info, Beaker, GitMerge, ArrowRight, Dna } from 'lucide-react';
import { cn } from '../utils/cn';
import { RichText } from '../components/UI/RichText';

interface DrugRef {
  id: string;
  name: string;
}

interface InteractionRef {
  id: string;
  name: string;
  severity: 'Forte' | 'Moderado' | 'Fraco';
}

interface DetailedEnzyme {
  id: string;
  name: string;
  location: string;
  importance: 'Crítica' | 'Alta' | 'Moderada';
  description: string;
  substrates: DrugRef[];
  inhibitors: InteractionRef[];
  inducers: InteractionRef[];
  genetics: string;
  clinicalDica: string;
}

export const ENZYME_DETAILS: Record<string, DetailedEnzyme> = {
  e1: {
    id: 'e1',
    name: 'CYP2D6',
    location: 'Hepático (Retículo Endoplasmático)',
    importance: 'Crítica',
    description: 'Uma das enzimas mais importantes na neuropsicofarmacologia. Embora represente apenas 2-4% do teor total de citocromo P450 no fígado, ela é responsável pela metabolização e depuração de mais de 25% de todos os medicamentos de uso psiquiátrico comum, incluindo a grande maioria dos antidepressivos e antipsicóticos.',
    substrates: [
      { id: 'm24', name: 'Risperidona' },
      { id: 'm3', name: 'Aripiprazol' },
      { id: 'm9', name: 'Venlafaxina' },
      { id: 'm11', name: 'Duloxetina' },
      { id: 'm33', name: 'Vortioxetina' },
      { id: 'm2', name: 'Haloperidol' },
      { id: 'm15', name: 'Clomipramina' },
      { id: 'm13', name: 'Amitriptilina' },
      { id: 'm16', name: 'Nortriptilina' },
      { id: 'm21', name: 'Moclobemida' },
      { id: 'm19', name: 'Fenelzina' }
    ],
    inhibitors: [
      { id: 'm1', name: 'Fluoxetina', severity: 'Forte' },
      { id: 'm5', name: 'Paroxetina', severity: 'Forte' },
      { id: 'm31', name: 'Bupropiona', severity: 'Forte' },
      { id: 'm11', name: 'Duloxetina', severity: 'Moderado' },
      { id: 'm4', name: 'Sertralina', severity: 'Fraco' }
    ],
    inducers: [
      { id: 'none', name: 'Resistente a indução clássica (sem indutores clínicos conhecidos de relevância)', severity: 'Fraco' }
    ],
    genetics: 'A CYP2D6 apresenta o maior grau de polimorfismo genético entre as CYPs. As pessoas são classificadas fenotipicamente em: (1) Metabolizadores Ultrarrápidos (UM) - possuem múltiplas cópias do gene ativo, metabolizam fármacos de forma extremamente rápida, levando a falhas terapêuticas; (2) Metabolizadores Normais (EM) - padrão populacional; (3) Metabolizadores Intermediários (IM) - atividade reduzida; (4) Metabolizadores Lentos (PM) - ausência de enzima funcional, gerando níveis plasmáticos tóxicos com doses padrão (comum em 7-10% de caucasianos).',
    clinicalDica: 'A coadministração de Fluoxetina ou Paroxetina (inibidores fortes da CYP2D6) com a Risperidona bloqueia a sua conversão no metabólito ativo (9-hidroxirisperidona). Isso causa acúmulo severo de Risperidona inalterada, multiplicando as concentrações séricas e elevando de forma severa o risco de Sintomas Extrapiramidais (SEP), rigidez motora extrema e hiperprolactinemia.'
  },
  e2: {
    id: 'e2',
    name: 'CYP3A4',
    location: 'Hepático e Intestinal (Mucosa do Intestino Delgado)',
    importance: 'Crítica',
    description: 'A isoenzima mais abundante do citocromo P450 no organismo humano, representando cerca de 30-40% de todas as CYPs hepáticas e 70% das intestinais. Metaboliza cerca de 50% de todas as drogas em circulação no mercado global. Devido à sua altíssima presença no trato intestinal, ela é o principal fator responsável pelo efeito de primeira passagem sistêmico.',
    substrates: [
      { id: 'm23', name: 'Quetiapina' },
      { id: 'm3', name: 'Aripiprazol' },
      { id: 'm24', name: 'Risperidona' },
      { id: 'm2', name: 'Haloperidol' },
      { id: 'm36', name: 'Alprazolam' },
      { id: 'm37', name: 'Diazepam' },
      { id: 'm39', name: 'Clonazepam' },
      { id: 'm32', name: 'Trazodona' },
      { id: 'm19', name: 'Fenelzina' }
    ],
    inhibitors: [
      { id: 'm8', name: 'Fluvoxamina', severity: 'Moderado' },
      { id: 'grapefruit', name: 'Suco de Toranja (Grapefruit)', severity: 'Forte' },
      { id: 'ketoconazole', name: 'Cetoconazol / Itraconazol', severity: 'Forte' },
      { id: 'clarithromycin', name: 'Claritromicina', severity: 'Forte' }
    ],
    inducers: [
      { id: 'm30', name: 'Carbamazepina', severity: 'Forte' },
      { id: 'phenytoin', name: 'Fenitoína', severity: 'Forte' },
      { id: 'rifampin', name: 'Rifampicina', severity: 'Forte' },
      { id: 'stjohns', name: 'Erva de São João (Hypericum)', severity: 'Moderado' }
    ],
    genetics: 'A variação polimórfica hereditária (genética) da CYP3A4 é baixa na população geral em comparação com a CYP2D6. No entanto, sua expressão fenotípica varia amplamente de pessoa para pessoa devido a fatores ambientais, dieta, e regulação por receptores nucleares como o PXR.',
    clinicalDica: 'O suco de toranja (grapefruit) inibe irreversivelmente a CYP3A4 intestinal por até 24-48 horas, aumentando drasticamente a absorção de Benzodiazepínicos e gerando sedação com risco de parada respiratória. Além disso, a Carbamazepina induz fortemente a CYP3A4, reduzindo os níveis de Quetiapina em até 80-90%, inviabilizando por completo o efeito terapêutico na esquizofrenia.'
  },
  e3: {
    id: 'e3',
    name: 'CYP1A2',
    location: 'Hepático',
    importance: 'Alta',
    description: 'Enzima altamente expressiva envolvida no metabolismo de aminas heterocíclicas e hidrocarbonetos. Possui papel clínico de vida ou morte no manejo de antipsicóticos atípicos específicos de alta potência como a Clozapina e a Olanzapina.',
    substrates: [
      { id: 'm22', name: 'Clozapina' },
      { id: 'm25', name: 'Olanzapina' },
      { id: 'm11', name: 'Duloxetina' },
      { id: 'm34', name: 'Agomelatina' },
      { id: 'm56', name: 'Cafeína' }
    ],
    inhibitors: [
      { id: 'm8', name: 'Fluvoxamina', severity: 'Forte' },
      { id: 'ciprofloxacin', name: 'Ciprofloxacino', severity: 'Forte' }
    ],
    inducers: [
      { id: 'tobacco', name: 'Alcatrão / Fumaça de Cigarro', severity: 'Forte' },
      { id: 'grilled', name: 'Alimentos grelhados no carvão', severity: 'Fraco' }
    ],
    genetics: 'Possui polimorfismos que alteram a velocidade basal de indução. Indivíduos portadores do alelo CYP1A2*1F são "indutores rápidos", apresentando taxas de clivagem de cafeína e antipsicóticos drasticamente mais rápidas em resposta à exposição a indutores como o fumo.',
    clinicalDica: 'Os hidrocarbonetos aromáticos presentes no alcatrão do tabaco induzem fortemente a CYP1A2. Se um paciente tabagista pesado em uso de Clozapina (Leponex) for hospitalizado em enfermaria psiquiátrica fechada e obrigado a cessar o tabagismo abruptamente, sua atividade de CYP1A2 cai pela metade em poucos dias, duplicando os níveis séricos de Clozapina. Isso pode precipitar convulsões grand mal, sedação profunda e miocardite letal.'
  },
  e4: {
    id: 'e4',
    name: 'CYP2C19',
    location: 'Hepático',
    importance: 'Alta',
    description: 'Enzima polimórfica proeminente na clivagem de antidepressivos ISRS e benzodiazepínicos. Juntamente com o CYP2D6, forma o núcleo metabólico que decide a biodisponibilidade da maioria dos tratamentos de ansiedade e depressão em psiquiatria.',
    substrates: [
      { id: 'm6', name: 'Escitalopram' },
      { id: 'm7', name: 'Citalopram' },
      { id: 'm4', name: 'Sertralina' },
      { id: 'm37', name: 'Diazepam' },
      { id: 'm13', name: 'Amitriptilina' },
      { id: 'm15', name: 'Clomipramina' },
      { id: 'm21', name: 'Moclobemida' }
    ],
    inhibitors: [
      { id: 'm8', name: 'Fluvoxamina', severity: 'Forte' },
      { id: 'omeprazole', name: 'Omeprazol', severity: 'Moderado' },
      { id: 'm1', name: 'Fluoxetina', severity: 'Fraco' }
    ],
    inducers: [
      { id: 'm30', name: 'Carbamazepina', severity: 'Moderado' },
      { id: 'rifampin', name: 'Rifampicina', severity: 'Forte' }
    ],
    genetics: 'Apresenta polimorfismo étnico marcante. Cerca de 15-20% das populações do Leste Asiático são Metabolizadores Lentos (PM) de CYP2C19, apresentando clearance extremamente baixo e sofrimento por efeitos colaterais com doses baixas de Escitalopram ou Diazepam.',
    clinicalDica: 'O uso diário do antiácido comum Omeprazol inibe de forma moderada a CYP2C19. Pacientes em uso regular deste protetor estomacal exibem picos séricos aumentados de Escitalopram e Diazepam, o que gera queixas constantes de letargia, sonolência diurna atípica e prolongamento do intervalo QTc.'
  },
  e5: {
    id: 'e5',
    name: 'CYP2C9',
    location: 'Hepático',
    importance: 'Moderada',
    description: 'Enzima chave no metabolismo de drogas com margem terapêutica estreita, como anticoagulantes orais, hipoglicemiantes e anti-inflamatórios não esteroides (AINEs). Na psiquiatria, tem importância direta na regulação plasmática do estabilizador de humor Ácido Valproico.',
    substrates: [
      { id: 'm28', name: 'Ácido Valproico' },
      { id: 'phenytoin', name: 'Fenitoína' },
      { id: 'warfarin', name: 'Varfarina' },
      { id: 'ibuprofen', name: 'Ibuprofeno' }
    ],
    inhibitors: [
      { id: 'fluconazole', name: 'Fluconazol', severity: 'Forte' },
      { id: 'amiodarone', name: 'Amiodarona', severity: 'Moderado' }
    ],
    inducers: [
      { id: 'm30', name: 'Carbamazepina', severity: 'Forte' },
      { id: 'rifampin', name: 'Rifampicina', severity: 'Forte' }
    ],
    genetics: 'Os alelos variantes CYP2C9*2 e CYP2C9*3 codificam enzimas com clearance severamente comprometido. Portadores homozigotos de CYP2C9*3 exibem clearance de varfarina reduzido em até 90%, necessitando de rígido acompanhamento de dosagens para evitar hemorragias cerebrais fatais.',
    clinicalDica: 'O uso concomitante de Fluconazol (antifúngico oral comum) bloqueia fortemente a CYP2C9. Pacientes estabilizados com Ácido Valproico ou Fenitoína que tomam uma dose única de Fluconazol correm o risco de intoxicação aguda severa, cursando com tremores incapacitantes, disartria, ataxia e depressão respiratória.'
  },
  e6: {
    id: 'e6',
    name: 'UGT (Phase II)',
    location: 'Hepático, Renal e Intestinal',
    importance: 'Crítica',
    description: 'As UDP-glucuronosiltransferases efetuam a conjugação de fase II (acoplamento do ácido glucurônico à molécula). Esse processo altera a conformação da molécula tornando-a altamente hidrossolúvel, permitindo a excreção renal e biliar imediata, inativando por completo o fármaco.',
    substrates: [
      { id: 'm29', name: 'Lamotrigina' },
      { id: 'm38', name: 'Lorazepam' },
      { id: 'oxazepam', name: 'Oxazepam' },
      { id: 'temazepam', name: 'Temazepam' },
      { id: 'm28', name: 'Ácido Valproico' }
    ],
    inhibitors: [
      { id: 'm28', name: 'Ácido Valproico (Inibe UGT1A4 e UGT2B7)', severity: 'Forte' }
    ],
    inducers: [
      { id: 'm30', name: 'Carbamazepina', severity: 'Forte' },
      { id: 'estrogen', name: 'Contraceptivos Orais Estrogênicos', severity: 'Forte' },
      { id: 'phenobarbital', name: 'Fenobarbital', severity: 'Forte' }
    ],
    genetics: 'Polimorfismos na UGT1A1 causam a Síndrome de Gilbert (uma condição benigna de icterícia intermitente). Polimorfismos de UGT1A4 alteram as taxas basais de conjugação de Lamotrigina na população geral, influenciando os níveis basais do medicamento.',
    clinicalDica: 'A interação entre Ácido Valproico (Valproato) e Lamotrigina é um clássico de alto risco. O Valproato bloqueia fortemente a UGT1A4, reduzindo o clearance de Lamotrigina em 50% e duplicando sua meia-vida. Isso dispara o risco de necrose epidérmica letal, a Síndrome de Stevens-Johnson (SJS). Quando associados, a dose de Lamotrigina deve ser cortada pela metade (iniciando com 12.5mg em dias alternados) e titulada com extrema lentidão. Além disso, anticoncepcionais estrogênicos induzem a UGT e diminuem a Lamotrigina pela metade, podendo deflagrar convulsões em epiléticos.'
  },
  e7: {
    id: 'e7',
    name: 'CYP2C8',
    location: 'Hepático',
    importance: 'Moderada',
    description: 'Enzima envolvida no metabolismo de fármacos na área de cardiologia, oncologia e em alguns compostos específicos de indução do sono (hipnóticos-Z).',
    substrates: [
      { id: 'm43', name: 'Zopiclona' },
      { id: 'repaglinide', name: 'Repaglinida' },
      { id: 'paclitaxel', name: 'Paclitaxel' }
    ],
    inhibitors: [
      { id: 'gemfibrozil', name: 'Genfibrozila', severity: 'Forte' }
    ],
    inducers: [
      { id: 'rifampin', name: 'Rifampicina', severity: 'Forte' }
    ],
    genetics: 'Possui variantes como a CYP2C8*3 que reduzem ou aumentam a eliminação de substratos específicos, com importância descrita em oncologia clínica.',
    clinicalDica: 'O uso concomitante do hipnótico Zopiclona com a Genfibrozila (medicamento para triglicerídeos) inibe fortemente a CYP2C8, retardando a excreção da Zopiclona e gerando severa ressaca matinal, ataxia, amnésia anterógrada e sonambulismo acentuado.'
  },
  e8: {
    id: 'e8',
    name: 'CYP2B6',
    location: 'Hepático',
    importance: 'Alta',
    description: 'Enzima chave no metabolismo de drogas atípicas e anestésicas em psiquiatria, além de retrovirais. Desempenha papel primordial na ativação de pró-fármacos.',
    substrates: [
      { id: 'm31', name: 'Bupropiona' },
      { id: 'm50', name: 'Cetamina' },
      { id: 'propofol', name: 'Propofol' },
      { id: 'efavirenz', name: 'Efavirenz' },
      { id: 'methadone', name: 'Metadona' }
    ],
    inhibitors: [
      { id: 'ticlopidine', name: 'Ticlopidina', severity: 'Forte' },
      { id: 'clopidogrel', name: 'Clopidogrel', severity: 'Moderado' }
    ],
    inducers: [
      { id: 'm30', name: 'Carbamazepina', severity: 'Forte' },
      { id: 'rifampin', name: 'Rifampicina', severity: 'Forte' }
    ],
    genetics: 'Variantes alélicas como a CYP2B6*6 estão associadas a clearance severamente reduzido de efavirenz e metadona, induzindo picos de toxicidade do SNC em portadores homozigotos.',
    clinicalDica: 'A Bupropiona é clivada pela CYP2B6 em seu metabólito ativo hidroxibupropiona (responsável pela potente ação de reabsorção de NE no córtex). Mutações de inibição desta enzima prejudicam a resposta clínica ao tratamento de depressão e tabagismo, pois impedem a liberação do metabólito noradrenérgico mais potente.'
  }
};

export const EnzymesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [selectedId, setSelectedId] = useState<string>('e1');
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-focus enzyme passed via route state (from atlas relational clicking!)
  useEffect(() => {
    if (location.state && (location.state as any).selectedEnzymeId) {
      const stateId = (location.state as any).selectedEnzymeId;
      if (ENZYME_DETAILS[stateId]) {
        setSelectedId(stateId);
      }
    }
  }, [location.state]);

  const enzymesList = Object.values(ENZYME_DETAILS);

  const filteredEnzymes = enzymesList.filter(enz =>
    enz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enz.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enz.substrates.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedEnzyme = ENZYME_DETAILS[selectedId] || ENZYME_DETAILS['e1'];

  return (
    <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 h-full overflow-hidden">
      {/* Sidebar List */}
      <div className="w-full lg:w-96 flex flex-col shrink-0 h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-800 pb-6 lg:pb-0 lg:pr-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Beaker className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-100 uppercase">
                Catálogo de Enzimas (CYP450)
              </h1>
              <p className="text-zinc-500 text-xs mt-0.5">
                Investigue o clearance metabólico, polimorfismos de risco e a farmacogenética psiquiátrica.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 relative shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Buscar enzima ou substrato..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-sans"
          />
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {filteredEnzymes.length > 0 ? (
            filteredEnzymes.map((enz) => {
              const isSelected = enz.id === selectedId;
              const importanceColor = 
                enz.importance === 'Crítica' ? 'text-red-400 border-red-500/20 bg-red-500/5' :
                enz.importance === 'Alta' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' :
                'text-teal-400 border-teal-500/20 bg-teal-500/5';

              return (
                <button
                  key={enz.id}
                  onClick={() => setSelectedId(enz.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden",
                    isSelected 
                      ? "bg-zinc-900 border-amber-500/50 shadow-lg shadow-amber-500/5" 
                      : "bg-zinc-950/40 border-zinc-900 hover:bg-zinc-900 hover:border-zinc-800"
                  )}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={cn(
                      "font-mono font-bold text-sm transition-colors",
                      isSelected ? "text-amber-400" : "text-zinc-300 group-hover:text-amber-400"
                    )}>
                      {enz.name}
                    </span>
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider font-mono",
                      importanceColor
                    )}>
                      {enz.importance}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed font-sans">
                    {enz.description}
                  </p>
                  
                  {/* Highlight bar */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center bg-zinc-950/20 rounded-xl border border-zinc-900">
              <p className="text-zinc-500 text-xs font-mono">Nenhuma enzima encontrada.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 h-full custom-scrollbar">
        {/* Enzyme Bio Header */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-amber-500/5 select-none pointer-events-none group-hover:text-amber-500/10 transition-colors">
            <Beaker className="w-36 h-36" />
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black font-mono tracking-tight text-zinc-100">
                {selectedEnzyme.name}
              </span>
              <div className="h-6 w-[1px] bg-zinc-800" />
              <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
                <Activity className="w-3.5 h-3.5" />
                <span>LOCALIZAÇÃO: {selectedEnzyme.location}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Prioridade Clínica:</span>
              <span className={cn(
                "text-xs font-bold font-mono px-2.5 py-0.5 rounded-full border tracking-wide uppercase",
                selectedEnzyme.importance === 'Crítica' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                selectedEnzyme.importance === 'Alta' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                'text-teal-400 border-teal-500/30 bg-teal-500/10'
              )}>
                {selectedEnzyme.importance}
              </span>
            </div>
          </div>

          <p className="text-zinc-300 text-sm leading-relaxed max-w-4xl font-sans">
            <RichText text={selectedEnzyme.description} />
          </p>
        </div>

        {/* Substrates, Inhibitors, Inducers Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Substratos */}
          <div className="bg-zinc-900/20 border border-zinc-800/80 p-5 rounded-2xl flex flex-col">
            <h3 className="text-xs uppercase font-bold tracking-widest text-zinc-400 flex items-center gap-2 mb-4 font-mono">
              <GitMerge className="w-4 h-4 text-zinc-400" /> Substratos Psiquiátricos
            </h3>
            
            <div className="flex flex-wrap gap-2 flex-1 items-start content-start">
              {selectedEnzyme.substrates.map(sub => {
                if (sub.id === 'none') {
                  return <span key={sub.id} className="text-xs text-zinc-500 font-sans italic">{sub.name}</span>;
                }
                return (
                  <Link
                    key={sub.id}
                    to="/molecules"
                    state={{ selectedId: sub.id }}
                    className="text-xs font-mono font-medium px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800/60 text-zinc-300 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all flex items-center gap-1 group/btn"
                  >
                    {sub.name}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all text-amber-400 shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Inibidores */}
          <div className="bg-zinc-900/20 border border-zinc-800/80 p-5 rounded-2xl flex flex-col">
            <h3 className="text-xs uppercase font-bold tracking-widest text-red-400 flex items-center gap-2 mb-4 font-mono">
              <AlertTriangle className="w-4 h-4 text-red-400" /> Inibidores Farmacológicos
            </h3>
            
            <div className="space-y-2 flex-1 overflow-y-auto max-h-60 pr-1 custom-scrollbar">
              {selectedEnzyme.inhibitors.map(inh => {
                const badgeColor = 
                  inh.severity === 'Forte' ? 'text-red-400 border-red-500/20 bg-red-500/5' :
                  inh.severity === 'Moderado' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' :
                  'text-zinc-400 border-zinc-800 bg-zinc-900/40';

                if (inh.id.startsWith('grapefruit') || inh.id.endsWith('azole') || inh.id.endsWith('mycin')) {
                  return (
                    <div key={inh.id} className="flex justify-between items-center p-2 rounded-xl bg-zinc-950 border border-zinc-900">
                      <span className="text-xs text-zinc-400 font-sans font-medium">{inh.name}</span>
                      <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0", badgeColor)}>
                        {inh.severity}
                      </span>
                    </div>
                  );
                }

                return (
                  <div key={inh.id} className="flex justify-between items-center p-2 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800/80 transition-colors">
                    <Link
                      to="/molecules"
                      state={{ selectedId: inh.id }}
                      className="text-xs font-mono font-bold text-zinc-300 hover:text-amber-400 transition-colors"
                    >
                      {inh.name}
                    </Link>
                    <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0", badgeColor)}>
                      {inh.severity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Indutores */}
          <div className="bg-zinc-900/20 border border-zinc-800/80 p-5 rounded-2xl flex flex-col">
            <h3 className="text-xs uppercase font-bold tracking-widest text-teal-400 flex items-center gap-2 mb-4 font-mono">
              <Shield className="w-4 h-4 text-teal-400" /> Indutores Farmacológicos
            </h3>
            
            <div className="space-y-2 flex-1 overflow-y-auto max-h-60 pr-1 custom-scrollbar">
              {selectedEnzyme.inducers.map(ind => {
                const badgeColor = 
                  ind.severity === 'Forte' ? 'text-teal-400 border-teal-500/20 bg-teal-500/5' :
                  ind.severity === 'Moderado' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' :
                  'text-zinc-400 border-zinc-800 bg-zinc-900/40';

                if (ind.id === 'none') {
                  return <span key={ind.id} className="text-xs text-zinc-500 font-sans italic">{ind.name}</span>;
                }

                if (ind.id.startsWith('tobacco') || ind.id.startsWith('grilled') || ind.id.endsWith('in') || ind.id.endsWith('johns') || ind.id.startsWith('estrogen')) {
                  return (
                    <div key={ind.id} className="flex justify-between items-center p-2 rounded-xl bg-zinc-950 border border-zinc-900">
                      <span className="text-xs text-zinc-400 font-sans font-medium">{ind.name}</span>
                      <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0", badgeColor)}>
                        {ind.severity}
                      </span>
                    </div>
                  );
                }

                return (
                  <div key={ind.id} className="flex justify-between items-center p-2 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800/80 transition-colors">
                    <Link
                      to="/molecules"
                      state={{ selectedId: ind.id }}
                      className="text-xs font-mono font-bold text-zinc-300 hover:text-amber-400 transition-colors"
                    >
                      {ind.name}
                    </Link>
                    <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0", badgeColor)}>
                      {ind.severity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Genetics and Polymorphisms Section */}
        <div className="bg-zinc-900/20 border border-zinc-800/80 p-6 rounded-2xl">
          <h3 className="text-xs uppercase font-bold tracking-widest text-zinc-400 flex items-center gap-2 mb-3 font-mono">
            <Dna className="w-4 h-4 text-zinc-400" /> Farmacogenômica e Polimorfismos Genéticos
          </h3>
          <p className="text-zinc-400 text-xs leading-relaxed font-sans">
            <RichText text={selectedEnzyme.genetics} />
          </p>
        </div>

        {/* Clinical Dica alert box */}
        <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-amber-500/5 select-none pointer-events-none">
            <AlertTriangle className="w-24 h-24" />
          </div>
          
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase font-bold tracking-widest text-amber-400 mb-1.5 font-mono">
                Alerta de Interação Clínica / Dica Farmacológica
              </h4>
              <p className="text-zinc-300 text-xs leading-relaxed max-w-4xl font-sans italic">
                "<RichText text={selectedEnzyme.clinicalDica} />"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
