# Dívida Técnica e Problemas Conhecidos

Este documento registra limitações aceitas, problemas que ocorrem e gambiarras conscientes. Serve para poupar tempo de debugging caso algo bizarro aconteça.

## 1. [CRÍTICO] O build de produção NÃO roda type-check
- **O que é:** O comando de deploy é `vite build` (ver `package.json`), que apenas transpila via esbuild e **não executa o TypeScript compiler**. O type-check só acontece no script separado `lint` (`tsc --noEmit`), que **não é chamado pelo build nem por nenhum gate de CI**. Consequência: código com erros de tipagem compila, passa e é publicado. A Vercel deploya silenciosamente mesmo com o `tsc` quebrado.
- **Prova concreta:** Hoje `npm run lint` falha (`src/data/mockData.ts:351` — `TS2322`, valor `'Substrato Principal'` fora da união `EnzymaticRole`; ver [02-DATA_MODEL.md](02-DATA_MODEL.md) item 3), mas `npm run build` passa e a Vercel deploya. O erro está em produção sem sinal nenhum.
- **Onde está:** `package.json` (`"build": "vite build"` sem `tsc`), e ausência de workflow de CI que rode `lint`.
- **Por que é grave:** Qualquer regressão de tipagem chega em produção sem barreira. O type system existe mas não protege nada no caminho de deploy.
- **Solução ideal:** Fazer o build type-checkar antes de transpilar — `"build": "tsc --noEmit && vite build"` — e/ou adicionar um GitHub Actions que rode `npm run lint` em cada push/PR e bloqueie o merge se falhar. (Não aplicado aqui: mudar o comando de build fará o deploy atual quebrar de imediato por causa do TS2322 pré-existente — resolver a divergência do enum antes.)

## 2. Branch `origin/master` órfã e HEAD remoto apontando errado
- **O que é:** O repositório tem uma branch `master` com um único commit (`feat: versão inicial`), abandonada. O `HEAD` padrão do GitHub aponta para `origin/master`, não para `origin/main` (a branch viva de onde a Vercel deploya).
- **Por que importa:** Quem clona o repo cai em `master` por padrão e vê um projeto vazio/obsoleto; ferramentas que assumem o default branch podem operar sobre lixo. É fonte de confusão e de erro operacional.
- **Solução ideal:** No painel do GitHub (Settings → Branches), mudar o default branch para `main` e então deletar `origin/master`. **Ação destrutiva e fora do repositório — requer o Thom.**

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
