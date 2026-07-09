# Estado Atual do Projeto

Este documento apresenta um retrato honesto de onde o projeto se encontra funcionalmente e tecnicamente.

## Funcionalidades Completas e Funcionando
- **Catálogo de Moléculas (Cards e Listas)**: Indexação via `/molecules` está renderizando corretamente com base no banco de dados, incluindo busca, filtros e modais de warning off-label.
- **Visualizador 2D de Moléculas (MoleculeStructureViewer)**: Funcionalidade de inspeção de áreas químicas da molécula.
- **Gráficos de Força / Navegador**: Páginas `/receptors` e `/navigator` utilizam d3-force para representar as conexões moleculares de modo interativo.
- **Dicionário Clínico / Glossário**: Dicionário hardcoded mas funcional.
- **Autenticação**: O fluxo de Auth com Supabase protege as rotas premium (Receptores, Enzimas, Comparador) com sucesso (`ProtectedRoute`).
- **Seeding de Banco de Dados**: A infraestrutura para transição do mock local para nuvem (`scripts/executeSeed.ts`) está validada e funcional.

## Funcionalidades Parcialmente Implementadas
- **Admin CMS**: O painel (`/admin`) permite inserções e atualizações simples (CRUD de moléculas), mas não há interface polida para gerenciamento complexo de relações N:N (afinidade de receptores ou ações enzimáticas). Isso ainda requer edição via scripts ou mockData + seed.

## Funcionalidades Planejadas mas Não Iniciadas
- Nenhum recurso gigante foi declarado como faltante na UI atual, o app se porta como uma primeira versão completa (MVP maduro) do atlas.

## Varredura de Dívidas Técnicas (TODOs, FIXMEs, HACKs)
Foi realizada uma varredura completa (`grep`) no repositório inteiro.
**Resultado:** Nenhuma anotação de `TODO`, `FIXME`, `HACK` ou `XXX` foi encontrada na base de código ativa (`src/` ou `scripts/`). O código encontra-se limpo de rascunhos verbais.
