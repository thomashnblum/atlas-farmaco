import { ProfileSymbolKey } from './schema';

export interface SymbolDefinition {
  key: ProfileSymbolKey;
  label: string;
  shortLabel: string;
  symbol: string;
  colorClass: string;     // Tailwind text color
  bgClass: string;        // Tailwind background color
  borderClass: string;    // Tailwind border color
  description: string;
  clinicalSignificance: string;
}

export const SYMBOL_DEFINITIONS: Record<ProfileSymbolKey, SymbolDefinition> = {
  serotonergic: {
    key: 'serotonergic',
    label: 'Serotoninérgico',
    shortLabel: '5-HT',
    symbol: '🌀',
    colorClass: 'text-teal-400',
    bgClass: 'bg-teal-500/10',
    borderClass: 'border-teal-500/30',
    description: 'Fármaco com forte ação sobre o sistema serotoninérgico (geralmente via inibição de SERT ou agonismo 5-HT1A).',
    clinicalSignificance: 'Essencial no tratamento de depressão, ansiedade generalizada, TOC e pânico. Pode causar disfunção sexual e síndrome serotoninérgica em altas doses.'
  },
  noradrenergic: {
    key: 'noradrenergic',
    label: 'Noradrenérgico',
    shortLabel: 'NE',
    symbol: '⚡',
    colorClass: 'text-orange-400',
    bgClass: 'bg-orange-500/10',
    borderClass: 'border-orange-500/30',
    description: 'Fármaco que eleva a noradrenalina na fenda sináptica (via inibição de NET ou antagonismo alfa-2).',
    clinicalSignificance: 'Aumenta o foco, a energia e o alerta. Muito útil em depressões melancólicas, apáticas e no TDAH. Pode elevar a pressão arterial e batimentos cardíacos.'
  },
  dopaminergic: {
    key: 'dopaminergic',
    label: 'Dopaminérgico',
    shortLabel: 'DA',
    symbol: '🧠',
    colorClass: 'text-cyan-400',
    bgClass: 'bg-cyan-500/10',
    borderClass: 'border-cyan-500/30',
    description: 'Atuação direta ou indireta no sistema dopaminérgico (via bloqueio D2, inibição de DAT ou liberação de dopamina).',
    clinicalSignificance: 'Modula o sistema de recompensa, motivação e funções motoras. Bloqueadores D2 tratam psicose e mania (mas causam sintomas extrapiramidais). Estimulantes aumentam DA no córtex para TDAH.'
  },
  gabaergic: {
    key: 'gabaergic',
    label: 'GABAérgico',
    shortLabel: 'GABA',
    symbol: '🔒',
    colorClass: 'text-purple-400',
    bgClass: 'bg-purple-500/10',
    borderClass: 'border-purple-500/30',
    description: 'Fármaco que potencializa a ação do GABA (geralmente via moduladores alostéricos positivos do receptor GABA-A).',
    clinicalSignificance: 'Garante efeito ansiolítico rápido, sedativo e miorrelaxante. Reduz o limiar convulsivo. Exige cautela quanto à dependência, tolerância e prejuízos cognitivos a longo prazo.'
  },
  glutamatergic: {
    key: 'glutamatergic',
    label: 'Glutamatérgico',
    shortLabel: 'GLU',
    symbol: '🔥',
    colorClass: 'text-rose-400',
    bgClass: 'bg-rose-500/10',
    borderClass: 'border-rose-500/30',
    description: 'Modulação do principal neurotransmissor excitatório do cérebro (por exemplo, antagonismo NMDA ou modulação de AMPA).',
    clinicalSignificance: 'Promove neuroplasticidade rápida e reconexão sináptica. Revolucionário no tratamento de depressão refratária e ideação suicida imediata (ex: Cetamina).'
  },
  anticholinergic: {
    key: 'anticholinergic',
    label: 'Anticolinérgico',
    shortLabel: 'ACh',
    symbol: '👁️',
    colorClass: 'text-amber-400',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/30',
    description: 'Efeito colateral "off-target" de bloqueio de receptores muscarínicos de acetilcolina (M1-M5).',
    clinicalSignificance: 'Causa boca seca, constipação, visão turva, retenção urinária e prejuízo na memória de curto prazo (especialmente crítico em idosos).'
  },
  antihistaminic: {
    key: 'antihistaminic',
    label: 'Anti-histamínico',
    shortLabel: 'H1',
    symbol: '💤',
    colorClass: 'text-sky-400',
    bgClass: 'bg-sky-500/10',
    borderClass: 'border-sky-500/30',
    description: 'Bloqueio central de receptores histaminérgicos H1.',
    clinicalSignificance: 'Gera forte sedação, sonolência e aumento significativo do apetite. Útil para induzir sono, mas frequentemente associado a cansaço residual e ganho de peso.'
  },
  cardiac_risk: {
    key: 'cardiac_risk',
    label: 'Risco QTc / Cardíaco',
    shortLabel: 'QTc',
    symbol: '🫀',
    colorClass: 'text-red-400',
    bgClass: 'bg-red-500/10',
    borderClass: 'border-red-500/30',
    description: 'Medicamento com risco conhecido de prolongamento do intervalo QTc ou toxicidade cardíaca dose-dependente.',
    clinicalSignificance: 'Requer monitoramento de eletrocardiograma (ECG) em doses elevadas ou em combinação com outros fármacos. Evitar em pacientes com arritmias congênitas.'
  },
  metabolic_risk: {
    key: 'metabolic_risk',
    label: 'Risco Metabólico',
    shortLabel: 'MET',
    symbol: '⚖️',
    colorClass: 'text-yellow-500',
    bgClass: 'bg-yellow-500/10',
    borderClass: 'border-yellow-500/30',
    description: 'Elevada propensão a causar ganho de peso, dislipidemia e resistência à insulina.',
    clinicalSignificance: 'Exige exames laboratoriais regulares (perfil lipídico, glicemia de jejum). Fator crítico para a adesão do paciente e saúde cardiovascular crônica.'
  },
  gold_standard: {
    key: 'gold_standard',
    label: 'Padrão-Ouro / Altíssima Eficácia',
    shortLabel: '★',
    symbol: '🏆',
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/30',
    description: 'Fármaco com eficácia amplamente reconhecida como padrão de excelência ou superioridade clínica na sua indicação principal.',
    clinicalSignificance: 'Referência clínica com taxas de resposta elevadas, embora muitas vezes exija monitoramento especial ou seja reservado para casos graves/refratários.'
  }
};
