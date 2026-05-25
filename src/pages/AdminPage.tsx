import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { Molecule, Receptor, MetabolicEnzyme, MoleculeReceptorInteraction, MoleculeEnzymeInteraction, ActionType, EnzymaticRole } from '../data/schema';
import { Plus, Edit2, Trash2, Save, X, Database, AlertTriangle, ChevronDown, ChevronUp, Beaker, Activity } from 'lucide-react';
import { cn } from '../utils/cn';

export const AdminPage = () => {
  const { session } = useAuth();
  const [molecules, setMolecules] = useState<Molecule[]>([]);
  const [receptors, setReceptors] = useState<Receptor[]>([]);
  const [enzymes, setEnzymes] = useState<MetabolicEnzyme[]>([]);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Molecule>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para as abas de interações
  const [pdInteractions, setPdInteractions] = useState<MoleculeReceptorInteraction[]>([]);
  const [pkInteractions, setPkInteractions] = useState<MoleculeEnzymeInteraction[]>([]);
  
  // Estados para formulários de novas interações
  const [newPd, setNewPd] = useState<Partial<MoleculeReceptorInteraction>>({ actionType: 'Antagonista' });
  const [newPk, setNewPk] = useState<Partial<MoleculeEnzymeInteraction>>({ role: 'Inibidor Forte' });

  useEffect(() => {
    loadData();
  }, []);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const loadData = () => {
    setMolecules(dataService.getMolecules());
    setReceptors(dataService.getReceptors());
    setEnzymes(dataService.getEnzymes());
  };

  const handleEdit = (molecule: Molecule) => {
    setEditingId(molecule.id);
    setFormData(molecule);
    setError(null);
  };

  const handleAddNew = () => {
    const newId = `m${Date.now()}`;
    setEditingId(newId);
    setFormData({ id: newId, name: '', class: '', mechanisms: '' });
    setError(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
    setError(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!formData.name || !formData.class || !formData.mechanisms) {
        throw new Error('Preencha os campos obrigatórios (Nome, Classe, Mecanismo).');
      }

      const isNew = !molecules.some(m => m.id === formData.id);
      
      if (isNew) {
        await dataService.createMolecule(formData as Partial<Molecule>);
      } else {
        await dataService.updateMolecule(formData.id!, formData as Partial<Molecule>);
      }
      
      setEditingId(null);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta molécula do banco de dados? Essa ação não pode ser desfeita.')) {
      try {
        setLoading(true);
        await dataService.deleteMolecule(id);
        loadData();
      } catch (err: any) {
        setError(err.message || 'Erro ao deletar.');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setPdInteractions(dataService.getPharmacodynamics(id));
      setPkInteractions(dataService.getPharmacokinetics(id));
    }
  };

  // Funções PD
  const handleAddPD = async (moleculeId: string) => {
    if (!newPd.receptorId || !newPd.actionType) return;
    try {
      setLoading(true);
      await dataService.addPDInteraction({
        moleculeId,
        receptorId: newPd.receptorId,
        actionType: newPd.actionType as ActionType,
        affinityKi: newPd.affinityKi,
        notes: newPd.notes
      });
      setPdInteractions(dataService.getPharmacodynamics(moleculeId));
      setNewPd({ actionType: 'Antagonista' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePD = async (moleculeId: string, receptorId: string) => {
    try {
      setLoading(true);
      await dataService.removePDInteraction(moleculeId, receptorId);
      setPdInteractions(dataService.getPharmacodynamics(moleculeId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Funções PK
  const handleAddPK = async (moleculeId: string) => {
    if (!newPk.enzymeId || !newPk.role) return;
    try {
      setLoading(true);
      await dataService.addPKInteraction({
        moleculeId,
        enzymeId: newPk.enzymeId,
        role: newPk.role as EnzymaticRole,
        notes: newPk.notes
      });
      setPkInteractions(dataService.getPharmacokinetics(moleculeId));
      setNewPk({ role: 'Inibidor Forte' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePK = async (moleculeId: string, enzymeId: string) => {
    try {
      setLoading(true);
      await dataService.removePKInteraction(moleculeId, enzymeId);
      setPkInteractions(dataService.getPharmacokinetics(moleculeId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-4 text-amber-400 font-mono text-sm">
            <span className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin"></span>
            PROCESSANDO OPERAÇÃO...
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-100 flex items-center gap-3">
            <Database className="w-8 h-8 text-amber-400" />
            Painel Administrativo (Super CMS)
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Gerencie moléculas e suas interações com receptores e enzimas.</p>
        </div>
        
        <button
          onClick={handleAddNew}
          disabled={editingId !== null}
          className="bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-zinc-950 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-amber-400/20"
        >
          <Plus className="w-5 h-5" /> Nova Molécula
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <p className="text-sm text-rose-300">{error}</p>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-950 border-b border-zinc-800 uppercase text-[10px] tracking-widest text-zinc-500 font-mono">
              <tr>
                <th className="px-6 py-4 w-10"></th>
                <th className="px-6 py-4">Ações</th>
                <th className="px-6 py-4">Nome da Molécula</th>
                <th className="px-6 py-4">Classe Farmacológica</th>
                <th className="px-6 py-4">Mecanismo Principal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {editingId && !molecules.some(m => m.id === editingId) && (
                <tr className="bg-amber-400/5">
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={handleSave} disabled={loading} className="text-emerald-400 p-1"><Save className="w-4 h-4" /></button>
                      <button onClick={handleCancel} disabled={loading} className="text-rose-400 p-1"><X className="w-4 h-4" /></button>
                    </div>
                  </td>
                  <td className="px-6 py-4"><input autoFocus type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 w-full text-zinc-100" placeholder="Nome" /></td>
                  <td className="px-6 py-4"><input type="text" value={formData.class || ''} onChange={e => setFormData({...formData, class: e.target.value})} className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 w-full text-zinc-100" placeholder="Classe" /></td>
                  <td className="px-6 py-4"><input type="text" value={formData.mechanisms || ''} onChange={e => setFormData({...formData, mechanisms: e.target.value})} className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 w-full text-zinc-100" placeholder="Mecanismo" /></td>
                </tr>
              )}
              
              {molecules.map(molecule => (
                <React.Fragment key={molecule.id}>
                  <tr className={cn("hover:bg-zinc-800/30 transition-colors", editingId === molecule.id || expandedId === molecule.id ? "bg-zinc-800/50" : "")}>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleExpand(molecule.id)} className="text-zinc-500 hover:text-amber-400">
                        {expandedId === molecule.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === molecule.id ? (
                        <div className="flex gap-2">
                          <button onClick={handleSave} disabled={loading} className="text-emerald-400 hover:text-emerald-300 p-1 bg-emerald-400/10 rounded"><Save className="w-4 h-4" /></button>
                          <button onClick={handleCancel} disabled={loading} className="text-rose-400 hover:text-rose-300 p-1 bg-rose-400/10 rounded"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleEdit(molecule)} disabled={editingId !== null} className="text-amber-400/70 hover:text-amber-400"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(molecule.id)} disabled={editingId !== null || loading} className="text-rose-500/70 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-zinc-200">
                      {editingId === molecule.id ? <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 w-full text-zinc-100" /> : molecule.name}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {editingId === molecule.id ? <input type="text" value={formData.class || ''} onChange={e => setFormData({...formData, class: e.target.value})} className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 w-full text-zinc-100" /> : molecule.class}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 truncate max-w-xs">
                      {editingId === molecule.id ? <input type="text" value={formData.mechanisms || ''} onChange={e => setFormData({...formData, mechanisms: e.target.value})} className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 w-full text-zinc-100" /> : molecule.mechanisms}
                    </td>
                  </tr>

                  {/* Expandable Section for PD and PK */}
                  {expandedId === molecule.id && (
                    <tr className="bg-zinc-950 border-b border-zinc-800">
                      <td colSpan={5} className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          
                          {/* Farmacodinâmica */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 uppercase tracking-widest">
                              <Activity className="w-4 h-4" /> Farmacodinâmica (Receptores)
                            </h3>
                            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-4">
                              {pdInteractions.map(pd => (
                                <div key={pd.receptorId} className="flex items-center justify-between bg-zinc-950 p-2 rounded border border-zinc-800">
                                  <div>
                                    <span className="text-zinc-100 font-bold text-xs">{dataService.getReceptorById(pd.receptorId)?.name}</span>
                                    <span className="text-zinc-500 text-xs ml-2">({pd.actionType})</span>
                                    {pd.affinityKi && <span className="text-amber-400/70 text-xs ml-2">Ki: {pd.affinityKi}</span>}
                                  </div>
                                  <button onClick={() => handleRemovePD(molecule.id, pd.receptorId)} className="text-rose-500 hover:bg-rose-500/10 p-1 rounded"><Trash2 className="w-3 h-3" /></button>
                                </div>
                              ))}
                              
                              <div className="flex gap-2 flex-wrap sm:flex-nowrap pt-2 border-t border-zinc-800/50">
                                <select 
                                  className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-100 flex-1"
                                  value={newPd.receptorId || ''}
                                  onChange={e => setNewPd({...newPd, receptorId: e.target.value})}
                                >
                                  <option value="">Selecione Receptor...</option>
                                  {receptors.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                                <select 
                                  className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-100 w-32"
                                  value={newPd.actionType}
                                  onChange={e => setNewPd({...newPd, actionType: e.target.value as ActionType})}
                                >
                                  <option value="Agonista">Agonista</option>
                                  <option value="Agonista Total">Agonista Total</option>
                                  <option value="Agonista Parcial">Agonista Parcial</option>
                                  <option value="Antagonista">Antagonista</option>
                                  <option value="Inibidor de Recaptação">Inib. Recaptação</option>
                                  <option value="Modulador Alostérico">Mod. Alostérico</option>
                                </select>
                                <input 
                                  type="number" 
                                  placeholder="Ki (opcional)" 
                                  className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-100 w-24"
                                  value={newPd.affinityKi || ''}
                                  onChange={e => setNewPd({...newPd, affinityKi: Number(e.target.value) || undefined})}
                                />
                                <button onClick={() => handleAddPD(molecule.id)} className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 px-3 py-1.5 rounded text-xs font-bold transition-colors">Add</button>
                              </div>
                            </div>
                          </div>

                          {/* Farmacocinética */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2 uppercase tracking-widest">
                              <Beaker className="w-4 h-4" /> Farmacocinética (Enzimas)
                            </h3>
                            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-4">
                              {pkInteractions.map(pk => (
                                <div key={pk.enzymeId} className="flex items-center justify-between bg-zinc-950 p-2 rounded border border-zinc-800">
                                  <div>
                                    <span className="text-zinc-100 font-bold text-xs">{dataService.getEnzymeById(pk.enzymeId)?.name}</span>
                                    <span className="text-zinc-500 text-xs ml-2">({pk.role})</span>
                                  </div>
                                  <button onClick={() => handleRemovePK(molecule.id, pk.enzymeId)} className="text-rose-500 hover:bg-rose-500/10 p-1 rounded"><Trash2 className="w-3 h-3" /></button>
                                </div>
                              ))}
                              
                              <div className="flex gap-2 pt-2 border-t border-zinc-800/50">
                                <select 
                                  className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-100 flex-1"
                                  value={newPk.enzymeId || ''}
                                  onChange={e => setNewPk({...newPk, enzymeId: e.target.value})}
                                >
                                  <option value="">Selecione Enzima...</option>
                                  {enzymes.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                                <select 
                                  className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-100 w-32"
                                  value={newPk.role}
                                  onChange={e => setNewPk({...newPk, role: e.target.value as EnzymaticRole})}
                                >
                                  <option value="Substrato">Substrato</option>
                                  <option value="Inibidor Forte">Inibidor Forte</option>
                                  <option value="Inibidor Moderado">Inibidor Mod.</option>
                                  <option value="Inibidor Fraco">Inibidor Fraco</option>
                                  <option value="Indutor Forte">Indutor Forte</option>
                                  <option value="Indutor Moderado">Indutor Mod.</option>
                                </select>
                                <button onClick={() => handleAddPK(molecule.id)} className="bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 px-3 py-1.5 rounded text-xs font-bold transition-colors">Add</button>
                              </div>
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
