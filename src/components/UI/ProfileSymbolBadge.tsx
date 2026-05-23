import React from 'react';
import { ProfileSymbolKey } from '../../data/schema';
import { SYMBOL_DEFINITIONS } from '../../data/symbols';
import { cn } from '../../utils/cn';

interface ProfileSymbolBadgeProps {
  symbolKey: ProfileSymbolKey;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  disableTooltip?: boolean;
}

export const ProfileSymbolBadge: React.FC<ProfileSymbolBadgeProps> = ({
  symbolKey,
  size = 'md',
  showLabel = false,
  className,
  tooltipPosition = 'top',
  disableTooltip = false
}) => {
  const def = SYMBOL_DEFINITIONS[symbolKey];
  if (!def) return null;

  const sizeClasses = {
    sm: 'w-5 h-5 text-xs',
    md: 'w-6 h-6 text-sm',
    lg: 'w-8 h-8 text-base'
  };

  const positionClasses = {
    top: 'bottom-full right-0 mb-2',
    bottom: 'top-full right-0 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full right-4 border-t-zinc-800 border-x-transparent border-b-transparent',
    bottom: 'bottom-full right-4 border-b-zinc-800 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-zinc-800 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-zinc-800 border-y-transparent border-l-transparent'
  };

  return (
    <div className={cn("relative group/badge inline-flex items-center select-none", className)}>
      {/* The Badge itself */}
      <div
        className={cn(
          "flex items-center justify-center rounded-full border cursor-help font-semibold transition-all duration-200",
          def.bgClass,
          def.colorClass,
          def.borderClass,
          sizeClasses[size],
          "hover:scale-115 hover:shadow-lg hover:shadow-black/40"
        )}
      >
        <span>{def.symbol}</span>
      </div>

      {showLabel && (
        <span className={cn("ml-1.5 font-medium text-xs text-zinc-300", def.colorClass)}>
          {def.label}
        </span>
      )}

      {/* Modern, elegant Glassmorphic CSS Tooltip */}
      {!disableTooltip && (
        <div
          className={cn(
            "absolute z-[100] hidden group-hover/badge:block pointer-events-none w-72 p-4",
            "rounded-xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-md shadow-2xl text-zinc-100",
            "transition-all duration-300 ease-out animate-in fade-in zoom-in-95 duration-100",
            positionClasses[tooltipPosition]
          )}
        >
          {/* Tooltip Header */}
          <div className="flex items-center space-x-2 border-b border-zinc-800 pb-2 mb-2">
            <div className={cn("w-7 h-7 rounded-full flex items-center justify-center border font-bold text-sm", def.bgClass, def.colorClass, def.borderClass)}>
              {def.symbol}
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-100 flex items-center gap-1.5">
                {def.label}
                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider", def.bgClass, def.borderClass)}>
                  {def.shortLabel}
                </span>
              </h4>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Perfil Farmacológico</p>
            </div>
          </div>

          {/* Tooltip Content */}
          <div className="space-y-2">
            <p className="text-xs text-zinc-300 leading-relaxed">
              {def.description}
            </p>
            {def.clinicalSignificance && (
              <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-0.5">Importância Clínica:</span>
                <p className="text-[11px] text-zinc-400 leading-normal italic">
                  {def.clinicalSignificance}
                </p>
              </div>
            )}
          </div>

          {/* Tooltip Arrow */}
          <div
            className={cn(
              "absolute border-4 w-0 h-0",
              arrowClasses[tooltipPosition]
            )}
          />
        </div>
      )}
    </div>
  );
};
