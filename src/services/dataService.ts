import { supabase } from './supabaseClient';
import { Molecule, Receptor, MetabolicEnzyme, MoleculeReceptorInteraction, MoleculeEnzymeInteraction, Disorder, DisorderTreatment } from '../data/schema';

import {
  molecules as localMolecules,
  receptors as localReceptors,
  enzymes as localEnzymes,
  pdInteractions as localPdInteractions,
  pkInteractions as localPkInteractions
} from '../data/mockData';

// Caches locais inicializados com dados locais como padrão e fallback
let molecules: Molecule[] = localMolecules;
let receptors: Receptor[] = localReceptors;
let enzymes: MetabolicEnzyme[] = localEnzymes;
let pdInteractions: MoleculeReceptorInteraction[] = localPdInteractions;
let pkInteractions: MoleculeEnzymeInteraction[] = localPkInteractions;
let disorders: Disorder[] = [];
let disorderTreatments: DisorderTreatment[] = [];

export const dataService = {
  loadData: async () => {
    try {
      console.log('Iniciando sincronização com Supabase...');
      const [molRes, recRes, enzRes, pdRes, pkRes, disRes, treatRes] = await Promise.all([
        supabase.from('molecules').select('*'),
        supabase.from('receptors').select('*'),
        supabase.from('enzymes').select('*'),
        supabase.from('pd_interactions').select('*'),
        supabase.from('pk_interactions').select('*'),
        supabase.from('disorders').select('*'),
        supabase.from('disorder_treatments').select('*')
      ]);

      if (molRes.error) throw molRes.error;
      if (recRes.error) throw recRes.error;
      if (enzRes.error) throw enzRes.error;
      if (pdRes.error) throw pdRes.error;
      if (pkRes.error) throw pkRes.error;
      // Transtornos podem falhar se as tabelas ainda não existirem (graceful degrade)
      if (!disRes.error) {
        disorders = (disRes.data || []).map((d: any) => ({
          id: d.id,
          name: d.name,
          description: d.description,
          cid10: d.cid10,
          dsm5: d.dsm5
        }));
      }
      if (!treatRes.error) {
        disorderTreatments = (treatRes.data || []).map((t: any) => ({
          id: t.id,
          disorderId: t.disorder_id,
          moleculeId: t.molecule_id,
          line: t.line,
          notes: t.notes
        }));
      }

      molecules = (molRes.data || []).map((m: any) => {
        const localMol = localMolecules.find(lm => lm.id === m.id);
        return {
          id: m.id,
          name: m.name,
          tradeNames: m.trade_names || [],
          class: m.class,
          clinicalAxes: m.clinical_axes || [],
          mechanisms: m.mechanisms,
          notes: m.notes,
          sideEffects: m.side_effects || [],
          contraindications: m.contraindications || [],
          routes: m.routes || [],
          psychiatryUse: m.psychiatry_use,
          offLabelUses: m.off_label_uses || [],
          onLabelUses: m.on_label_uses || [],
          profileSymbols: m.profile_symbols || [],
          halfLife: m.half_life || localMol?.halfLife,
          bioavailability: m.bioavailability || localMol?.bioavailability,
          onsetOfAction: m.onset_of_action || localMol?.onsetOfAction,
          peakPlasma: m.peak_plasma || localMol?.peakPlasma,
          proteinBinding: m.protein_binding || localMol?.proteinBinding,
          elimination: m.elimination || localMol?.elimination,
          therapeuticDoseRange: m.therapeutic_dose_range || localMol?.therapeuticDoseRange
        };
      });

      // 1. Receptors
      const remoteReceptors = (recRes.data || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        type: r.type,
        neurotransmitterSystem: r.neurotransmitter_system,
        description: r.description
      }));
      const remoteRecIds = new Set(remoteReceptors.map(r => r.id));
      receptors = [...remoteReceptors];
      localReceptors.forEach(lr => {
        if (!remoteRecIds.has(lr.id)) {
          receptors.push(lr);
        }
      });

      // 2. Enzymes
      const remoteEnzymes = (enzRes.data || []).map((e: any) => ({
        id: e.id,
        name: e.name,
        description: e.description,
        location: e.location
      }));
      const remoteEnzIds = new Set(remoteEnzymes.map(e => e.id));
      enzymes = [...remoteEnzymes];
      localEnzymes.forEach(le => {
        if (!remoteEnzIds.has(le.id)) {
          enzymes.push(le);
        }
      });

      // 3. PD Interactions
      const remotePd = (pdRes.data || []).map((pd: any) => ({
        moleculeId: pd.molecule_id,
        receptorId: pd.receptor_id,
        actionType: pd.action_type,
        affinityKi: pd.affinity_ki != null ? Number(pd.affinity_ki) : undefined,
        functionalPotency: pd.functional_potency != null ? Number(pd.functional_potency) : undefined,
        potencyType: pd.potency_type || undefined,
        notes: pd.notes,
        sources: pd.sources || []
      }));
      const remotePdKeys = new Set(remotePd.map(pd => `${pd.moleculeId}-${pd.receptorId}`));
      pdInteractions = [...remotePd];
      localPdInteractions.forEach(lp => {
        if (!remotePdKeys.has(`${lp.moleculeId}-${lp.receptorId}`)) {
          pdInteractions.push(lp);
        }
      });

      // 4. PK Interactions
      const remotePk = (pkRes.data || []).map((pk: any) => ({
        moleculeId: pk.molecule_id,
        enzymeId: pk.enzyme_id,
        role: pk.role,
        notes: pk.notes,
        sources: pk.sources || []
      }));
      const remotePkKeys = new Set(remotePk.map(pk => `${pk.moleculeId}-${pk.enzymeId}-${pk.role}`));
      pkInteractions = [...remotePk];
      localPkInteractions.forEach(lp => {
        if (!remotePkKeys.has(`${lp.moleculeId}-${lp.enzymeId}-${lp.role}`)) {
          pkInteractions.push(lp);
        }
      });

      console.log(`Dados carregados: ${molecules.length} Mols, ${receptors.length} Recs, ${enzymes.length} Enzs.`);
    } catch (error) {
      console.error('Erro ao carregar dados do Supabase:', error);
      // Fallback para não quebrar a aplicação caso a internet falhe ou Supabase esteja fora
      // Poderíamos importar os dados locais como fallback, mas para forçar o uso real da nuvem, vamos deixar vazio.
    }
  },

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
  },

  // CRUD Operations para o Painel Administrativo (CMS)
  createMolecule: async (molecule: Partial<Molecule>) => {
    const { error } = await supabase.from('molecules').insert([{
      id: molecule.id,
      name: molecule.name,
      trade_names: molecule.tradeNames || [],
      class: molecule.class,
      clinical_axes: molecule.clinicalAxes || [],
      mechanisms: molecule.mechanisms,
      notes: molecule.notes,
      side_effects: molecule.sideEffects || [],
      contraindications: molecule.contraindications || [],
      routes: molecule.routes || [],
      psychiatry_use: molecule.psychiatryUse,
      off_label_uses: molecule.offLabelUses || [],
      on_label_uses: molecule.onLabelUses || [],
      profile_symbols: molecule.profileSymbols || []
    }]);
    if (error) throw error;
    await dataService.loadData(); // Recarrega os caches
  },

  updateMolecule: async (id: string, molecule: Partial<Molecule>) => {
    const { error } = await supabase.from('molecules').update({
      name: molecule.name,
      trade_names: molecule.tradeNames,
      class: molecule.class,
      clinical_axes: molecule.clinicalAxes,
      mechanisms: molecule.mechanisms,
      notes: molecule.notes,
      side_effects: molecule.sideEffects,
      contraindications: molecule.contraindications,
      routes: molecule.routes,
      psychiatry_use: molecule.psychiatryUse,
      off_label_uses: molecule.offLabelUses,
      on_label_uses: molecule.onLabelUses,
      profile_symbols: molecule.profileSymbols
    }).eq('id', id);
    if (error) throw error;
    await dataService.loadData();
  },

  deleteMolecule: async (id: string) => {
    const { error } = await supabase.from('molecules').delete().eq('id', id);
    if (error) throw error;
    await dataService.loadData();
  },

  // === PD Interactions ===
  addPDInteraction: async (pd: MoleculeReceptorInteraction) => {
    const { error } = await supabase.from('pd_interactions').insert([{
      molecule_id: pd.moleculeId,
      receptor_id: pd.receptorId,
      action_type: pd.actionType,
      affinity_ki: pd.affinityKi,
      notes: pd.notes
    }]);
    if (error) throw error;
    await dataService.loadData();
  },
  removePDInteraction: async (moleculeId: string, receptorId: string) => {
    const { error } = await supabase.from('pd_interactions')
      .delete()
      .match({ molecule_id: moleculeId, receptor_id: receptorId });
    if (error) throw error;
    await dataService.loadData();
  },

  // === PK Interactions ===
  addPKInteraction: async (pk: MoleculeEnzymeInteraction) => {
    const { error } = await supabase.from('pk_interactions').insert([{
      molecule_id: pk.moleculeId,
      enzyme_id: pk.enzymeId,
      role: pk.role,
      notes: pk.notes
    }]);
    if (error) throw error;
    await dataService.loadData();
  },
  removePKInteraction: async (moleculeId: string, enzymeId: string) => {
    const { error } = await supabase.from('pk_interactions')
      .delete()
      .match({ molecule_id: moleculeId, enzyme_id: enzymeId });
    if (error) throw error;
    await dataService.loadData();
  },

  // === Disorders ===
  getDisorders: (): Disorder[] => disorders,
  getDisorderById: (id: string): Disorder | undefined => disorders.find(d => d.id === id),
  getTreatmentsForDisorder: (disorderId: string): DisorderTreatment[] => {
    return disorderTreatments.filter(t => t.disorderId === disorderId);
  }
};
