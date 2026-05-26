import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { Network, Search, BookOpen, Menu, Sparkles, SlidersHorizontal, Beaker, Info, LogOut, User as UserIcon, LogIn, Activity, Brain, Lock } from 'lucide-react';
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
    { name: 'Dashboard', href: '/', icon: Network, isPaid: false },
    { name: 'Atlas Relacional', href: '/atlas', icon: Search, isPaid: false },
    { name: 'Catálogo de Fármacos', href: '/molecules', icon: BookOpen, isPaid: true },
    { name: 'Catálogo de Transtornos', href: '/disorders', icon: Brain, isPaid: false },
    { name: 'Catálogo de Enzimas', href: '/enzymes', icon: Beaker, isPaid: true },
    { name: 'Catálogo de Receptores', href: '/receptors', icon: Activity, isPaid: true },
    { name: 'Simulador de Interações', href: '/navigator', icon: Sparkles, isPaid: true },
    { name: 'Comparar', href: '/compare', icon: SlidersHorizontal, isPaid: true },
    { name: 'Glossário de Símbolos', href: '/glossary', icon: Info, isPaid: false },
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
    if (searchQuery.length < 2) return { molecules: [], receptors: [], enzymes: [], disorders: [] };
    const q = searchQuery.toLowerCase();
    return {
      molecules: dataService.getMolecules().filter(m => m.name.toLowerCase().includes(q) || m.tradeNames.some(t => t.toLowerCase().includes(q))),
      receptors: dataService.getReceptors().filter(r => r.name.toLowerCase().includes(q)),
      enzymes: dataService.getEnzymes().filter(e => e.name.toLowerCase().includes(q)),
      disorders: dataService.getDisorders().filter(d => d.name.toLowerCase().includes(q))
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

        <div className="flex-1 max-w-md xl:max-w-lg mx-4 relative hidden md:block" ref={searchRef}>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-amber-400 transition-colors" />
            <input
              type="text"
              placeholder="Pesquise no Atlas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
            />
          </div>
          {searchOpen && searchQuery.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto z-50">
              {results.molecules.length > 0 || results.receptors.length > 0 || results.disorders.length > 0 || results.enzymes.length > 0 ? (
                <div className="py-2">
                  {results.molecules.length > 0 && (
                    <div className="px-3 pb-2">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-1">Fármacos</h4>
                      {results.molecules.map(m => (
                        <div 
                          key={m.id} 
                          className="px-2 py-1.5 hover:bg-zinc-800 rounded cursor-pointer text-sm text-zinc-300"
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                            navigate('/molecules', { state: { selectedMoleculeId: m.id } });
                          }}
                        >
                          {m.name}
                        </div>
                      ))}
                    </div>
                  )}
                  {results.disorders.length > 0 && (
                    <div className="px-3 pb-2">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-1">Transtornos</h4>
                      {results.disorders.map(d => (
                        <div 
                          key={d.id} 
                          className="px-2 py-1.5 hover:bg-zinc-800 rounded cursor-pointer text-sm text-amber-400"
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                            navigate(`/disorders/${d.id}`);
                          }}
                        >
                          {d.name}
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
                            navigate('/receptors', { state: { selectedReceptorId: r.id } });
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
        
        <div className="flex items-center gap-4 ml-auto xl:ml-0 overflow-hidden">
          <nav className="hidden 2xl:flex space-x-1 lg:space-x-3 text-[12px] font-medium h-full items-center whitespace-nowrap">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const isLocked = item.isPaid && !session;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-1.5 transition-colors h-16 border-b-2 px-1 relative group/nav",
                    isActive 
                      ? "text-amber-300 border-amber-300" 
                      : "text-zinc-500 hover:text-zinc-100 border-transparent"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isLocked ? "opacity-50" : "")} />
                  <span className={cn(isLocked ? "opacity-70" : "")}>{item.name}</span>
                  {isLocked && (
                    <Lock className="w-3 h-3 text-rose-500/80 mb-3 -ml-0.5" />
                  )}
                </Link>
              );
            })}
          </nav>
          
          <div className="hidden sm:flex items-center pl-4 xl:border-l xl:border-zinc-800 shrink-0">
            {session ? (
              <div className="flex items-center gap-3">
                {user?.email === 'thomas.n.blum@gmail.com' && (
                  <Link to="/admin" className="text-[10px] font-bold text-amber-500 hover:text-amber-400 uppercase tracking-widest border border-amber-500/30 px-2 py-1 rounded bg-amber-500/10 whitespace-nowrap shrink-0">CMS Admin</Link>
                )}
                <div className="flex items-center gap-1.5 text-zinc-400 max-w-[100px] sm:max-w-[150px]">
                  <UserIcon className="w-4 h-4 shrink-0" />
                  <span className="truncate text-xs font-mono">{user?.email?.split('@')[0]}</span>
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
                className="flex items-center gap-2 px-3 py-1.5 bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 rounded-md transition-colors text-sm"
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </Link>
            )}
          </div>
        </div>
        
        <button 
          className="2xl:hidden p-2 text-zinc-500 hover:text-zinc-100 ml-2 shrink-0"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="2xl:hidden bg-zinc-900 border-b border-zinc-800 p-4 space-y-2 max-h-[80vh] overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const isLocked = item.isPaid && !session;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors border",
                  isActive 
                    ? "bg-amber-400/10 text-amber-300 border-amber-400/20" 
                    : "text-zinc-500 hover:bg-zinc-800 border-transparent"
                )}
              >
                <div className="flex items-center gap-2">
                  <item.icon className={cn("w-4 h-4", isLocked ? "opacity-50" : "")} />
                  <span className={cn(isLocked ? "opacity-70" : "")}>{item.name}</span>
                </div>
                {isLocked && <Lock className="w-4 h-4 text-rose-500/80" />}
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
