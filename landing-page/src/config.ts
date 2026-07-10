/**
 * Configuração de integração da landing (site de vendas) com o app (produto).
 *
 * A landing e o Atlas são deploys separados (topologia por subdomínio):
 *   - Landing: atlasfarmaco.com.br      (este projeto)
 *   - App:     app.atlasfarmaco.com.br  (o Atlas)
 *
 * Enquanto o domínio próprio não é comprado, VITE_APP_URL cai no deploy atual
 * da Vercel. Quando o domínio existir, basta setar VITE_APP_URL nas env vars da
 * Vercel para "https://app.atlasfarmaco.com.br" — nada no código muda.
 */
export const APP_URL = (
  (import.meta.env.VITE_APP_URL as string | undefined) || 'https://atlas-farmaco.vercel.app'
).replace(/\/+$/, '');

/**
 * O app usa HashRouter, então toda rota vive atrás de `/#/`.
 * appRoute('register') => https://.../#/register
 */
export const appRoute = (path = ''): string => {
  const clean = path.replace(/^\/+/, '');
  return `${APP_URL}/#/${clean}`;
};

/** Cadastro grátis. O plano escolhido é carregado para o checkout futuro do app. */
export const registerUrl = (plan?: string): string =>
  appRoute(plan ? `register?plan=${encodeURIComponent(plan)}` : 'register');

/** Login de quem já tem conta. */
export const loginUrl = (): string => appRoute('login');

/** Navega o navegador para uma rota do app (mesma aba — é a saída do funil). */
export const goToApp = (url: string): void => {
  window.location.assign(url);
};
