import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { MoleculeCard } from '../components/Molecules/MoleculeCard';
import { Molecule, MoleculeReceptorInteraction, MoleculeEnzymeInteraction } from '../data/schema';
import { ArrowLeft, Database, ShieldAlert, Clock, Pill, Activity, FlaskConical, Droplets, Zap } from 'lucide-react';
import { ProfileSymbolBadge } from '../components/UI/ProfileSymbolBadge';
import { MoleculeStructureViewer } from '../components/Molecules/MoleculeStructureViewer';
import { RichText } from '../components/UI/RichText';

export const MoleculeIndexPage = () => {
  const [axisFilter, setAxisFilter] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const allMolecules = dataService.getMolecules();

  const selectedMolecule = useMemo(() => {
    const id = searchParams.get('id');
    return id ? allMolecules.find(m => m.id === id) || null : null;
  }, [searchParams, allMolecules]);

  const setSelectedMolecule = (mol: Molecule | null) => {
    if (mol) {
      setSearchParams({ id: mol.id });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    if (location.state && (location.state.selectedId || location.state.selectedMoleculeId)) {
      const searchId = location.state.selectedId || location.state.selectedMoleculeId;
      navigate(location.pathname + '?id=' + searchId, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const molecules = (axisFilter 
    ? allMolecules.filter(m => m.clinicalAxes.includes(axisFilter as any))
    : allMolecules).sort((a, b) => a.name.localeCompare(b.name));

  if (selectedMolecule) {
    const pd = dataService.getPharmacodynamics(selectedMolecule.id);
    const pk = dataService.getPharmacokinetics(selectedMolecule.id);

    return (
      <div className="p-6 md:p-8">
        <button 
          onClick={() => setSelectedMolecule(null)}
          className="flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 mb-6 transition uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo
        </button>

        <div className="bg-zinc-900 rounded-2xl p-6 md:p-8 border border-zinc-800 shadow-2xl relative">
          <div className="mb-8 border-b border-zinc-800 pb-6 flex justify-between items-start flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-extrabold text-zinc-100">{selectedMolecule.name}</h1>
                {selectedMolecule.profileSymbols && selectedMolecule.profileSymbols.length > 0 && (
                  <div className="flex gap-1.5">
                    {selectedMolecule.profileSymbols.map((sym) => (
                      <ProfileSymbolBadge key={sym} symbolKey={sym} size="md" tooltipPosition="bottom" />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-zinc-500 mt-1 font-mono text-sm lowercase">Comercial: {selectedMolecule.tradeNames.join(', ')}</p>
            </div>
            <span className="inline-flex items-center rounded bg-amber-400 px-2 py-1 text-[10px] font-bold text-zinc-950 uppercase tracking-widest">
              {selectedMolecule.class}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="col-span-1 space-y-8">
              <section>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 font-mono">Mecanismo de Ação</h3>
                <p className="text-zinc-500 leading-relaxed text-sm"><RichText text={selectedMolecule.mechanisms} /></p>
              </section>

              <section>
                <h3 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3 font-mono flex items-center gap-2">
                  <Database className="w-4 h-4" /> Indicações Clínicas Principais (Bula)
                </h3>
                <p className="text-[10px] text-zinc-500 italic mb-4">Uso oficial aprovado e indicado no tratamento de primeira escolha ou adjuvante.</p>
                {selectedMolecule.onLabelUses && selectedMolecule.onLabelUses.length > 0 ? (
                  <div className="space-y-3">
                    {selectedMolecule.onLabelUses.map((use, i) => (
                      <div key={i} className="bg-teal-500/5 border border-teal-500/20 p-3.5 rounded-xl transition-all hover:bg-teal-500/10">
                        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                          <span className="font-bold text-sm text-zinc-100"><RichText text={use.condition} /></span>
                          <div className="flex gap-1.5 flex-wrap">
                            <span className="text-[9px] uppercase font-mono font-extrabold px-1.5 py-0.5 rounded border bg-teal-500/10 text-teal-400 border-teal-500/30">
                              {use.line}
                            </span>
                            <span className={`text-[9px] uppercase font-mono font-extrabold px-1.5 py-0.5 rounded border ${
                              use.evidence === 'Padrão-Ouro' ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 animate-pulse' :
                              use.evidence === 'Robusto' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                              use.evidence === 'Moderado' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                              'bg-zinc-500/10 text-zinc-500 border-zinc-500/30'
                            }`}>
                              {use.evidence === 'Padrão-Ouro' && '🏆 '} {use.evidence}
                            </span>
                          </div>
                        </div>
                        <p className="text-[12px] text-zinc-400 leading-relaxed font-sans"><RichText text={use.justification} /></p>
                        {use.notes && <p className="text-[11px] text-zinc-500 italic mt-2 border-t border-zinc-800 pt-2"><RichText text={use.notes} /></p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 leading-relaxed text-sm"><RichText text={selectedMolecule.psychiatryUse || 'Informação primária não listada.'} /></p>
                )}
              </section>

              {selectedMolecule.offLabelUses && selectedMolecule.offLabelUses.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3 font-mono flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> Usos Off-Label (Não-Bula)
                  </h3>
                  <p className="text-[10px] text-zinc-500 italic mb-4">Os usos listados abaixo não constam na bula oficial e devem ser avaliados por um profissional de saúde qualificado.</p>
                  <div className="space-y-3">
                    {selectedMolecule.offLabelUses.map((use, i) => (
                      <div key={i} className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-sm text-zinc-100"><RichText text={use.condition} /></span>
                          <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${
                            use.evidence === 'Alto' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                            use.evidence === 'Moderado' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                            'bg-zinc-500/10 text-zinc-500 border-zinc-500/30'
                          }`}>
                            Nível: {use.evidence}
                          </span>
                        </div>
                        <p className="text-[12px] text-zinc-500 leading-relaxed"><RichText text={use.justification} /></p>
                        {use.notes && <p className="text-[11px] text-zinc-600 italic mt-2 border-t border-zinc-800 pt-2"><RichText text={use.notes} /></p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>

            <div className="col-span-1 lg:col-span-2 space-y-10">
              <section>
                <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <h3 className="font-bold tracking-widest text-zinc-100 uppercase text-sm">
                    Alvos Farmacodinâmicos (Receptores)
                  </h3>
                </div>
                {pd.length > 0 ? (
                  <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50">
                    <table className="min-w-full divide-y divide-zinc-800 text-left text-sm">
                      <thead className="bg-zinc-800/80">
                        <tr>
                          <th className="px-4 py-3 font-mono text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Receptor</th>
                          <th className="px-4 py-3 font-mono text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Tipo de Ação</th>
                          <th className="px-4 py-3 font-mono text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Afinidade (Ki)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {pd.map(interaction => {
                          const receptor = dataService.getReceptorById(interaction.receptorId);
                          return (
                            <tr key={interaction.receptorId} className="hover:bg-zinc-800/30 transition-colors">
                              <td className="px-4 py-3 font-medium text-zinc-500">{receptor?.name}</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex rounded text-[10px] bg-zinc-800 border border-zinc-700 px-2 py-0.5 font-bold uppercase tracking-wider text-zinc-500">
                                  {interaction.actionType}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-[11px] font-mono font-bold text-amber-300">
                                {interaction.affinityKi != null ? `${interaction.affinityKi} nM` : <span className="text-zinc-500 font-mono">N/D</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-zinc-500 text-sm italic font-mono">Nenhum dado primário catalogado no momento.</p>
                )}
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <h3 className="font-bold tracking-widest text-zinc-100 uppercase text-sm">
                    Perfil Farmacocinético
                  </h3>
                </div>
                {pk.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pk.map(interaction => {
                      const enzyme = dataService.getEnzymeById(interaction.enzymeId);
                      const isInhibitor = interaction.role.includes('Inibidor');
                      const isInducer = interaction.role.includes('Indutor');
                      
                      let roleClass = "text-zinc-500 bg-zinc-800 border-zinc-700";
                      if (isInhibitor) roleClass = "text-rose-400 bg-rose-500/10 border-rose-500/30";
                      else if (isInducer) roleClass = "text-amber-400 bg-amber-500/10 border-amber-500/30";

                      return (
                        <div key={`${interaction.enzymeId}-${interaction.role}`} className={`border rounded p-3 flex justify-between items-center transition-colors ${roleClass}`}>
                          <span className="text-xs font-mono font-bold">{enzyme?.name}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            {interaction.role}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-sm italic font-mono">Nenhuma via metabólica crítica cadastrada.</p>
                )}
              </section>

              <MoleculeStructureViewer molecule={selectedMolecule} />

              {/* Parâmetros Farmacocinéticos */}
              {(selectedMolecule.halfLife || selectedMolecule.bioavailability || selectedMolecule.onsetOfAction || selectedMolecule.therapeuticDoseRange) && (
                <section className="pt-6 border-t border-zinc-850">
                  <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-4 font-mono flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Parâmetros Farmacocinéticos
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedMolecule.halfLife && (
                      <div className="bg-violet-500/5 border border-violet-500/20 p-3.5 rounded-xl flex items-start gap-3 hover:bg-violet-500/10 transition-all">
                        <Clock className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase font-mono font-bold text-violet-400/70 tracking-widest mb-0.5">Meia-Vida (t½)</p>
                          <p className="text-sm text-zinc-200 font-semibold">{selectedMolecule.halfLife}</p>
                        </div>
                      </div>
                    )}
                    {selectedMolecule.onsetOfAction && (
                      <div className="bg-violet-500/5 border border-violet-500/20 p-3.5 rounded-xl flex items-start gap-3 hover:bg-violet-500/10 transition-all">
                        <Zap className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase font-mono font-bold text-violet-400/70 tracking-widest mb-0.5">Início de Ação</p>
                          <p className="text-sm text-zinc-200 font-semibold">{selectedMolecule.onsetOfAction}</p>
                        </div>
                      </div>
                    )}
                    {selectedMolecule.therapeuticDoseRange && (
                      <div className="bg-violet-500/5 border border-violet-500/20 p-3.5 rounded-xl flex items-start gap-3 hover:bg-violet-500/10 transition-all">
                        <Pill className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase font-mono font-bold text-violet-400/70 tracking-widest mb-0.5">Faixa de Dose Terapêutica</p>
                          <p className="text-sm text-zinc-200 font-semibold">{selectedMolecule.therapeuticDoseRange}</p>
                        </div>
                      </div>
                    )}
                    {selectedMolecule.bioavailability && (
                      <div className="bg-violet-500/5 border border-violet-500/20 p-3.5 rounded-xl flex items-start gap-3 hover:bg-violet-500/10 transition-all">
                        <FlaskConical className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase font-mono font-bold text-violet-400/70 tracking-widest mb-0.5">Biodisponibilidade</p>
                          <p className="text-sm text-zinc-200 font-semibold">{selectedMolecule.bioavailability}</p>
                        </div>
                      </div>
                    )}
                    {selectedMolecule.peakPlasma && (
                      <div className="bg-violet-500/5 border border-violet-500/20 p-3.5 rounded-xl flex items-start gap-3 hover:bg-violet-500/10 transition-all">
                        <Activity className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase font-mono font-bold text-violet-400/70 tracking-widest mb-0.5">Pico Plasmático (Tmax)</p>
                          <p className="text-sm text-zinc-200 font-semibold">{selectedMolecule.peakPlasma}</p>
                        </div>
                      </div>
                    )}
                    {selectedMolecule.proteinBinding && (
                      <div className="bg-violet-500/5 border border-violet-500/20 p-3.5 rounded-xl flex items-start gap-3 hover:bg-violet-500/10 transition-all">
                        <Droplets className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase font-mono font-bold text-violet-400/70 tracking-widest mb-0.5">Ligação Proteica</p>
                          <p className="text-sm text-zinc-200 font-semibold">{selectedMolecule.proteinBinding}</p>
                        </div>
                      </div>
                    )}
                    {selectedMolecule.elimination && (
                      <div className="bg-violet-500/5 border border-violet-500/20 p-3.5 rounded-xl flex items-start gap-3 hover:bg-violet-500/10 transition-all col-span-1 sm:col-span-2">
                        <FlaskConical className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase font-mono font-bold text-violet-400/70 tracking-widest mb-0.5">Eliminação</p>
                          <p className="text-sm text-zinc-200 font-semibold">{selectedMolecule.elimination}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              <section className="pt-6 border-t border-zinc-800">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 font-mono">Notas Clínicas</h3>
                <p className="text-[12px] text-zinc-500 leading-relaxed italic underline decoration-amber-400/30 underline-offset-4 bg-zinc-800/40 border border-zinc-700/50 p-4 rounded-lg">
                  <RichText text={selectedMolecule.notes} />
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-800">
                <section className="space-y-3">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono">Via de Administração</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMolecule.routes && selectedMolecule.routes.length > 0 ? (
                      selectedMolecule.routes.map((route, i) => (
                        <span key={i} className="inline-flex bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1 text-[11px] text-zinc-500 font-mono">
                          {route}
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc-600 text-xs italic font-mono">N/D</span>
                    )}
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xs font-bold text-rose-500/80 uppercase tracking-widest font-mono flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> Contraindicações
                  </h3>
                  {selectedMolecule.contraindications && selectedMolecule.contraindications.length > 0 ? (
                    <ul className="list-disc list-outside ml-4 space-y-1">
                      {selectedMolecule.contraindications.map((contra, i) => (
                        <li key={i} className="text-[12px] text-rose-200/90 leading-relaxed">{contra}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-zinc-600 text-xs italic font-mono">Não constam alertas absolutos específicos nesta base.</p>
                  )}
                </section>
              </div>

              <section className="pt-6 border-t border-zinc-800">
                <h3 className="text-xs font-bold text-amber-500/80 uppercase tracking-widest mb-3 font-mono">Perfil de Tolerabilidade (Efeitos Adversos Comuns)</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMolecule.sideEffects && selectedMolecule.sideEffects.length > 0 ? (
                    selectedMolecule.sideEffects.map((effect, i) => (
                      <span key={i} className="inline-flex bg-amber-900/20 border border-amber-500/30 text-amber-200/80 rounded-full px-3 py-1 text-[11px]">
                        {effect}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-600 text-xs italic font-mono">Perfil não listado.</span>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 uppercase mb-4">Catálogo de Fármacos</h1>
        
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono mr-2">Eixos:</span>
          {['Antidepressivo', 'Antipsicotico', 'Estabilizador', 'Ansiolitico', 'Estimulante'].map(axis => (
            <button 
              key={axis}
              onClick={() => setAxisFilter(axisFilter === axis ? null : axis)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-colors ${
                axisFilter === axis 
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/50' 
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:bg-zinc-700'
              }`}
            >
              {axis}
            </button>
          ))}
          {axisFilter && (
            <button 
              onClick={() => setAxisFilter(null)}
              className="ml-auto text-xs text-amber-300 hover:text-amber-200 transition-colors uppercase font-bold tracking-wider"
            >
              Limpar Filtros
            </button>
          )}
        </div>

        <p className="text-zinc-500 text-sm">Selecione uma molécula para inspecionar parâmetros de Afinidade (Ki), vias metabólicas (PK) e eixos terapêuticos integrados.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
        {molecules.map(mol => (
          <MoleculeCard key={mol.id} molecule={mol} onClick={() => setSelectedMolecule(mol)} />
        ))}
      </div>
    </div>
  );
};
