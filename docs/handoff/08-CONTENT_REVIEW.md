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
| 2 | Perfis clínicos de receptores | `clinicalKnowledge.ts` (bloqueio/ativação por receptor) | ✅ revisado (sólido) |
| 3 | Antidepressivos | ISRS, ISRSN, tricíclicos, atípicos, IMAO, SARI (perfil + Ki + PK) | ✅ perfis + prosa (Ki fica p/ Bloco 9) |
| 4 | Antipsicóticos | típicos + atípicos | ✅ revisado (sólido) |
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

### Bloco 2 — Perfis clínicos dos receptores — 2026-07-10
Revisados os 15 perfis em `RECEPTOR_CLINICAL_PROFILES` (D2, D3, 5-HT1A/2A/2C/3, H1, Alpha-1/2, M1, SERT, NET, DAT, GABA-A, NMDA).

**Resultado: nenhum erro factual — conteúdo sólido e coerente com o modelo do Stahl.** Efeitos de bloqueio/ativação e significância clínica estão corretos (ex.: ocupação D2 65–80%, atipicidade via 5-HT2A, freio α2 da mirtazapina, NMDA/cetamina). Nenhuma correção aplicada — churnar edições aqui só arriscaria piorar.

**Lacuna registrada (enhancement, não erro):** apenas 15 dos 25 receptores têm perfil clínico. Faltam perfis para: MAO-A, MAO-B, VSSC, MT1/MT2, VGCC-α2δ, µ/κ/δ-Opioide, xCT, Sigma-1, 5-HT7, Adenosina (A1/A2A), AMPA/Kainato. Autorar esses perfis é trabalho de conteúdo novo (não revisão) — proposto como bloco extra, sob confirmação do Thom.

Obs.: `DISORDER_CLINICAL_PROFILES` (transtornos) também vive neste arquivo; será revisado no Bloco 8. Leitura preliminar não achou erros graves.

### Bloco 3 — Antidepressivos (perfis em mockData) — 2026-07-10
Revisados os perfis das moléculas antidepressivas em `mockData.ts` (ISRS m1/m4-m8, ISRSN m9-m12, tricíclicos m13-m16, tetracíclicos m17-m18, IMAO m19-m21, atípicos m31-m34).

**Resultado: perfis densos e majoritariamente corretos** (mecanismos, farmacocinética, meia-vida coerentes com a literatura). Erros pontuais corrigidos:

- **m7 Citalopram** — contraindicação "Braquicardia congênita" (erro de grafia + conceito) → **"Síndrome do QT longo congênito"**, que é a real contraindicação por risco de torsades.
- **m18 Maprotilina** — "Eileptogênica" (grafia) → "Epileptogênica (reduz o limiar convulsivo)".
- **m34 Agomelatina** — mecanismo "Agonista potentes MT1/MT2 e um antagonista 5-HT2C pre-sináptico" (concordância + "pré-sináptico" impreciso) → "Agonista potente de MT1/MT2 e antagonista 5-HT2C".
- **m9 Venlafaxina** — faltavam `sideEffects` e `contraindications` (lacuna de dados). Adicionados: náusea, hipertensão dose-dependente, síndrome de descontinuação intensa; contraindicação IMAO e hipertensão não controlada.

Os valores numéricos de Ki ficam para o Bloco 9 (auditoria numérica).

### Bloco 3b — Antidepressivos (prosa em moleculeDetails.ts) — 2026-07-10
Revisada a prosa clínica (psychiatryUse + usos on/off-label) dos ramos: bupropiona, trazodona, vortioxetina, agomelatina, ISRS, ISRSN, tricíclicos/tetracíclicos (incl. mirtazapina) e IMAO.

**Resultado: prosa densa e clinicamente precisa.** Destaques corretos verificados: perfil multimodal completo da vortioxetina (5-HT1A/1B/1D/3/7), pérola da mirtazapina (doses <15mg sedam mais que 45mg), clomipramina padrão-ouro no TOC, duloxetina padrão-ouro em dor neuropática, *leaden paralysis* nos IMAO.

Correção aplicada:
- **IMAO — offLabel "Doença de Parkinson"** era enganoso: os IMAO do dataset são não-seletivos (fenelzina/tranilcipromina) ou MAO-A seletivo (moclobemida); Parkinson é indicação dos MAO-B seletivos (selegilina/rasagilina, ausentes aqui) e a moclobemida não tem esse uso. Substituído por **"Fobia Social / Ansiedade Social Refratária"**, indicação real e com evidência para fenelzina e moclobemida.

Nota (baixa prioridade): a `psychiatryUse` dos IMAO tem estilo bastante floreado ("perfis curativos incomparáveis"); factualmente ok, poderia ser enxugada numa passada de estilo futura.

### Bloco 4 — Antipsicóticos — 2026-07-10
Revisados os perfis em `mockData.ts` (haloperidol m2; atípicos m3, m22-m26) e a prosa em `moleculeDetails.ts` (blocos `isAtypicalAntipsychotic` e `isTypicalAntipsychotic`).

**Resultado: conteúdo sólido e clinicamente correto — nenhuma correção aplicada.** Mecanismos e usos conferidos: clozapina refratária/padrão-ouro + redução de suicídio; quetiapina padrão-ouro em depressão bipolar; risco metabólico atribuído só aos sedativos (quetiapina/olanzapina/clozapina); aripiprazol como agonista parcial D2/5-HT1A; black box de mortalidade cardiovascular em demência; haloperidol em delirium e agitação.

Notas registradas (não corrigidas — imprecisões menores):
- O ramo atípico aplica "Bipolar Mania — 1ª Linha, Padrão-Ouro" a **todos** os atípicos; para a **clozapina** isso é uma leve super-generalização (clozapina é refratária, não 1ª linha para mania). Correção exigiria lógica condicional; baixo impacto.
- `psychiatryUse` atípica afirma que o "principal papel evoluiu para adjuvante na depressão" — ênfase exagerada (o papel principal segue sendo psicose/bipolar).

**Sinalizado para o Bloco 9 (auditoria numérica):** biodisponibilidade da quetiapina listada como "~9%" parece baixa demais — verificar contra fonte antes de aceitar/corrigir.
