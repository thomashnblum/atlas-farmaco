import { dataService } from './dataService';

export interface GraphNode {
  id: string;
  name: string;
  group: 'molecule' | 'receptor' | 'enzyme';
  val: number; // size
  color?: string;
  data: any;
  x?: number;
  y?: number;
  z?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
  color?: string;
  width?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export const buildAtlasGraphData = (): GraphData => {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  const molecules = dataService.getMolecules();
  const receptors = dataService.getReceptors();
  const enzymes = dataService.getEnzymes();

  molecules.forEach(m => {
    nodes.push({ id: m.id, name: m.name, group: 'molecule', val: 20, color: '#fbbf24', data: m }); // amber-400
  });

  receptors.forEach(r => {
    nodes.push({ id: r.id, name: r.name, group: 'receptor', val: 15, color: '#F43F5E', data: r }); // rose-500
  });

  enzymes.forEach(e => {
    nodes.push({ id: e.id, name: e.name, group: 'enzyme', val: 15, color: '#94A3B8', data: e }); // zinc-400
  });

  const pd = dataService.getPharmacodynamics();
  pd.forEach(interaction => {
    links.push({
      source: interaction.moleculeId,
      target: interaction.receptorId,
      label: interaction.actionType,
      color: 'rgba(244, 63, 94, 0.6)', // rose-500 fading
      width: 2
    });
  });

  const pk = dataService.getPharmacokinetics();
  pk.forEach(interaction => {
    links.push({
      source: interaction.moleculeId,
      target: interaction.enzymeId,
      label: interaction.role,
      color: 'rgba(148, 163, 184, 0.4)', // zinc-400 fading
      width: 1
    });
  });

  return { nodes, links };
};
