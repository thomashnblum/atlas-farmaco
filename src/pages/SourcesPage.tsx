import React from 'react';
import { BookOpen, Activity, FlaskConical, Brain, FileText, ShieldCheck, Microscope } from 'lucide-react';

interface SourceGroup {
  icon: React.ElementType;
  area: string;
  grounds: string;
  refs: { name: string; detail: string }[];
}

const SOURCE_GROUPS: SourceGroup[] = [
  {
    icon: Activity,
    area: 'Farmacodinâmica & Afinidades (Ki)',
    grounds: 'Constantes de afinidade (Ki) e tipo de ação (agonista/antagonista) nos receptores e transportadores.',
    refs: [
      { name: 'PDSP Ki Database', detail: 'NIMH Psychoactive Drug Screening Program — banco de referência de constantes de ligação (Ki).' },
      { name: 'IUPHAR/BPS Guide to PHARMACOLOGY', detail: 'Base curada pela União Internacional de Farmacologia para alvos e ligantes.' },
    ],
  },
  {
    icon: FlaskConical,
    area: 'Farmacocinética & CYP450',
    grounds: 'Meia-vida, biodisponibilidade, metabolismo e papéis enzimáticos (substrato/inibidor/indutor).',
    refs: [
      { name: 'Bulas FDA & ANVISA', detail: 'Informação de prescrição oficial (parâmetros PK, indicações e alertas).' },
      { name: 'Tabela de Flockhart (CYP450)', detail: 'Division of Clinical Pharmacology, Indiana University — referência de interações do citocromo P450.' },
    ],
  },
  {
    icon: BookOpen,
    area: 'Mecanismos & Uso Clínico',
    grounds: 'Racional de mecanismo de ação, indicações on/off-label e perfis de efeitos adversos.',
    refs: [
      { name: 'Stahl — Psicofarmacologia Essencial', detail: 'Stahl SM, "Essential Psychopharmacology" — referência do modelo de neurotransmissão adotado.' },
      { name: 'DrugBank', detail: 'Base farmacológica de fármacos, alvos e vias metabólicas.' },
    ],
  },
  {
    icon: Brain,
    area: 'Diagnóstico & Transtornos',
    grounds: 'Definições, critérios e nomenclatura dos transtornos psiquiátricos.',
    refs: [
      { name: 'DSM-5-TR', detail: 'Manual Diagnóstico e Estatístico da Associação Americana de Psiquiatria (APA).' },
      { name: 'CID-11', detail: 'Classificação Internacional de Doenças da Organização Mundial da Saúde (OMS).' },
    ],
  },
  {
    icon: Microscope,
    area: 'Literatura Primária',
    grounds: 'Evidência de eficácia, linhas de tratamento e usos emergentes.',
    refs: [
      { name: 'PubMed / MEDLINE', detail: 'Ensaios clínicos, meta-análises e revisões sistemáticas indexadas.' },
    ],
  },
];

export const SourcesPage = () => {
  return (
    <div className="flex-1 w-full px-4 py-10 md:py-16">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Cabeçalho */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase">
            <FileText size={12} /> Fontes & Metodologia
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight">
            Sobre o que o Atlas se apoia
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            O conteúdo do Atlas Fármaco é compilado e revisado a partir de fontes secundárias consolidadas e de literatura revisada por pares. Abaixo, o que embasa cada camada de dados.
          </p>
        </div>

        {/* Grupos de fontes */}
        <div className="space-y-4">
          {SOURCE_GROUPS.map((g) => (
            <div key={g.area} className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <g.icon size={18} />
                </div>
                <div className="space-y-3 flex-1 min-w-0">
                  <div>
                    <h2 className="text-base font-bold text-zinc-100 font-display">{g.area}</h2>
                    <p className="text-xs text-zinc-500 leading-relaxed">{g.grounds}</p>
                  </div>
                  <ul className="space-y-2">
                    {g.refs.map((r) => (
                      <li key={r.name} className="text-xs">
                        <span className="font-semibold text-amber-400/90">{r.name}</span>
                        <span className="text-zinc-500"> — {r.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Metodologia */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2 font-display">
            <ShieldCheck size={16} className="text-amber-400" /> Metodologia e revisão
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Os dados são curados manualmente a partir das fontes acima e passam por auditoria científica por blocos (farmacodinâmica, farmacocinética, perfis de receptor, transtornos e tratamentos). Valores de afinidade e parâmetros farmacocinéticos representam faixas típicas de referência — a variabilidade entre estudos e populações é inerente à farmacologia.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-6">
          <p className="text-xs text-zinc-300 leading-relaxed">
            <strong className="text-amber-400/90">Aviso.</strong> O Atlas Fármaco é uma ferramenta <strong>estritamente educacional</strong> de apoio ao estudo da psicofarmacologia. Não substitui o julgamento clínico, a bula do medicamento nem a decisão terapêutica do profissional de saúde, a quem cabe a autonomia e a responsabilidade final sobre qualquer conduta.
          </p>
        </div>
      </div>
    </div>
  );
};
