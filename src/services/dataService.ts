import { molecules, receptors, enzymes, pdInteractions, pkInteractions } from '../data/mockData';
import { Molecule, Receptor, MetabolicEnzyme, MoleculeReceptorInteraction, MoleculeEnzymeInteraction } from '../data/schema';

export const dataService = {
  getMolecules: (): Molecule[] => molecules,
  getReceptors: (): Receptor[] => receptors,
  getEnzymes: (): MetabolicEnzyme[] => enzymes,

  getMoleculeById: (id: string): Molecule | undefined => molecules.find(m => m.id === id),
  getReceptorById: (id: string): Receptor | undefined => receptors.find(r => r.id === id),
  getEnzymeById: (id: string): MetabolicEnzyme | undefined => enzymes.find(e => e.id === id),

  getPharmacodynamics: (moleculeId?: string): MoleculeReceptorInteraction[] => {
    if (!moleculeId) return pdInteractions;
    return pdInteractions.filter(pd => pd.moleculeId === moleculeId);
  },

  getPharmacokinetics: (moleculeId?: string): MoleculeEnzymeInteraction[] => {
    if (!moleculeId) return pkInteractions;
    return pkInteractions.filter(pk => pk.moleculeId === moleculeId);
  }
};
