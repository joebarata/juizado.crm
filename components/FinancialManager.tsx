import React, { useState } from 'react';

const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3001/api' : '/api';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'receita' | 'despesa';
  status: 'pago' | 'pendente';
  date: string;
}

export const FinancialManager: React.FC<{ transactions: any[], onAdd: () => void }> = ({ transactions, onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [newT, setNewT] = useState<any>({ type: 'receita', status: 'pendente', date: new Date().toISOString().split('T')[0] });
  const [isLoading, setIsLoading] = useState(false);

  const totalRevenue = transactions.filter(t => t.type === 'receita').reduce((a, b) => a + Number(b.amount || 0), 0);
  const totalExpense = transactions.filter(t => t.type === 'despesa').reduce((a, b) => a + Number(b.amount || 0), 0);
  const balance = totalRevenue - totalExpense;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const session = localStorage.getItem('lexflow_session');
      const token = session ? JSON.parse(session).token : '';
      
      const res = await fetch(`${API_URL}/financial`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description: newT.description,
          amount: newT.amount,
          type: newT.type,
          status: newT.status,
          date: newT.date
        })
      });
      if (res.ok) {
        onAdd();
        setShowModal(false);
      } else {
        const err = await res.json();
        alert(err.error || 'Erro ao salvar transação.');
      }
    } catch (e) {
      alert('Erro de conexão com o banco.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-white">Gestão Financeira</h1>
          <p className="text-sm font-medium text-slate-400">Fluxo de caixa sincronizado 360.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="dynamic-btn px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest">
          <i className="fas fa-plus mr-2"></i> Novo Lançamento
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="soft-glass p-8 rounded-3xl border-l-4 border-blue-500">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Balanço</p>
          <h3 className="text-3xl font-extrabold text-white">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className="soft-glass p-8 rounded-3xl border-l-4 border-emerald-500">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Receitas</p>
          <h3 className="text-3xl font-extrabold text-emerald-500">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className="soft-glass p-8 rounded-3xl border-l-4 border-rose-500">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Despesas</p>
          <h3 className="text-3xl font-extrabold text-rose-500">R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
      </div>

      <div className="soft-glass rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Descrição / Data</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Valor</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.length === 0 ? (
              <tr><td colSpan={3} className="p-10 text-center opacity-50">Sem lançamentos registrados.</td></tr>
            ) : (
              transactions.map(t => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-white">{t.description || t.desc}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                  </td>
                  <td className={`px-8 py-6 text-right font-extrabold text-base ${t.type === 'receita' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {t.type === 'receita' ? '+' : '-'} R$ {Number(t.amount || t.val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${t.status === 'pago' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="soft-glass w-full max-w-lg p-10 bg-slate-900 border-white/10">
            <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tighter">Lançamento Financeiro</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Descrição" className="w-full p-4 bg-white/5 rounded-xl outline-none text-sm text-white border border-white/5" onChange={e => setNewT({...newT, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" step="0.01" placeholder="Valor R$" className="w-full p-4 bg-white/5 rounded-xl outline-none text-sm text-white border border-white/5" onChange={e => setNewT({...newT, amount: parseFloat(e.target.value)})} />
                <select className="w-full p-4 bg-white/5 rounded-xl outline-none text-sm text-white border border-white/5" onChange={e => setNewT({...newT, type: e.target.value as any})}>
                  <option value="receita">Receita (+)</option>
                  <option value="despesa">Despesa (-)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required type="date" className="w-full p-4 bg-white/5 rounded-xl outline-none text-sm text-white border border-white/5" value={newT.date} onChange={e => setNewT({...newT, date: e.target.value})} />
                <select className="w-full p-4 bg-white/5 rounded-xl outline-none text-sm text-white border border-white/5" onChange={e => setNewT({...newT, status: e.target.value as any})}>
                  <option value="pago">Pago / Recebido</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="text-xs font-black uppercase text-slate-500">Cancelar</button>
                <button type="submit" disabled={isLoading} className="dynamic-btn px-10 py-3 rounded-xl text-xs uppercase tracking-widest">
                  {isLoading ? 'Salvando...' : 'Confirmar Lançamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};