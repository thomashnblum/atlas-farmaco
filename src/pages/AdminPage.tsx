import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { Molecule } from '../data/schema';
import { Plus, Edit2, Trash2, Save, X, Database, AlertTriangle } from 'lucide-react';
import { cn } from '../utils/cn';

export const AdminPage = () => {
  const { session } = useAuth();
  const [molecules, setMolecules] = useState<Molecule[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Molecule>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Se não estiver logado, redireciona. Na próxima fase travaremos apenas para contas admin.
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setMolecules(dataService.getMolecules());
  };

  const handleEdit = (molecule: Molecule) => {
    setEditingId(molecule.id);
    setFormData(molecule);
    setError(null);
  };

  const handleAddNew = () => {
    const newId = `m${Date.now()}`; // Gerador simples de ID provisório
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
      setError(err.message || 'Erro ao salvar. Verifique sua conexão e permissões RLS.');
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

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-100 flex items-center gap-3">
            <Database className="w-8 h-8 text-amber-400" />
            Painel Administrativo (CMS)
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Gerencie os registros do banco de dados diretamente pelo aplicativo.</p>
        </div>
        
        <button
          onClick={handleAddNew}
          disabled={editingId !== null}
          className="bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:hover:bg-amber-400 text-zinc-950 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-amber-400/20"
        >
          <Plus className="w-5 h-5" /> Adicionar Molécula
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <p className="text-sm text-rose-300">{error}</p>
        </div>
      )}

      {/* Tabela de Dados */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-950 border-b border-zinc-800 uppercase text-[10px] tracking-widest text-zinc-500 font-mono">
              <tr>
                <th className="px-6 py-4">ID / Ações</th>
                <th className="px-6 py-4">Nome da Molécula</th>
                <th className="px-6 py-4">Classe Farmacológica</th>
                <th className="px-6 py-4">Mecanismo Principal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {editingId && !molecules.some(m => m.id === editingId) && (
                <tr className="bg-amber-400/5">
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={handleSave} disabled={loading} className="text-emerald-400 hover:text-emerald-300 p-1"><Save className="w-4 h-4" /></button>
                      <button onClick={handleCancel} disabled={loading} className="text-rose-400 hover:text-rose-300 p-1"><X className="w-4 h-4" /></button>
                    </div>
                  </td>
                  <td className="px-6 py-4"><input autoFocus type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 w-full text-zinc-100" placeholder="Nome" /></td>
                  <td className="px-6 py-4"><input type="text" value={formData.class || ''} onChange={e => setFormData({...formData, class: e.target.value})} className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 w-full text-zinc-100" placeholder="Classe" /></td>
                  <td className="px-6 py-4"><input type="text" value={formData.mechanisms || ''} onChange={e => setFormData({...formData, mechanisms: e.target.value})} className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 w-full text-zinc-100" placeholder="Mecanismo" /></td>
                </tr>
              )}
              
              {molecules.map(molecule => (
                <tr key={molecule.id} className={cn("hover:bg-zinc-800/30 transition-colors", editingId === molecule.id ? "bg-amber-400/5 hover:bg-amber-400/5" : "")}>
                  <td className="px-6 py-4">
                    {editingId === molecule.id ? (
                      <div className="flex gap-2">
                        <button onClick={handleSave} disabled={loading} className="text-emerald-400 hover:text-emerald-300 p-1 bg-emerald-400/10 rounded"><Save className="w-4 h-4" /></button>
                        <button onClick={handleCancel} disabled={loading} className="text-rose-400 hover:text-rose-300 p-1 bg-rose-400/10 rounded"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-zinc-600">{molecule.id}</span>
                        <button onClick={() => handleEdit(molecule)} disabled={editingId !== null} className="text-amber-400/70 hover:text-amber-400 disabled:opacity-20"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(molecule.id)} disabled={editingId !== null || loading} className="text-rose-500/70 hover:text-rose-500 disabled:opacity-20"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 font-bold text-zinc-200">
                    {editingId === molecule.id ? (
                      <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 w-full text-zinc-100" />
                    ) : molecule.name}
                  </td>
                  
                  <td className="px-6 py-4 text-zinc-400">
                    {editingId === molecule.id ? (
                      <input type="text" value={formData.class || ''} onChange={e => setFormData({...formData, class: e.target.value})} className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 w-full text-zinc-100" />
                    ) : molecule.class}
                  </td>
                  
                  <td className="px-6 py-4 text-zinc-400 truncate max-w-xs" title={molecule.mechanisms}>
                    {editingId === molecule.id ? (
                      <input type="text" value={formData.mechanisms || ''} onChange={e => setFormData({...formData, mechanisms: e.target.value})} className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 w-full text-zinc-100" />
                    ) : molecule.mechanisms}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {molecules.length === 0 && !editingId && (
          <div className="p-8 text-center text-zinc-500 font-mono text-sm">
            Nenhuma molécula encontrada no banco de dados.
          </div>
        )}
      </div>
      
      <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-4 flex gap-3 text-sm text-amber-200/70">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
        <p>A exclusão ou modificação afeta todos os usuários da aplicação imediatamente. Opere com cuidado. Para editar interações e perfil completo, recomendamos o script backend por enquanto até a Fase 3 (Edição Completa do JSON) estar pronta.</p>
      </div>
    </div>
  );
};
