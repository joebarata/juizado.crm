import React, { useState } from 'react';

const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3001/api' : '/api';

interface Client {
  id: string;
  name: string;
  type: 'PF' | 'PJ';
  doc: string;
  email: string;
  city: string;
  cases: number;
}

export const ClientManager: React.FC<{ clients: Client[], onAdd: () => void }> = ({ clients, onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({ type: 'PF' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const session = localStorage.getItem('lexflow_session');
      const token = session ? JSON.parse(session).token : '';

      const res = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newClient)
      });
      if (res.ok) {
        onAdd();
        setShowModal(false);
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao salvar cliente.');
      }
    } catch (e) {
      alert('Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter dark:text-white">Carteira de Clientes</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Gestão centralizada de ativos jurídicos.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="dynamic-btn px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest">
          <i className="fas fa-plus mr-2"></i> Novo Cliente
        </button>
      </header>

      <div className="space-y-4">
        {clients.length === 0 ? (
          <div className="p-20 text-center soft-glass opacity-50">Nenhum cliente encontrado no banco.</div>
        ) : (
          clients.map(cli => (
            <div key={cli.id} className="soft-glass overflow-hidden transition-all duration-300 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <i className={`fas ${cli.type === 'PF' ? 'fa-user' : 'fa-building'}`}></i>
                </div>
                <div>
                  <h3 className="text-sm font-black dark:text-white uppercase tracking-tight">{cli.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{cli.doc} • {cli.city}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">E-mail</p>
                <p className="text-xs font-black dark:text-white">{cli.email}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="soft-glass w-full max-w-lg p-10 bg-slate-900 border-white/10 shadow-2xl">
            <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tighter">Novo Cliente</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Nome Completo" className="w-full p-4 bg-white/5 border border-white/5 rounded-xl text-sm text-white outline-none" onChange={e => setNewClient({...newClient, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="CPF/CNPJ" className="w-full p-4 bg-white/5 border border-white/5 rounded-xl text-sm text-white outline-none" onChange={e => setNewClient({...newClient, doc: e.target.value})} />
                <select className="w-full p-4 bg-white/5 border border-white/5 rounded-xl text-sm text-white outline-none" onChange={e => setNewClient({...newClient, type: e.target.value as any})}>
                  <option value="PF">Pessoa Física</option>
                  <option value="PJ">Pessoa Jurídica</option>
                </select>
              </div>
              <input required placeholder="E-mail" type="email" className="w-full p-4 bg-white/5 border border-white/5 rounded-xl text-sm text-white outline-none" onChange={e => setNewClient({...newClient, email: e.target.value})} />
              <input required placeholder="Cidade" className="w-full p-4 bg-white/5 border border-white/5 rounded-xl text-sm text-white outline-none" onChange={e => setNewClient({...newClient, city: e.target.value})} />
              <div className="flex justify-end gap-3 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="text-xs font-black uppercase text-slate-500">Cancelar</button>
                <button type="submit" disabled={isLoading} className="dynamic-btn px-10 py-3 rounded-xl text-xs uppercase tracking-widest">
                  {isLoading ? 'Salvando...' : 'Salvar no Banco'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};