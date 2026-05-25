import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Network, Search, Filter, Fingerprint, Info, Brain, Zap, Activity, ArrowLeft } from 'lucide-react';
import { dataService } from '../services/dataService';
import { cn } from '../utils/cn';
import { Receptor } from '../data/schema';
import { RECEPTOR_CLINICAL_PROFILES } from '../data/clinicalKnowledge';
import { RichText } from '../components/UI/RichText';

export const ReceptorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const receptors = useMemo(() => dataService.getReceptors(), []);

  const selectedReceptor = useMemo(() => {
    const id = searchParams.get('id');
    return id ? receptors.find(r => r.id === id) || null : null;
  }, [searchParams, receptors]);

  const setSelectedReceptor = (rec: Receptor | null) => {
    if (rec) {
      setSearchParams({ id: rec.id });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    if (location.state && location.state.selectedReceptorId) {
      const searchId = location.state.selectedReceptorId;
      setSearchParams({ id: searchId }, { replace: true });
      navigate(location.pathname + '?id=' + searchId, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname, setSearchParams]);

  const systems = useMemo(() => {
    const sys = new Set(receptors.map(r => r.neurotransmitterSystem));
    return Array.from(sys).sort();
  }, [receptors]);

  const types = useMemo(() => {
    const tps = new Set(receptors.map(r => r.type));
    return Array.from(tps).sort();
  }, [receptors]);

  const filteredReceptors = useMemo(() => {
    return receptors.filter(receptor => {
      const matchesSearch = receptor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          receptor.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSystem = selectedSystem ? receptor.neurotransmitterSystem === selectedSystem : true;
      const matchesType = selectedType ? receptor.type === selectedType : true;
      
      return matchesSearch && matchesSystem && matchesType;
    });
  }, [receptors, searchTerm, selectedSystem, selectedType]);

  const getSystemColor = (system: string) => {
    const colors: Record<string, string> = {
      'Serotoninérgico': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
      'Dopaminérgico': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
      'Noradrenérgico': 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
      'GABAérgico': 'text-rose-400 bg-rose-400/10 border-rose-400/20',
      'Glutamatérgico': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
      'Colinérgico': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
      'Histaminérgico': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
      'Opioide': 'text-fuchsia-400 bg-fuchsia-400/10 border-fuchsia-400/20',
      'Geral': 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20',
    };
    return colors[system] || 'text-teal-400 bg-teal-400/10 border-teal-400/20';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Receptor': return <Brain className="w-4 h-4" />;
      case 'Canal Iônico': return <Zap className="w-4 h-4" />;
      case 'Transportador': return <Activity className="w-4 h-4" />;
      case 'Enzima Alvo': return <Fingerprint className="w-4 h-4" />;
      default: return <Network className="w-4 h-4" />;
    }
  };

  if (selectedReceptor) {
    // Buscar moléculas que interagem com este receptor
    const allPd = dataService.getPharmacodynamics();
    const relatedInteractions = allPd.filter(pd => pd.receptorId === selectedReceptor.id);

    // Agrupar interações
    const antagonists = relatedInteractions.filter(i => i.actionType.toLowerCase().includes('antagonista') || i.actionType.toLowerCase().includes('inibidor'));
    const agonists = relatedInteractions.filter(i => i.actionType.toLowerCase().includes('agonista'));
    const modulators = relatedInteractions.filter(i => !antagonists.includes(i) && !agonists.includes(i));

    // Perfil Clínico
    const clinicalProfile = RECEPTOR_CLINICAL_PROFILES[selectedReceptor.name];

    // Helper para cor do Ki
    const getKiColor = (ki: number | null | undefined) => {
      if (ki == null) return 'text-zinc-500';
      if (ki < 1) return 'text-rose-400 font-bold';
      if (ki < 10) return 'text-amber-400 font-bold';
      if (ki < 100) return 'text-emerald-400';
      return 'text-zinc-400';
    };

    const renderInteractionCard = (interaction: MoleculeReceptorInteraction, index: number, bgColor: string, borderColor: string, iconColor: string) => {
      const molecule = dataService.getMoleculeById(interaction.moleculeId);
      if (!molecule) return null;
      return (
        <Link 
          to={`/molecules?id=${molecule.id}`}
          key={`${interaction.moleculeId}-${index}`} 
          className={cn("p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02]", bgColor, borderColor)}
        >
          <div>
            <h4 className={cn("font-bold text-sm mb-1", iconColor)}>{molecule.name}</h4>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">{interaction.actionType}</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-zinc-500 uppercase tracking-widest font-mono mb-1">Afinidade (Ki)</div>
            <div className={cn("font-mono text-sm", getKiColor(interaction.affinityKi))}>
              {interaction.affinityKi != null ? `${interaction.affinityKi} nM` : 'N/D'}
            </div>
          </div>
        </Link>
      );
    };

    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <button 
          onClick={() => setSelectedReceptor(null)}
          className="flex items-center gap-2 text-sm font-bold text-rose-400 hover:text-rose-300 mb-6 transition uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo de Receptores
        </button>

        <div className="bg-zinc-900 rounded-3xl p-8 md:p-10 border border-zinc-800 shadow-2xl relative mb-8 overflow-hidden">
          <div className={cn("absolute top-0 left-0 w-full h-2", getSystemColor(selectedReceptor.neurotransmitterSystem).split(' ')[1])}></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={cn(
                  "px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border",
                  getSystemColor(selectedReceptor.neurotransmitterSystem)
                )}>
                  {selectedReceptor.neurotransmitterSystem}
                </span>
                <span className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-zinc-700 bg-zinc-800 text-zinc-300 flex items-center gap-1">
                  {getTypeIcon(selectedReceptor.type)} {selectedReceptor.type}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-zinc-100 tracking-tight">{selectedReceptor.name}</h1>
            </div>
            
            <div className="w-full md:w-1/2 bg-zinc-950/50 p-5 rounded-2xl border border-zinc-800/80">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 font-mono">Descrição Biológica</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                <RichText text={selectedReceptor.description} />
              </p>
            </div>
          </div>
        </div>

        {clinicalProfile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {clinicalProfile.blockadeEffects && clinicalProfile.blockadeEffects.length > 0 && (
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6">
                <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Efeitos do Bloqueio (Antagonismo)
                </h3>
                <ul className="space-y-3">
                  {clinicalProfile.blockadeEffects.map((effect, idx) => (
                    <li key={idx} className="text-sm text-zinc-300 leading-relaxed flex items-start gap-2">
                      <span className="text-rose-500/50 mt-1">■</span> <RichText text={effect} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {clinicalProfile.activationEffects && clinicalProfile.activationEffects.length > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Efeitos da Ativação (Agonismo)
                </h3>
                <ul className="space-y-3">
                  {clinicalProfile.activationEffects.map((effect, idx) => (
                    <li key={idx} className="text-sm text-zinc-300 leading-relaxed flex items-start gap-2">
                      <span className="text-emerald-500/50 mt-1">■</span> <RichText text={effect} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {clinicalProfile.clinicalSignificance && (
              <div className="md:col-span-2 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Importância Clínica na Psiquiatria
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed italic">"<RichText text={clinicalProfile.clinicalSignificance} />"</p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-8">
          <h2 className="text-xl font-bold text-zinc-100 border-b border-zinc-800 pb-4">Matriz de Interação Farmacológica</h2>
          
          {antagonists.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4 font-mono">Antagonistas / Bloqueadores / Inibidores</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {antagonists.sort((a, b) => (a.affinityKi || 9999) - (b.affinityKi || 9999)).map((interaction, idx) => 
                  renderInteractionCard(interaction, idx, 'bg-zinc-900', 'border-rose-500/20 hover:border-rose-500/50', 'text-rose-100 group-hover:text-rose-400')
                )}
              </div>
            </section>
          )}

          {agonists.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 font-mono">Agonistas (Totais e Parciais)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {agonists.sort((a, b) => (a.affinityKi || 9999) - (b.affinityKi || 9999)).map((interaction, idx) => 
                  renderInteractionCard(interaction, idx, 'bg-zinc-900', 'border-emerald-500/20 hover:border-emerald-500/50', 'text-emerald-100 group-hover:text-emerald-400')
                )}
              </div>
            </section>
          )}

          {modulators.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-4 font-mono">Moduladores Alostéricos e Outros</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {modulators.sort((a, b) => (a.affinityKi || 9999) - (b.affinityKi || 9999)).map((interaction, idx) => 
                  renderInteractionCard(interaction, idx, 'bg-zinc-900', 'border-amber-500/20 hover:border-amber-500/50', 'text-amber-100 group-hover:text-amber-400')
                )}
              </div>
            </section>
          )}

          {relatedInteractions.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl border-dashed">
              <Info className="w-8 h-8 text-zinc-600 mb-3" />
              <p className="text-zinc-500 text-sm italic font-mono">Nenhum fármaco mapeado interagindo primariamente com este alvo no banco de dados atual.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20">
            <Network className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-100 tracking-tight">Catálogo de Receptores</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Base de dados detalhada de {receptors.length} alvos farmacológicos e transportadores. Clique em um alvo para ver os fármacos associados.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80 backdrop-blur-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar receptor, sistema ou função..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-zinc-100 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-colors"
          />
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
          <div className="flex items-center gap-2 min-w-max">
            <Filter className="w-4 h-4 text-zinc-500" />
            <select
              value={selectedSystem || ''}
              onChange={(e) => setSelectedSystem(e.target.value || null)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-rose-400 transition-colors appearance-none cursor-pointer"
            >
              <option value="">Todos os Sistemas</option>
              {systems.map(sys => (
                <option key={sys} value={sys}>{sys}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 min-w-max">
            <select
              value={selectedType || ''}
              onChange={(e) => setSelectedType(e.target.value || null)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-rose-400 transition-colors appearance-none cursor-pointer"
            >
              <option value="">Todos os Tipos</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredReceptors.length > 0 ? (
        <div className="space-y-12">
          {systems.map(sys => {
            const sysReceptors = filteredReceptors.filter(r => r.neurotransmitterSystem === sys).sort((a, b) => a.name.localeCompare(b.name));
            
            if (sysReceptors.length === 0) return null;

            return (
              <div key={sys} className="space-y-4">
                <h2 className={cn("text-xl font-bold uppercase tracking-widest border-b pb-2 flex items-center gap-3", getSystemColor(sys).split(' ')[0])}>
                  {sys}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sysReceptors.map(receptor => (
                    <button 
                      key={receptor.id}
                      onClick={() => setSelectedReceptor(receptor)}
                      className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-6 hover:border-rose-500/50 hover:bg-zinc-900/80 transition-all group flex flex-col text-left active:scale-95 shadow-lg hover:shadow-rose-900/20"
                    >
                      <div className="flex justify-between items-start mb-4 w-full">
                        <h3 className="text-xl font-bold text-zinc-100 group-hover:text-rose-400 transition-colors">
                          {receptor.name}
                        </h3>
                        <span className={cn(
                          "px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border",
                          getSystemColor(receptor.neurotransmitterSystem)
                        )}>
                          {receptor.type}
                        </span>
                      </div>
                      
                      <p className="text-zinc-400 text-sm leading-relaxed flex-1 w-full">
                        {receptor.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/20 border border-zinc-800/50 rounded-xl border-dashed">
          <Info className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-zinc-300">Nenhum receptor encontrado</h3>
          <p className="text-zinc-500 text-sm mt-1">Tente ajustar seus filtros ou termos de busca.</p>
        </div>
      )}
    </div>
  );
};
