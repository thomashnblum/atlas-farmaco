import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { Disorder } from '../data/schema';
import { Brain, Search, BookOpen } from 'lucide-react';

export const DisordersPage = () => {
  const [disorders, setDisorders] = useState<Disorder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Carrega do dataService local (que já puxou do Supabase no app load)
    setDisorders(dataService.getDisorders());
  }, []);

  const filteredDisorders = disorders.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.cid10 && d.cid10.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-zinc-100 flex items-center gap-3">
            <Brain className="w-8 h-8 text-amber-400" />
            Catálogo de Transtornos
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Catálogo de diagnósticos, fisiopatologia e diretrizes de tratamento psicofarmacológico baseados no DSM-5 e CID-10.</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input 
          type="text" 
          placeholder="Buscar por nome ou CID (ex: F32, Depressão)..." 
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-zinc-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors shadow-inner"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDisorders.map(disorder => (
          <div 
            key={disorder.id}
            onClick={() => navigate(`/disorders/${disorder.id}`)}
            className="group bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 cursor-pointer hover:bg-zinc-800/80 hover:border-amber-400/30 transition-all duration-300 shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center border border-amber-400/20 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex gap-2">
                {disorder.cid10 && <span className="bg-zinc-950 text-zinc-400 text-xs px-2 py-1 rounded font-mono border border-zinc-800">CID: {disorder.cid10}</span>}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-amber-400 transition-colors">
              {disorder.name}
            </h3>
            
            <p className="text-sm text-zinc-400 line-clamp-3 mb-6">
              {disorder.description}
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
              <BookOpen className="w-4 h-4" /> Ver Tratamentos e Detalhes
            </div>
          </div>
        ))}

        {filteredDisorders.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-500 font-mono">Nenhum transtorno encontrado para a busca atual.</p>
            {disorders.length === 0 && (
              <p className="text-amber-400/70 text-sm mt-2">O banco de dados de transtornos pode estar vazio. Aguarde o script SQL ser executado.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
