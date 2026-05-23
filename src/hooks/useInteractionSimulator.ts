import { useState, useMemo } from 'react';
import { dataService } from '../services/dataService';
import { EnzymaticRole, Molecule } from '../data/schema';

export interface InteractionAlert {
  type: 'warning' | 'info' | 'danger';
  message: string;
  perpetrator: Molecule;
  victim: Molecule;
  enzymeName?: string;
  receptorName?: string;
  mechanismExplanation?: string;
}

export const useInteractionSimulator = (selectedMoleculeIds: string[]) => {
  return useMemo(() => {
    const alerts: InteractionAlert[] = [];
    if (selectedMoleculeIds.length < 2) return alerts;

    const selectedMols = selectedMoleculeIds.map(id => dataService.getMoleculeById(id)).filter(Boolean) as Molecule[];
    const enzymes = dataService.getEnzymes();

    // To prevent duplicate PD alerts since A vs B is the same as B vs A
    const processedPdPairs = new Set<string>();

    for (let i = 0; i < selectedMols.length; i++) {
      for (let j = 0; j < selectedMols.length; j++) {
        if (i === j) continue;
        
        const molA = selectedMols[i];
        const molB = selectedMols[j];

        const pkMolA = dataService.getPharmacokinetics(molA.id);
        const pkMolB = dataService.getPharmacokinetics(molB.id);

        // PK Interactions (A on B)
        pkMolA.forEach(interactionA => {
          if (interactionA.role.includes('Inibidor') || interactionA.role.includes('Indutor')) {
            const isSubstrateB = pkMolB.find(pk => pk.enzymeId === interactionA.enzymeId && pk.role === 'Substrato');
            
            if (isSubstrateB) {
              const enzyme = enzymes.find(e => e.id === interactionA.enzymeId);
              const isInducer = interactionA.role.includes('Indutor');
              const isForte = interactionA.role.includes('Forte');
              
              alerts.push({
                type: isInducer ? 'warning' : (isForte ? 'danger' : 'info'),
                perpetrator: molA,
                victim: molB,
                enzymeName: enzyme?.name ?? 'Enzima Desconhecida',
                message: `${molA.name} atua como ${interactionA.role.toLowerCase()} da ${enzyme?.name}, alterando a metabolização de ${molB.name} (substrato).`,
                mechanismExplanation: isInducer 
                  ? `A indução enzimática por ${molA.name} acelera a degradação e excreção de ${molB.name}, podendo levar a falha terapêutica ou sintomas de retirada precoces se a dose não for reajustada.`
                  : `A inibição do ${enzyme?.name} por ${molA.name} reduz o clearance (depuração) hepática de ${molB.name}, podendo aumentar as concentrações plasmáticas a níveis tóxicos, prolongar meias-vidas e gerar excesso dose-dependente de efeitos adversos.`
              });
            }
          }
        });

        // PD Interactions (Bidirectional, run only once per pair)
        const pairId = [molA.id, molB.id].sort().join('-');
        if (!processedPdPairs.has(pairId)) {
          processedPdPairs.add(pairId);
          const pdMolA = dataService.getPharmacodynamics(molA.id);
          const pdMolB = dataService.getPharmacodynamics(molB.id);

          pdMolA.forEach(intA => {
            const matchB = pdMolB.find(intB => intB.receptorId === intA.receptorId);
            if (matchB) {
              const rec = dataService.getReceptorById(intA.receptorId);
              if (!rec) return;

              let specificHandled = false;

              if (rec.id === 'r1' && intA.actionType === 'Inibidor de Recaptação' && matchB.actionType === 'Inibidor de Recaptação') {
                specificHandled = true;
                alerts.push({
                  type: 'danger',
                  perpetrator: molA,
                  victim: molB,
                  receptorName: rec.name,
                  message: `Risco exacerbado de Síndrome Serotoninérgica devido à inibição dupla do transportador SERT.`,
                  mechanismExplanation: `A combinação de ${molA.name} e ${molB.name} trava quase que totalmente as bombas de recaptação de serotonina na fenda pré-sináptica. O acúmulo brutal do neurotransmissor pode desencadear tempestade autonômica, mioclonia, febre, e confusão mental.`
                });
              }

              if (rec.id === 'r2' && intA.actionType.includes('Antagonista') && matchB.actionType.includes('Antagonista')) {
                specificHandled = true;
                alerts.push({
                  type: 'warning',
                  perpetrator: molA,
                  victim: molB,
                  receptorName: rec.name,
                  message: `Maior risco de parkinsonismo e sintomas extrapiramidais (SEP).`,
                  mechanismExplanation: `O bloqueio somado dos receptores D2 na via nigroestriatal reduz drasticamente a atividade dopaminérgica regulatória motora. O uso conjunto potencializa severamente tremores, acatisia, rigidez muscular, hiperprolactinemia e sintomas discinéticos.`
                });
              }

              if (rec.id === 'r6' && intA.actionType === 'Antagonista' && matchB.actionType === 'Antagonista') {
                specificHandled = true;
                alerts.push({
                  type: 'info',
                  perpetrator: molA,
                  victim: molB,
                  receptorName: rec.name,
                  message: `Adição de efeitos sedativos e orexígenos marcados.`,
                  mechanismExplanation: `Ambas as moléculas bloqueiam diferencialmente o receptor de Histamina H1 no hipotálamo, gerando somnolência pesada ao longo do dia e suprimindo fortes redes inibitórias do apetite, o que pode agravar drasticamente o ganho calórico e a síndrome metabólica.`
                });
              }
              
              const isMAOI = (a: Molecule) => a.class === 'iMAO';
              const isSerotonergic = (a: Molecule) => a.class === 'ISRS' || a.class === 'ISRSN';
              if ((isMAOI(molA) && isSerotonergic(molB)) || (isMAOI(molB) && isSerotonergic(molA))) {
                specificHandled = true;
                alerts.push({
                   type: 'danger',
                   perpetrator: molA,
                   victim: molB,
                   receptorName: 'Geral', // Conceptual
                   message: `CONTRAINDICAÇÃO ABSOLUTA: Combinação iMAO + ISRS/ISRSN. Risco de síndrome serotoninérgica grave ou fatal.`,
                   mechanismExplanation: `A combinação de inibidores da MAO com inibidores de recaptação de serotonina impede simultaneamente o recolhimento e o catabolismo central da Serotonina, causando toxicidade letal.`
                });
              }

              // Dynamic Generic Rules for any other overlapping receptor (except global GABA check handled later)
              if (!specificHandled && rec.id !== 'r13') {
                 const isA_Antagonist = intA.actionType.includes('Antagonista');
                 const isB_Antagonist = matchB.actionType.includes('Antagonista');
                 
                 const isA_Agonist = intA.actionType.includes('Agonista') || intA.actionType.includes('Inibidor de Recaptação') || intA.actionType.includes('Modulador');
                 const isB_Agonist = matchB.actionType.includes('Agonista') || matchB.actionType.includes('Inibidor de Recaptação') || matchB.actionType.includes('Modulador');

                 if (isA_Antagonist && isB_Antagonist) {
                    alerts.push({
                      type: 'warning',
                      perpetrator: molA,
                      victim: molB,
                      receptorName: rec.name,
                      message: `Sinergismo de bloqueio no alvo ${rec.name}.`,
                      mechanismExplanation: `Ambas as moléculas atuam como antagonistas ou bloqueadores em ${rec.name}. O uso concomitante potencializa o bloqueio dessa via, podendo gerar efeitos adversos aditivos ou exacerbar a inibição funcional do sistema ${rec.neurotransmitterSystem}.`
                    });
                 } else if (isA_Agonist && isB_Agonist) {
                    alerts.push({
                      type: 'warning',
                      perpetrator: molA,
                      victim: molB,
                      receptorName: rec.name,
                      message: `Superativação farmacodinâmica no alvo ${rec.name}.`,
                      mechanismExplanation: `Ambas exercem ações excitatórias, agonistas ou de acúmulo sináptico simultâneas no receptor ${rec.name}. Há risco de super-estimulação da via ${rec.neurotransmitterSystem}, o que pode facilmente ultrapassar a janela terapêutica e causar toxicidade.`
                    });
                 } else if ((isA_Antagonist && isB_Agonist) || (isB_Antagonist && isA_Agonist)) {
                    alerts.push({
                      type: 'info',
                      perpetrator: molA,
                      victim: molB,
                      receptorName: rec.name,
                      message: `Competição de efeitos no alvo ${rec.name}.`,
                      mechanismExplanation: `Forças opostas detectadas: uma molécula tenta ativar ou modular positivamente a via, enquanto a outra a bloqueia ou antagoniza. Isso geralmente resulta em anulação mútua ou redução drástica do efeito terapêutico de um dos fármacos no receptor ${rec.name}.`
                    });
                 }
              }
            }
          });
        }
      }
    }

    // Adicionar verificação de grupo para Potenciação GABAérgica
    const gabaMols = selectedMols.filter(mol => {
      const pds = dataService.getPharmacodynamics(mol.id);
      return pds.some(pd => pd.receptorId === 'r13');
    });

    if (gabaMols.length >= 2) {
      alerts.push({
        type: 'danger',
        message: 'Potenciação GABAérgica: múltiplos depressores do SNC atuando em GABA-A detectados. Risco elevado de sedação excessiva, depressão respiratória e dependência cruzada.',
        mechanismExplanation: 'A combinação de múltiplos agonistas/moduladores positivos do receptor GABA-A (benzodiazepínicos, hipnóticos-Z) produz efeitos sinérgicos que podem ultrapassar os limiares de segurança para sedação e função respiratória.',
        perpetrator: gabaMols[0],
        victim: gabaMols[1],
        receptorName: 'GABA-A'
      });
    }

    return alerts;
  }, [selectedMoleculeIds]);
};
