import React, { useState } from 'react';
import { 
  Heart, 
  Layers, 
  Activity, 
  Cpu, 
  HelpCircle, 
  ArrowRight, 
  Brain, 
  Lock, 
  Plus, 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  Award, 
  FileText, 
  Stethoscope, 
  Sparkles,
  ChevronDown,
  Info
} from 'lucide-react';
import { FAQS } from './data/pharmacology';
import InteractionSimulator from './components/InteractionSimulator';
import CheckoutHandoff from './components/CheckoutHandoff';
import HeroVisual from './components/HeroVisual';
import { registerUrl, loginUrl, goToApp } from './config';

export default function App() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('anual');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-amber-500/20 selection:text-amber-400">
      
      {/* 1. STICKY HEADER WITH CTA */}
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-white/5 px-4 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo brand */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center group-hover:border-amber-400 group-hover:bg-amber-500/20 transition-all">
              <Brain size={18} className="text-amber-400 group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-white text-sm tracking-tight flex items-center gap-1">
                ATLAS FÁRMACO <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">Psicofarmacologia Visual</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-[11px] font-semibold uppercase tracking-widest">
            <button onClick={() => scrollToSection('gargalos-memorizacao')} className="text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer">O Desafio</button>
            <button onClick={() => scrollToSection('proposta-atlas')} className="text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer">O Atlas</button>
            <button onClick={() => scrollToSection('recursos-editoriais')} className="text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer">Recursos</button>
            <button onClick={() => scrollToSection('simulador-sessao')} className="text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer">Simulador</button>
            <button onClick={() => scrollToSection('planos-assinatura')} className="text-[#F3AC12] hover:text-amber-300 transition-colors cursor-pointer">Planos</button>
            <button onClick={() => scrollToSection('perguntas-frequentes')} className="text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer">FAQ</button>
          </nav>

          {/* Action CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => goToApp(loginUrl())}
              className="hidden sm:inline-flex text-zinc-400 hover:text-white transition-colors text-[11px] font-semibold cursor-pointer uppercase tracking-wider"
            >
              Entrar
            </button>
            <button
              id="sticky-header-cta"
              onClick={() => goToApp(registerUrl(selectedPlan))}
              className="bg-amber-500 text-black hover:bg-amber-400 px-5 py-2 rounded-full transition-all text-xs font-bold cursor-pointer uppercase tracking-wider shadow-md shadow-amber-500/10"
            >
              Começar grátis
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-10 pb-16 md:py-24 px-4 overflow-hidden border-b border-white/5">
        
        {/* Ambient atmospheric lighting blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-amber-400/3 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Typography area */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1117] border border-amber-500/20 text-[10px] font-mono text-amber-400 font-semibold tracking-wider uppercase mx-auto lg:mx-0">
              <Sparkles size={11} className="text-amber-400 animate-pulse" />
              <span>MAPEAMENTO INTELIGÍVEL DE PRINCÍPIOS ATIVOS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-white leading-[1.1] tracking-tight font-display">
              A psicofarmacologia como você <span className="text-amber-400 underline decoration-amber-500/30 underline-offset-4">nunca viu.</span>
            </h1>

            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans">
              Transforme o caos de tabelas estáticas em um atlas visual interativo. Mapeie moléculas, receptores, enzimas e simule interações com precisão acadêmica baseada em dados robustos.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                id="hero-primary-cta"
                onClick={() => goToApp(registerUrl(selectedPlan))}
                className="w-full sm:w-auto px-8 py-4 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-lg shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 group font-display uppercase tracking-widest"
              >
                <span>Começar grátis agora</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform animate-pulse" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={() => scrollToSection('simulador-sessao')}
                className="w-full sm:w-auto px-8 py-4 text-xs font-medium text-white bg-white/5 border border-white/10 hover:border-white/20 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 font-display uppercase tracking-widest"
              >
                <span>Testar o simulador</span>
              </button>
            </div>

            {/* Micro proof line */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-[10.5px] text-zinc-500 font-mono">
              <span className="flex items-center gap-1.5">
                <Heart size={12} className="text-red-500" />
                <span>Para Residentes e Estudantes de Medicina</span>
              </span>
              <span className="hidden sm:inline text-zinc-800">|</span>
              <span className="flex items-center gap-1.5">
                <FileText size={12} className="text-amber-400" />
                <span>Baseado em Stahl, PubMed e outras databases</span>
              </span>
            </div>
          </div>

          {/* Interaction preview widget right */}
          <div className="w-full flex items-center justify-center">
            <HeroVisual />
          </div>

        </div>
      </section>

      {/* 3. CHALLENGES / BOTTLENECKS SECTION */}
      <section id="gargalos-memorizacao" className="py-16 md:py-24 px-4 bg-[#09090b] relative border-b border-white/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/2 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
              Decorar perfis moleculares em tabelas frias mina sua retenção de longo prazo.
            </h2>
            <p className="text-xs md:text-sm text-zinc-400">
              Estudantes e residentes desperdiçam horas tentando correlacionar a farmacologia de forma decorada. A mente clínica não foi feita para decorar listas; ela foi feita para reconhecer padrões em redes de interação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            {/* Pain Card 1 */}
            <div className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/80 space-y-3.5">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <ShieldAlert size={18} />
              </div>
              <h3 className="font-bold text-sm text-white font-display">Afinidades Sinápticas Abstratas</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Decorar as constantes de afinidade (Ki) do receptor histamínico H1 contra o muscarínico M1 da Olanzapina sem entender clinicamente o porquê de cada efeito colateral metabólico.
              </p>
            </div>

            {/* Pain Card 2 */}
            <div className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/80 space-y-3.5">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertTriangle size={18} />
              </div>
              <h3 className="font-bold text-sm text-white font-display">Invisibilidade de Citocromos</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Prescrever amitriptilina ou risperidona em paralelo a inibidores clássicos como fluoxetina, citalopram ou bupropiona sem memorizar instantaneamente que o CYP2D6 hepático estará bloqueado.
              </p>
            </div>

            {/* Pain Card 3 */}
            <div className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/80 space-y-3.5">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Layers size={18} />
              </div>
              <h3 className="font-bold text-sm text-white font-display">Decoreba Fragmentada</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Consultar um site geral de interações que apenas gera um sinal vermelho de "Grave" sem explicar o mecanismo anatômico, nem permitir que você explore a sinergia na dor ou ansiedade.
              </p>
            </div>

          </div>

          {/* Solution introduction label */}
          <div className="bg-amber-500/5 p-4 md:p-6 border border-amber-500/15 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-amber-400 font-bold block uppercase">A ABORDAGEM DE ENGENHARIA COGNITIVA</span>
              <p className="text-xs text-zinc-300 max-w-xl">
                O Atlas Fármaco converte a fisiologia e a química molecular em mapas integrados que sua memória fotográfica retém sem esforço.
              </p>
            </div>
            <button 
              onClick={() => scrollToSection('proposta-atlas')}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-white/5 border border-white/10 hover:border-white/20 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Ver Proposta de Educação</span>
              <ArrowRight size={13} />
            </button>
          </div>

        </div>
      </section>

      {/* 4. PRODUCT EXPLANATION SECTION */}
      <section id="proposta-atlas" className="py-16 md:py-24 px-4 bg-zinc-900/5 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-12 space-y-2 text-center">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase block">
              SISTEMA OPERACIONAL ESTUDANTIL
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white font-display max-w-3xl mx-auto leading-tight">
              Uma central unificada de conexões farmacológicas inteligentes.
            </h2>
          </div>

          {/* Visual card mimicking panels */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glow-card bg-[#0E0E11] border border-white/10 p-6 rounded-2xl relative space-y-3">
              <div className="absolute right-4 top-4 text-amber-500 opacity-20"><Cpu size={24} /></div>
              
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#09090b] border border-white/10 text-[10px] font-mono text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                VISÃO MULTI-CAMADAS
              </div>

              <h4 className="text-lg font-bold font-display text-white">Navegação Tridimensional de Mecanismos</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Em vez de saltar entre sites de bulas diferentes e livros acadêmicos pesados, o Atlas permite transitar organicamente com um clique entre o <strong className="text-white">Perfil Sináptico</strong> da molécula, seus eixos de metabólitos no <strong className="text-white">Fígado</strong> e seus desfechos nos <strong className="text-white">Transtornos Psiquiátricos</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[10.5px] font-mono">
                <div className="border border-white/5 bg-[#09090b] p-3 rounded-xl space-y-1.5">
                  <span className="text-amber-400 font-bold block">• Moléculas</span>
                  <p className="text-zinc-500 text-[10px] leading-relaxed font-sans">
                    Perfis completos contendo meia-vida ativa, tempo de Cmax, ligação proteica, biodisponibilidade, indicações regulatórias do bulário (TDM, TAG, TOC, Pânico) e mapeamento clínico off-label.
                  </p>
                </div>
                <div className="border border-white/5 bg-[#09090b] p-3 rounded-xl space-y-1.5">
                  <span className="text-purple-400 font-bold block">• Receptores & Alvos</span>
                  <p className="text-zinc-500 text-[10px] leading-relaxed font-sans">
                    Constantes Ki do espectro sináptico completo: transportadores <strong className="text-zinc-400 font-mono">(SERT, NET, DAT)</strong>, serotoninérgicos <strong className="text-zinc-400 font-mono">(5-HT1A, 5-HT2A, 5-HT2C)</strong>, dopaminérgicos <strong className="text-zinc-400 font-mono">(D2)</strong>, histaminérgicos <strong className="text-zinc-400 font-mono">(H1)</strong>, muscarínicos <strong className="text-zinc-400 font-mono">(M1)</strong> e adrenérgicos <strong className="text-zinc-400 font-mono">(Alfa-1, Alfa-2)</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copy points left */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-xl md:text-2xl font-bold font-display text-white leading-tight">
              Desenhado para transformar conceitos densos em memórias intuitivas de longo prazo.
            </h3>
            
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
              O Atlas Fármaco não ensina condutas de receita, ele ensina raciocínio clínico fisiológico. Ao compreender detalhadamente em qual receptor uma molécula se acopla, as causas das reações adversas e as barreiras hepáticas se tornam óbvias e dedutíveis, não decodificadas por pura sorte.
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Check size={12} />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-white">Clareza Absoluta de Afinidade (Ki)</h4>
                  <p className="text-xs text-zinc-400">Representações gráficas que expõem o percentual de ocupação neuroquímica.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Check size={12} />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-white">Eixos Metabólicos do CYP450 Hepático</h4>
                  <p className="text-xs text-zinc-400">Visão nítida de rotas onde fármacos disputam enzimas, provocando intoxicação secundária.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Check size={12} />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-white">Pontos Críticos de Cautela e Alertas Clássicos</h4>
                  <p className="text-xs text-zinc-400">Mapeamento direto de síndromes graves (síndrome serotoninérgica, prolongamento do QTc, efeitos extrapiramidais).</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. FEATURE / CAPABILITY SECTION (EDITORIAL ASYMMETRIC LAYOUT) */}
      <section id="recursos-editoriais" className="py-16 md:py-24 px-4 bg-[#09090b] border-b border-zinc-900 relative">
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-amber-500/2 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center md:text-left space-y-3 max-w-2xl">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase block">
              DIFERENCIAIS DE ENGENHARIA NEUROQUÍMICA
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white font-display leading-tight">
              Diga adeus às listas chatas e estáticas.
            </h2>
            <p className="text-xs md:text-sm text-zinc-400">
              Cada recurso do Atlas Fármaco foi construído com foco em aprendizado dinâmico e retenção visual.
            </p>
          </div>

          {/* Asymmetric Editorials Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Row 1 / Col 1 - Moléculas (7 cols) */}
            <div className="md:col-span-7 bg-zinc-900/30 border border-zinc-800 p-6 md:p-8 rounded-2xl flex flex-col justify-between gap-6 hover:border-zinc-800 transition-all">
              <div className="space-y-3.5">
                <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/5 border border-amber-500/15 px-2.5 py-0.5 rounded-full">
                  01 . BASE ATIVA
                </span>
                <h3 className="text-lg md:text-xl font-bold font-display text-white">Atlas Dinâmico de Moléculas</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Consulte individualmente cada psicofármaco mapeado com suas indicações formais e off-label, tempo de meia-vida biológica, vias metabólicas e mecanismo sináptico específico de ação química.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10px] font-mono text-zinc-500 border-t border-zinc-800/80 pt-4">
                <span className="text-zinc-400">• Meia-vida & Cmax</span>
                <span className="text-zinc-700">|</span>
                <span className="text-zinc-400">• Ligação a Proteínas</span>
                <span className="text-zinc-700">|</span>
                <span className="text-zinc-400">• Biodisponibilidade</span>
                <span className="text-zinc-700">|</span>
                <span className="text-zinc-400">• Indicações Oficiais</span>
                <span className="text-zinc-700">|</span>
                <span className="text-zinc-400">• Aplicações Off-Label</span>
              </div>
            </div>

            {/* Row 1 / Col 2 - Receptores (5 cols) */}
            <div className="md:col-span-5 bg-white/5 border border-white/5 p-6 md:p-8 rounded-2xl flex flex-col justify-between gap-6 hover:border-amber-500/25 transition-all">
              <div className="space-y-3.5">
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/5 border border-purple-500/15 px-2.5 py-0.5 rounded-full">
                  02 . ALVO SINÁPTICO
                </span>
                <h3 className="text-lg md:text-xl font-bold font-display text-white">Mapa de Receptores</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Um painel interativo exclusivo que expõe com clareza o grau de inibição nanomolar (Ki) de transportadores e receptores pós-sinápticos que geram os desejáveis benefícios clínicos e reações adversas indesejáveis.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10px] font-mono text-purple-400 border-t border-zinc-800/80 pt-4">
                <span>• SERT, NET e DAT</span>
                <span className="text-zinc-800">|</span>
                <span>• 5-HT1A, 5-HT2A e 5-HT2C</span>
                <span className="text-zinc-800">|</span>
                <span>• D2 Dopaminérgico</span>
                <span className="text-zinc-800">|</span>
                <span>• H1, M1, Alfa-1, Alfa-2</span>
              </div>
            </div>

            {/* Row 2 / Col 1 - CYP (5 cols) */}
            <div className="md:col-span-5 bg-white/5 border border-white/5 p-6 md:p-8 rounded-2xl flex flex-col justify-between gap-6 hover:border-amber-500/25 transition-all">
              <div className="space-y-3.5">
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/5 border border-amber-500/15 px-2.5 py-0.5 rounded-full">
                  03 . METABOLISMO HEPÁTICO
                </span>
                <h3 className="text-lg md:text-xl font-bold font-display text-white">Eixos do CYP450 Hepático</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Monitore em tempo real as vias do citocromo onde os fármacos exercem papel de substrato, indutor ou inibidor. Evite arritmia, toxicidade e bloqueio cinético corporal indesejado de forma totalmente espacial.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10.5px] font-mono text-zinc-500">
                <span className="text-amber-400/90 font-semibold">• CYP2D6</span>
                <span className="text-amber-400/90 font-semibold">• CYP3A4</span>
                <span className="text-amber-400/90 font-semibold">• CYP1A2</span>
              </div>
            </div>

            {/* Row 2 / Col 2 - Simulator (7 cols) */}
            <div className="md:col-span-7 bg-white/5 border border-white/5 p-6 md:p-8 rounded-2xl flex flex-col justify-between gap-6 hover:border-amber-500/25 transition-all">
              <div className="space-y-3.5">
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/5 border border-amber-500/15 px-2.5 py-0.5 rounded-full">
                  04 . INTERAÇÃO CRUZADA
                </span>
                <h3 className="text-lg md:text-xl font-bold font-display text-white">Simulador de Combinações Sinápticas</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Nosso grande destaque: coloque duas dezenas de substâncias lado a lado na bancada e confira instantaneamente o nível cumulativo de saturação pré-sináptica e possíveis conflitos cinéticos decorrentes de prescrição concorrente.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between text-[10px] text-amber-400 font-mono gap-2">
                <span>Alertas de sobreposição serotonérgica, sedativa e extrapiramidal</span>
                <button onClick={() => scrollToSection('simulador-sessao')} className="text-white hover:underline flex items-center gap-1 font-sans cursor-pointer text-xs">
                  <span>Ir para o teste de demonstração</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section className="py-16 md:py-24 px-4 bg-zinc-950/20 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase block">
              METODOLOGIA DE RACIOCÍNIO RÁPIDO
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
              Sua jornada de estudo em 3 etapas
            </h2>
            <p className="text-xs md:text-sm text-zinc-400">
              Veja como o ambiente visual do Atlas Fármaco acelera a decodificação da matéria terapêutica em apenas alguns cliques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            
            {/* Step 1 */}
            <div className="p-5 bg-white/5 border border-white/5 rounded-xl space-y-3 relative overflow-hidden">
              <span className="absolute right-3 top-2 text-[48px] font-extrabold font-display text-[#0D1117] pointer-events-none select-none">1</span>
              <span className="text-[10px] font-mono text-amber-400 font-bold block uppercase">PASSO 01</span>
              <h4 className="font-bold text-sm text-white font-display">Busque a Molécula</h4>
              <p className="text-xs text-zinc-400 leading-relaxed pr-6">
                Selecione o psicofármaco pelo nome ou grupo farmacológico e acesse imediatamente o perfil individual com indicações oficiais e off-label.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 bg-white/5 border border-white/5 rounded-xl space-y-3 relative overflow-hidden">
              <span className="absolute right-3 top-2 text-[48px] font-extrabold font-display text-[#0D1117] pointer-events-none select-none">2</span>
              <span className="text-[10px] font-mono text-amber-400 font-bold block uppercase">PASSO 02</span>
              <h4 className="font-bold text-sm text-white font-display">Mapeie Afinidades (Ki)</h4>
              <p className="text-xs text-zinc-400 leading-relaxed pr-6">
                Visualize de forma gráfica a afinidade de ligação nos receptores pré e pós-sinápticos para compreender o efeito clínico e prever colaterais.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 bg-white/5 border border-white/5 rounded-xl space-y-3 relative overflow-hidden">
              <span className="absolute right-3 top-2 text-[48px] font-extrabold font-display text-[#0D1117] pointer-events-none select-none">3</span>
              <span className="text-[10px] font-mono text-amber-400 font-bold block uppercase">PASSO 03</span>
              <h4 className="font-bold text-sm text-white font-display">Audite Cruzamentos Hepáticos</h4>
              <p className="text-xs text-zinc-400 leading-relaxed pr-6">
                Simule a polifarmácia na cascata de enzimas do Citocromo CYP450 para identificar inibições, induções e potenciais riscos de toxicidade.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 7. DIFFERENTIATION SECTION */}
      <section className="py-16 md:py-24 px-4 bg-[#09090b] border-b border-white/5 relative">
        <div className="absolute top-0 right-10 w-96 h-96 bg-amber-500/3 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase block">
              DIFERENÇA ANATÔMICA DO SISTEMA
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
              Como o Atlas Fármaco compara-se aos métodos obsoletos?
            </h2>
            <p className="text-xs md:text-sm text-zinc-400">
              Compreenda por que os compêndios estáticos tornam o estudo psicofarmacológico um fardo diário improdutivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* Traditional way */}
            <div className="p-6 md:p-8 rounded-2xl bg-[#09090b] border border-white/5 space-y-5">
              <span className="text-rose-500 text-xs font-mono font-bold tracking-wider uppercase block border-b border-white/5 pb-3">
                × MÉTODOS TRADICIONAIS (ESTÁTICOS)
              </span>
              
              <ul className="space-y-4">
                <li className="flex gap-3 text-xs text-zinc-400 items-start">
                  <span className="text-rose-600 font-bold mt-0.5 shrink-0">✕</span>
                  <div>
                    <strong className="text-zinc-300">Artigos Científicos:</strong> O conteúdo denso e técnico dos artigos científicos são fundamentais na ciência psiquiátrica, mas tornam-se um modelo desgastante para estudo de determinada farmacodinâmica.
                  </div>
                </li>
                <li className="flex gap-3 text-xs text-zinc-400 items-start">
                  <span className="text-rose-600 font-bold mt-0.5 shrink-0">✕</span>
                  <div>
                    <strong className="text-zinc-300">Bulas PDF Cruas:</strong> Texto massivo e repetitivo que não foca na afinidade cinética diferencial nanomolar.
                  </div>
                </li>
                <li className="flex gap-3 text-xs text-zinc-400 items-start">
                  <span className="text-rose-600 font-bold mt-0.5 shrink-0">✕</span>
                  <div>
                    <strong className="text-zinc-300">Tabelas de Rodapé:</strong> Dados dispersos que exigem que você desenhe as sinergias de receptores manualmente no papel.
                  </div>
                </li>
                <li className="flex gap-3 text-xs text-zinc-400 items-start">
                  <span className="text-rose-600 font-bold mt-0.5 shrink-0">✕</span>
                  <div>
                    <strong className="text-zinc-300">Portais de Interação Genéricos:</strong> Avisos de "Evite associação" automáticos sem fornecer a base de neurobiologia celular.
                  </div>
                </li>
              </ul>
            </div>

            {/* Atlas Fármaco */}
            <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-amber-500/20 space-y-5 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl"></div>
              
              <span className="text-amber-400 text-xs font-mono font-bold tracking-wider uppercase block border-b border-white/5 pb-3">
                ✓ ECOSSISTEMA ATLAS FÁRMACO (VISUAL)
              </span>
              
              <ul className="space-y-4">
                <li className="flex gap-3 text-xs text-zinc-300 items-start">
                  <span className="text-amber-400 font-bold mt-0.5 shrink-0">✓</span>
                  <div>
                    <strong className="text-white">Sistema completo:</strong> Cada molécula com todas as informações fundamentais para seu conhecimento em um mesmo aplicativo, tornando a navegação entre molécula, enzimas e receptores muito prática e eficiente.
                  </div>
                </li>
                <li className="flex gap-3 text-xs text-zinc-300 items-start">
                  <span className="text-amber-400 font-bold mt-0.5 shrink-0">✓</span>
                  <div>
                    <strong className="text-white">Cognição por Espaço:</strong> Cada receptor ou enzima do citocromo é um polo mapeado no visor dinâmico do simulador.
                  </div>
                </li>
                <li className="flex gap-3 text-xs text-zinc-300 items-start">
                  <span className="text-amber-400 font-bold mt-0.5 shrink-0">✓</span>
                  <div>
                    <strong className="text-white">Interconectividade Molecular:</strong> Entenda a sinergia na bipolaridade ou depressão refratária de forma automatizada por Ki.
                  </div>
                </li>
                <li className="flex gap-3 text-xs text-zinc-300 items-start">
                  <span className="text-amber-400 font-bold mt-0.5 shrink-0">✓</span>
                  <div>
                    <strong className="text-white">Análise de Risco Fisiológica:</strong> Alertas clínicos calcados em ciência real para subsidiar discussões sérias em sessões clínicas acadêmicas.
                  </div>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 8. PRODUCT DEMO / SCREEN SECTION */}
      <section id="simulador-sessao" className="pt-16 md:pt-24 pb-6 md:pb-8 px-4 bg-zinc-950/20 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase block">
              EXPERIMENTE A INTERFACE AGORA
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white font-display leading-tight">
              Coloque o Atlas Fármaco à prova
            </h2>
            <p className="text-xs md:text-sm text-zinc-400">
              Interaja diretamente com o demonstrador conceitual abaixo. Combine moléculas clássicas como <strong className="text-zinc-300">Fluoxetina</strong> e <strong className="text-zinc-300">Amitriptilina</strong> para auditar conflitos severos do citocromo.
            </p>
            <p className="text-[10px] md:text-xs text-amber-400/80 bg-amber-500/5 border border-amber-500/10 rounded-lg py-1.5 px-3 max-w-xl mx-auto italic">
              *Nota do desenvolvedor: Este painel é uma simulação interativa construída especificamente para demonstração na web. O aplicativo oficial completo conta com uma interface exclusiva refinada para a prática clínica diária e recursos infinitamente mais ricos em dados e interatividade.
            </p>
          </div>

          <div className="pt-2">
            <InteractionSimulator />
          </div>

        </div>
      </section>

      {/* 9. TRUST / SERIOUSNESS SECTION */}
      <section className="pt-8 pb-16 md:pt-10 md:pb-24 px-4 bg-[#09090b] border-b border-white/5 relative">
        <div className="max-w-4xl mx-auto">
          
          <div className="p-6 md:p-8 bg-white/5 w-full border border-white/5 rounded-2xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
            
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Award size={26} />
            </div>

            <div className="space-y-2.5 text-center md:text-left flex-1">
              <h3 className="text-base md:text-lg font-bold font-display text-white">Nosso Compromisso com a Sobriedade Científica</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Nós rejeitamos jargões de "cura mágica" ou modismos de inteligência diagnóstica. <strong className="text-amber-400/90 font-semibold">O aplicativo é estritamente educacional e não substitui de forma alguma o julgamento médico humano</strong>. O Atlas Fármaco foi concebido para organizar e de forma visual facilitar o aprendizado de farmacologia psiquiátrica clínica, servindo como suporte cognitivo auxiliar, cabendo exclusivamente ao profissional de saúde a autonomia, o discernimento clínico definitivo e a decisão terapêutica personalizada.
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-[9.5px] font-mono text-slate-500">
                <span>Fontes homologadas secundariamente:</span>
                <span className="text-slate-300">Stahl Clinical Atlas</span>
                <span>•</span>
                <span className="text-slate-300">PubMed Archives</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 10. PRICING & OFFER SECTION */}
      <section id="planos-assinatura" className="py-20 px-4 bg-zinc-950/20 border-b border-white/5 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/3 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          
          {/* Eyebrow and Header matching user's spec */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase block">
              INVESTIMENTO ACESSÍVEL EM EDUCAÇÃO MÉDICA
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight leading-[1.15]">
              Planos desenhados para sua evolução profissional
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-sans">
              Escolha a melhor licença de acesso ao ecossistema do Atlas Fármaco. Tenha domínio espacial sobre as afinidades de receptores e enzimas sem termos que induzam a erro ou contratos abusivos.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4">
            
            {/* Card 1: Mensal */}
            <div 
              onClick={() => setSelectedPlan('mensal')}
              className={`p-8 bg-[#09090b]/40 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between cursor-pointer hover:border-zinc-700/60 ${
                selectedPlan === 'mensal' 
                  ? 'border-amber-500/50 bg-[#09090b]/85 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20' 
                  : 'border-white/5 bg-[#09090b]/30'
              }`}
            >
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 font-bold tracking-wider uppercase block">Acesso Flexível</span>
                  <h4 className="font-bold text-xl text-white font-display">Plano Mensal</h4>
                  <p className="text-xs text-zinc-400 pr-4 leading-relaxed font-sans">
                    Ideal para testar a dinâmica com total controle e liberdade de permanência.
                  </p>
                </div>
                
                <div className="py-3 border-t border-b border-white/5 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white font-mono">R$ 19,90</span>
                  <span className="text-xs text-zinc-500 font-sans">/ mês</span>
                </div>

                <ul className="space-y-3.5 text-xs text-zinc-400 pt-2 font-sans">
                  <li className="flex gap-2.5 items-center">
                    <Check size={13} className="text-amber-500 shrink-0" />
                    <span>Banco completo (+160 moléculas)</span>
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check size={13} className="text-amber-500 shrink-0" />
                    <span>Mapeamento de afinidade Ki</span>
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check size={13} className="text-amber-500 shrink-0" />
                    <span>Cascata de enzimas CYP450</span>
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check size={13} className="text-amber-500 shrink-0" />
                    <span>Cancelamento online direto no painel</span>
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check size={13} className="text-amber-500 shrink-0" />
                    <span>Suporte técnico WhatsApp / Email</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan('mensal');
                    scrollToSection('subscription-checkout-form');
                  }}
                  className={`w-full py-3 text-center text-xs font-bold rounded-lg uppercase tracking-wider font-display transition-all cursor-pointer ${
                    selectedPlan === 'mensal'
                      ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-md'
                      : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  Escolher Plano Mensal
                </button>
              </div>
            </div>

            {/* Card 2: Anual (RECOMENDADO / PRINCIPAL HERO EFFECT) */}
            <div 
              onClick={() => setSelectedPlan('anual')}
              className={`p-8 bg-[#09090b]/60 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between cursor-pointer ring-2 ${
                selectedPlan === 'anual' 
                  ? 'border-amber-500 bg-[#09090b]/95 shadow-xl shadow-amber-500/10 ring-amber-500/30' 
                  : 'border-white/10 bg-[#09090b]/45 hover:border-zinc-700/60'
              }`}
            >
              {/* Highlight Ribbon */}
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-[9px] font-extrabold text-black uppercase tracking-wider shadow font-display">
                Melhor Custo-Benefício
              </span>

              <div className="space-y-5 pt-1">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-amber-400 font-bold tracking-wider uppercase block">OPÇÃO RECOMENDADA</span>
                  <h4 className="font-bold text-xl text-white font-display">Plano Anual</h4>
                  <p className="text-xs text-zinc-400 pr-4 leading-relaxed font-sans">
                    O plano principal indicado para quem busca fixação permanente e consultas frequentes.
                  </p>
                </div>
                
                <div className="py-3 border-t border-b border-white/10 flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-amber-400 font-mono">R$ 167,90</span>
                    <span className="text-xs text-zinc-400 font-sans">/ ano</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono mt-1">Equivale a apenas R$ 13,99/mês</span>
                </div>

                <ul className="space-y-3.5 text-xs text-zinc-300 pt-2 font-sans">
                  <li className="flex gap-2.5 items-center">
                    <Check size={13} className="text-amber-500 shrink-0" />
                    <span><strong>Tudo do Mensal</strong> incluso</span>
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check size={13} className="text-amber-500 shrink-0" />
                    <span><strong>Economia de mais de 30%</strong> ao ano</span>
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check size={13} className="text-amber-500 shrink-0" />
                    <span>Direito a todas as novas moléculas inclusas</span>
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check size={13} className="text-amber-500 shrink-0" />
                    <span>Acesso constante assegurado por 12 meses</span>
                  </li>
                  <li className="flex gap-2.5 items-center">
                    <Check size={13} className="text-amber-500 shrink-0" />
                    <span>Suporte técnico prioritário WhatsApp/Slack</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan('anual');
                    scrollToSection('subscription-checkout-form');
                  }}
                  className="w-full py-3 text-center text-xs font-extrabold bg-amber-500 text-black hover:bg-amber-400 rounded-lg uppercase tracking-wider font-display shadow-md transition-all cursor-pointer"
                >
                  Começar com Plano Anual
                </button>
              </div>
            </div>
          </div>

          {/* Centered Checkout Simulation Wrapper */}
          <div id="subscription-checkout-form" className="pt-10 max-w-2xl mx-auto border-t border-white/5">
            <CheckoutHandoff selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} />
          </div>

        </div>
      </section>

      {/* 11. FAQ SECTION */}
      <section id="perguntas-frequentes" className="py-16 md:py-24 px-4 bg-[#09090b] border-b border-white/5 relative">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase block">
              RESPOSTAS TRANSPARENTES
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
              Perguntas Frequentes
            </h2>
            <p className="text-xs md:text-sm text-zinc-400">
              Esclareça suas dúvidas técnicas e funcionais mais recorrentes sobre a estrutura do Atlas Fármaco.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white/5 border border-white/5 rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    id={`faq-toggle-${idx}`}
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/10"
                  >
                    <span className="font-semibold text-xs md:text-sm text-white font-display tracking-tight leading-relaxed pr-2">
                      {faq.question}
                    </span>
                    <span className={`text-zinc-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-400' : 'rotate-0'}`}>
                      <ChevronDown size={16} />
                    </span>
                  </button>

                  <div 
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? 'max-h-[300px] border-t border-white/5 p-5 bg-white/5' : 'max-h-0'
                    }`}
                  >
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 12. FINAL CTA SECTION */}
      <section className="py-20 px-4 bg-[#09090b] border-b border-white/5 text-center relative overflow-hidden">
        <div className="absolute mid-1/2 -top-10 w-96 h-96 bg-amber-500/3 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9.5px] font-mono text-amber-400 font-bold uppercase tracking-wider">
            LIBERAÇÃO INTEGRAL IMEDIATA
          </span>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-display leading-[1.15]">
            Não estude farmacologia às cegas. Torne-a visual hoje.
          </h2>

          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed max-w-lg mx-auto">
            Junte-se a milhares de estudantes de medicina, residentes de psiquiatria e profissionais que estão substituindo a decoreba mecânica pela clareza analítica estrita.
          </p>

          <div className="pt-2">
            <button
              id="final-section-cta"
              onClick={() => goToApp(registerUrl(selectedPlan))}
              className="px-8 py-4 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-lg shadow-lg shadow-amber-500/20 transition-all cursor-pointer inline-flex items-center gap-2 group font-display uppercase tracking-widest"
            >
              <span>Começar grátis agora</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="text-[10px] text-zinc-500 font-mono">
            Plataforma 100% ativa e disponível para uso imediato pós-ativação.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 bg-[#09090b] text-xs text-zinc-500 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo brand footer */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#0D1117] border border-white/10 flex items-center justify-center">
              <Brain size={13} className="text-amber-400" />
            </div>
            <span className="font-display font-semibold text-white text-xs tracking-tight">Atlas Fármaco — Tecnologia e Educação Médica</span>
          </div>

          {/* Copyright claims */}
          <div className="text-center md:text-left space-y-1">
            <p className="text-[11px]">© {new Date().getFullYear()} Atlas Fármaco. Todos os direitos reservados.</p>
            <p className="text-[10px] text-zinc-600">Material de modelagem de software didático pedagógico avançado em psiquiatria.</p>
          </div>

          {/* Quick anchor tags */}
          <div className="flex gap-4 text-[10.5px] font-mono text-zinc-600">
            <a href="#proposta-atlas" className="hover:text-zinc-400">Termos</a>
            <span>•</span>
            <a href="#proposta-atlas" className="hover:text-zinc-400">Privacidade</a>
            <span>•</span>
            <a href="#simulador-sessao" className="hover:text-zinc-400">Demo</a>
          </div>

        </div>
      </footer>

    </div>
  );
}
