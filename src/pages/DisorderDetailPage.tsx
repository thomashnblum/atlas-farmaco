import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Disorder, DisorderTreatment } from '../data/schema';
import { Brain, ArrowLeft, Activity, Info, Pill } from 'lucide-react';
import { DISORDER_CLINICAL_PROFILES } from '../data/clinicalKnowledge';

export const DisorderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [disorder, setDisorder] = useState<Disorder | null>(null);
  const [treatments, setTreatments] = useState<DisorderTreatment[]>([]);

  useEffect(() => {
    if (id) {
      const found = dataService.getDisorderById(id);
      if (found) {
        setDisorder(found);
        setTreatments(dataService.getTreatmentsForDisorder(id));
      }
    }
  }, [id]);

  if (!disorder) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-zinc-500">
        <Brain className="w-16 h-16 mb-4 opacity-20" />
        <p>Transtorno não encontrado.</p>
        <button onClick={() => navigate('/disorders')} className="mt-4 text-amber-400 hover:underline">Voltar ao Catálogo</button>
      </div>
    );
  }

  // Agrupa os tratamentos por Linha
  const treatmentsByLine = treatments.reduce((acc, treatment) => {
    if (!acc[treatment.line]) {
      acc[treatment.line] = [];
    }
    acc[treatment.line].push(treatment);
    return acc;
  }, {} as Record<string, DisorderTreatment[]>);

  // Ordem de apresentação das linhas
  const lineOrder = ['1ª Linha', '2ª Linha', '3ª Linha', 'Adjuvante', 'Refratária', 'Off-label'];

  const profile = disorder ? DISORDER_CLINICAL_PROFILES[disorder.id] : null;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in pb-24">
      <button 
        onClick={() => navigate('/disorders')}
        className="flex items-center gap-2 text-zinc-400 hover:text-amber-400 font-bold uppercase tracking-widest text-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo de Transtornos
      </button>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center border border-amber-400/20 shadow-lg">
              <Brain className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-zinc-100 tracking-tight">{disorder.name}</h1>
              <div className="flex gap-2 mt-2">
                {disorder.cid10 && <span className="bg-zinc-950 text-zinc-400 text-xs px-2 py-1 rounded font-mono border border-zinc-800">CID-10: {disorder.cid10}</span>}
                {disorder.dsm5 && <span className="bg-zinc-950 text-zinc-400 text-xs px-2 py-1 rounded font-mono border border-zinc-800">DSM-5: {disorder.dsm5}</span>}
              </div>
            </div>
          </div>

            <div className="bg-zinc-950/50 rounded-2xl p-6 border border-zinc-800/50 text-zinc-300 leading-relaxed text-sm">
              {disorder.description}
            </div>
          </div>
        </div>

        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.epidemiology && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" /> Epidemiologia
                </h3>
                <p className="text-sm text-zinc-300">{profile.epidemiology}</p>
              </div>
            )}
            {profile.prognosis && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" /> Prognóstico
                </h3>
                <p className="text-sm text-zinc-300">{profile.prognosis}</p>
              </div>
            )}
            {profile.neurobiology && profile.neurobiology.length > 0 && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 md:col-span-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-amber-400" /> Neurobiologia & Circuitos
                </h3>
                <ul className="space-y-2">
                  {profile.neurobiology.map((item, idx) => (
                    <li key={idx} className="text-sm text-zinc-300 flex items-start gap-2">
                      <span className="text-amber-500/50 mt-1">■</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {profile.clinicalMarkers && profile.clinicalMarkers.length > 0 && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 md:col-span-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-rose-400" /> Marcadores Clínicos / Chaves Diagnósticas
                </h3>
                <ul className="space-y-2">
                  {profile.clinicalMarkers.map((item, idx) => (
                    <li key={idx} className="text-sm text-zinc-300 flex items-start gap-2">
                      <span className="text-rose-500/50 mt-1">■</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-4">
          <Activity className="w-5 h-5 text-amber-400" />
          Diretrizes Psicofarmacológicas
        </h2>

        {treatments.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
            Nenhuma molécula cadastrada especificamente para este transtorno no banco de dados ainda.
          </div>
        ) : (
          <div className="space-y-8">
            {lineOrder.map(line => {
              const items = treatmentsByLine[line];
              if (!items || items.length === 0) return null;

              // Estilização condicional baseada na linha
              let badgeColor = "bg-zinc-800 text-zinc-300 border-zinc-700";
              if (line === '1ª Linha') badgeColor = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
              if (line === '2ª Linha') badgeColor = "bg-amber-500/20 text-amber-400 border-amber-500/30";
              if (line === 'Off-label' || line === 'Refratária') badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20";

              return (
                <div key={line} className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full border text-[10px] ${badgeColor}`}>
                      {line}
                    </span>
                    <span className="flex-1 h-px bg-zinc-800"></span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items.map(t => {
                      const molecule = dataService.getMoleculeById(t.moleculeId);
                      if (!molecule) return null;

                      return (
                        <div 
                          key={t.id} 
                          onClick={() => navigate('/molecules', { state: { selectedId: molecule.id } })}
                          className="bg-zinc-900 border border-zinc-800 hover:border-amber-400/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-zinc-800/80 group"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-amber-400/20 transition-colors">
                              <Pill className="w-4 h-4 text-zinc-400 group-hover:text-amber-400" />
                            </div>
                            <div>
                              <h4 className="font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">{molecule.name}</h4>
                              <p className="text-xs text-zinc-500 truncate w-40 md:w-48">{molecule.class}</p>
                            </div>
                          </div>
                          {t.notes && (
                            <div className="mt-3 bg-zinc-950 rounded border border-zinc-800/50 p-2 text-xs text-zinc-400 flex gap-2 items-start">
                              <Info className="w-3.5 h-3.5 text-amber-400/70 shrink-0 mt-0.5" />
                              <span>{t.notes}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
