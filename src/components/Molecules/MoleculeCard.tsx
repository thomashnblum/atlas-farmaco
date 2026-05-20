import { Molecule } from '../../data/schema';
import { ProfileSymbolBadge } from '../UI/ProfileSymbolBadge';

interface MoleculeCardProps {
  key?: any;
  molecule: Molecule;
  onClick?: () => void;
}

export const MoleculeCard = ({ molecule, onClick }: MoleculeCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl hover:border-zinc-700 transition-all cursor-pointer flex flex-col h-full group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-amber-400 group-hover:text-amber-300 transition-colors">{molecule.name}</h3>
            {molecule.profileSymbols && molecule.profileSymbols.length > 0 && (
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                {molecule.profileSymbols.map((sym) => (
                  <ProfileSymbolBadge key={sym} symbolKey={sym} size="sm" />
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-zinc-500 font-medium font-mono lowercase">{molecule.tradeNames.join(', ')}</p>
        </div>
        <span className="inline-flex items-center rounded bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-400/20 uppercase text-right shrink-0">
          {molecule.class}
        </span>
      </div>
      
      <div className="mb-6 flex-1">
        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 font-mono">Mecanismo de Ação</h4>
        <p className="text-sm text-zinc-500 line-clamp-3 leading-relaxed">{molecule.mechanisms}</p>
      </div>

      <div className="mt-auto pt-4 border-t border-zinc-800 flex flex-wrap gap-2">
        {molecule.clinicalAxes.map((axis) => (
          <span key={axis} className="inline-flex items-center rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            {axis}
          </span>
        ))}
      </div>
    </div>
  );
};
