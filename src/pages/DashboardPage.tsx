import { ArrowRight, Activity, Zap, Beaker } from "lucide-react";
import { Link } from "react-router-dom";

export const DashboardPage = () => {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-8">
      <section className="bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:24px_24px] bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-amber-400">
          <NetworkIcon className="w-64 h-64" />
        </div>
        <div className="absolute top-4 left-4 flex items-center text-[10px] text-zinc-500 font-mono space-x-4">
          <span>v1.0.4 - BASE DADOS: ESTÁVEL</span>
          <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 font-bold tracking-wider">
            SINC-REALTIME
          </div>
        </div>
        <div className="max-w-2xl relative z-10 mt-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-100 tracking-tight mb-4">
            ATLAS <span className="font-light text-zinc-500">FÁRMACO</span>
          </h1>
          <p className="text-lg text-zinc-500 mb-8 whitespace-pre-wrap leading-relaxed">
            Base de dados unificada e visualizador de grafos para interações farmacodinâmicas e farmacocinéticas em psiquiatria.
            <br />
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md inline-block mt-4 border border-emerald-500/20">
              [✓] DADOS VERIFICÁVEIS (STAHL'S / PUBMED)
            </span>
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/atlas" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded text-sm bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition shadow-[0_0_15px_rgba(251,191,36,0.2)]">
              <Activity className="w-4 h-4" /> ABRIR ATLAS DE GRAFOS
            </Link>
            <Link to="/navigator" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded text-sm bg-zinc-800 text-amber-300 font-bold border border-amber-400/30 hover:bg-zinc-700 transition">
              <Zap className="w-4 h-4" /> SIMULAR INTERAÇÕES PK
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition group">
          <div className="w-12 h-12 bg-amber-400/10 text-amber-300 rounded-lg border border-amber-400/20 flex items-center justify-center mb-4 group-hover:bg-amber-400/20 transition">
            <Beaker className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100 mb-2 font-sans tracking-tight">Catálogo Mapeado</h2>
          <p className="text-zinc-500 mb-6 text-sm leading-relaxed">Consulte fichas detalhadas de ISRS, Antipsicóticos e outros, com seus alvos em receptores e vias metabólicas.</p>
          <Link to="/molecules" className="text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all group-hover:text-amber-200">
            Acessar banco de dados <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition group">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition">
            <NetworkIcon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100 mb-2 font-sans tracking-tight">Farmacodinâmica (PD)</h2>
          <p className="text-zinc-500 mb-6 text-sm leading-relaxed">Visualize a afinidade de ligação (Ki) e o tipo de ação (agonista, antagonista, inibidor) sobre receptores 5-HT, D2, etc.</p>
          <Link to="/atlas" className="text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all group-hover:text-emerald-300">
            Visualizar teia <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition group">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20 flex items-center justify-center mb-4 group-hover:bg-rose-500/20 transition">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100 mb-2 font-sans tracking-tight">Farmacocinética (PK)</h2>
          <p className="text-zinc-500 mb-6 text-sm leading-relaxed">Cruze substratos com inibidores/indutores enzimáticos (CYP2D6, CYP3A4) para simular risco de toxicidade.</p>
          <Link to="/navigator" className="text-rose-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all group-hover:text-rose-300">
            Executar simulação <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

const NetworkIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="16" y="16" width="6" height="6" rx="1"></rect>
    <rect x="2" y="16" width="6" height="6" rx="1"></rect>
    <rect x="9" y="2" width="6" height="6" rx="1"></rect>
    <path d="M5 16v-3a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v3"></path>
    <path d="M12 8v8"></path>
  </svg>
)
