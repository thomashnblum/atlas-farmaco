import { AlertCircle } from 'lucide-react';
import { InteractionAlert } from '../../hooks/useInteractionSimulator';

interface Props {
  key?: any;
  alert: InteractionAlert;
}

export const InteractionAlertCard = ({ alert }: Props) => {
  const isDanger = alert.type === 'danger';
  const isWarning = alert.type === 'warning';
  
  let colorClass = 'border-amber-400/30';
  let iconColor = 'text-amber-400';
  let textColor = 'text-amber-300';
  
  if (isDanger) {
    colorClass = 'border-rose-500/30 shadow-[0_4px_20px_-5px_rgba(244,63,94,0.1)]';
    iconColor = 'text-rose-500';
    textColor = 'text-rose-400';
  } else if (isWarning) {
    colorClass = 'border-amber-500/30';
    iconColor = 'text-amber-500';
    textColor = 'text-amber-400';
  }

  const titleContext = alert.enzymeName ? `Enzima: ${alert.enzymeName}` : `Receptor: ${alert.receptorName ?? 'Geral'}`;

  return (
    <div className={`rounded-xl p-5 border flex items-start gap-3 backdrop-blur bg-zinc-900/80 ${colorClass}`}>
      {isDanger ? (
        <svg className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      ) : (
        <AlertCircle className={`w-5 h-5 mt-0.5 shrink-0 ${iconColor}`} />
      )}
      <div className="flex-1">
        <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 flex flex-wrap gap-2 items-center ${textColor}`}>
          Alerta Estrutural: {titleContext} 
          <span className="opacity-70 font-mono ml-auto lg:ml-2 text-[10px]">
             [{alert.perpetrator.name.toUpperCase()} &harr; {alert.victim.name.toUpperCase()}]
          </span>
        </h4>
        <p className="text-[13px] text-zinc-100 leading-relaxed font-sans mb-3">
          {alert.message}
        </p>
        
        {alert.mechanismExplanation && (
           <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
             <h5 className="text-[10px] uppercase font-mono font-bold tracking-widest text-zinc-500 mb-1">Mecanismo Explicativo</h5>
             <p className="text-xs text-zinc-500 leading-relaxed">
                {alert.mechanismExplanation}
             </p>
           </div>
        )}
      </div>
    </div>
  );
};
