import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Network, Search, Filter, Fingerprint, Info, Brain, Zap, Activity, ArrowLeft } from 'lucide-react';
import { dataService } from '../services/dataService';
import { cn } from '../utils/cn';
import { Receptor } from '../data/schema';

export const ReceptorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedReceptor, setSelectedReceptor] = useState<Receptor | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const receptors = useMemo(() => dataService.getReceptors(), []);

  useEffect(() => {
    if (location.state && location.state.selectedReceptorId) {
      const searchId = location.state.selectedReceptorId;
      const rec = receptors.find(r => r.id === searchId);
      if (rec) {
        setSelectedReceptor(rec);
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, receptors, navigate]);

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

    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <button 
          onClick={() => setSelectedReceptor(null)}
          className="flex items-center gap-2 text-sm font-bold text-rose-400 hover:text-rose-300 mb-6 transition uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo de Receptores
        </button>

        <div className="bg-zinc-900 rounded-2xl p-6 md:p-8 border border-zinc-800 shadow-2xl relative">
          <div className="mb-8 border-b border-zinc-800 pb-6 flex justify-between items-start flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-extrabold text-zinc-100">{selectedReceptor.name}</h1>
                <span className={cn(
                  "px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border",
                  getSystemColor(selectedReceptor.neurotransmitterSystem)
                )}>
                  {selectedReceptor.neurotransmitterSystem}
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 mt-3 font-mono text-sm">
                {getTypeIcon(selectedReceptor.type)}
                <span>{selectedReceptor.type}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="col-span-1 space-y-8">
              <section>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 font-mono">Descrição do Alvo Biológico</h3>
                <p className="text-zinc-300 leading-relaxed text-sm bg-zinc-800/40 border border-zinc-700/50 p-4 rounded-lg">
                  {selectedReceptor.description}
                </p>
              </section>
            </div>

            <div className="col-span-1 lg:col-span-2 space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <h3 className="font-bold tracking-widest text-zinc-100 uppercase text-sm">
                    Fármacos Agonistas / Antagonistas
                  </h3>
                </div>
                
                {relatedInteractions.length > 0 ? (
                  <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50">
                    <table className="min-w-full divide-y divide-zinc-800 text-left text-sm">
                      <thead className="bg-zinc-800/80">
                        <tr>
                          <th className="px-4 py-3 font-mono text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Fármaco (Molécula)</th>
                          <th className="px-4 py-3 font-mono text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Ação no Receptor</th>
                          <th className="px-4 py-3 font-mono text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Afinidade (Ki)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {relatedInteractions.map((interaction, i) => {
                          const molecule = dataService.getMoleculeById(interaction.moleculeId);
                          return (
                            <tr key={`${interaction.moleculeId}-${i}`} className="hover:bg-zinc-800/30 transition-colors">
                              <td className="px-4 py-3 font-bold text-zinc-200">
                                <button 
                                  onClick={() => navigate('/molecules', { state: { selectedMoleculeId: interaction.moleculeId } })}
                                  className="hover:text-amber-400 transition-colors text-left"
                                >
                                  {molecule?.name}
                                </button>
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex rounded text-[10px] bg-zinc-800 border border-zinc-700 px-2 py-0.5 font-bold uppercase tracking-wider text-rose-400/80">
                                  {interaction.actionType}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-[11px] font-mono font-bold text-rose-300">
                                {interaction.affinityKi != null ? `${interaction.affinityKi} nM` : <span className="text-zinc-500 font-mono">N/D</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 bg-zinc-900/20 border border-zinc-800/50 rounded-xl border-dashed">
                    <Info className="w-8 h-8 text-zinc-600 mb-2" />
                    <p className="text-zinc-500 text-sm italic font-mono">Nenhum fármaco mapeado interagindo primariamente com este alvo.</p>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Header Section */}
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

      {/* Filters and Search */}
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

      {/* Grid of Receptors */}
      {filteredReceptors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReceptors.map(receptor => (
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
                  {receptor.neurotransmitterSystem}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-zinc-500 mb-4 bg-zinc-950/50 px-3 py-2 rounded-lg text-sm border border-zinc-900 w-full">
                {getTypeIcon(receptor.type)}
                <span>{receptor.type}</span>
              </div>
              
              <p className="text-zinc-400 text-sm leading-relaxed flex-1 w-full">
                {receptor.description}
              </p>
            </button>
          ))}
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
