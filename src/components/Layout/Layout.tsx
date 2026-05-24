import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { Network, Search, BookOpen, Menu, Sparkles, SlidersHorizontal, Beaker, Info, LogOut, User as UserIcon, LogIn, Activity, Brain } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const { session, user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Network },
    { name: 'Atlas Relacional', href: '/atlas', icon: Search },
    { name: 'Catálogo de Fármacos', href: '/molecules', icon: BookOpen },
    { name: 'Catálogo de Transtornos', href: '/disorders', icon: Brain },
    { name: 'Catálogo de Enzimas', href: '/enzymes', icon: Beaker },
    { name: 'Catálogo de Receptores', href: '/receptors', icon: Activity },
    { name: 'Simulador de Interações', href: '/navigator', icon: Sparkles },
    { name: 'Comparar', href: '/compare', icon: SlidersHorizontal },
    { name: 'Glossário de Símbolos', href: '/glossary', icon: Info },
  ];

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = () => {
    if (searchQuery.length < 2) return { molecules: [], receptors: [], enzymes: [] };
    const q = searchQuery.toLowerCase();
    return {
      molecules: dataService.getMolecules().filter(m => m.name.toLowerCase().includes(q) || m.tradeNames.some(t => t.toLowerCase().includes(q))),
      receptors: dataService.getReceptors().filter(r => r.name.toLowerCase().includes(q)),
      enzymes: dataService.getEnzymes().filter(e => e.name.toLowerCase().includes(q))
    };
  };

  const results = searchResults();
  const hasResults = results.molecules.length > 0 || results.receptors.length > 0 || results.enzymes.length > 0;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans overflow-x-hidden">
      <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-50 backdrop-blur-sm gap-4">
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-8 h-8 bg-amber-400 rounded flex items-center justify-center shrink-0">
            <Network className="w-5 h-5 text-zinc-900" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 hidden xl:block">
            ATLAS <span className="font-light text-zinc-500">FÁRMACO </span>
          </h1>
        </div>

        <div className="flex-1 max-w-sm relative hidden sm:block" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-full py-1.5 pl-9 pr-4 text-sm text-zinc-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
            />
          </div>
          
          {searchOpen && searchQuery.length >= 2 && (
            <div className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto">
              {hasResults ? (
                <div className="py-2">
                  {results.molecules.length > 0 && (
                    <div className="px-3 pb-2">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-1">Moléculas</h4>
                      {results.molecules.map(m => (
                        <div 
                          key={m.id} 
                           className="px-2 py-1.5 hover:bg-zinc-800 rounded cursor-pointer text-sm text-amber-300"
                           onClick={() => {
                             setSearchOpen(false);
                             setSearchQuery('');
                             // Simulating navigation by directing to Molecule Index (in a real app we'd pass ID through URL or state)
                             navigate('/molecules', { state: { selectedId: m.id } });
                           }}
                        >
                          {m.name} <span className="text-zinc-500 text-xs">({m.tradeNames[0]})</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {results.receptors.length > 0 && (
                    <div className="px-3 pb-2">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-1">Receptores</h4>
                      {results.receptors.map(r => (
                        <div 
                          key={r.id} 
                          className="px-2 py-1.5 hover:bg-zinc-800 rounded cursor-pointer text-sm text-rose-400"
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                            // Assuming navigation to atlas Highlights this node
                            navigate('/atlas');
                          }}
                        >
                          {r.name}
                        </div>
                      ))}
                    </div>
                  )}
                  {results.enzymes.length > 0 && (
                    <div className="px-3 pb-2">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-1">Enzimas</h4>
                      {results.enzymes.map(e => (
                        <div 
                          key={e.id} 
                          className="px-2 py-1.5 hover:bg-zinc-800 rounded cursor-pointer text-sm text-indigo-400"
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                            navigate('/enzymes', { state: { selectedEnzymeId: e.id } });
                          }}
                        >
                          {e.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-zinc-500">Nenhum resultado encontrado.</div>
              )}
            </div>
          )}
        </div>
        
        <nav className="hidden xl:flex space-x-1 lg:space-x-3 text-[12px] font-medium h-full shrink-0 items-center">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-1.5 transition-colors h-full border-b-2 border-transparent px-1",
                  isActive 
                    ? "text-amber-300 border-amber-300" 
                    : "text-zinc-500 hover:text-zinc-100"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
          
          <div className="flex items-center ml-4 pl-4 border-l border-zinc-800">
            {session ? (
              <div className="flex items-center gap-3 md:gap-4">
                {user?.email === 'thomas.n.blum@gmail.com' && (
                  <Link to="/admin" className="text-[10px] md:text-xs font-bold text-amber-500 hover:text-amber-400 uppercase tracking-widest border border-amber-500/30 px-2 py-1 rounded bg-amber-500/10 whitespace-nowrap">CMS Admin</Link>
                )}
                <div className="flex items-center gap-1.5 md:gap-2 text-zinc-400 max-w-[80px] md:max-w-[120px]">
                  <UserIcon className="w-4 h-4 shrink-0" />
                  <span className="truncate text-xs">{user?.email?.split('@')[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-zinc-500 hover:text-rose-400 transition-colors shrink-0"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-3 py-1.5 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 rounded-md transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </Link>
            )}
          </div>
        </nav>
        
        <button 
          className="xl:hidden p-2 text-zinc-500 hover:text-zinc-100 ml-auto"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="xl:hidden bg-zinc-900 border-b border-zinc-800 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-colors border",
                  isActive 
                    ? "bg-amber-400/10 text-amber-300 border-amber-400/20" 
                    : "text-zinc-500 hover:bg-zinc-800 border-transparent"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
          
          <div className="pt-2 mt-2 border-t border-zinc-800">
            {session ? (
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <UserIcon className="w-4 h-4" />
                  <span className="truncate max-w-[150px]">{user?.email}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-3 mt-2 rounded-lg bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 text-sm font-medium transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Entrar / Criar Conta
              </Link>
            )}
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col items-stretch overflow-x-hidden">
        {children}
      </main>

      <footer className="h-12 border-t border-zinc-800 bg-zinc-900/80 px-4 md:px-8 flex items-center justify-between text-[11px] text-zinc-500 shrink-0 mt-auto">
        <div className="flex space-x-4 md:space-x-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <span>SISTEMA DOPAMINÉRGICO: OK</span>
          <span className="hidden sm:inline">SEROTONINÉRGICO: OK</span>
          <span className="hidden sm:inline">CYP450 ATLAS: LOADED</span>
        </div>
        <div className="shrink-0 ml-4 font-mono">v1.0.4 - SINC-REALTIME</div>
      </footer>
    </div>
  );
};
