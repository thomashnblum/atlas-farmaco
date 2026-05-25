import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { ENZYME_DETAILS } from '../../pages/EnzymesPage';

interface RichTextProps {
  text: string;
  className?: string;
}

export const RichText: React.FC<RichTextProps> = ({ text, className }) => {
  const navigate = useNavigate();

  // Mapeamos todas as entidades conhecidas
  const entities = useMemo(() => {
    const list: { name: string; type: string; id: string }[] = [];

    // Fármacos
    dataService.getMolecules().forEach(m => {
      list.push({ name: m.name, type: 'molecule', id: m.id });
      // Podemos adicionar nomes comerciais se quisermos, mas o pedido fala "nome" da origem
    });

    // Transtornos e Aliases
    dataService.getDisorders().forEach(d => {
      list.push({ name: d.name, type: 'disorder', id: d.id });
      
      // Aliases baseados em mapeamentos manuais para abranger os textos de bula (ex: Depressão Maior (TDM))
      if (d.id === 'tr_mdd') {
         list.push({ name: 'Depressão Maior (TDM)', type: 'disorder', id: d.id });
         list.push({ name: 'Depressão Maior', type: 'disorder', id: d.id });
         list.push({ name: 'TDM', type: 'disorder', id: d.id });
      }
      if (d.id === 'tr_tag') {
         list.push({ name: 'Ansiedade Generalizada (TAG)', type: 'disorder', id: d.id });
         list.push({ name: 'Ansiedade Generalizada', type: 'disorder', id: d.id });
         list.push({ name: 'TAG', type: 'disorder', id: d.id });
      }
      if (d.id === 'tr_tdah') {
         list.push({ name: 'TDAH', type: 'disorder', id: d.id });
      }
      if (d.id === 'tr_sz') {
         list.push({ name: 'Esquizofrenia', type: 'disorder', id: d.id });
      }
      if (d.id === 'tr_bipolar_1') {
         list.push({ name: 'Transtorno Bipolar I', type: 'disorder', id: d.id });
         list.push({ name: 'Bipolar Tipo 1', type: 'disorder', id: d.id });
         list.push({ name: 'Bipolar I', type: 'disorder', id: d.id });
      }
      if (d.id === 'tr_bipolar_2') {
         list.push({ name: 'Transtorno Bipolar II', type: 'disorder', id: d.id });
         list.push({ name: 'Bipolar Tipo 2', type: 'disorder', id: d.id });
         list.push({ name: 'Bipolar II', type: 'disorder', id: d.id });
      }
      if (d.id === 'tr_ocd') {
         list.push({ name: 'TOC', type: 'disorder', id: d.id });
      }
      if (d.id === 'tr_ptsd') {
         list.push({ name: 'TEPT', type: 'disorder', id: d.id });
      }
      if (d.id === 'tr_panico') {
         list.push({ name: 'Pânico', type: 'disorder', id: d.id });
      }
      if (d.id === 'tr_social') {
         list.push({ name: 'Fobia Social', type: 'disorder', id: d.id });
         list.push({ name: 'Ansiedade Social', type: 'disorder', id: d.id });
      }
      if (d.id === 'tr_insonia') {
         list.push({ name: 'Insônia', type: 'disorder', id: d.id });
      }
      if (d.id === 'tr_borderline') {
         list.push({ name: 'Borderline', type: 'disorder', id: d.id });
      }
      if (d.id === 'tr_eating_an') {
         list.push({ name: 'Anorexia Nervosa', type: 'disorder', id: d.id });
         list.push({ name: 'Anorexia', type: 'disorder', id: d.id });
      }
      if (d.id === 'tr_eating_bn') {
         list.push({ name: 'Bulimia Nervosa', type: 'disorder', id: d.id });
         list.push({ name: 'Bulimia', type: 'disorder', id: d.id });
      }
      if (d.id === 'tr_sud_alcohol') {
         list.push({ name: 'Transtorno por Uso de Álcool', type: 'disorder', id: d.id });
         list.push({ name: 'Alcoolismo', type: 'disorder', id: d.id });
      }
      if (d.id === 'tr_pmdd') {
         list.push({ name: 'TDPM', type: 'disorder', id: d.id });
      }
      if (d.id === 'tr_demencia_alz') {
         list.push({ name: 'Doença de Alzheimer', type: 'disorder', id: d.id });
         list.push({ name: 'Alzheimer', type: 'disorder', id: d.id });
      }
    });

    // Receptores
    dataService.getReceptors().forEach(r => {
      list.push({ name: r.name, type: 'receptor', id: r.id });
    });

    // Enzimas (temos a lista na EnzymesPage, mas podemos extrair do dataService ou usar nomes comuns)
    // Usando ENZYME_DETAILS
    Object.values(ENZYME_DETAILS).forEach(e => {
      list.push({ name: e.name, type: 'enzyme', id: e.id });
    });

    // Ordenamos pela length descendente para evitar matching parcial (ex: "Metilfenidato" antes de "Metil")
    return list.sort((a, b) => b.name.length - a.name.length);
  }, []);

  const parsedContent = useMemo(() => {
    if (!text) return null;

    // Criamos um regex gigante com todas as palavras. Ex: \b(Fluoxetina|Sertralina)\b
    // Usamos \b apenas se a palavra começar/terminar com letra.
    const escapedNames = entities.map(e => e.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedNames.join('|')})`, 'gi');

    const parts = text.split(regex);

    return parts.map((part, i) => {
      const lowerPart = part.toLowerCase();
      const matchedEntity = entities.find(e => e.name.toLowerCase() === lowerPart);

      if (matchedEntity) {
        const handleClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          switch (matchedEntity.type) {
            case 'molecule':
              navigate(`/molecules?id=${matchedEntity.id}`);
              break;
            case 'disorder':
              navigate(`/disorders/${matchedEntity.id}`);
              break;
            case 'receptor':
              navigate(`/receptors?id=${matchedEntity.id}`);
              break;
            case 'enzyme':
              navigate(`/enzymes`, { state: { selectedEnzymeId: matchedEntity.id } });
              break;
          }
        };

        // Estilização baseada no tipo para dar uma "cara de Atlas"
        let colorClass = 'text-amber-400 hover:text-amber-300'; // Default molecule
        if (matchedEntity.type === 'disorder') colorClass = 'text-rose-400 hover:text-rose-300';
        if (matchedEntity.type === 'receptor') colorClass = 'text-emerald-400 hover:text-emerald-300';
        if (matchedEntity.type === 'enzyme') colorClass = 'text-blue-400 hover:text-blue-300';

        return (
          <span
            key={i}
            onClick={handleClick}
            className={`cursor-pointer underline decoration-1 underline-offset-2 decoration-zinc-700 hover:decoration-current transition-colors ${colorClass}`}
            title={`Ir para ${matchedEntity.name}`}
          >
            {part}
          </span>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  }, [text, entities, navigate]);

  return <span className={className}>{parsedContent}</span>;
};
