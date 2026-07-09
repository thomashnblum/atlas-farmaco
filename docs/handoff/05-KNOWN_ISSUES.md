# Dívida Técnica e Problemas Conhecidos

Este documento registra limitações aceitas, problemas que ocorrem e gambiarras conscientes. Serve para poupar tempo de debugging caso algo bizarro aconteça.

## 1. CMS (Painel /admin) Limitado
- **O que é:** O painel de administração permite adicionar ou editar entidades-pai (`Molecules`), mas carece da capacidade de adicionar relações (como vincular uma enzima e atribuir Ki ou papel, ou gerenciar Receptores).
- **Onde está:** `src/pages/AdminPage.tsx` e `src/services/dataService.ts`.
- **Por que existe:** O esforço de construir formulários reativos altamente complexos foi preterido em favor de gerenciar os dados por meio de edição crua em TS (`mockData.ts`) seguida de um script de Seed forçado (`executeSeed.ts`).
- **Solução ideal:** Implementar endpoints Supabase ou funções e expandir a UI do painel administrativo.

## 2. Invalidação de Cache Sutil (Fallbacks Fantasmas)
- **O que é:** Como `dataService.ts` inicializa arrays a partir do `mockData.ts` antes de ir ao Supabase, e se baseia em chaves unificadas para não duplicar dados anexados, se o banco de dados remoto for deliberadamente apagado e tentar retornar "vazio" para limpar a UI, a aplicação vai renderizar o conteúdo do `mockData` mesmo com uma resposta 200 (Success) do Supabase.
- **Onde está:** `src/services/dataService.ts` no `loadData()`.
- **Por que existe:** Desenvolvido como "Graceful Fallback" para prevenir falhas críticas.
- **Solução ideal:** Usar bibliotecas consolidadas como `SWR` ou `React Query`, separando de forma mais nítida estado hidratado do banco vs seed local estático.

## 3. Sobrescrita de Dados ao Rodar o Seed
- **O que é:** Toda vez que `npx tsx scripts/executeSeed.ts` é invocado, ele usa as exportações de `mockData.ts` para fazer um "UPSERT" agressivo no Supabase. Se alguém alterou uma entidade manualmente lá no banco de dados mas esqueceu de puxar (via PR) a mudança pro `mockData.ts`, essa mudança será aniquilada pelo Seed.
- **Onde está:** Na cultura de desenvolvimento do repositório.
- **Solução ideal:** Decidir formalmente se as migrações serão estritamente one-way (código -> db) ou adotar ferramentas formais de diffing/migration do Supabase.
