import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEntitlement } from '../hooks/useEntitlement';
import { ENFORCE_PAYWALL } from '../config/features';

const Verifying = ({ label }: { label: string }) => (
  <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-8rem)]">
    <div className="flex flex-col items-center gap-4 text-zinc-500">
      <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      <p className="text-sm font-mono tracking-widest uppercase">{label}</p>
    </div>
  </div>
);

/**
 * Protege uma feature premium.
 *
 * Sempre exige login. A trava de ASSINATURA só é aplicada quando ENFORCE_PAYWALL
 * está ligado — assim, enquanto o pagamento não existe, o paywall fica desligado
 * e qualquer usuário logado passa (comportamento atual preservado). Quando ligado,
 * usuários sem assinatura são levados à página de planos.
 */
export const RequireSubscription = ({ children }: { children: React.ReactNode }) => {
  const { session, loading: authLoading } = useAuth();
  const { isPremium, loading: entLoading } = useEntitlement();
  const location = useLocation();

  if (authLoading) return <Verifying label="Verificando credenciais..." />;

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (ENFORCE_PAYWALL) {
    if (entLoading) return <Verifying label="Verificando assinatura..." />;
    if (!isPremium) {
      return <Navigate to="/pricing" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
};
