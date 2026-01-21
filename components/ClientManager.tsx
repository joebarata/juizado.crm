
import React, { useState } from 'react';

interface Client {
  id: string;
  name: string;
  type: 'PF' | 'PJ';
  doc: string;
  email: string;
  city: string;
  cases: number;
  history: any[];
}

export const ClientManager: React.FC<{ clients: Client[], onAdd: (c: Client) => void }> = ({ clients, onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({ type: 'PF' });
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...newClient,
      id: Math.random().toString(36).substr(2, 9),
      cases: 0,
      history: []
    } as Client);
    setShowModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter dark:text-white">Carteira de Clientes</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Clique em um cliente para ver o histórico de movimentações.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="dynamic-btn px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest">
          <i className="fas fa-plus mr-2"></i> Novo Cliente
        </button>
      </header>

      <div className="space-y-4">
        {clients.map(cli => (
          <div key={cli.id} className="soft-glass overflow-hidden transition-all duration-300">
            <div 
              onClick={() => setExpandedClient(expandedClient === cli.id ? null : cli.id)}
              className="px-8 py-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <i className={`fas ${cli.type === 'PF' ? 'fa-user' : 'fa-building'}`}></i>
                </div>
                <div>
                  <h3 className="text-sm font-black dark:text-white uppercase tracking-tight">{cli.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{cli.doc} • {cli.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Processos</p>
                  <p className="text-xs font-black dark:text-white">{cli.cases}</p>
                </div>
                <i className={`fas fa-chevron-down text-xs text-slate-300 transition-transform ${expandedClient === cli.id ? 'rotate-180' : ''}`}></i>
              </div>
            </div>

            {expandedClient === cli.id && (
              <div className="px-8 pb-8 pt-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-black/20 animate-in slide-in-from-top-4 duration-300">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6">Histórico de Movimentações</h4>
                <div className="space-y-6">
                  {cli.history.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">Nenhuma movimentação registrada recentemente.</p>
                  ) : (
                    cli.history.map((h, i) => (
                      <div key={i} className="flex gap-4 relative">
                        {i !== cli.history.length - 1 && <div className="absolute left-2.5 top-6 bottom-[-24px] w-px bg-slate-200 dark:bg-white/10"></div>}
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0 mt-0.5 border-4 border-slate-100 dark:border-slate-900"></div>
                        <div className="flex-1 pb-4">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[11px] font-black dark:text-white uppercase tracking-tight">{h.type}</span>
                            <span className="text-[10px] font-bold text-slate-400">{h.date}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">"{h.description}"</p>
                          <p className="text-[9px] font-black text-blue-500 uppercase">Responsável: {h.responsible}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="soft-glass w-full max-w-lg p-10 bg-white dark:bg-slate-900">
            <h2 className="text-xl font-black dark:text-white mb-6 uppercase tracking-tighter">Novo Cliente</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Nome Completo" className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl text-sm dark:text-white outline-none" onChange={e => setNewClient({...newClient, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="CPF/CNPJ" className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl text-sm dark:text-white outline-none" onChange={e => setNewClient({...newClient, doc: e.target.value})} />
                <select className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl text-sm dark:text-white outline-none" onChange={e => setNewClient({...newClient, type: e.target.value as any})}>
                  <option value="PF">Pessoa Física</option>
                  <option value="PJ">Pessoa Jurídica</option>
                </select>
              </div>
              <input required placeholder="E-mail" type="email" className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl text-sm dark:text-white outline-none" onChange={e => setNewClient({...newClient, email: e.target.value})} />
              <input required placeholder="Cidade" className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl text-sm dark:text-white outline-none" onChange={e => setNewClient({...newClient, city: e.target.value})} />
              <div className="flex justify-end gap-3 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="text-xs font-black uppercase text-slate-500">Cancelar</button>
                <button type="submit" className="dynamic-btn px-10 py-3 rounded-xl text-xs uppercase tracking-widest">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
