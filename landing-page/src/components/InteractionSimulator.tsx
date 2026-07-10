import React, { useState, useMemo } from 'react';
import { MOLECULES, calculateInteractions } from '../data/pharmacology';
import { Molecule, InteractionAlert } from '../types';
import { ShieldAlert, Info, Layers, RefreshCw, Activity, ArrowRight, CheckCircle2, FlaskConical, Search } from 'lucide-react';

export default function InteractionSimulator() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['fluoxetina', 'amitriptilina']);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'receptor' | 'cyp' | 'alerts'>('alerts');

  // Computed values
  const selectedMolecules = useMemo(() => {
    return MOLECULES.filter(m => selectedIds.includes(m.id));
  }, [selectedIds]);

  const results = useMemo(() => {
    return calculateInteractions(selectedMolecules);
  }, [selectedMolecules]);

  // Handle toggle selection
  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) { // keep at least 1 selected
        setSelectedIds(selectedIds.filter(x => x !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        // Swap first element or alert user max 3
        setSelectedIds([...selectedIds.slice(1), id]);
      }
    }
  };

  const filteredMolecules = useMemo(() => {
    if (!searchQuery) return MOLECULES;
    return MOLECULES.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.class.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Preset clinical case studies
  const applyCaseStudy = (caseId: 'perigoso' | 'duplicado' | 'dual') => {
    if (caseId === 'perigoso') {
      setSelectedIds(['fluoxetina', 'amitriptilina']);
      setActiveTab('alerts');
    } else if (caseId === 'duplicado') {
      setSelectedIds(['sertralina', 'escitalopram']);
      setActiveTab('alerts');
    } else if (caseId === 'dual') {
      setSelectedIds(['venlafaxina', 'bupropiona']);
      setActiveTab('receptor');
    }
  };

  const severityColors = {
    high: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', label: 'Risco Crítico' },
    moderate: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', label: 'Monitoramento Moderado' },
    low: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', label: 'Somatório Leve / Observar' },
    info: { bg: 'bg-zinc-500/10', border: 'border-zinc-500/30', text: 'text-zinc-400', label: 'Nota Informativa' }
  };

  return (
    <div id="simulador-interativo" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Simulation Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 mb-2 font-mono">
            <FlaskConical size={12} />
            CONCEITO DEMONSTRATIVO BÁSICO
          </div>
          <h3 className="text-xl md:text-2xl font-bold font-display text-white">Simulador de Combinações Sinápticas</h3>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">Selecione de 2 a 3 fármacos para visualizar possíveis incompatibilidades cinéticas hepáticas e sobreposição neuro-receptorial.</p>
        </div>
        
        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2">
          <button 
            id="preset-danger"
            onClick={() => applyCaseStudy('perigoso')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all border ${
              selectedIds.includes('fluoxetina') && selectedIds.includes('amitriptilina') && selectedIds.length === 2
                ? 'bg-rose-950/80 border-rose-500/40 text-rose-300' 
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/40'
            }`}
          >
            Conflito CYP2D6 (Grave)
          </button>
          <button 
            id="preset-duplicate"
            onClick={() => applyCaseStudy('duplicado')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all border ${
              selectedIds.includes('sertralina') && selectedIds.includes('escitalopram') && selectedIds.length === 2
                ? 'bg-amber-950/80 border-amber-500/40 text-amber-300' 
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/40'
            }`}
          >
            Duplicidade de Classe
          </button>
          <button 
            id="preset-dual"
            onClick={() => applyCaseStudy('dual')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all border ${
              selectedIds.includes('venlafaxina') && selectedIds.includes('bupropiona') && selectedIds.length === 2
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' 
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/40'
            }`}
          >
            Sinergia Dual Dopamina
          </button>
        </div>
      </div>

      {/* Simulator Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column (Selector panel) */}
        <div className="lg:col-span-4 border-r border-zinc-800 bg-zinc-900/35 p-5 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-zinc-500" size={14} />
            <input 
              id="search-molecules"
              type="text"
              placeholder="Buscar molécula ou grupo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs py-2 pl-9 pr-4 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          <div className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">MOLÉCULAS NA BASE ({filteredMolecules.length})</div>
          
          <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
            {filteredMolecules.map((m) => {
              const isSelected = selectedIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  id={`molecule-btn-${m.id}`}
                  onClick={() => toggleSelection(m.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1 ${
                    isSelected 
                      ? 'bg-amber-950/15 border-amber-500/30 text-white' 
                      : 'bg-zinc-900/30 border-zinc-800/60 text-zinc-400 hover:bg-zinc-900/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-display font-semibold text-sm">{m.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">
                      {m.classAbbr}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 line-clamp-1">{m.class}</span>
                  {isSelected && (
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] text-amber-400 font-medium animate-pulse">
                      <CheckCircle2 size={10} />
                      Simulação Ativada
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-3 border-t border-zinc-800/60">
            <div className="text-[10px] text-zinc-500 flex items-center justify-between">
              <span>Fármacos em cruzamento:</span>
              <span className="font-mono text-white text-xs px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                {selectedIds.length} de 3
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1.5">No sistema final, consulte mais de 160 fármacos psicotrópicos indexados simultaneamente.</p>
          </div>
        </div>

        {/* Center / Right Column (Visualizers) */}
        <div className="lg:col-span-8 flex flex-col bg-zinc-900/10">
          
          {/* Internal Navigation Tabs inside simulator */}
          <div className="flex border-b border-zinc-800 bg-zinc-950/40 text-xs">
            <button
              id="tab-alerts"
              onClick={() => setActiveTab('alerts')}
              className={`flex-1 py-3 text-center border-b-2 font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'alerts' 
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5' 
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <ShieldAlert size={14} />
              Alertas Clínicos e Conflitos ({results.alerts.length})
            </button>
            <button
              id="tab-receptor"
              onClick={() => setActiveTab('receptor')}
              className={`flex-1 py-3 text-center border-b-2 font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'receptor' 
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5' 
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <Layers size={14} />
              Eixo Neuro-Receptorial
            </button>
            <button
              id="tab-cyp"
              onClick={() => setActiveTab('cyp')}
              className={`flex-1 py-3 text-center border-b-2 font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'cyp' 
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5' 
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <Activity size={14} />
              Citocromo CYP450
            </button>
          </div>

          <div className="p-5 md:p-6 flex-1 min-h-[350px]">
            
            {/* ALERT TAB */}
            {activeTab === 'alerts' && (
              <div className="flex flex-col gap-4">
                {results.alerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-zinc-950/20 rounded-xl border border-dashed border-zinc-800">
                    <CheckCircle2 className="text-emerald-500 mb-3" size={28} />
                    <h4 className="font-semibold text-white text-sm">Sem alertas críticos conhecidos</h4>
                    <p className="text-xs text-zinc-500 max-w-sm mt-1">
                      A associação das moléculas selecionadas ({selectedMolecules.map(m => m.name).join(', ')}) não apresenta graves interações ou duplicidades diretas nesta base demonstrativa simples.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-xs text-zinc-500 font-mono flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      INTERAÇÕES MAPEADAS PELA REDE NEUROQUÍMICA
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {results.alerts.map((alert, i) => {
                        const style = severityColors[alert.severity] || severityColors.info;
                        return (
                          <div 
                            key={i} 
                            className={`p-4 rounded-xl border ${style.bg} ${style.border} flex flex-col gap-2`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-sm text-white flex items-center gap-2">
                                <ShieldAlert size={15} className={style.text} />
                                {alert.title}
                              </span>
                              <span className={`text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded border border-white/5 ${style.text}`}>
                                {style.label}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed">{alert.description}</p>
                            <div className="mt-2 text-[11px] text-zinc-400 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/50">
                              <span className="text-[10px] font-mono uppercase text-amber-400 block mb-1">Mecanismo de Ação Farmacocinético</span>
                              {alert.mechanism}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Individual Molecule Quick Cautions */}
                <div className="mt-4 pt-4 border-t border-zinc-800/60">
                  <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block mb-3">Recomendações Clínicas Individuais</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedMolecules.map(m => (
                      <div key={m.id} className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-xl space-y-1.5">
                        <span className="text-xs font-semibold text-white block">{m.name} <span className="text-[10px] text-zinc-500 font-normal">({m.halfLife})</span></span>
                        <ul className="space-y-1">
                          {m.cautionPoints.slice(0, 2).map((pt, j) => (
                            <li key={j} className="text-[10.5px] text-zinc-400 leading-snug flex gap-1.5">
                              <span className="text-amber-500 shrink-0">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* RECEPTOR TAB */}
            {activeTab === 'receptor' && (
              <div className="space-y-4">
                <div className="text-xs text-zinc-500 font-mono flex items-center justify-between">
                  <span>SOBREPOSIÇÃO E SOMA DE AFINIDADE EM RECEPTORES</span>
                  <span className="text-zinc-600">(Constante Alostérica Ki Virtual)</span>
                </div>

                {/* Overlap Map */}
                <div className="space-y-3">
                  {results.receptorOverlap.map((rec) => {
                    let color = 'bg-zinc-700';
                    let text = 'text-zinc-400';
                    if (rec.maxIntensity === 'critical') { color = 'bg-red-500'; text = 'text-red-400'; }
                    else if (rec.maxIntensity === 'high') { color = 'bg-amber-500'; text = 'text-amber-400'; }
                    else if (rec.maxIntensity === 'moderate') { color = 'bg-amber-400'; text = 'text-amber-400'; }
                    
                    return (
                      <div key={rec.name} className="p-3 bg-zinc-950/40 border border-zinc-800/60 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-white">
                              {rec.name}
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              Ocupado por <strong className="text-zinc-300">{rec.count}</strong> fármaco{rec.count > 1 ? 's' : ''}
                            </span>
                          </div>
                          <span className={`text-[10px] font-mono text-right font-semibold ${text}`}>
                            {rec.maxIntensity === 'critical' ? 'Saturação Crítica' : rec.maxIntensity === 'high' ? 'Bloqueio Alto' : 'Ligação Lenta'}
                          </span>
                        </div>
                        
                        {/* Custom Bar Meter */}
                        <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800">
                          <div 
                            className={`h-full rounded-full ${color} transition-all duration-500`}
                            style={{ width: `${rec.scale}%` }}
                          ></div>
                        </div>

                        {/* Explain Overlap */}
                        <div className="flex flex-wrap gap-1 items-center mt-1 text-[9px] text-zinc-500">
                          <span>Afinidades somadas:</span>
                          {selectedMolecules.map(m => {
                            const match = m.receptors.find(r => r.receptor === rec.name && r.intensity !== 'none');
                            if (!match) return null;
                            return (
                              <span key={m.id} className="bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 text-[9.5px]">
                                {m.name}: <strong style={{ color: match.valueHex }}>{match.intensity}</strong>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom scientific visual breakdown legend */}
                <div className="bg-zinc-950/60 p-4 border border-zinc-800 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono font-bold text-amber-500 block uppercase">COGNICÇÃO FARMACEUTICA HISTÓRICA</span>
                  <p className="text-[10.5px] text-zinc-400 leading-relaxed">
                    Em farmacologia clínica avançada, a somatória de afinidades (por exemplo, bloqueio histaminérgico <strong className="text-white">H1</strong> cumulativo por Amitriptilina + Quetiapina) explica a hipersolubilidade de efeitos e sintomas colaterais agudos antes mesmo do acúmulo sérico hepático.
                  </p>
                </div>
              </div>
            )}

            {/* CYP450 TAB */}
            {activeTab === 'cyp' && (
              <div className="space-y-4">
                <div className="text-xs text-zinc-500 font-mono flex items-center justify-between">
                  <span>MAPEAMENTO DE DEGRADAÇÃO HEPÁTICA (CYP450)</span>
                  <span className="text-rose-400 font-mono text-[10px] animate-pulse">Conflito Metabólico Ativo</span>
                </div>

                {/* CYP enzyme status grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(['CYP2D6', 'CYP3A4', 'CYP1A2', 'CYP2C19'] as const).map((enzyme) => {
                    // Check which molecules are substrates or inhibitors for this enzyme
                    const interactingMols = selectedMolecules.map(m => {
                      const relation = m.cyp450.find(c => c.enzyme === enzyme);
                      return relation ? { name: m.name, ...relation } : null;
                    }).filter(Boolean);

                    const isInhibited = interactingMols.some(m => m?.role === 'inhibitor');
                    const hasSubstrate = interactingMols.some(m => m?.role === 'substrate');
                    const isConcomitantConflict = isInhibited && hasSubstrate;

                    return (
                      <div 
                        key={enzyme} 
                        className={`p-3.5 rounded-xl border ${
                          isConcomitantConflict 
                            ? 'bg-rose-950/20 border-rose-500/30' 
                            : isInhibited 
                              ? 'bg-amber-950/10 border-amber-900/35'
                              : 'bg-zinc-950/40 border-zinc-800/80'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm font-bold text-white">{enzyme}</span>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                            isConcomitantConflict 
                              ? 'bg-rose-500/10 border-rose-400/20 text-rose-400' 
                              : isInhibited 
                                ? 'bg-amber-500/10 border-amber-400/20 text-amber-400'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                          }`}>
                            {isConcomitantConflict ? '⚠️ CONFLITO DE VIA' : isInhibited ? 'Bloqueada por inibidor' : 'Via Desimpedida'}
                          </span>
                        </div>

                        {interactingMols.length === 0 ? (
                          <p className="text-[10px] text-zinc-500 italic">Nenhum fármaco ativo selecionado utiliza esta via nesta demo.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {interactingMols.map((mol, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <span className="text-zinc-300 font-medium">{mol?.name}</span>
                                <span className={`text-[10px] font-mono uppercase ${
                                  mol?.role === 'inhibitor' 
                                    ? 'text-red-400' 
                                    : 'text-amber-400'
                                }`}>
                                  {mol?.role === 'inhibitor' ? `Inibidor (${mol.strength})` : 'Substrato'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Warnings parsed from calculations */}
                {results.metabolicWarnings.length > 0 && (
                  <div className="space-y-2 mt-4 pt-4 border-t border-zinc-800">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Notas Críticas de Depuração Hepática</span>
                    <div className="space-y-1.5">
                      {results.metabolicWarnings.map((warn, index) => (
                        <p key={index} className="text-[11px] text-rose-300/90 leading-relaxed bg-rose-950/20 p-2 rounded-lg border border-rose-900/30">
                          {warn}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-[10px] text-zinc-500 leading-snug mt-2">
                  *A inibição extrema do CYP2D6 por Fluoxetina ou Bupropiona altera a biodisponibilidade de betabloqueadores, opiáceos e grande parte dos antidepressivos tricíclicos circulantes.
                </p>
              </div>
            )}

          </div>

          {/* Simulator Footer - Visual confirmation of premium value */}
          <div className="border-t border-zinc-800/80 bg-zinc-950/60 p-4 font-mono text-[10px] md:text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <span className="flex items-center gap-1.5">
              <Info size={12} className="text-amber-400" />
              <span>Base farmacológica baseada em compêndios bibliográficos validados.</span>
            </span>
            <span className="text-zinc-500">Atlas Fármaco v1.0.4 rascunho de engenharia</span>
          </div>

        </div>

      </div>
    </div>
  );
}
