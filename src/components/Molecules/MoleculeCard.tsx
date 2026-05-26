import { Molecule } from '../../data/schema';
import { ProfileSymbolBadge } from '../UI/ProfileSymbolBadge';
import { Clock, Pill } from 'lucide-react';

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
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-amber-400 group-hover:text-amber-300 transition-colors break-words">{molecule.name}</h3>
            {molecule.profileSymbols && molecule.profileSymbols.length > 0 && (
              <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                {molecule.profileSymbols.map((sym) => (
                  <ProfileSymbolBadge key={sym} symbolKey={sym} size="sm" />
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-zinc-500 font-medium font-mono lowercase truncate">{molecule.tradeNames.join(', ')}</p>
        </div>
        <span className="inline-flex items-center rounded bg-amber-400/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-amber-400 border border-amber-400/20 uppercase text-center shrink-0 max-w-[45%]">
          <span className="truncate">{molecule.class}</span>
        </span>
      </div>
      
      <div className="mb-4 flex-1">
        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 font-mono">Mecanismo de Ação</h4>
        <p className="text-sm text-zinc-500 line-clamp-3 leading-relaxed">{molecule.mechanisms}</p>
      </div>

      {(molecule.halfLife || molecule.therapeuticDoseRange) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {molecule.halfLife && (
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/20 rounded-lg px-2.5 py-1.5 text-[10px] text-violet-300 font-mono font-bold">
              <Clock className="w-3 h-3" />
              t½: {molecule.halfLife.split(' (')[0]}
            </span>
          )}
          {molecule.therapeuticDoseRange && (
            <span className="inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/20 rounded-lg px-2.5 py-1.5 text-[10px] text-teal-300 font-mono font-bold">
              <Pill className="w-3 h-3" />
              {molecule.therapeuticDoseRange}
            </span>
          )}
        </div>
      )}

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
