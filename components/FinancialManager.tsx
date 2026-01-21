
import React, { useState } from 'react';

interface Transaction {
  id: string;
  desc: string;
  val: number;
  type: 'receita' | 'despesa';
  status: 'pago' | 'pendente';
  date: string;
}

export const FinancialManager: React.FC<{ transactions: Transaction[], onAdd: (t: Transaction) => void }> = ({ transactions, onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [newT, setNewT] = useState<Partial<Transaction>>({ type: 'receita', status: 'pendente' });

  const totalRevenue = transactions.filter(t => t.type === 'receita').reduce((a, b) => a + b.val, 0);
  const totalExpense = transactions.filter(t => t.type === 'despesa').reduce((a, b) => a + b.val, 0);
  const balance = totalRevenue - totalExpense;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...newT,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0]
    } as Transaction);
    setShowModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter dark:text-white">Financeiro 360</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Controle de caixa real-time e saúde da banca.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="dynamic-btn px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest">
          <i className="fas fa-plus mr-2"></i> Lançamento
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="soft-glass p-8 rounded-3xl border-l-4 border-blue-500">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Balanço Atual</p>
          <h3 className="text-3xl font-extrabold dark:text-white">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className="soft-glass p-8 rounded-3xl border-l-4 border-emerald-500">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Receitas</p>
          <h3 className="text-3xl font-extrabold text-emerald-500">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className="soft-glass p-8 rounded-3xl border-l-4 border-rose-500">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Despesas</p>
          <h3 className="text-3xl font-extrabold text-rose-500">R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
      </div>

      <div className="soft-glass rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-white/5">
            <tr>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Lançamento / Data</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Valor</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {transactions.map(t => (
              <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                <td className="px-8 py-6">
                  <p className="text-sm font-bold dark:text-white">{t.desc}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{t.date}</p>
                </td>
                <td className={`px-8 py-6 text-right font-extrabold text-base ${t.type === 'receita' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {t.type === 'receita' ? '+' : '-'} R$ {t.val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${t.status === 'pago' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="soft-glass w-full max-w-lg p-10">
            <h2 className="text-xl font-black dark:text-white mb-6 uppercase tracking-tighter">Novo Lançamento</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Descrição do Lançamento" className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl outline-none text-sm dark:text-white" onChange={e => setNewT({...newT, desc: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" step="0.01" placeholder="Valor R$" className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl outline-none text-sm dark:text-white" onChange={e => setNewT({...newT, val: parseFloat(e.target.value)})} />
                <select className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl outline-none text-sm dark:text-white" onChange={e => setNewT({...newT, type: e.target.value as any})}>
                  <option value="receita">Receita (+)</option>
                  <option value="despesa">Despesa (-)</option>
                </select>
              </div>
              <select className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl outline-none text-sm dark:text-white" onChange={e => setNewT({...newT, status: e.target.value as any})}>
                <option value="pago">Pago / Recebido</option>
                <option value="pendente">Pendente</option>
              </select>
              <div className="flex justify-end gap-3 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="text-xs font-black uppercase text-slate-500">Cancelar</button>
                <button type="submit" className="dynamic-btn px-10 py-3 rounded-xl text-xs uppercase tracking-widest">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
