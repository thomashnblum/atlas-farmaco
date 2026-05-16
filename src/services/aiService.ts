import { Molecule, PharmacodynamicInteraction, PharmacokineticInteraction } from '../data/schema';

export interface AIInsight {
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'danger';
}

export const aiService = {
  generateClinicalInsights: async (
    molecules: Molecule[],
    pdParams: PharmacodynamicInteraction[],
    pkParams: PharmacokineticInteraction[]
  ): Promise<AIInsight | null> => {
    // Simular delay de rede (IA pensando...)
    await new Promise(resolve => setTimeout(resolve, 800));

    if (molecules.length < 2) return null;

    const names = molecules.map(m => m.name).join(' e ');

    // Regras de negócio simples para criar insights mock mais orgânicos
    const hasSertInhibitor = pdParams.some(pd => pd.receptorId === 'r1' && pd.actionType.includes('Inibidor'));
    const hasCypInhibitor = pkParams.some(pk => pk.role.includes('Inibidor'));

    if (hasSertInhibitor && hasCypInhibitor) {
      return {
        title: 'Alerta de Sinergia e Acúmulo Metabólico',
        description: `A combinação de ${names} apresenta forte sobreposição farmacodinâmica (inibição do SERT) além de potenciais gargalos metabólicos, requerendo monitoramento clínico estrito.`,
        severity: 'danger'
      };
    }

    if (hasCypInhibitor) {
      return {
        title: 'Alerta de Risco Farmacocinético',
        description: `O uso concomitante de ${names} demanda atenção às vias do citocromo P450. Um dos fármacos atua como inibidor, podendo elevar perigosamente a meia-vida do outro.`,
        severity: 'warning'
      };
    }

    return {
      title: 'Insight Clínico Automatizado',
      description: `A combinação de ${names} possui perfis complementares. Fique atento aos efeitos adversos aditivos, embora não existam interações absolutas primárias detectadas no modelo base.`,
      severity: 'info'
    };
  }
};
