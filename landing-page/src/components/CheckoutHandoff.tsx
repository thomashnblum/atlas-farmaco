import React from 'react';
import { Check, ArrowRight, ShieldCheck, LogIn, Sparkles } from 'lucide-react';
import { registerUrl, loginUrl, goToApp } from '../config';

interface CheckoutHandoffProps {
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
}

const planTitles: { [key: string]: string } = {
  mensal: 'Plano Mensal',
  anual: 'Plano Anual',
};

const planPrices: { [key: string]: string } = {
  mensal: 'R$ 19,90',
  anual: 'R$ 167,90',
};

const planIntervals: { [key: string]: string } = {
  mensal: '/ mês',
  anual: '/ ano',
};

/**
 * Ponte da landing para o produto real.
 *
 * Substitui o antigo checkout simulado (que só gravava no localStorage e exibia
 * um recibo falso). Aqui o visitante cria uma conta grátis de verdade no app e
 * o plano escolhido é levado junto para o checkout — que será ligado quando o
 * pagamento (Pix/cartão) estiver pronto.
 */
export default function CheckoutHandoff({ selectedPlan, setSelectedPlan }: CheckoutHandoffProps) {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="glow-card bg-zinc-900/40 p-6 md:p-8 rounded-2xl flex flex-col gap-5 border border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-[3px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"></div>

        <div className="space-y-1.5 text-center md:text-left">
          <span className="text-[10px] font-mono tracking-wider text-amber-400 font-bold uppercase flex items-center gap-1.5 justify-center md:justify-start">
            <Sparkles size={11} /> Comece agora — grátis
          </span>
          <h4 className="text-xl md:text-2xl font-semibold font-display text-white">Crie sua conta e explore</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Você entra de graça e já navega o conteúdo. As ferramentas premium são ativadas com a assinatura, dentro do próprio app.
          </p>
        </div>

        {/* Seletor de plano */}
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400 font-medium block">Plano de interesse</label>
          <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            {(['mensal', 'anual'] as const).map((plan) => (
              <button
                key={plan}
                type="button"
                onClick={() => setSelectedPlan(plan)}
                className={`py-2 px-1 text-[10px] sm:text-xs font-semibold rounded-lg font-display cursor-pointer transition-all ${
                  selectedPlan === plan ? 'bg-amber-500 text-black shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {plan === 'mensal' ? 'Mensal' : 'Anual'}
              </button>
            ))}
          </div>
        </div>

        {/* Resumo do plano */}
        <div className="bg-zinc-950/85 px-4 py-3 rounded-xl border border-zinc-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-mono text-zinc-500 block">Plano selecionado</span>
            <span className="text-xs font-bold text-zinc-200">{planTitles[selectedPlan]}</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-amber-400 font-mono">{planPrices[selectedPlan]}</span>
            <span className="text-[10px] text-zinc-500 block">{planIntervals[selectedPlan]}</span>
          </div>
        </div>

        {/* O que já entra grátis */}
        <ul className="space-y-2.5 text-xs text-zinc-400">
          <li className="flex gap-2.5 items-center">
            <Check size={13} className="text-amber-500 shrink-0" />
            <span>Conta criada na hora, sem cartão</span>
          </li>
          <li className="flex gap-2.5 items-center">
            <Check size={13} className="text-amber-500 shrink-0" />
            <span>Acesso livre ao conteúdo (transtornos, glossário, atlas visual)</span>
          </li>
          <li className="flex gap-2.5 items-center">
            <Check size={13} className="text-amber-500 shrink-0" />
            <span>Ferramentas premium liberadas ao assinar</span>
          </li>
        </ul>

        {/* CTA principal → cadastro grátis no app */}
        <button
          type="button"
          onClick={() => goToApp(registerUrl(selectedPlan))}
          className="w-full py-4 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 group font-display uppercase tracking-wider"
        >
          <span>Criar conta grátis e explorar</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px] text-zinc-500">
          <button
            type="button"
            onClick={() => goToApp(loginUrl())}
            className="hover:text-zinc-300 transition-colors cursor-pointer inline-flex items-center gap-1.5 font-mono"
          >
            <LogIn size={11} /> Já tenho conta — entrar
          </button>
          <span className="inline-flex items-center gap-1.5 font-mono">
            <ShieldCheck size={11} className="text-emerald-400" /> Pagamento seguro em breve (Pix e cartão)
          </span>
        </div>
      </div>
    </div>
  );
}
