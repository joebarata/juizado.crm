
import React, { useState } from 'react';

const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3001/api' : '/api';

export const LawyerManager: React.FC<{ users: any[], onUpdate: () => void }> = ({ users, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<any>({ role: 'LAWYER', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    const initials = parts[0].charAt(0) + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : '');
    return initials.toUpperCase();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const session = localStorage.getItem('juizado_session');
      const token = session ? JSON.parse(session).token : '';

      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar usuário.');
      
      onUpdate();
      setIsModalOpen(false);
      setFormData({ role: 'LAWYER', password: '' });
    } catch (err: any) {
      setError(err.message || 'Erro ao processar solicitação.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-center gap-6 px-2">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Equipe Jurídica</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Gerenciamento de acessos e permissões.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Buscar membro..." 
            className="w-full md:w-64 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold outline-none text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setIsModalOpen(true)} className="dynamic-btn px-6 py-2.5 text-xs flex items-center gap-2">
            <i className="fas fa-user-plus text-[10px]"></i> Novo Membro
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(u => (
          <div key={u.id} className="soft-glass p-8 group hover:border-blue-500/50 transition-all duration-300 relative">
            {!u.ativo && <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-10 rounded-3xl flex items-center justify-center font-black text-rose-500 uppercase text-[10px]">Inativo</div>}
            
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-blue-500/20">
                {getInitials(u.nome)}
              </div>
              <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-500/20 bg-blue-500/10 text-blue-500">
                {u.perfil}
              </div>
            </div>
            
            <h3 className="text-lg font-extrabold text-white tracking-tight">{u.nome}</h3>
            <p className="text-xs text-slate-400 font-medium">{u.email}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 w-full max-w-lg rounded-[32px] shadow-2xl border border-white/10 overflow-hidden">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-base font-bold text-white uppercase tracking-widest">Adicionar Membro</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-white text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-5">
              {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-[10px] font-black uppercase text-center">{error}</div>}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <input required type="text" className="w-full bg-white/5 border border-white/5 rounded-xl p-3.5 text-sm text-white outline-none" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                  <input required type="email" className="w-full bg-white/5 border border-white/5 rounded-xl p-3.5 text-sm text-white outline-none" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Perfil</label>
                  <select className="w-full bg-white/5 border border-white/5 rounded-xl p-3.5 text-sm text-white outline-none" value={formData.role || 'LAWYER'} onChange={e => setFormData({...formData, role: e.target.value as any})}>
                    <option value="LAWYER">Advogado</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Senha Temporária</label>
                <input required type="password" placeholder="Mínimo 6 caracteres" className="w-full bg-white/5 border border-white/5 rounded-xl p-3.5 text-sm text-white outline-none" value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 py-2">Cancelar</button>
                <button type="submit" disabled={isLoading} className="dynamic-btn px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest">
                  {isLoading ? 'Salvando...' : 'Confirmar Cadastro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
