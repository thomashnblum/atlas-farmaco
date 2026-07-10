/**
 * Flags e constantes de produto.
 */

/**
 * Liga/desliga o paywall (a trava de assinatura nas features premium).
 *
 * - `false` (padrão): features premium exigem apenas LOGIN — comportamento atual,
 *   nada trava para os usuários enquanto o pagamento não existe.
 * - `true`: features premium exigem LOGIN + assinatura ativa. Ative isto (via env
 *   VITE_ENFORCE_PAYWALL=true na Vercel) no dia em que o checkout entrar no ar.
 */
export const ENFORCE_PAYWALL = import.meta.env.VITE_ENFORCE_PAYWALL === 'true';

/** Dono do produto: sempre tratado como premium e único com acesso ao /admin. */
export const OWNER_EMAIL = 'thomas.n.blum@gmail.com';
