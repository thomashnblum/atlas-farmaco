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
| 5 | Estabilizadores & anticonvulsivantes | lítio, valproato, lamotrigina, carbamazepina, topiramato… | ✅ revisado |
| 6 | Ansiolíticos & hipnóticos | BZDs, drogas-Z, buspirona, gabapentinoides | ✅ revisado (sólido) |
| 7 | Estimulantes & outros | metilfenidato, anfetaminas, atomoxetina, modafinila, cafeína, suplementos | ✅ revisado |
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

### Bloco 5 — Estabilizadores de humor & anticonvulsivantes — 2026-07-10
Revisados os perfis em `mockData.ts` (lítio m27, valproato m28, lamotrigina m29, carbamazepina m30, topiramato m58) e a prosa em `moleculeDetails.ts` (ramo `isMoodStabilizer` + ramos especiais de lítio e topiramato).

**Perfis mockData: excelentes** — mecanismos e nuances corretos (inibição de GSK-3β/IMPase do lítio; valproato como inibidor de UGT que eleva a lamotrigina; meia-vida da lamotrigina que sobe com valproato e cai com indutores; autoindução da carbamazepina; HLA-B\*1502).

**Erro clínico corrigido (importante) em `moleculeDetails.ts`:**
- O ramo dos estabilizadores atribuía **"Mania Bipolar Aguda — 1ª Linha"** a **todos**, inclusive à **Lamotrigina**. A lamotrigina **não tem eficácia antimaníaca aguda** — ela previne o polo **depressivo**/manutenção. Corrigido: a indicação de mania aguda agora é condicional (lítio/valproato/carbamazepina), e a lamotrigina recebe a indicação correta ("Prevenção de Episódios Depressivos no Bipolar; não indicada para mania aguda"). A justificativa da mania também passou a citar corretamente lítio/valproato/carbamazepina.

Nota (baixa prioridade): a `psychiatryUse` do ramo é bastante floreada; factualmente ok.

### Bloco 6 — Ansiolíticos & hipnóticos — 2026-07-10
Revisados perfis em `mockData.ts` (BZDs m36-m41, drogas-Z m42-m44, buspirona m35, gabapentinoides m45-m46) e a prosa em `moleculeDetails.ts` (ramos `isBZD`, `isZDrug`, buspirona, gabapentinoides).

**Resultado: factualmente correto no nível de classe — nenhuma correção aplicada.** Verificados: glucuronidação do lorazepam (segura em hepatopatas), α1-seletividade do zolpidem vs não-seletividade da zopiclona, absorção saturável (dose-dependente inversa) da gabapentina, BZD como padrão-ouro em abstinência alcoólica e estado de mal epiléptico, pregabalina 1ª linha em TAG e dor neuropática.

Notas registradas (super-generalizações do template por classe — mesmo padrão do Bloco 4, baixo/médio impacto, não corrigidas):
- O ramo `isBZD` aplica as MESMAS indicações a todos os BZDs: "Ataque de Pânico 1ª Linha" e "Estado de Mal Epiléptico / Abstinência Alcoólica — Padrão-Ouro". Impreciso para membros específicos — ex.: **midazolam** (anestésico/procedimento, não pânico) e **alprazolam/bromazepam** (não usados em estado de mal). Corrigir bem exigiria indicações por-fármaco (proposto como refino dedicado, junto com o mesmo problema nos antipsicóticos).
- Gabapentina recebe "TAG 1ª Linha Robusto" igual à pregabalina; a evidência forte/aprovação em TAG é da **pregabalina** (gabapentina é mais off-label para ansiedade).
- Redundância: no ramo BZD, "Estado de Mal Epiléptico" e "Abstinência Alcoólica" aparecem tanto em on- quanto em offLabel.
- m44 Eszopiclona: mecanismo diz "afinidade extrínseca no GABA-A" — jargão sem sentido; trocar por "modulador alostérico positivo do GABA-A" numa passada de estilo.

**Recomendação transversal:** as super-generalizações do template (BZD + antipsicóticos) merecem um refino dedicado com indicações por-fármaco — candidato a bloco extra depois da 1ª passada.

### Bloco 7 — Estimulantes & outros — 2026-07-10
Revisados perfis em `mockData.ts` (estimulantes m51-m57; outros m47-m50) e prosa em `moleculeDetails.ts` (ramo `isStimulant`, modafinil, naltrexona, memantina, cetamina).

**Dois erros reais corrigidos** (o ramo `isStimulant` capturava cafeína e atomoxetina e aplicava a ambas "TDAH — 1ª Linha, Padrão-Ouro"):
- **m56 Cafeína** — mostrava-se como tratamento **padrão-ouro de 1ª linha para TDAH**, o que é falso. Ganhou ramo próprio: sem indicação psiquiátrica formal, usos off-label leves (astenia, adjuvante analgésico) e ênfase nos efeitos adversos (ansiedade/insônia/pânico).
- **m57 Atomoxetina** — mostrava-se como **padrão-ouro** de 1ª linha. É a opção **não-estimulante** (início 4-8 sem, sem abuso); os estimulantes é que são o padrão-ouro. Ramo próprio: TDAH 1ª linha "Robusto" (não Padrão-Ouro), perfil noradrenérgico, uso preferencial com ansiedade/tiques/risco de abuso.

**Correto (sem alteração):** metilfenidato/anfetaminas/lisdexanfetamina (padrão-ouro TDAH; lisdexa em TCAP), modafinil/armodafinil (eugeroico, narcolepsia), cetamina/esketamina (padrão-ouro em DRT via NMDA→BDNF), memantina (Alzheimer moderada-grave; adjuvante em TOC), naltrexona (dependência; LDN).

Nota: `clinicalAxes` da atomoxetina é `['Estimulante']` embora ela seja não-estimulante — quirk de taxonomia da UI (baixa prioridade). `norquetamina` deveria ser `norcetamina` na PK da cetamina (grafia, baixa prioridade).
