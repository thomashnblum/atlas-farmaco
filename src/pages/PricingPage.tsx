import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, Sparkles, ShieldCheck, Lock, ArrowRight, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEntitlement } from '../hooks/useEntitlement';
import { PLANS, PREMIUM_FEATURES } from '../data/plans';
import { MP_PLAN_URLS } from '../config/features';
import { cn } from '../utils/cn';

export const PricingPage = () => {
  const { session } = useAuth();
  const { isPremium } = useEntitlement();
  const location = useLocation();
  const cameFromLockedFeature = Boolean((location.state as { from?: unknown } | null)?.from);

  return (
    <div className="flex-1 w-full px-4 py-10 md:py-16">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Aviso quando o usuário foi barrado numa feature premium */}
        {cameFromLockedFeature && !isPremium && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 max-w-2xl mx-auto">
            <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200/90">
              Esse recurso faz parte do <strong>Atlas Premium</strong>. Escolha um plano abaixo para desbloquear as ferramentas interativas.
            </p>
          </div>
        )}

        {/* Cabeçalho */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase">
            <Sparkles size={12} /> Planos de assinatura
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight">
            Desbloqueie o Atlas completo
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            O conteúdo (transtornos, glossário e atlas visual) é livre. As ferramentas interativas de farmacodinâmica e farmacocinética fazem parte da assinatura.
          </p>
        </div>

        {/* Já é assinante */}
        {isPremium ? (
          <div className="max-w-xl mx-auto bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <Crown size={26} />
            </div>
            <h2 className="text-xl font-bold text-zinc-100">Você já é assinante</h2>
            <p className="text-sm text-zinc-400">Todas as ferramentas premium estão liberadas na sua conta.</p>
            <Link
              to="/molecules"
              className="inline-flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold rounded-xl transition-all"
            >
              Ir para o catálogo <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            {/* Grade de planos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    'relative p-8 rounded-2xl border flex flex-col justify-between bg-zinc-900/40',
                    plan.highlight ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'border-zinc-800',
                  )}
                >
                  {plan.ribbon && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-[9px] font-extrabold text-black uppercase tracking-wider shadow whitespace-nowrap">
                      {plan.ribbon}
                    </span>
                  )}
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <h3 className="font-bold text-xl text-zinc-100">{plan.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className={cn('text-3xl font-extrabold font-mono', plan.highlight ? 'text-amber-400' : 'text-zinc-100')}>
                          {plan.price}
                        </span>
                        <span className="text-xs text-zinc-500">{plan.interval}</span>
                      </div>
                      {plan.monthlyEquiv && (
                        <span className="text-[10px] text-zinc-500 font-mono block">{plan.monthlyEquiv}</span>
                      )}
                    </div>
                    <ul className="space-y-3 text-xs text-zinc-300">
                      {plan.features.map((f) => (
                        <li key={f} className="flex gap-2.5 items-center">
                          <Check size={14} className="text-amber-500 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    {session ? (
                      MP_PLAN_URLS[plan.id] ? (
                        // Logado: vai ao checkout de assinatura do Mercado Pago.
                        <a
                          href={MP_PLAN_URLS[plan.id]}
                          className={cn(
                            'w-full py-3 text-center text-xs font-bold rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2',
                            plan.highlight ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-white/5 text-zinc-200 hover:bg-white/10 border border-white/10',
                          )}
                        >
                          Assinar com Mercado Pago
                        </a>
                      ) : (
                        // Sem link configurado ainda: pagamento em finalização.
                        <button
                          type="button"
                          disabled
                          title="O pagamento (Pix e cartão) está sendo finalizado."
                          className="w-full py-3 text-center text-xs font-bold rounded-lg uppercase tracking-wider bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700"
                        >
                          Assinatura em breve
                        </button>
                      )
                    ) : (
                      // Sem conta: primeiro cria a conta grátis.
                      <Link
                        to="/register"
                        className={cn(
                          'w-full py-3 text-center text-xs font-bold rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2',
                          plan.highlight ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-white/5 text-zinc-200 hover:bg-white/10 border border-white/10',
                        )}
                      >
                        Criar conta grátis
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* O que a assinatura destrava */}
            <div className="max-w-2xl mx-auto bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-400" /> O que a assinatura destrava
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-zinc-400">
                {PREMIUM_FEATURES.map((f) => (
                  <div key={f} className="flex gap-2 items-center">
                    <Check size={13} className="text-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nota honesta sobre o pagamento */}
            {session && (MP_PLAN_URLS.mensal || MP_PLAN_URLS.anual) ? (
              <p className="text-center text-[11px] text-amber-400/80 font-mono max-w-xl mx-auto">
                Importante: no checkout do Mercado Pago, pague com o <strong>mesmo e-mail</strong> desta conta — é assim que liberamos o seu acesso premium automaticamente.
              </p>
            ) : session ? (
              <p className="text-center text-[11px] text-zinc-500 font-mono max-w-xl mx-auto">
                O checkout com Pix e cartão está em finalização. Assim que entrar no ar, você ativa o plano direto por aqui — sua conta grátis continua funcionando até lá.
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};
