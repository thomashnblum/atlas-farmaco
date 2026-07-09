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

## GitHub Actions — `Keep Supabase Alive` (INFRAESTRUTURA CRÍTICA)
Existe um workflow agendado em `.github/workflows/keep-supabase-alive.yml`.
- **O que faz:** todos os dias às `10:00 UTC` (07:00 de Brasília) — mais gatilho manual via `workflow_dispatch` — roda um `curl GET` na `VITE_SUPABASE_URL`, autenticado com a `VITE_SUPABASE_ANON_KEY`. As duas vêm de **GitHub Secrets** (`secrets.VITE_SUPABASE_URL`, `secrets.VITE_SUPABASE_ANON_KEY`), não do repositório.
- **Por que existe:** o Supabase free tier **pausa** um projeto após ~7 dias sem atividade. Esse ping periódico mantém o banco ativo.
- **Consequência se o workflow morrer** (secrets rotacionados/removidos, repo tornado privado sem Actions, cota do Actions esgotada, projeto Supabase renomeado): o banco pausa, o `dataService.ts` deixa de receber dados da nuvem e a aplicação cai **silenciosamente** no fallback do `mockData.ts` — **sem erro visível em tela** (ver [05-KNOWN_ISSUES.md](05-KNOWN_ISSUES.md) item 4, Fallbacks Fantasmas). O app parece funcionar, mas serve dados locais estáticos e todo CRUD/escrita ao banco falha.
- **Como verificar saúde:** aba **Actions** do GitHub (o run diário deve estar verde) e o painel do Supabase (projeto não deve estar "Paused"). Se os secrets forem trocados, atualizar também os secrets do repositório.

## Configuração Vercel
- **Branch de Produção:** `main`
- **Diretório de Saída:** `dist`
- **Comando de Build:** `npm run build` ou `vite build`
Não há `vercel.json` na raiz do repositório, indicando que o deploy utiliza o Vercel Zero Config padrão para projetos Vite/React.
> Nota: o único CRON conhecido do projeto é o GitHub Actions `Keep Supabase Alive` (documentado acima), não uma integração da Vercel. TODO em aberto: confirmar com o autor se há alguma Edge Function ou integração adicional configurada apenas no painel da Vercel.

## Node.js
- Espera-se a versão Node definida de forma padrão (LTS), mas o projeto está atualmente rodando sobre `v22` (ou compatível com Vite 6+).
