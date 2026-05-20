import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraphRenderer } from '../components/AtlasGraph/GraphRenderer';
import { ErrorBoundary } from '../components/UI/ErrorBoundary';
import { X } from 'lucide-react';
import { GraphNode } from '../services/graphBuilder';

export const AtlasViewPage = () => {
  const navigate = useNavigate();
  const [visibleGroups, setVisibleGroups] = useState({
    molecule: true,
    receptor: true,
    enzyme: true,
  });

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoomNodeId, setZoomNodeId] = useState<string | null>(null);
  const [zoomTrigger, setZoomTrigger] = useState(0);
  const [repulsion, setRepulsion] = useState(-300);

  const toggleGroup = (group: keyof typeof visibleGroups) => {
    setVisibleGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div className="p-4 md:p-6 flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight uppercase mb-2">Atlas Relacional</h1>
          <p className="text-zinc-500 text-sm">Navegue pelas conexões entre fármacos, alvos de ação e vias metabólicas. Arraste para mover, role para aproximar.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 xl:mr-2 rounded px-3 py-1.5 shadow-sm">
              <label htmlFor="repulsion" className="text-zinc-500 font-bold whitespace-nowrap">⊙ AFASTAMENTO</label>
              <input 
                id="repulsion"
                type="range" 
                min="-800" 
                max="-50" 
                value={repulsion}
                onChange={(e) => setRepulsion(Number(e.target.value))}
                className="w-20 md:w-32 accent-amber-400"
              />
            </div>
           <button 
             onClick={() => toggleGroup('molecule')}
             className={`px-3 py-1.5 rounded border transition-colors ${visibleGroups.molecule ? 'bg-amber-400/20 border-amber-400/50 text-amber-300' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}
           >
             MOLÉCULAS
           </button>
           <button 
             onClick={() => toggleGroup('receptor')}
             className={`px-3 py-1.5 rounded border transition-colors ${visibleGroups.receptor ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}
           >
             RECEPTORES
           </button>
           <button 
             onClick={() => toggleGroup('enzyme')}
             className={`px-3 py-1.5 rounded border transition-colors ${visibleGroups.enzyme ? 'bg-zinc-600/30 border-zinc-400/50 text-zinc-500' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}
           >
             ENZIMAS
           </button>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 min-w-0 flex border border-zinc-800 bg-zinc-900 shadow-sm rounded-xl overflow-hidden relative">
        <div className="flex-1 min-w-0 relative">
          <ErrorBoundary>
            <GraphRenderer 
              visibleGroups={visibleGroups} 
              onNodeSelect={setSelectedNode}
              zoomToNodeId={zoomNodeId}
              zoomTrigger={zoomTrigger}
              repulsion={repulsion}
            />
          </ErrorBoundary>
        </div>

        {selectedNode && (
          <aside className="absolute right-0 top-0 h-full w-80 bg-zinc-950/95 backdrop-blur-xl border-l border-zinc-800 p-5 flex flex-col overflow-y-auto z-20 shadow-2xl">
            <button 
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <X className="w-5 h-5"/>
            </button>

            <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 font-mono mb-2">
               {selectedNode.group === 'molecule' ? 'Fármaco' : selectedNode.group === 'receptor' ? 'Alvo' : 'Enzima'}
            </span>
            <h2 className="text-xl font-bold text-zinc-100 mb-6 uppercase tracking-tight">{selectedNode.name}</h2>

            <div className="space-y-6 text-sm text-zinc-500">
               {selectedNode.group === 'molecule' && selectedNode.data && (
                 <>
                   <div>
                     <h4 className="text-[10px] uppercase text-zinc-500 font-mono font-bold mb-1">Classe</h4>
                     <p className="font-medium text-zinc-100">{selectedNode.data.class}</p>
                   </div>
                   <div>
                     <h4 className="text-[10px] uppercase text-zinc-500 font-mono font-bold mb-1">Mecanismo</h4>
                     <p className="leading-relaxed">{selectedNode.data.mechanisms}</p>
                   </div>
                   {selectedNode.data.notes && (
                     <div>
                       <h4 className="text-[10px] uppercase text-zinc-500 font-mono font-bold mb-1">Notas</h4>
                       <p className="italic text-zinc-500 border-l-2 border-zinc-700 pl-3">{selectedNode.data.notes}</p>
                     </div>
                   )}
                   <button
                     onClick={() => navigate('/molecules', { state: { selectedMoleculeId: selectedNode.id } })}
                     className="mt-4 w-full bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400/20 hover:text-amber-200 font-mono text-xs tracking-widest uppercase py-2 rounded transition-colors"
                   >
                     Ver Ficha Completa →
                   </button>
                 </>
               )}

               {selectedNode.group === 'receptor' && selectedNode.data && (
                 <>
                   <div>
                     <h4 className="text-[10px] uppercase text-zinc-500 font-mono font-bold mb-1">Sistema</h4>
                     <p className="font-medium text-zinc-100">{selectedNode.data.neurotransmitterSystem}</p>
                   </div>
                   <div>
                     <h4 className="text-[10px] uppercase text-zinc-500 font-mono font-bold mb-1">Descrição</h4>
                     <p className="leading-relaxed">{selectedNode.data.description}</p>
                   </div>
                   <button
                     onClick={() => {
                       setZoomNodeId(selectedNode.id);
                       setZoomTrigger(t => t + 1);
                     }}
                     className="mt-4 w-full bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 font-mono text-xs tracking-widest uppercase py-2 rounded transition-colors"
                   >
                     Ver no Atlas →
                   </button>
                 </>
               )}

               {selectedNode.group === 'enzyme' && selectedNode.data && (
                 <>
                   <div>
                     <h4 className="text-[10px] uppercase text-zinc-500 font-mono font-bold mb-1">Localização</h4>
                     <p className="font-medium text-zinc-100">{selectedNode.data.location}</p>
                   </div>
                   <div>
                     <h4 className="text-[10px] uppercase text-zinc-500 font-mono font-bold mb-1">Descrição</h4>
                     <p className="leading-relaxed">{selectedNode.data.description}</p>
                   </div>
                   <button
                     onClick={() => navigate('/enzymes', { state: { selectedEnzymeId: selectedNode.id } })}
                     className="mt-4 w-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 font-mono text-xs tracking-widest uppercase py-2 rounded transition-colors"
                   >
                     Ver Ficha Completa →
                   </button>
                 </>
               )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
