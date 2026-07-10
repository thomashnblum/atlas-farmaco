# Revisão de Conteúdo Científico — Atlas Fármaco

Registro-mestre da auditoria teórica (farmacologia/psiquiatria) do conteúdo do app.
Objetivo: revisar **todo** o conteúdo científico, corrigir erros, padronizar e, onde
possível, fortalecer com fontes confiáveis. Feito por blocos, com log recuperável.

## Onde vive o conteúdo
- `src/data/mockData.ts` — 58 moléculas (perfil + farmacocinética), 25 receptores, 8 enzimas, e as tabelas de relação (afinidade Ki, tipo de ação, papéis enzimáticos, tratamentos por transtorno).
- `src/data/moleculeDetails.ts` — função `getMoleculeDetails()` com prosa por molécula (mecanismo, usos on/off-label).
- `src/data/clinicalKnowledge.ts` — perfis clínicos por receptor (efeitos de bloqueio/ativação) e transtornos.
- `src/data/schema.ts` — tipos (fonte da verdade estrutural).

## Metodologia
- 1ª passada por bloco: corrigir erros factuais claros a partir de farmacologia consolidada (Stahl, IUPHAR/Guide to Pharmacology, DrugBank, bulas FDA/ANVISA).
- Itens de alto risco (valores de Ki, tipo agonista/antagonista, indicações de bula) sinalizados para verificação dirigida.
- Correções registradas aqui com o "porquê". Onde uma fonte fortalece, é citada.
- O campo `sources` das interações está hoje **vazio**; preencher é meta de médio prazo (começar pelas correções de maior impacto).

## Plano por blocos e status
| # | Bloco | Escopo | Status |
|---|-------|--------|--------|
| 1 | Alvos | 25 receptores + 8 enzimas (definições/tipos) em mockData | ✅ 1ª passada |
| 2 | Perfis clínicos de receptores | `clinicalKnowledge.ts` (bloqueio/ativação por receptor) | ⬜ pendente |
| 3 | Antidepressivos | ISRS, ISRSN, tricíclicos, atípicos, IMAO, SARI (perfil + Ki + PK) | ⬜ pendente |
| 4 | Antipsicóticos | típicos + atípicos | ⬜ pendente |
| 5 | Estabilizadores & anticonvulsivantes | lítio, valproato, lamotrigina, carbamazepina, topiramato… | ⬜ pendente |
| 6 | Ansiolíticos & hipnóticos | BZDs, drogas-Z, buspirona, gabapentinoides | ⬜ pendente |
| 7 | Estimulantes & outros | metilfenidato, anfetaminas, atomoxetina, modafinila, cafeína, suplementos | ⬜ pendente |
| 8 | Transtornos & tratamentos | transtornos + linhas de tratamento (DisorderTreatment) | ⬜ pendente |
| 9 | Afinidades Ki (auditoria numérica) | conferir valores de Ki das interações vs IUPHAR/PDSP | ⬜ pendente |

---

## Log de correções

### Bloco 1 — Alvos (receptores + enzimas) — 2026-07-10
Erros corrigidos em `src/data/mockData.ts`:

- **r20 `xCT` — tipo errado.** Estava `type: 'Enzima Alvo'`. O xCT (sistema xc−, SLC7A11) é um **transportador** (antiporter cistina-glutamato), não uma enzima. → `type: 'Transportador'`; descrição enriquecida (alvo indireto da N-acetilcisteína).
- **r15 `VGCC-α2δ` — rótulo enganoso.** Estava `neurotransmitterSystem: 'GABAérgico/Glutamatérgico'`. A subunidade α2δ é o alvo dos **gabapentinoides**, que reduzem liberação de neurotransmissores excitatórios; apesar do nome "gaba", **não agem no GABA**. → sistema corrigido para `'Glutamatérgico / Cálcio'`.
- **r10 `MAO-A`** — descrição imprecisa ("preferencialmente a tiramina"). Reescrita: cataboliza serotonina/noradrenalina; a MAO-A **intestinal** degrada a tiramina dietética (base da crise hipertensiva do queijo com IMAOs).
- **r11 `MAO-B`** — descrição imprecisa ("focada em dopamina e tiramina"). Reescrita: metaboliza preferencialmente feniletilamina e contribui para o catabolismo de dopamina no SNC; alvo da selegilina (IMAO-B).
- **e3 `CYP1A2`** — dizia estar ligada "estritamente" ao tabaco. Reescrita: metaboliza cafeína, clozapina, olanzapina, duloxetina; induzida pela fumaça do tabaco (relevante para dose de clozapina em fumantes).
- **e4 `CYP2C19`** — texto confuso ("subgrupos exóticos"). Reescrita: metaboliza escitalopram/citalopram, diazepam, clopidogrel, IBPs; forte polimorfismo genético.

Notas / pendências deste bloco:
- r15: a `description` usa escape unicode `α2δ`; a nota "não age no GABA" ainda pode ser reforçada no perfil dos gabapentinoides (Bloco 6).
- r7 `M1`: descrição mistura efeitos antimuscarínicos gerais; refinar em passada futura (baixa prioridade).
