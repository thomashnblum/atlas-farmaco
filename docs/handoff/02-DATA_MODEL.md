# Modelo de Dados

O Atlas Fármaco é fortemente orientado a dados (Data-Driven). Todos os perfis de moléculas e interações derivam da sua camada de dados.

## Onde os dados vivem: Supabase vs mockData

Existe uma dualidade estrutural projetada entre os dados locais e na nuvem:

**1. Qual está ativo em desenvolvimento e produção?**
O banco de dados **Supabase** é a fonte principal (Single Source of Truth) para ambos os ambientes (dev e prod). O frontend sempre tentará puxar e espelhar o Supabase quando inicializa.

**2. Como o código decide entre um e outro?**
Não há flag condicional (ex: se dev usar X). O arquivo `src/services/dataService.ts` inicializa as variáveis de memória com o conteúdo de `src/data/mockData.ts`. Durante o `loadData()`, ele bate na API do Supabase. Se houver sucesso, os dados do Supabase **sobrescrevem** o mockData. Se houver falha de rede, as variáveis permanecem com os valores do `mockData.ts` (funcionando como um Graceful Fallback). Além disso, dados do `mockData` que não existam no Supabase são anexados em tela (merging).

**3. Os schemas estão sincronizados?**
**Sim, atualmente sincronizados.** As interfaces em `src/data/schema.ts` validam o `mockData.ts` e `npm run lint` (`tsc --noEmit`) passa limpo.

Histórico (resolvido em 2026-07-09): houve uma divergência ativa. O tipo `EnzymaticRole` (`src/data/schema.ts:15`) é a união fechada `'Substrato' | 'Inibidor Forte' | 'Inibidor Moderado' | 'Inibidor Fraco' | 'Indutor Forte' | 'Indutor Moderado' | 'Indutor Fraco'`, e o registro de PK da Bupropiona (`mockData.ts:351`, introduzido no fix da m31) usava `role: 'Substrato Principal'`, valor fora da união — quebrando o lint com `TS2322`. Foi normalizado para `'Substrato'` (o canônico), com a nuance clínica "substrato principal do CYP2B6" preservada no campo `notes`. Optou-se por normalizar em vez de estender a união porque a lógica do app compara o papel por igualdade exata (`role === 'Substrato'` em `useInteractionSimulator.ts` e `NavigatorPage.tsx`); um valor novo faria a Bupropiona ser ignorada silenciosamente pelo simulador de interações e pelo grafo.

**4. O mockData é legado ou arquitetura deliberada?**
O `mockData.ts` é infraestrutura deliberada. Ele serve para três propósitos:
- Fallback em caso de indisponibilidade da nuvem.
- Ambiente rápido de testes de interface sem rede.
- **A Fonte Primária para Seeding** (população inicial).

**5. Existe migração ou seed que popula o Supabase a partir do mockData?**
Sim. O script em `scripts/executeSeed.ts` lê as exportações do `mockData.ts` e utiliza a chave Service Role (ignorando RLS) para fazer um UPSERT agressivo de todos os dados do mock local diretamente para as tabelas de produção do Supabase.

## Schemas Principais
Definidos em `src/data/schema.ts`:
- **Molecule**: `id, name, tradeNames, class, clinicalAxes, mechanisms, notes...`
- **Receptor**: `id, name, type, neurotransmitterSystem`
- **MetabolicEnzyme**: `id, name, location`
- **MoleculeReceptorInteraction (PD)**: `moleculeId, receptorId, actionType, affinityKi`
- **MoleculeEnzymeInteraction (PK)**: `moleculeId, enzymeId, role`

## Exemplo de Registro (Bupropiona)
```json
{
  "id": "m31",
  "name": "Bupropiona",
  "class": "Antidepressivo Atípico",
  "clinicalAxes": ["Antidepressivo", "Estimulante"],
  "mechanisms": "Inibidor da recaptação de noradrenalina e dopamina (IRND)."
}
```

## Origem dos Dados
Curadoria manual. Textos e classificações vêm de literatura revisada de farmacologia, convertidos estaticamente para o `mockData.ts` ou inseridos pelo CMS próprio em `/admin`.
