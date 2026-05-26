import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { Molecule } from '../data/schema';
import { ProfileSymbolBadge } from '../components/UI/ProfileSymbolBadge';

export const ComparePage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const molecules = dataService.getMolecules();

  const addMolecule = (id: string) => {
    if (id && !selectedIds.includes(id) && selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeMolecule = (id: string) => {
    setSelectedIds(selectedIds.filter(selId => selId !== id));
  };

  const cols = selectedIds.length > 0 ? selectedIds.length : 1;

  return (
    <div className="p-6 md:p-8 flex flex-col h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight uppercase mb-2">Comparativo de Fármacos</h1>
        <p className="text-zinc-500 text-sm">Selecione até 3 moléculas para comparar perfis farmacodinâmicos e farmacocinéticos lado a lado.</p>
      </div>

      <div className="mb-8">
        <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-2">Adicionar Molécula (Máx 3)</label>
        <select 
          className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-lg shadow-sm py-2 px-3 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 font-mono"
          onChange={(e) => addMolecule(e.target.value)}
          value=""
          disabled={selectedIds.length >= 3}
        >
          <option value="" disabled>ESCOLHA UM FÁRMACO...</option>
          {molecules.filter(m => !selectedIds.includes(m.id)).map(m => (
            <option key={m.id} value={m.id}>{m.name.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {selectedIds.length > 0 ? (
        <div className="flex-1 w-full overflow-x-auto min-h-0 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-6 relative">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(300px, 1fr))` }}>
            {selectedIds.map(id => {
              const mol = dataService.getMoleculeById(id);
              if (!mol) return null;
              
              const pk = dataService.getPharmacokinetics(mol.id);
              const pd = dataService.getPharmacodynamics(mol.id);
              
              const enzymes = pk.map(interaction => {
                const enzyme = dataService.getEnzymeById(interaction.enzymeId);
                return { ...interaction, name: enzyme?.name };
              });

              const receptors = pd.map(interaction => {
                 const receptor = dataService.getReceptorById(interaction.receptorId);
                 return { ...interaction, name: receptor?.name };
              });

              return (
                <div key={id} className="relative bg-zinc-950 border border-zinc-800 rounded-lg p-5 flex flex-col min-w-[300px]">
                  <button 
                    onClick={() => removeMolecule(id)}
                    className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-100"
                  >
                    ×
                  </button>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="text-xl font-bold text-zinc-100 uppercase tracking-tight">{mol.name}</h2>
                    {mol.profileSymbols && mol.profileSymbols.length > 0 && (
                      <div className="flex gap-1">
                        {mol.profileSymbols.map((sym) => (
                          <ProfileSymbolBadge key={sym} symbolKey={sym} size="sm" />
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="inline-flex max-w-fit rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest mb-6">
                    {mol.class}
                  </span>

                  <div className="space-y-6">
                    <section>
                      <h4 className="text-[10px] uppercase text-zinc-500 font-mono font-bold mb-2 tracking-widest border-b border-zinc-800 pb-1">Mecanismo</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">{mol.mechanisms}</p>
                    </section>

                    <section>
                      <h4 className="text-[10px] uppercase text-zinc-500 font-mono font-bold mb-2 tracking-widest border-b border-zinc-800 pb-1">Eixos Clínicos</h4>
                      <div className="flex flex-wrap gap-1">
                        {mol.clinicalAxes.map(axis => (
                          <span key={axis} className="bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold">
                            {axis}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h4 className="text-[10px] uppercase text-zinc-500 font-mono font-bold mb-2 tracking-widest border-b border-zinc-800 pb-1">Alvos (Receptores)</h4>
                      {receptors.length > 0 ? (
                        <div className="space-y-1.5 mt-2">
                           {receptors.map((r, i) => (
                             <div key={i} className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-2 rounded">
                               <span className="text-xs font-mono font-bold text-zinc-500">{r.name}</span>
                               <div className="flex flex-col items-end">
                                 <span className="text-[10px] text-amber-300 leading-none">{r.actionType}</span>
                                 <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                                   {r.affinityKi != null ? `${r.affinityKi} nM` : 'N/D'}
                                 </span>
                               </div>
                             </div>
                           ))}
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-600 font-mono italic mt-2">Sem dados catalogados.</p>
                      )}
                    </section>

                    <section>
                      <h4 className="text-[10px] uppercase text-zinc-500 font-mono font-bold mb-2 tracking-widest border-b border-zinc-800 pb-1">Perfil Enzimático</h4>
                      {enzymes.length > 0 ? (
                        <div className="space-y-1.5 mt-2">
                          {enzymes.map((e, i) => {
                             const isInhibitor = e.role.includes('Inibidor');
                             const isInducer = e.role.includes('Indutor');
                             let txtColor = 'text-zinc-500';
                             if (isInhibitor) txtColor = 'text-rose-400';
                             else if (isInducer) txtColor = 'text-amber-400';

                             return (
                               <div key={i} className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-2 rounded">
                                 <span className="text-xs font-mono font-bold text-zinc-500">{e.name}</span>
                                 <span className={`text-[10px] font-bold ${txtColor} uppercase tracking-wider`}>
                                   {e.role}
                                 </span>
                               </div>
                             );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-600 font-mono italic mt-2">Sem atividade CYP catalogada.</p>
                      )}
                    </section>

                    {(mol.halfLife || mol.therapeuticDoseRange || mol.bioavailability) && (
                      <section>
                        <h4 className="text-[10px] uppercase text-violet-400 font-mono font-bold mb-2 tracking-widest border-b border-zinc-800 pb-1">Parâmetros Farmacocinéticos</h4>
                        <div className="space-y-1.5 mt-2">
                          {mol.halfLife && (
                            <div className="flex justify-between items-center bg-violet-500/5 border border-violet-500/20 p-2 rounded">
                              <span className="text-[10px] font-mono font-bold text-violet-400/70 uppercase">Meia-Vida</span>
                              <span className="text-[11px] text-zinc-200 font-semibold text-right max-w-[60%]">{mol.halfLife}</span>
                            </div>
                          )}
                          {mol.onsetOfAction && (
                            <div className="flex justify-between items-center bg-violet-500/5 border border-violet-500/20 p-2 rounded">
                              <span className="text-[10px] font-mono font-bold text-violet-400/70 uppercase">Início de Ação</span>
                              <span className="text-[11px] text-zinc-200 font-semibold text-right max-w-[60%]">{mol.onsetOfAction}</span>
                            </div>
                          )}
                          {mol.therapeuticDoseRange && (
                            <div className="flex justify-between items-center bg-violet-500/5 border border-violet-500/20 p-2 rounded">
                              <span className="text-[10px] font-mono font-bold text-violet-400/70 uppercase">Dose</span>
                              <span className="text-[11px] text-zinc-200 font-semibold text-right max-w-[60%]">{mol.therapeuticDoseRange}</span>
                            </div>
                          )}
                          {mol.bioavailability && (
                            <div className="flex justify-between items-center bg-violet-500/5 border border-violet-500/20 p-2 rounded">
                              <span className="text-[10px] font-mono font-bold text-violet-400/70 uppercase">Biodisponib.</span>
                              <span className="text-[11px] text-zinc-200 font-semibold text-right max-w-[60%]">{mol.bioavailability}</span>
                            </div>
                          )}
                          {mol.proteinBinding && (
                            <div className="flex justify-between items-center bg-violet-500/5 border border-violet-500/20 p-2 rounded">
                              <span className="text-[10px] font-mono font-bold text-violet-400/70 uppercase">Lig. Proteica</span>
                              <span className="text-[11px] text-zinc-200 font-semibold text-right max-w-[60%]">{mol.proteinBinding}</span>
                            </div>
                          )}
                          {mol.elimination && (
                            <div className="flex justify-between items-center bg-violet-500/5 border border-violet-500/20 p-2 rounded">
                              <span className="text-[10px] font-mono font-bold text-violet-400/70 uppercase">Eliminação</span>
                              <span className="text-[11px] text-zinc-200 font-semibold text-right max-w-[60%]">{mol.elimination}</span>
                            </div>
                          )}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Removido Insight Clínico Automatizado IA */}
        </div>
      ) : (
         <div className="flex-1 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl">
            <p className="text-zinc-500 font-mono text-sm">Selecione moléculas para começar a comparar.</p>
         </div>
      )}
    </div>
  );
};
