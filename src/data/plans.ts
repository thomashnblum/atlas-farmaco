/**
 * Planos de assinatura do Atlas Fármaco.
 * Fonte única usada pela página de planos do app (/pricing) — mantém os preços
 * alinhados com a landing.
 */
export interface Plan {
  id: 'mensal' | 'anual';
  name: string;
  price: string;
  interval: string;
  monthlyEquiv?: string;
  highlight?: boolean;
  ribbon?: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: 'mensal',
    name: 'Plano Mensal',
    price: 'R$ 19,90',
    interval: '/ mês',
    features: [
      'Banco completo (+160 moléculas)',
      'Mapeamento de afinidade Ki',
      'Cascata de enzimas CYP450',
      'Simulador de interações completo',
      'Cancelamento a qualquer momento',
    ],
  },
  {
    id: 'anual',
    name: 'Plano Anual',
    price: 'R$ 167,90',
    interval: '/ ano',
    monthlyEquiv: 'Equivale a R$ 13,99/mês',
    highlight: true,
    ribbon: 'Melhor custo-benefício',
    features: [
      'Tudo do plano mensal',
      'Economia de mais de 30% ao ano',
      'Todas as novas moléculas inclusas',
      'Acesso assegurado por 12 meses',
      'Suporte prioritário',
    ],
  },
];

/** Rótulo curto do que a assinatura destrava, para telas de bloqueio. */
export const PREMIUM_FEATURES = [
  'Catálogo completo de moléculas',
  'Mapa de receptores e afinidades (Ki)',
  'Eixos de enzimas CYP450',
  'Simulador de interações',
  'Comparador de fármacos',
];
