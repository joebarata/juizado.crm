
import React, { useState } from 'react';

interface LawyerRecord {
  id: string;
  nome: string;
  email: string;
  nivel: 'advogado' | 'estagiario' | 'admin' | 'parceiro';
  oab: string;
  especialidade: string;
}

export const LawyerManager: React.FC = () => {
  const [lawyers, setLawyers] = useState<LawyerRecord[]>([
    {
      id: '1',
      nome: 'Dr. Ricardo Silva',
      email: 'ricardo@lexflow.com.br',
      nivel: 'admin',
      oab: '123.456/SP',
      especialidade: 'Direito Civil'
    },
    {
      id: '2',
      nome: 'Dra. Beatriz Mendes',
      email: 'beatriz@lexflow.com.br',
      nivel: 'advogado',
      oab: '654.321/SP',
      especialidade: 'Direito de Família'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<LawyerRecord>>({ nivel: 'advogado' });

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    const initials = parts[0].charAt(0) + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : '');
    return initials.toUpperCase();
  };

  const getRoleBadge = (nivel: string) => {
    switch (nivel) {
      case 'admin': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'estagiario': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-200';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setLawyers(prev => prev.map(l => l.id === editingId ? { ...l, ...formData } as LawyerRecord : l));
    } else {
      const newLawyer = { ...formData, id: Math.random().toString(36).substr(2, 9) } as LawyerRecord;
      setLawyers(prev => [newLawyer, ...prev]);
    }
    closeModal();
  };

  const openModal = (lawyer?: LawyerRecord) => {
    if (lawyer) {
      setFormData(lawyer);
      setEditingId(lawyer.id);
    } else {
      setFormData({ nivel: 'advogado' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setFormData({}); };

  const deleteLawyer = (id: string) => {
    if (confirm('Deseja realmente remover este membro da equipe?')) {
      setLawyers(prev => prev.filter(l => l.id !== id));
    }
  };

  const filteredLawyers = lawyers.filter(l => 
    l.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.oab.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-center gap-6 px-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Equipe Jurídica</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Gestão de advogados, estagiários e parceiros da banca.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input 
              type="text" 
              placeholder="Buscar OAB ou Nome..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => openModal()} className="dynamic-btn px-6 py-2.5 text-xs flex items-center gap-2 flex-shrink-0">
            <i className="fas fa-user-plus text-[10px]"></i> Adicionar Membro
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLawyers.map(lawyer => (
          <div key={lawyer.id} className="glass-card flex flex-col overflow-hidden group hover:border-blue-300 transition-all duration-300">
            <div className="p-8 flex-1">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-blue-500/20">
                  {getInitials(lawyer.nome)}
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getRoleBadge(lawyer.nivel)}`}>
                  {lawyer.nivel}
                </div>
              </div>
              
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-white tracking-tight">{lawyer.nome}</h3>
              <p className="text-xs text-slate-400 font-medium mb-6">{lawyer.email}</p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <i className="fas fa-id-card text-blue-500 text-[10px]"></i>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">OAB: {lawyer.oab || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <i className="fas fa-star text-amber-500 text-[10px]"></i>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{lawyer.especialidade || 'Clínico Geral'}</span>
                </div>
              </div>
            </div>
            
            <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button onClick={() => openModal(lawyer)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <i className="fas fa-edit text-xs"></i>
              </button>
              <button onClick={() => deleteLawyer(lawyer.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                <i className="fas fa-trash-alt text-xs"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                {formData.id ? 'Editar Membro' : 'Novo Membro da Banca'}
              </h2>
              <button onClick={closeModal} className="text-slate-300 hover:text-slate-600 transition-colors text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <input required type="text" placeholder="Ex: Dr. Silva" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20" value={formData.nome || ''} onChange={e => setFormData({...formData, nome: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail Profissional</label>
                  <input required type="email" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-sm font-medium outline-none" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nível de Acesso</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-sm font-medium outline-none" value={formData.nivel || 'advogado'} onChange={e => setFormData({...formData, nivel: e.target.value as any})}>
                    <option value="advogado">Advogado</option>
                    <option value="estagiario">Estagiário</option>
                    <option value="admin">Sócio / Admin</option>
                    <option value="parceiro">Parceiro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Inscrição OAB</label>
                  <input type="text" placeholder="Ex: 12345/SP" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-sm font-medium outline-none" value={formData.oab || ''} onChange={e => setFormData({...formData, oab: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Especialidade Principal</label>
                  <input type="text" placeholder="Ex: Cível" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-sm font-medium outline-none" value={formData.especialidade || ''} onChange={e => setFormData({...formData, especialidade: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Senha de Acesso</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-sm font-medium outline-none" />
                <p className="text-[9px] text-slate-400 italic">Deixe em branco para não alterar a senha atual.</p>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button type="button" onClick={closeModal} className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 py-2 hover:text-slate-600 transition-colors">Cancelar</button>
                <button type="submit" className="dynamic-btn px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest shadow-lg">Salvar Membro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
