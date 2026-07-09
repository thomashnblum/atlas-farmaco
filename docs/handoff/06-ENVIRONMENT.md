# Ambiente e Configurações

Este documento registra as dependências, comandos e ambiente de deploy.

## Variáveis de Ambiente
O projeto depende de três variáveis de ambiente injetadas no arquivo `.env.local` (ou configuradas na Vercel):
- `VITE_SUPABASE_URL`: (Obrigatória) URL da API REST do Supabase. Consumida pelo `dataService.ts`.
- `VITE_SUPABASE_ANON_KEY`: (Obrigatória) Chave pública anônima para queries comuns. Consumida pelo `dataService.ts`.
- `VITE_SUPABASE_SERVICE_ROLE_KEY`: (Opcional para runtime UI, Obrigatória para Seeding) Chave com bypass de RLS, utilizada apenas localmente no script `scripts/executeSeed.ts` para forçar inserts. NUNCA exponha no frontend.

## Comandos de Desenvolvimento
- Instalar dependências: `npm install`
- Rodar servidor local: `npm run dev`
- Realizar build de produção: `npm run build`
- Limpar cache/build: `npm run clean`
- Executar o seeder no Supabase: `npx tsx scripts/executeSeed.ts`

## Resultados de Integração Contínua (Momento do Handoff)
Ao rodar os comandos no estado atual (`pre-claude-handoff`):
- `npm run build`: **PASSOU** (~5.88s). Apresenta apenas warning de chunk size na Vercel: `Some chunks are larger than 500 kB after minification.`
- `npm run lint`: **FALHOU**. Erro de tipagem em `src/data/mockData.ts(351,40): error TS2322: Type "Substrato Principal" is not assignable to type "EnzymaticRole".` (Débito técnico gerado na edição da Bupropiona onde o Type `EnzymaticRole` do `schema.ts` não engloba este novo valor, mas o build passa ignorando erros TypeScript).

## Configuração Vercel
- **Branch de Produção:** `main`
- **Diretório de Saída:** `dist`
- **Comando de Build:** `npm run build` ou `vite build`
Não há `vercel.json` na raiz do repositório, indicando que o deploy utiliza o Vercel Zero Config padrão para projetos Vite/React.
> TODO: Confirmar com o autor se existe alguma integração externa customizada (ex: CRON jobs ou Edge Functions) configurada apenas no painel da Vercel.

## Node.js
- Espera-se a versão Node definida de forma padrão (LTS), mas o projeto está atualmente rodando sobre `v22` (ou compatível com Vite 6+).
