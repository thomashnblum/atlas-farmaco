import { useState, useEffect, useMemo } from 'react';
import { dataService } from '../services/dataService';
import { useInteractionSimulator } from '../hooks/useInteractionSimulator';
import { 
  AlertCircle, 
  X, 
  Activity, 
  Sparkles, 
  Clock, 
  Zap, 
  Pill, 
  FlaskConical, 
  Droplets, 
  ShieldAlert, 
  Network, 
  Database 
} from 'lucide-react';
import { Molecule, Receptor, MetabolicEnzyme } from '../data/schema';

// Mapeamento de recomendações clínicas individuais customizadas por classe/nome do fármaco
const getIndividualRecommendation = (mol: Molecule): string[] => {
  const name = mol.name.toLowerCase();
  const cls = mol.class.toLowerCase();
  
  const recs: string[] = [];
  
  if (cls.includes('tricíclico')) {
    recs.push('Alto risco de toxicidade cardíaca em superdosagem devido a bloqueio rápido de canais de sódio (alargamento de QRS).');
    recs.push('Muito vulnerável a inibidores de CYP2D6 que podem fazer a concentração sérica atingir limites perigosos para arritmias cardíacas.');
    recs.push('Forte ação anticolinérgica (risco de boca seca, constipação, retenção urinária e confusão mental em idosos).');
  } else if (cls.includes('isrs') && !cls.includes('isrsn')) {
    if (name.includes('fluoxetina') || name.includes('paroxetina')) {
      recs.push('Inibidor potente da enzima CYP2D6, aumentando consideravelmente os níveis séricos de outros fármacos que dependem deste citocromo.');
    } else if (name.includes('fluvoxamina')) {
      recs.push('Inibidor potente de CYP1A2 e CYP2C19, exigindo extrema cautela em polifarmácia.');
    } else {
      recs.push('Inibidor seletivo de SERT com baixo potencial intrínseco de interações metabólicas CYP450.');
    }
    recs.push('Risco moderado de prolongamento do intervalo QTc em doses elevadas ou em combinação com outros agentes arritmogênicos.');
  } else if (cls.includes('isrsn')) {
    if (name.includes('venlafaxina')) {
      recs.push('Inibição do SERT em doses baixas; bloqueio de NET adicional em doses mais altas (>150mg).');
      recs.push('Pode induzir elevação da pressão arterial de forma dose-dependente pelo tônus noradrenérgico.');
    } else if (name.includes('desvenlafaxina') || name.includes('milnaciprana')) {
      recs.push('Eliminação majoritariamente por conjugação UGT ativa, com baixíssimo envolvimento das vias do CYP450.');
    } else {
      recs.push('Inibição dual de SERT e NET equilibrada; monitorar níveis de pressão arterial regularmente.');
    }
  } else if (cls.includes('atípico') && cls.includes('antipsicótico')) {
    recs.push('Risco metabólico elevado (ganho de peso, dislipidemia, hiperglicemia), exigindo controle laboratorial de rotina.');
    recs.push('Risco de sintomas extrapiramidais (SEP) e discinesia tardia dependente do grau de ocupação de receptores dopaminérgicos D2.');
    if (name.includes('clozapina')) {
      recs.push('Risco crítico de agranulocitose; controle rigoroso por hemograma obrigatório.');
    }
  } else if (cls.includes('estabilizador')) {
    if (name.includes('lítio')) {
      recs.push('Estreito índice terapêutico (janela de litemia ideal: 0.6 - 1.2 mEq/L); monitorar creatinina e função tireoidiana.');
      recs.push('Não sofre metabolização hepática; clearance é 100% renal e altamente sensível a AINEs, diuréticos e IECAs.');
    } else if (name.includes('valproato')) {
      recs.push('Inibidor potente da UGT (fase II de metabolização), podendo duplicar os níveis plasmáticos de lamotrigina.');
    } else if (name.includes('carbamazepina')) {
      recs.push('Potente autoindutor enzimático de CYP3A4, CYP1A2 e CYP2C9; reduz expressivamente a eficácia de outros fármacos com o tempo.');
    }
  } else if (cls.includes('benzodiazepínico')) {
    recs.push('Risco proeminente de tolerância, dependência física e síndrome de descontinuação/abstinência com uso prolongado.');
    recs.push('Potente depressor do SNC, com risco crítico de sedação excessiva e depressão respiratória se associado a outros agentes gabaérgicos.');
  } else if (cls.includes('estimulante')) {
    recs.push('Ação simpaticomimética indireta no córtex pré-frontal, com potencial de elevação de pressão arterial e taquicardia.');
    recs.push('Pode exacerbar ansiedade basal, tiques motores ou desencadear quadros psicóticos em indivíduos predispostos.');
  } else {
    recs.push('Monitorar a resposta terapêutica clínica nas primeiras 2 a 4 semanas.');
    recs.push('Acompanhar o aparecimento de cefaleia ou desconforto gastrointestinal transitório no início da terapia.');
  }
  
  return recs;
};

export const NavigatorPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('atlas_simulator_ids');
    if (saved) {
       try {
         const parsed = JSON.parse(saved);
         if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
           return parsed;
         }
         return [];
       } catch (e) {
         return [];
       }
    }
    return [];
  });
  
  const [activeTab, setActiveTab] = useState<'alerts' | 'receptors' | 'cyp'>('alerts');

  const molecules = dataService.getMolecules();
  const alerts = useInteractionSimulator(selectedIds);

  useEffect(() => {
    localStorage.setItem('atlas_simulator_ids', JSON.stringify(selectedIds));
  }, [selectedIds]);

  const addMolecule = (id: string) => {
    if (id && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeMolecule = (id: string) => {
    setSelectedIds(selectedIds.filter(selId => selId !== id));
  };

  const selectedMols = useMemo(() => {
    return selectedIds.map(id => dataService.getMoleculeById(id)).filter(Boolean) as Molecule[];
  }, [selectedIds]);

  // --- 1. Cálculos do Eixo Neuro-Receptorial ---
  const receptorAnalysis = useMemo(() => {
    if (selectedMols.length === 0) return [];
    
    // Mapear todas as interações PD dos fármacos selecionados
    const allPd = selectedMols.flatMap(m => {
      const pds = dataService.getPharmacodynamics(m.id);
      return pds.map(pd => ({ ...pd, molName: m.name }));
    });
    
    // Agrupar por receptor
    const grouped: Record<string, { receptor: Receptor; occupancy: number; drugs: { molName: string; level: 'critical' | 'high' | 'moderate' | 'low'; action: string }[] }> = {};
    
    allPd.forEach(interaction => {
      const rec = dataService.getReceptorById(interaction.receptorId);
      if (!rec) return;
      
      if (!grouped[rec.id]) {
        grouped[rec.id] = {
          receptor: rec,
          occupancy: 0,
          drugs: []
        };
      }
      
      let level: 'critical' | 'high' | 'moderate' | 'low' = 'low';
      let fill = 25;
      
      const ki = interaction.affinityKi;
      if (ki != null) {
        if (ki < 1) { level = 'critical'; fill = 95; }
        else if (ki < 10) { level = 'high'; fill = 80; }
        else if (ki < 100) { level = 'moderate'; fill = 50; }
        else { level = 'low'; fill = 25; }
      } else {
        // Fallbacks para gabaérgicos e ações especiais baseados em tipo
        if (interaction.actionType === 'Modulador Alostérico' || interaction.actionType === 'Agonista Total') {
          level = 'critical'; fill = 90;
        } else {
          level = 'low'; fill = 25;
        }
      }
      
      grouped[rec.id].drugs.push({
        molName: interaction.molName,
        level,
        action: interaction.actionType
      });
      
      // A ocupação total é o maior valor dos preenchimentos individuais
      if (fill > grouped[rec.id].occupancy) {
        grouped[rec.id].occupancy = fill;
      }
    });
    
    return Object.values(grouped).sort((a, b) => b.occupancy - a.occupancy);
  }, [selectedMols]);

  // --- 2. Cálculos do Citocromo CYP450 ---
  const cypAnalysis = useMemo(() => {
    // 4 Enzimas centrais pedidas
    const cypIds = ['e1', 'e2', 'e3', 'e4']; // CYP2D6, CYP3A4, CYP1A2, CYP2C19
    const enzymes = cypIds.map(id => dataService.getEnzymeById(id)).filter(Boolean) as MetabolicEnzyme[];
    
    const results = enzymes.map(enzyme => {
      // Obter todas as interações dessa enzima com os fármacos selecionados
      const interactions = selectedMols.flatMap(m => {
        const pks = dataService.getPharmacokinetics(m.id);
        const match = pks.find(pk => pk.enzymeId === enzyme.id);
        if (match) {
          return [{ molName: m.name, role: match.role }];
        }
        return [];
      });
      
      // Determinar se há conflito de via
      const hasSubstrate = interactions.some(i => i.role === 'Substrato');
      const hasInhibitorOrInducer = interactions.some(i => i.role.includes('Inibidor') || i.role.includes('Indutor'));
      const hasConflict = hasSubstrate && hasInhibitorOrInducer;
      
      return {
        enzyme,
        interactions,
        hasConflict
      };
    });
    
    // Gerar as notas críticas de depuração baseadas nos conflitos reais
    const criticalNotes: { type: 'danger' | 'warning'; text: string }[] = [];
    results.forEach(res => {
      if (res.hasConflict) {
        const inhibitors = res.interactions.filter(i => i.role.includes('Inibidor'));
        const substrates = res.interactions.filter(i => i.role === 'Substrato');
        
        inhibitors.forEach(i => {
          substrates.forEach(s => {
            const isForte = i.role.includes('Forte');
            if (isForte) {
              criticalNotes.push({
                type: 'danger',
                text: `ALTA PERICULOSIDADE: A ${i.molName} funciona como INIBIDOR FORTE da enzima cromossomática ${res.enzyme.name}. Isto diminui drasticamente o metabolismo hepático da ${s.molName}, podendo elevar suas taxas plasmáticas a patamares potencialmente tóxicos.`
              });
            } else {
              criticalNotes.push({
                type: 'warning',
                text: `ATENÇÃO MODERADA: A ${i.molName} é ${i.role.toUpperCase()} do ${res.enzyme.name}, retardando a taxa de atenuação e depuração da molécula de ${s.molName}.`
              });
            }
          });
        });
      }
    });
    
    return {
      grid: results,
      criticalNotes
    };
  }, [selectedMols]);

  const dangerCount = alerts.filter(a => a.type === 'danger').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;
  const infoCount = alerts.filter(a => a.type === 'info').length;
  const totalAlerts = dangerCount + warningCount;

  return (
    <div className="p-4 md:p-8 flex flex-col gap-6 h-full overflow-y-auto">
      {/* Header do Simulador */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight uppercase mb-1">Simulador Psico-Farmacológico</h1>
          <p className="text-zinc-500 text-xs font-mono">Atlas Fármaco v1.0.4 - painel de verificação clínica</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0 items-start">
        {/* Painel de Seleção Esquerdo */}
        <div className="lg:col-span-1 border border-zinc-800 bg-zinc-900/30 p-5 rounded-2xl flex flex-col backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Network className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">Seleção de Painel</h2>
          </div>
          
          <div className="mb-6">
            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Adicionar Molécula</label>
            <select 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 font-mono cursor-pointer"
              onChange={(e) => addMolecule(e.target.value)}
              value=""
            >
              <option value="" disabled>ESCOLHA UM FÁRMACO...</option>
              {[...molecules]
                .sort((a, b) => a.name.localeCompare(b.name))
                .filter(m => !selectedIds.includes(m.id))
                .map(m => (
                  <option key={m.id} value={m.id}>{m.name.toUpperCase()}</option>
                ))}
            </select>
          </div>

          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 font-mono">Fármacos Selecionados ({selectedIds.length})</h3>
            {selectedIds.length === 0 ? (
              <p className="text-xs text-zinc-600 italic font-mono p-3 bg-zinc-950/20 border border-zinc-900 border-dashed rounded-xl">Nenhuma molécula ativa...</p>
            ) : (
              <div className="space-y-2">
                {selectedIds.map(id => {
                  const mol = dataService.getMoleculeById(id);
                  return mol ? (
                    <div key={id} className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-xl flex justify-between items-center group transition-colors hover:border-zinc-700">
                      <span className="text-zinc-300 font-bold text-sm tracking-wide">{mol.name}</span>
                      <button onClick={() => removeMolecule(id)} className="text-zinc-600 hover:text-rose-400 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>

        {/* Console Principal Direita com abas */}
        <div className="lg:col-span-3 flex flex-col border border-zinc-800 bg-zinc-950/40 rounded-3xl overflow-hidden shadow-2xl min-h-[500px]">
          {/* Navegação por Sub-Abas do Simulador */}
          <div className="flex border-b border-zinc-800 bg-zinc-900/20 text-xs md:text-sm font-mono shrink-0">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 border-b-2 transition-all font-bold ${
                activeTab === 'alerts'
                  ? 'border-amber-400 text-amber-300 bg-amber-400/5'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/10'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Alertas Clínicos e Conflitos {selectedIds.length >= 2 && `(${totalAlerts})`}
            </button>
            <button
              onClick={() => setActiveTab('receptors')}
              className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 border-b-2 transition-all font-bold ${
                activeTab === 'receptors'
                  ? 'border-amber-400 text-amber-300 bg-amber-400/5'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/10'
              }`}
            >
              <Network className="w-4 h-4" />
              Eixo Neuro-Receptorial
            </button>
            <button
              onClick={() => setActiveTab('cyp')}
              className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 border-b-2 transition-all font-bold ${
                activeTab === 'cyp'
                  ? 'border-amber-400 text-amber-300 bg-amber-400/5'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/10'
              }`}
            >
              <Activity className="w-4 h-4" />
              Citocromo CYP450
            </button>
          </div>

          <div className="p-6 md:p-8 flex-1 flex flex-col min-h-0 overflow-y-auto">
            {selectedIds.length < 2 ? (
              <div className="flex flex-col items-center justify-center text-center my-auto py-12 text-zinc-600 font-mono">
                <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center mb-4 bg-zinc-900/30">
                  <Activity className="w-6 h-6 text-zinc-500" />
                </div>
                <p className="text-sm tracking-wider">Aguardando combinatória de pelo menos 2 moléculas ativas.</p>
              </div>
            ) : (
              <>
                {/* 1. ABA DE ALERTAS CLÍNICOS */}
                {activeTab === 'alerts' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                        Interações Mapeadas pela Rede Neuroquímica
                      </span>
                    </div>

                    {alerts.length === 0 ? (
                      <div className="bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 rounded-2xl p-5 flex items-start gap-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] mt-1.5 shrink-0 animate-pulse"></div>
                        <div>
                          <h4 className="font-bold tracking-wider text-sm mb-1 uppercase font-mono">Sistema Estável: Sem interações graves</h4>
                          <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                            Nenhum conflito de inibição potente (CYP450) ou toxicidade cruzada foi detectado entre as substâncias selecionadas.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {alerts.map((alert, idx) => {
                          const isDanger = alert.type === 'danger';
                          const isWarning = alert.type === 'warning';
                          
                          let cardBorderColor = 'border-blue-500/20 bg-blue-500/5';
                          let titleColor = 'text-blue-400';
                          let badgeText = 'MONITORAMENTO LEVE';
                          let badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                          
                          if (isDanger) {
                            cardBorderColor = 'border-rose-500/25 bg-rose-500/5';
                            titleColor = 'text-rose-400';
                            badgeText = 'RISCO CRÍTICO';
                            badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                          } else if (isWarning) {
                            cardBorderColor = 'border-amber-500/20 bg-amber-500/5';
                            titleColor = 'text-amber-400';
                            badgeText = 'MONITORAMENTO MODERADO';
                            badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                          }

                          return (
                            <div key={idx} className={`border rounded-2xl p-5 flex flex-col gap-3 transition-all hover:scale-[1.005] ${cardBorderColor}`}>
                              <div className="flex justify-between items-start flex-wrap gap-2">
                                <h3 className={`font-bold text-base tracking-wide flex items-center gap-2 ${titleColor}`}>
                                  <AlertCircle className="w-5 h-5 shrink-0" />
                                  {alert.message}
                                </h3>
                                <span className={`text-[9px] uppercase font-mono font-black px-2 py-0.5 rounded border ${badgeColor}`}>
                                  {badgeText}
                                </span>
                              </div>
                              
                              {alert.mechanismExplanation && (
                                <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900">
                                  <h4 className="text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono mb-1.5">
                                    Mecanismo de Ação Farmacocinético
                                  </h4>
                                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">{alert.mechanismExplanation}</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Recomendações Clínicas Individuais */}
                    <div className="pt-6 border-t border-zinc-900 space-y-4">
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                        Recomendações Clínicas Individuais
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedMols.map(mol => {
                          const recs = getIndividualRecommendation(mol);
                          return (
                            <div key={mol.id} className="bg-zinc-950/40 border border-zinc-800 p-5 rounded-2xl flex flex-col gap-3">
                              <h5 className="font-bold text-zinc-200 text-sm tracking-wide border-b border-zinc-800 pb-2 flex items-center justify-between">
                                <span>{mol.name}</span>
                                <span className="text-[10px] text-zinc-500 font-mono font-medium">({mol.halfLife?.split(' (')[0] || 't½ N/D'})</span>
                              </h5>
                              <ul className="list-disc list-outside ml-4 space-y-2 text-xs text-zinc-400 leading-relaxed font-sans">
                                {recs.map((rec, i) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ABA DE EIXO NEURO-RECEPTORIAL */}
                {activeTab === 'receptors' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                        Sobreposição e Soma de Afinidade em Receptores
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">(Constante Alostérica Ki Virtual)</span>
                    </div>

                    <div className="space-y-5">
                      {receptorAnalysis.map(analysis => {
                        let fillBarColor = 'bg-zinc-700';
                        let labelText = 'Ligação Lenta';
                        let labelColor = 'text-zinc-500';
                        
                        if (analysis.occupancy >= 90) {
                          fillBarColor = 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
                          labelText = 'Saturação Crítica';
                          labelColor = 'text-rose-400 font-bold';
                        } else if (analysis.occupancy >= 80) {
                          fillBarColor = 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]';
                          labelText = 'Bloqueio Alto';
                          labelColor = 'text-amber-400 font-bold';
                        } else if (analysis.occupancy >= 50) {
                          fillBarColor = 'bg-yellow-500';
                          labelText = 'Bloqueio Moderado';
                          labelColor = 'text-yellow-400 font-medium';
                        } else if (analysis.occupancy >= 25) {
                          fillBarColor = 'bg-zinc-600';
                          labelText = 'Ligação Lenta';
                          labelColor = 'text-zinc-500';
                        }

                        return (
                          <div key={analysis.receptor.id} className="bg-zinc-900/20 border border-zinc-800 p-5 rounded-2xl space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                <span className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1 text-xs font-bold text-zinc-200 font-mono">
                                  {analysis.receptor.name}
                                </span>
                                <span className="text-zinc-500 text-xs font-mono">
                                  Ocupado por {analysis.drugs.length} {analysis.drugs.length === 1 ? 'fármaco' : 'fármacos'}
                                </span>
                              </div>
                              <span className={`text-xs uppercase font-mono ${labelColor}`}>{labelText}</span>
                            </div>

                            {/* Barra de Progresso Visual */}
                            <div className="h-2 w-full bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${fillBarColor}`} 
                                style={{ width: `${analysis.occupancy}%` }}
                              ></div>
                            </div>

                            {/* Detalhes de Afinidades individuais */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold font-mono">Afinidades:</span>
                              {analysis.drugs.map((drug, dIdx) => {
                                let badgeClass = 'border-zinc-800 bg-zinc-900 text-zinc-400';
                                if (drug.level === 'critical') badgeClass = 'border-rose-500/20 bg-rose-500/5 text-rose-300';
                                else if (drug.level === 'high') badgeClass = 'border-amber-500/20 bg-amber-500/5 text-amber-300';
                                else if (drug.level === 'moderate') badgeClass = 'border-yellow-500/20 bg-yellow-500/5 text-yellow-300';
                                
                                return (
                                  <span key={dIdx} className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-bold font-mono ${badgeClass}`}>
                                    {drug.molName}: {drug.level}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                      
                      {receptorAnalysis.length === 0 && (
                        <div className="p-8 text-center text-zinc-600 font-mono border border-zinc-900 border-dashed rounded-2xl bg-zinc-900/5">
                          Sem sobreposição ativa detectada em receptores.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. ABA DE CITOCROMO CYP450 */}
                {activeTab === 'cyp' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                        Mapeamento de Degradação Hepática (CYP450)
                      </span>
                      {cypAnalysis.criticalNotes.length > 0 ? (
                        <span className="text-[10px] text-rose-400 font-bold font-mono flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                          Conflito Metabólico Ativo
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-mono">Sem Conflitos Ativos</span>
                      )}
                    </div>

                    {/* Grid de Enzimas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cypAnalysis.grid.map(gridItem => {
                        return (
                          <div 
                            key={gridItem.enzyme.id} 
                            className={`p-5 rounded-2xl border flex flex-col justify-between min-h-[140px] transition-colors ${
                              gridItem.hasConflict 
                                ? 'bg-rose-500/5 border-rose-500/30' 
                                : 'bg-zinc-900/20 border-zinc-800'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-bold text-sm text-zinc-200 font-mono uppercase tracking-wide">
                                {gridItem.enzyme.name}
                              </h4>
                              <span className={`text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${
                                gridItem.hasConflict 
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse' 
                                  : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                              }`}>
                                {gridItem.hasConflict ? '⚠️ CONFLITO DE VIA' : 'Via Desimpedida'}
                              </span>
                            </div>

                            {/* Lista de fármacos interagindo nesta enzima */}
                            <div className="space-y-2">
                              {gridItem.interactions.length === 0 ? (
                                <p className="text-[11px] text-zinc-600 font-mono italic">Sem atividade CYP ativa...</p>
                              ) : (
                                gridItem.interactions.map((inter, iIdx) => {
                                  const isInhibitor = inter.role.includes('Inibidor');
                                  const isInducer = inter.role.includes('Indutor');
                                  
                                  let roleBadge = 'bg-zinc-900 border-zinc-800 text-zinc-400';
                                  if (isInhibitor) {
                                    roleBadge = inter.role.includes('Forte') 
                                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 font-bold'
                                      : 'bg-orange-500/10 border-orange-500/30 text-orange-400 font-bold';
                                  } else if (isInducer) {
                                    roleBadge = 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold';
                                  } else if (inter.role === 'Substrato') {
                                    roleBadge = 'bg-yellow-500/5 border-yellow-500/20 text-yellow-300';
                                  }
                                  
                                  return (
                                    <div key={iIdx} className="flex justify-between items-center text-xs">
                                      <span className="font-medium text-zinc-400">{inter.molName}</span>
                                      <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded border ${roleBadge}`}>
                                        {inter.role.includes('Inibidor Forte') ? 'INIBIDOR (STRONG)' :
                                         inter.role.includes('Inibidor Moderado') ? 'INIBIDOR (MODERATE)' :
                                         inter.role.toUpperCase()}
                                      </span>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Notas Críticas de Depuração */}
                    {cypAnalysis.criticalNotes.length > 0 && (
                      <div className="pt-6 border-t border-zinc-900 space-y-4">
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                          Notas Críticas de Depuração Hepática
                        </h4>
                        <div className="space-y-3">
                          {cypAnalysis.criticalNotes.map((note, noteIdx) => {
                            const isDanger = note.type === 'danger';
                            return (
                              <div 
                                key={noteIdx} 
                                className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed font-sans ${
                                  isDanger 
                                    ? 'bg-rose-500/5 border-rose-500/20 text-rose-200/90' 
                                    : 'bg-orange-500/5 border-orange-500/20 text-orange-200/90'
                                }`}
                              >
                                <span className="shrink-0 mt-0.5">⚠️</span>
                                <p>{note.text}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Disclaimer de rodapé */}
                    <div className="pt-6 border-t border-zinc-900 text-center text-[10px] text-zinc-600 font-mono flex items-center justify-between">
                      <span>* Base farmacológica baseada em compêndios bibliográficos validados.</span>
                      <span>rascunho de engenharia</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
