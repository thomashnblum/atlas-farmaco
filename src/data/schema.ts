export type ClinicalAxis =
  | 'Antidepressivo'
  | 'Antipsicotico'
  | 'Estabilizador'
  | 'Ansiolitico'
  | 'Estimulante'
  | 'Anticonvulsivante'
  | 'Hipnotico'
  | 'Gabapentinoide'
  | 'Anestesico'
  | 'Opioide'
  | 'Neuroprotetor'
  | 'Suplemento';
export type ActionType = 'Agonista' | 'Agonista Total' | 'Agonista Parcial' | 'Agonista Seletivo' | 'Antagonista' | 'Inibidor de Recaptação' | 'Modulador Alostérico' | 'Inibidor Enzimático' | 'Outro';
export type EnzymaticRole = 'Substrato' | 'Inibidor Forte' | 'Inibidor Moderado' | 'Inibidor Fraco' | 'Indutor Forte' | 'Indutor Moderado' | 'Indutor Fraco';

export interface OffLabelUse {
  condition: string;
  evidence: 'Alto' | 'Moderado' | 'Baixo' | 'Anedótico';
  justification: string;
  notes?: string;
}

export interface OnLabelUse {
  condition: string;
  line: '1ª Linha' | '2ª Linha' | '3ª Linha' | 'Adjuvante' | 'Potencialização' | 'Refratária';
  evidence: 'Padrão-Ouro' | 'Robusto' | 'Moderado' | 'Baixo';
  justification: string;
  notes?: string;
}

export type ProfileSymbolKey = 
  | 'serotonergic' 
  | 'noradrenergic' 
  | 'dopaminergic' 
  | 'gabaergic' 
  | 'glutamatergic' 
  | 'anticholinergic' 
  | 'antihistaminic' 
  | 'cardiac_risk' 
  | 'metabolic_risk' 
  | 'gold_standard';

export interface Molecule {
  id: string;
  name: string;
  tradeNames: string[];
  class: string;
  clinicalAxes: ClinicalAxis[];
  mechanisms: string;
  notes: string;
  sideEffects?: string[];
  contraindications?: string[];
  routes?: string[];
  psychiatryUse?: string;
  offLabelUses?: OffLabelUse[];
  onLabelUses?: OnLabelUse[];
  profileSymbols?: ProfileSymbolKey[];
}

export interface Receptor {
  id: string;
  name: string;
  type: 'Receptor' | 'Transportador' | 'Canal Iônico' | 'Enzima Alvo';
  neurotransmitterSystem: string;
  description: string;
}

export interface MetabolicEnzyme {
  id: string;
  name: string;
  description: string;
  location: string;
}

export interface MoleculeReceptorInteraction {
  moleculeId: string;
  receptorId: string;
  actionType: ActionType;
  affinityKi?: number | null;
  notes?: string;
  sources?: string[];
}

export interface MoleculeEnzymeInteraction {
  moleculeId: string;
  enzymeId: string;
  role: EnzymaticRole;
  notes?: string;
  sources?: string[];
}
