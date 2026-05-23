import { 
  ArrowRight, 
  Activity, 
  Zap, 
  Beaker, 
  BookOpen, 
  Sparkles, 
  SlidersHorizontal, 
  Info, 
  Database, 
  Network, 
  FlaskConical 
} from "lucide-react";
import { Link } from "react-router-dom";
import { dataService } from "../services/dataService";

export const DashboardPage = () => {
  const moleculeCount = dataService.getMolecules().length;
  const receptorCount = dataService.getReceptors().length;
  const enzymeCount = dataService.getEnzymes().length;

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8">
      {/* Hero Glassmorphic Card */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/60 via-zinc-950/80 to-zinc-900/30 p-8 md:p-12 backdrop-blur-md shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Dotted Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-mono tracking-widest uppercase mb-4">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>v1.0.4 - SINC-REALTIME ACTIVED</span>
              <span className="text-zinc-700">|</span>
              <span className="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                DADOS VERIFICÁVEIS (STAHL'S / PUBMED)
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-zinc-100 tracking-tight leading-none mb-6">
              ATLAS <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-indigo-300 font-light">FÁRMACO</span>
            </h1>
            
            <p className="text-base md:text-lg text-zinc-400 mb-8 leading-relaxed max-w-2xl font-light">
              Base de dados científica e visualizador de grafos em tempo real para o mapeamento de interações farmacodinâmicas e vias farmacocinéticas em psicofarmacologia clínica.
            </p>

            <div className="flex flex-col gap-6 mt-8">
              <div>
                <Link 
                  to="/atlas" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-black tracking-wide hover:brightness-110 active:scale-98 transition-all shadow-[0_0_30px_rgba(251,191,36,0.2)] hover:shadow-[0_0_40px_rgba(251,191,36,0.3)]"
                >
                  <Activity className="w-5 h-5" /> ABRIR ATLAS RELACIONAL
                </Link>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-2">
                <Link 
                  to="/molecules" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-zinc-900/80 text-zinc-300 font-medium border border-zinc-800 hover:bg-zinc-800 hover:text-amber-300 hover:border-amber-400/30 transition-all active:scale-95"
                >
                  <BookOpen className="w-4 h-4" /> Catálogo de Fármacos
                </Link>
                <Link 
                  to="/enzymes" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-zinc-900/80 text-zinc-300 font-medium border border-zinc-800 hover:bg-zinc-800 hover:text-indigo-300 hover:border-indigo-400/30 transition-all active:scale-95"
                >
                  <Beaker className="w-4 h-4" /> Catálogo de Enzimas
                </Link>
                <Link 
                  to="/receptors" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-zinc-900/80 text-zinc-300 font-medium border border-zinc-800 hover:bg-zinc-800 hover:text-rose-300 hover:border-rose-400/30 transition-all active:scale-95"
                >
                  <Network className="w-4 h-4" /> Receptores e Alvos
                </Link>
                <Link 
                  to="/navigator" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-zinc-900/80 text-zinc-300 font-medium border border-zinc-800 hover:bg-zinc-800 hover:text-emerald-300 hover:border-emerald-400/30 transition-all active:scale-95"
                >
                  <Zap className="w-4 h-4" /> Navegador PK / PD
                </Link>
                <Link 
                  to="/compare" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-zinc-900/80 text-zinc-300 font-medium border border-zinc-800 hover:bg-zinc-800 hover:text-purple-300 hover:border-purple-400/30 transition-all active:scale-95"
                >
                  <SlidersHorizontal className="w-4 h-4" /> Comparar Fármacos
                </Link>
                <Link 
                  to="/glossary" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-zinc-900/80 text-zinc-300 font-medium border border-zinc-800 hover:bg-zinc-800 hover:text-teal-300 hover:border-teal-400/30 transition-all active:scale-95"
                >
                  <Info className="w-4 h-4" /> Glossário
                </Link>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-zinc-900/20 to-zinc-900/80 z-10 rounded-3xl mix-blend-overlay pointer-events-none" />
            <img 
              src="/hero_art.png" 
              alt="Neural Network Art" 
              className="w-full max-w-md object-cover rounded-3xl opacity-80 mix-blend-lighten shadow-[0_0_50px_rgba(236,72,153,0.15)] border border-white/5"
            />
          </div>
        </div>
      </section>

      {/* Database Quick Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-4 flex items-center justify-between hover:border-amber-400/20 transition-colors">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Moléculas Registradas</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{moleculeCount}</div>
          </div>
          <FlaskConical className="w-8 h-8 text-amber-400/20" />
        </div>
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-4 flex items-center justify-between hover:border-rose-500/20 transition-colors">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Receptores e Alvos</div>
            <div className="text-2xl font-bold text-rose-400 mt-1">{receptorCount}</div>
          </div>
          <Network className="w-8 h-8 text-rose-400/20" />
        </div>
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-4 flex items-center justify-between hover:border-indigo-500/20 transition-colors">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Enzimas CYP / Conjugação</div>
            <div className="text-2xl font-bold text-indigo-400 mt-1">{enzymeCount}</div>
          </div>
          <Beaker className="w-8 h-8 text-indigo-400/20" />
        </div>
      </section>

      {/* Navigation Sections Grid */}
      <section>
        <h3 className="text-xs uppercase font-bold tracking-widest text-zinc-500 font-mono mb-4">Navegação do Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-zinc-900/20 p-6 rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/40 transition group flex flex-col justify-between h-52">
            <div>
              <div className="w-10 h-10 bg-amber-400/10 text-amber-300 rounded-lg border border-amber-400/20 flex items-center justify-center mb-4 group-hover:bg-amber-400/20 transition">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-zinc-200 mb-1 group-hover:text-zinc-100 transition">Catálogo Mapeado</h2>
              <p className="text-zinc-500 text-xs leading-relaxed">Fichas técnicas de ISRS, ISRSN, antipsicóticos, lítio e estimulantes com suas indicações de bula padrão-ouro.</p>
            </div>
            <Link to="/molecules" className="text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all mt-4 group-hover:text-amber-200">
              Acessar banco de dados <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-900/20 p-6 rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/40 transition group flex flex-col justify-between h-52">
            <div>
              <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20 flex items-center justify-center mb-4 group-hover:bg-rose-500/20 transition">
                <Network className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-zinc-200 mb-1 group-hover:text-zinc-100 transition">Atlas Relacional</h2>
              <p className="text-zinc-500 text-xs leading-relaxed">Navegue pelas conexões de farmacodinâmica de forma gráfica 2D. Veja afinidades, mecanismos e conexões enzimáticas.</p>
            </div>
            <Link to="/atlas" className="text-rose-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all mt-4 group-hover:text-rose-300">
              Visualizar teia relacional <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-900/20 p-6 rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/40 transition group flex flex-col justify-between h-52">
            <div>
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-zinc-200 mb-1 group-hover:text-zinc-100 transition">Navegador PK / PD</h2>
              <p className="text-zinc-500 text-xs leading-relaxed">Cruze substratos com indutores ou inibidores de citocromos e preveja riscos reais de toxicidade farmacológica.</p>
            </div>
            <Link to="/navigator" className="text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all mt-4 group-hover:text-emerald-300">
              Simular interações PK <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 4 */}
          <div className="bg-zinc-900/20 p-6 rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/40 transition group flex flex-col justify-between h-52">
            <div>
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition">
                <Beaker className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-zinc-200 mb-1 group-hover:text-zinc-100 transition">Catálogo de Enzimas</h2>
              <p className="text-zinc-500 text-xs leading-relaxed">Detalhamento completo de CYP3A4, CYP2D6, UGT e outras enzimas com substratos, inibidores e polimorfismos clínicos.</p>
            </div>
            <Link to="/enzymes" className="text-indigo-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all mt-4 group-hover:text-indigo-300">
              Ver catálogo de enzimas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>


          {/* Card 5 */}
          <div className="bg-zinc-900/20 p-6 rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/40 transition group flex flex-col justify-between h-52">
            <div>
              <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-zinc-200 mb-1 group-hover:text-zinc-100 transition">Comparador</h2>
              <p className="text-zinc-500 text-xs leading-relaxed">Selecione duas moléculas lado a lado e compare perfis de ligação, dose, meia-vida, indicações e risco metabólico.</p>
            </div>
            <Link to="/compare" className="text-purple-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all mt-4 group-hover:text-purple-300">
              Comparar substâncias <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 6 */}
          <div className="bg-zinc-900/20 p-6 rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/40 transition group flex flex-col justify-between h-52">
            <div>
              <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20 flex items-center justify-center mb-4 group-hover:bg-teal-500/20 transition">
                <Info className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-zinc-200 mb-1 group-hover:text-zinc-100 transition">Glossário de Símbolos</h2>
              <p className="text-zinc-500 text-xs leading-relaxed">Guia rápido sobre a classificação visual de medicamentos: padrão-ouro, risco de QT prolongado, risco metabólico, etc.</p>
            </div>
            <Link to="/glossary" className="text-teal-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all mt-4 group-hover:text-teal-300">
              Ver glossário <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
};
