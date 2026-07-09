# Registros de Decisão Arquitetural (ADRs)

Este documento registra as principais decisões de engenharia, arquitetura e produto, explicando as razões pelas quais caminhos específicos foram adotados. Útil para que futuros mantenedores não desfaçam decisões conscientes sem compreender o contexto original.

## 1. Supabase como BaaS em vez de Backend Dedicado
- **Contexto:** O projeto necessitava de persistência e autenticação rápidas, e o foco principal sempre foi a interatividade complexa e educacional no Frontend (gráficos, filtros, modais 2D).
- **Decisão:** Adotar o Supabase como Backend as a Service. A comunicação é feita direto do React via API REST cliente (`supabase-js`).
- **Consequência:** Eliminou a necessidade de orquestrar um servidor Node.js/Express, simplificando o deploy para um SPA puro na Vercel. Todavia, a lógica de negócio pesada, se existir no futuro, terá que ser feita no frontend ou usando Edge Functions.

## 2. Padrão Dual de Dados (mockData.ts + Nuvem)
- **Contexto:** Havia um receio de que limites do plano free da nuvem quebrassem o app ou que o dev precisasse estar sempre online para ver a UI renderizar. Além disso, estruturar relações farmacodinâmicas complexas via CMS exigiria centenas de horas de desenvolvimento de formulários interativos.
- **Decisão:** Manter um espelho rígido local tipado em `src/data/mockData.ts`. Ele é o ponto focal de edição de massa. Foi criado um script `executeSeed.ts` que destrói/insere os dados do mock no Supabase. O frontend tenta usar a nuvem primeiro e dá fallback silencioso para o mock.
- **Consequência:** Evita o engessamento de um painel de Admin incompleto. No entanto, para atualizar um receptor de uma molécula hoje, é mais eficiente editar o `mockData.ts` e rodar o seed do que tentar fazer isso pela UI do painel `/admin`.

## 3. Uso do d3-force em conjunto com React Force Graph
- **Contexto:** A página `/receptors` e `/navigator` requerem a renderização de mapas mentais biológicos e farmacológicos densos (milhares de pontos e arestas).
- **Decisão:** Optou-se por utilizar as bibliotecas `react-force-graph-2d` e engine matemática `d3-force`.
- **Consequência:** Oferece excelente performance e física customizável. Porém, requer que o desenvolvedor lide com layouts dinâmicos imprevisíveis (forças repelentes/atrativas) em vez de layouts fixos, e estilizar o canvas SVG em profundidade pode ser doloroso.

## 4. Estilização Utility-first com Tailwind + CSS Global Mínimo
- **Contexto:** Necessidade de criar um visual escuro, vibrante, com forte "Neon/Cyber/Glassmorphism" sem encher o app de arquivos CSS conflitantes.
- **Decisão:** O uso irrestrito de TailwindCSS para 99% do layout. O `index.css` global abriga apenas a paleta de tokens base e algumas injeções cruciais de fonte/scroll.
- **Consequência:** Permite iterar muito rápido nas telas e nos gráficos.

## > TODO: Confirmar com o autor
Se houveram outras decisões não verbais que motivaram o formato restrito do Painel Administrativo atual ou recusas ativas a bibliotecas de estado globais maduras (como Redux/Zustand), estas deverão ser incluídas aqui caso julgadas necessárias.
