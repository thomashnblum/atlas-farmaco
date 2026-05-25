import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { useInteractionSimulator } from '../hooks/useInteractionSimulator';
import { AlertCircle, Plus, X, Activity, Sparkles } from 'lucide-react';
import { InteractionAlertCard } from '../components/InteractionNavigator/InteractionAlertCard';
import { aiService, AIInsight } from '../services/aiService';

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
  
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const molecules = dataService.getMolecules();
  const alerts = useInteractionSimulator(selectedIds);

  useEffect(() => {
    localStorage.setItem('atlas_simulator_ids', JSON.stringify(selectedIds));
    
    // Generate AI Insight
    const generateInsight = async () => {
      const selectedMolecules = selectedIds.map(id => dataService.getMoleculeById(id)).filter(Boolean) as any[];
      if (selectedMolecules.length >= 2) {
        setLoadingInsight(true);
        try {
          const pd = selectedMolecules.flatMap(m => dataService.getPharmacodynamics(m.id));
          const pk = selectedMolecules.flatMap(m => dataService.getPharmacokinetics(m.id));
          const newInsight = await aiService.generateClinicalInsights(selectedMolecules, pd, pk);
          setInsight(newInsight);
        } catch (error) {
          console.error("Erro ao gerar insight:", error);
          setInsight(null);
        } finally {
          setLoadingInsight(false);
        }
      } else {
        setInsight(null);
      }
    };
    generateInsight();
  }, [selectedIds]);

  const addMolecule = (id: string) => {
    if (id && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeMolecule = (id: string) => {
    setSelectedIds(selectedIds.filter(selId => selId !== id));
  };

  const dangerCount = alerts.filter(a => a.type === 'danger').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;
  const infoCount = alerts.filter(a => a.type === 'info').length;

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight uppercase mb-2">Painel de Simulação de Interações</h1>
        <p className="text-zinc-500 text-sm">Analise conflitos de farmacocinética metabólica (CYP450) e detecte interações sinérgicas ou antagônicas em receptores (farmacodinâmica) em tempo real.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        <div className="lg:col-span-1 border border-zinc-800 bg-zinc-900/40 p-5 rounded-xl flex flex-col h-fit">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 font-mono">Seleção de Painel</h2>
          
          <div className="mb-6">
            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Adicionar Molécula</label>
            <div className="flex gap-2">
              <select 
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-sm py-2 px-3 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 font-mono"
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
          </div>

          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 font-mono">Moléculas Ativas ({selectedIds.length})</h3>
            {selectedIds.length === 0 ? (
              <p className="text-xs text-zinc-500 italic font-mono">Status: Aguardando input...</p>
            ) : (
              selectedIds.map(id => {
                const mol = dataService.getMoleculeById(id);
                return mol ? (
                  <div key={id} className="p-3 bg-amber-400/10 border border-amber-400/30 rounded-lg flex justify-between items-center group transition-colors hover:border-amber-400/60">
                    <span className="text-amber-300 font-bold text-sm tracking-wide">{mol.name}</span>
                    <button onClick={() => removeMolecule(id)} className="text-amber-400/50 hover:text-amber-300 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : null;
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col">
          <div className="flex-1 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:24px_24px] bg-zinc-900 border border-zinc-800 rounded-xl p-6 min-h-[400px] relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <h2 className="text-sm font-bold tracking-widest text-zinc-100 uppercase">
                  Console de Simulação Ativa
                </h2>
              </div>
              
              {alerts.length > 0 && (
                <div className="flex items-center gap-2">
                  {dangerCount > 0 && <span className="px-2 py-0.5 rounded border border-rose-500/30 bg-rose-500/10 text-[10px] font-bold font-mono text-rose-400">{dangerCount} DANGER</span>}
                  {warningCount > 0 && <span className="px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-[10px] font-bold font-mono text-amber-400">{warningCount} WARNING</span>}
                  {infoCount > 0 && <span className="px-2 py-0.5 rounded border border-amber-400/30 bg-amber-400/10 text-[10px] font-bold font-mono text-amber-300">{infoCount} INFO</span>}
                </div>
              )}
            </div>

            {selectedIds.length < 2 ? (
              <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px] text-zinc-600 font-mono">
                <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center mb-4 bg-zinc-900/50">
                  <Activity className="w-6 h-6 text-zinc-500" />
                </div>
                <p className="text-sm tracking-wider">Aguardando combinatória de pelo menos 2 vetores moleculares.</p>
              </div>
            ) : alerts.length === 0 ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg p-5 flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] mt-2 shrink-0"></div>
                <div>
                  <h4 className="font-bold tracking-wider text-sm mb-1 uppercase">Sistema Estável: Sem interações maiores</h4>
                  <p className="text-xs mt-1 text-emerald-400/80 leading-relaxed font-mono">
                    Com base nos dados disponíveis das vias enzimáticas maiores (CYP2D6, CYP3A4), não foram detectados perfis inibitórios concorrentes fortes entre as moléculas selecionadas neste simulador.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 relative z-10 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                {alerts.map((alert, idx) => (
                  <InteractionAlertCard key={idx} alert={alert} />
                ))}
                
                {loadingInsight ? (
                  <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center gap-3 animate-pulse">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">Sintetizando Insight Clínico AI...</span>
                  </div>
                ) : insight && (
                  <div className={`p-5 rounded-xl border flex gap-4 ${
                    insight.severity === 'danger' ? 'bg-rose-500/10 border-rose-500/30' :
                    insight.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                    'bg-indigo-500/10 border-indigo-500/30'
                  }`}>
                    <div className="shrink-0 mt-0.5">
                      <Sparkles className={`w-5 h-5 ${
                        insight.severity === 'danger' ? 'text-rose-400' :
                        insight.severity === 'warning' ? 'text-amber-400' :
                        'text-indigo-400'
                      }`} />
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                        insight.severity === 'danger' ? 'text-rose-400' :
                        insight.severity === 'warning' ? 'text-amber-400' :
                        'text-indigo-400'
                      }`}>{insight.title}</h4>
                      <p className="text-[13px] text-zinc-500 leading-relaxed font-sans">{insight.description}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
