# Dívida Técnica e Problemas Conhecidos

Este documento registra limitações aceitas, problemas que ocorrem e gambiarras conscientes. Serve para poupar tempo de debugging caso algo bizarro aconteça.

## 1. [RESOLVIDO em 2026-07-09] O build de produção não rodava type-check
- **O que era:** O comando de deploy era `vite build`, que apenas transpila via esbuild e **não executava o TypeScript compiler**. O type-check só rodava no script separado `lint`, não chamado pelo build nem por CI. Consequência: código com erro de tipo compilava, passava e era publicado — a Vercel deployava com o `tsc` quebrado sem sinal nenhum.
- **Correção aplicada:** o script de build virou `"build": "tsc --noEmit && vite build"` (`package.json`). Agora um erro de tipagem **falha o build** e barra o deploy. A divergência de enum que expunha o problema (ver [02-DATA_MODEL.md](02-DATA_MODEL.md) item 3) também foi resolvida, então o build passa limpo.
- **Melhoria futura recomendada:** adicionar um GitHub Actions que rode `npm run lint` em cada push/PR, para pegar o erro antes mesmo do deploy da Vercel (defesa em profundidade).

## 2. [RESOLVIDO em 2026-07-09] Branch `origin/master` órfã e HEAD remoto errado
- **O que era:** O repositório tinha uma branch `master` com um único commit (`feat: versão inicial`), abandonada, e o default branch do GitHub apontava para ela em vez de `main` (a branch viva de onde a Vercel deploya). Quem clonava caía em `master` e via projeto obsoleto.
- **Correção aplicada:** default branch do GitHub alterado para `main` e a branch `origin/master` deletada (verificado antes que não tinha nenhum commit exclusivo — o único commit dela já estava contido em `main`).

## 3. CMS (Painel /admin) Limitado
- **O que é:** O painel de administração permite adicionar ou editar entidades-pai (`Molecules`), mas carece da capacidade de adicionar relações (como vincular uma enzima e atribuir Ki ou papel, ou gerenciar Receptores).
- **Onde está:** `src/pages/AdminPage.tsx` e `src/services/dataService.ts`.
- **Por que existe:** O esforço de construir formulários reativos altamente complexos foi preterido em favor de gerenciar os dados por meio de edição crua em TS (`mockData.ts`) seguida de um script de Seed forçado (`executeSeed.ts`).
- **Solução ideal:** Implementar endpoints Supabase ou funções e expandir a UI do painel administrativo.

## 4. Invalidação de Cache Sutil (Fallbacks Fantasmas)
- **O que é:** Como `dataService.ts` inicializa arrays a partir do `mockData.ts` antes de ir ao Supabase, e se baseia em chaves unificadas para não duplicar dados anexados, se o banco de dados remoto for deliberadamente apagado e tentar retornar "vazio" para limpar a UI, a aplicação vai renderizar o conteúdo do `mockData` mesmo com uma resposta 200 (Success) do Supabase.
- **Onde está:** `src/services/dataService.ts` no `loadData()`.
- **Por que existe:** Desenvolvido como "Graceful Fallback" para prevenir falhas críticas.
- **Solução ideal:** Usar bibliotecas consolidadas como `SWR` ou `React Query`, separando de forma mais nítida estado hidratado do banco vs seed local estático.

## 5. Sobrescrita de Dados ao Rodar o Seed
- **O que é:** Toda vez que `npx tsx scripts/executeSeed.ts` é invocado, ele usa as exportações de `mockData.ts` para fazer um "UPSERT" agressivo no Supabase. Se alguém alterou uma entidade manualmente lá no banco de dados mas esqueceu de puxar (via PR) a mudança pro `mockData.ts`, essa mudança será aniquilada pelo Seed.
- **Onde está:** Na cultura de desenvolvimento do repositório.
- **Solução ideal:** Decidir formalmente se as migrações serão estritamente one-way (código -> db) ou adotar ferramentas formais de diffing/migration do Supabase.
