import { MoleculeReceptorInteraction, MoleculeEnzymeInteraction } from './schema';

/**
 * Fontes das citações do Atlas.
 *
 * Os nomes DEVEM casar com a página /sources (`SourcesPage.tsx`), que traz a
 * bibliografia completa e a metodologia.
 *
 * Design: em vez de duplicar arrays idênticos em ~150 interações, a proveniência
 * é atribuída por CATEGORIA (afinidade Ki vs papel enzimático). Uma citação
 * específica gravada no campo `sources` da própria interação SEMPRE tem
 * prioridade sobre o padrão da categoria — permitindo referências pontuais
 * (ex.: um artigo específico) quando existirem.
 */
export const SOURCE = {
  PDSP: 'PDSP Ki Database',
  IUPHAR: 'IUPHAR/BPS Guide to PHARMACOLOGY',
  STAHL: 'Stahl — Psicofarmacologia Essencial',
  FLOCKHART: 'Tabela de Flockhart (CYP450)',
  FDA_ANVISA: 'Bulas FDA & ANVISA',
} as const;

/** Fontes de uma interação farmacodinâmica (afinidade Ki / tipo de ação). */
export function getPdSources(i: Pick<MoleculeReceptorInteraction, 'sources' | 'affinityKi'>): string[] {
  if (i.sources && i.sources.length) return i.sources;
  return i.affinityKi != null
    ? [SOURCE.PDSP, SOURCE.IUPHAR] // constante de ligação medida
    : [SOURCE.IUPHAR, SOURCE.STAHL]; // ação sem Ki público (mecanismo)
}

/** Fontes de uma interação farmacocinética (papel enzimático CYP/UGT). */
export function getPkSources(i: Pick<MoleculeEnzymeInteraction, 'sources'>): string[] {
  if (i.sources && i.sources.length) return i.sources;
  return [SOURCE.FLOCKHART, SOURCE.FDA_ANVISA];
}

/** Une listas de fontes preservando a ordem e sem repetir (para rodapés de tabela). */
export function unionSources(lists: string[][]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const list of lists) {
    for (const s of list) {
      if (!seen.has(s)) {
        seen.add(s);
        out.push(s);
      }
    }
  }
  return out;
}
