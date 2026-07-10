import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OWNER_EMAIL } from '../config/features';

/**
 * Restringe uma rota ao dono do produto.
 *
 * Fecha a brecha em que qualquer usuário logado conseguia abrir /admin na mão
 * (a UI escondia o link, mas a rota só exigia login). A proteção definitiva é o
 * RLS do Supabase nas tabelas; este guard é a defesa de front-end.
 */
export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="flex flex-col items-center gap-4 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          <p className="text-sm font-mono tracking-widest uppercase">Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.email !== OWNER_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
