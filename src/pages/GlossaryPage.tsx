import React, { useState } from 'react';
import { SYMBOL_DEFINITIONS, SymbolDefinition } from '../data/symbols';
import { ProfileSymbolBadge } from '../components/UI/ProfileSymbolBadge';
import { ProfileSymbolKey } from '../data/schema';
import { BookOpen, Search, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

export const GlossaryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const allSymbols = Object.values(SYMBOL_DEFINITIONS);
  
  const filteredSymbols = allSymbols.filter(sym => 
    sym.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sym.shortLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sym.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sym.clinicalSignificance.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div className="p-6 md:p-8 flex flex-col h-full overflow-y-auto">
      {/* Header Section */}
      <div className="mb-8 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 uppercase">
              Glossário de Símbolos Farmacológicos
            </h1>
            <p className="text-zinc-500 text-sm">
              Explore o significado dos marcadores farmacológicos utilizados em nosso catálogo e entenda suas implicações clínicas diretas.
            </p>
          </div>
        </div>
      </div>

      {/* Control / Search Section */}
      <div className="mb-8 max-w-md relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Buscar símbolo por nome, sigla ou descrição clínica..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all font-sans"
        />
      </div>

      {/* Grid of Symbols */}
      {filteredSymbols.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSymbols.map((sym: SymbolDefinition) => {
            return (
              <div 
                key={sym.key}
                className={cn(
                  "bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col h-full transition-all duration-300 relative group overflow-hidden hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/50"
                )}
              >
                {/* Decorative colored glow on top of the card when hovered */}
                <div 
                  className={cn(
                    "absolute top-0 left-0 right-0 h-1 transition-all duration-300 opacity-30 group-hover:opacity-100",
                    sym.bgClass.replace('/10', '/60')
                  )} 
                />

                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {/* Interactive symbol badge which also showcases the tooltips */}
                    <ProfileSymbolBadge symbolKey={sym.key} size="lg" disableTooltip={true} />
                    <div>
                      <h3 className="text-base font-bold text-zinc-100 group-hover:text-amber-400 transition-colors flex items-center gap-2">
                        {sym.label}
                        <span className={cn(
                          "text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider font-mono shrink-0",
                          sym.bgClass,
                          sym.borderClass,
                          sym.colorClass
                        )}>
                          {sym.shortLabel}
                        </span>
                      </h3>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold font-mono">Tipo: Propriedade Crítica</p>
                    </div>
                  </div>
                </div>

                {/* Description block */}
                <div className="space-y-4 flex-1">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1 font-mono">Mecanismo Geral</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">{sym.description}</p>
                  </div>

                  <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/80 group-hover:border-zinc-800 transition-colors mt-auto">
                    <h4 className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5 mb-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Significado na Prática Clínica
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans italic">
                      {sym.clinicalSignificance}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-zinc-900 border border-zinc-800 rounded-2xl text-center">
          <p className="text-zinc-500 font-mono text-sm mb-2">Nenhum símbolo farmacológico coincide com sua busca.</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="text-xs text-teal-400 hover:text-teal-300 font-bold uppercase tracking-wider underline underline-offset-4"
          >
            Limpar Busca
          </button>
        </div>
      )}
    </div>
  );
};
