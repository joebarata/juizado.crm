import React, { useState, useEffect } from 'react';
import { authService, User } from '../services/authService';

export const LawyerManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<any>({ role: 'LAWYER', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(authService.getUsers());
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    const initials = parts[0].charAt(0) + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : '');
    return initials.toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    const roles: any = {
      'ADMIN': 'Sócio Administrador',
      'LAWYER': 'Advogado Associado',
      'ASSISTANT': 'Assistente / Estagiário',
      'FINANCIAL': 'Controladoria / Financeiro'
    };
    return roles[role] || role;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (formData.id) {
        authService.saveUser(formData as User);
      } else {
        await authService.createUser(formData);
      }
      loadUsers();
      closeModal();
    } catch (err: any) {
      setError(err.message || 'Erro ao processar solicitação.');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (user?: User) => {
    if (user) {
      setFormData({ ...user, password: '' });
    } else {
      setFormData({ role: 'LAWYER', password: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setError('');
  };

  const deleteUser = (id: string) => {
    if (id === 'master-admin') return alert('O administrador mestre não pode ser removido.');
    if (confirm('Deseja realmente remover este membro da equipe? O acesso será revogado imediatamente.')) {
      authService.deleteUser(id);
      loadUsers();
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-center gap-6 px-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Gestão de Equipe</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Controle de acesso e cargos da banca jurídica.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input 
              type="text" 
              placeholder="Buscar por nome ou e-mail..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => openModal()} className="dynamic-btn px-6 py-2.5 text-xs flex items-center gap-2">
            <i className="fas fa-user-plus text-[10px]"></i> Novo Membro
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(u => (
          <div key={u.id} className="glass-card flex flex-col group hover:border-blue-500/50 transition-all duration-300 relative">
            {!u.active && <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] z-10 rounded-[32px] flex items-center justify-center font-black text-rose-500 uppercase text-[10px]">Inativo</div>}
            
            <div className="p-8 flex-1">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-blue-500/20">
                  {getInitials(u.name)}
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-500/20 bg-blue-500/10 text-blue-500`}>
                  {u.role}
                </div>
              </div>
              
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-white tracking-tight">{u.name}</h3>
              <p className="text-xs text-slate-400 font-medium mb-4">{u.email}</p>
              
              <p className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest">{getRoleLabel(u.role)}</p>

              <div className="space-y-3">
                {u.oab && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <i className="fas fa-id-card text-blue-500 text-[10px]"></i>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">OAB: {u.oab}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <i className="fas fa-clock text-slate-400 text-[10px]"></i>
                  <span className="text-[11px] font-bold text-slate-400">Desde: {new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="px-8 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button onClick={() => openModal(u)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <i className="fas fa-edit text-xs"></i>
              </button>
              <button onClick={() => deleteUser(u.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                <i className="fas fa-trash-alt text-xs"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[32px] shadow-2xl border border-slate-800 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                {formData.id ? 'Editar Cadastro' : 'Novo Membro da Banca'}
              </h2>
              <button onClick={closeModal} className="text-slate-300 hover:text-white text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-5">
              {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest">{error}</div>}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <input required type="text" placeholder="Ex: Dr. Roberto Mendes" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-700 rounded-xl p-3.5 text-sm dark:text-white outline-none" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail de Acesso</label>
                  <input required type="email" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-700 rounded-xl p-3.5 text-sm dark:text-white outline-none" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Perfil / Cargo</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-700 rounded-xl p-3.5 text-sm dark:text-white outline-none" value={formData.role || 'LAWYER'} onChange={e => setFormData({...formData, role: e.target.value as any})}>
                    <option value="LAWYER">Advogado</option>
                    <option value="ADMIN">Sócio Administrador</option>
                    <option value="ASSISTANT">Assistente / Estagiário</option>
                    <option value="FINANCIAL">Financeiro</option>
                  </select>
                </div>
              </div>

              {!formData.id && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Senha Inicial</label>
                  <input required type="password" placeholder="Defina a senha do membro" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-700 rounded-xl p-3.5 text-sm dark:text-white outline-none" value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Inscrição OAB</label>
                  <input type="text" placeholder="OAB/UF" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-700 rounded-xl p-3.5 text-sm dark:text-white outline-none" value={formData.oab || ''} onChange={e => setFormData({...formData, oab: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Especialidade</label>
                  <input type="text" placeholder="Ex: Trabalhista" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-700 rounded-xl p-3.5 text-sm dark:text-white outline-none" value={formData.specialty || ''} onChange={e => setFormData({...formData, specialty: e.target.value})} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button type="button" onClick={closeModal} className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 py-2 hover:text-slate-600">Cancelar</button>
                <button type="submit" disabled={isLoading} className="dynamic-btn px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest">
                  {isLoading ? 'Processando...' : (formData.id ? 'Salvar Alterações' : 'Criar Usuário')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};