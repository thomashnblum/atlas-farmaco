# Atlas Fármaco

O Atlas Fármaco é um catálogo interativo visual para psicofarmacologia e psiquiatria clínica. Ele indexa perfis de moléculas (Antidepressivos, Antipsicóticos, etc), relações enzimáticas e afinidades farmacodinâmicas.

## Comandos Essenciais
- **Instalar:** `npm install`
- **Rodar servidor local (Dev):** `npm run dev`
- **Build de Produção:** `npm run build`
- **Checagem de Tipos (Lint):** `npm run lint`
- **Seedar Banco de Dados (Supabase):** `npx tsx scripts/executeSeed.ts` (Requer `.env.local` configurado com `VITE_SUPABASE_SERVICE_ROLE_KEY`).

## Convenções de Código
- Escreva componentes puramente funcionais no React (Hooks, Sem classes).
- Estilização estritamente utilitária (TailwindCSS) com classes dinâmicas unidas pelo `tailwind-merge` e `clsx`.
- Separe estritamente estado de UI e estado de fetch de dados (`dataService.ts`).
- Tipagem estrita de Modelos Farmacológicos usando as interfaces declaradas em `src/data/schema.ts`.

## Padrões Arquiteturais a Respeitar
- **Single Source of Truth na Nuvem, Single Source of Seed Local:** O Supabase é a fonte principal e roda ao vivo na Vercel e Local. Porém, qualquer manipulação profunda estrutural de dados DEVE ser feita no arquivo `mockData.ts` e despachada para o Supabase via `executeSeed.ts`. O painel `/admin` serve apenas para gerência leve (não gerencia relações Pk/Pd).
- **Graceful Fallbacks:** `dataService.ts` foi projetado para renderizar dados locais em tela imediatamente caso a requisição ao Supabase falhe ou retorne vazio (offline mode implícito).
- **Graph Engines independentes:** Lógica matemática de física para redes complexas usa `d3-force` injetado em Canvas estáticos via bibliotecas wrappers (`react-force-graph-2d`).

## Restrições
- **NÃO** instale bibliotecas massivas de componentes de UI corporativos (Material UI, AntD, Chakra). O sistema atual preza pelo visual "Neon/Vidro" desenhado à mão com Tailwind.
- **NÃO** remova o `mockData.ts` achando que é código morto/legado de testes. Ele é a principal fonte do Seeder.
- **NÃO** crie backend customizado/rotas Express na nuvem. A aplicação é Client-Side Rendering pura batendo no Supabase API via REST.
- **NÃO** insira segredos (`SERVICE_ROLE`) em variáveis expostas ao browser (`VITE_...`) exceto a `ANON_KEY`.

## Documentação Profunda
Consulte os documentos especializados da migração para maior aprofundamento:
- `docs/handoff/01-ARCHITECTURE.md` - Desenho do fluxo de dados e Stack.
- `docs/handoff/02-DATA_MODEL.md` - Como mockData converte para Supabase.
- `docs/handoff/05-KNOWN_ISSUES.md` - Armadilhas, bugs abertos e limitações.
- `docs/handoff/06-ENVIRONMENT.md` - Listagem das Variáveis de Ambiente necessárias.
