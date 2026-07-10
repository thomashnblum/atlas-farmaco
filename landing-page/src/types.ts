export interface ReceptorAffinity {
  receptor: string;
  intensity: 'critical' | 'high' | 'moderate' | 'low' | 'none';
  valueHex: string; // Color intensity for modern UI
  description: string;
}

export interface CYPInteraction {
  enzyme: 'CYP2D6' | 'CYP3A4' | 'CYP1A2' | 'CYP2C19' | 'CYP2C9';
  role: 'substrate' | 'inhibitor' | 'inducer';
  strength?: 'strong' | 'moderate' | 'weak';
}

export type ClassType = 'ISR' | 'IRSN' | 'AD-TRICICLICO' | 'APS-ATIPICO' | 'ESTABILIZADOR' | 'IRND';

export interface Molecule {
  id: string;
  name: string;
  class: string;
  classAbbr: ClassType;
  description: string;
  mechanism: string;
  indications: string[];
  receptors: ReceptorAffinity[];
  cyp450: CYPInteraction[];
  cautionPoints: string[];
  halfLife: string;
}

export interface InteractionAlert {
  severity: 'high' | 'moderate' | 'low' | 'info';
  title: string;
  description: string;
  mechanism: string;
}

export interface WaitlistSubmission {
  name: string;
  email: string;
  role: string;
  timestamp: string;
}
