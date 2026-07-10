import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { OWNER_EMAIL } from '../config/features';

export interface Entitlement {
  /** true se o usuário tem assinatura ativa (ou é o dono). */
  isPremium: boolean;
  /** true enquanto o status ainda está sendo verificado. */
  loading: boolean;
}

/**
 * Diz se o usuário logado é assinante (premium).
 *
 * Lê a coluna `is_premium` da tabela `public.profiles` no Supabase. Se a tabela
 * ainda não existe (antes da migração) ou a query falha, trata como NÃO-premium
 * sem quebrar — com o paywall desligado isso é inofensivo, pois o gate cai no login.
 *
 * O dono (OWNER_EMAIL) é sempre premium, sem depender do banco.
 */
export const useEntitlement = (): Entitlement => {
  const { user, session } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!session || !user) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    if (user.email === OWNER_EMAIL) {
      setIsPremium(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.warn('[entitlement] profiles indisponível; tratando como não-premium:', error.message);
          setIsPremium(false);
        } else {
          setIsPremium(Boolean(data?.is_premium));
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session, user]);

  return { isPremium, loading };
};
