
import React, { useState } from 'react';

interface KanbanCard {
  id: string;
  title: string;
  description: string;
  value: number;
  priority: 'baixa' | 'media' | 'alta';
  column_id: string;
  phone?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
}

export const KanbanPipeline: React.FC<{ onConversion?: (t: any) => void }> = ({ onConversion }) => {
  const [columns] = useState<KanbanColumn[]>([
    { id: '1', title: 'Novos Leads', color: '#3b82f6' },
    { id: '2', title: 'Em Negociação', color: '#f59e0b' },
    { id: '3', title: 'Proposta Enviada', color: '#8b5cf6' },
    { id: '4', title: 'Fechado', color: '#10b981' },
  ]);

  const [cards, setCards] = useState<KanbanCard[]>([
    { id: 'c1', title: 'Divórcio Consensual - Maria S.', description: 'Aguardando envio de documentos iniciais.', value: 5000, priority: 'alta', column_id: '1', phone: '5511999999999' },
    { id: 'c2', title: 'Consultoria Tech Corp', description: 'Revisão de contrato internacional.', value: 12000, priority: 'media', column_id: '2', phone: '5511888888888' },
    { id: 'c3', title: 'Inventário Espólio J.R.', description: 'Negociação de honorários com herdeiros.', value: 45000, priority: 'alta', column_id: '2', phone: '5511777777777' },
  ]);

  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Partial<KanbanCard> | null>(null);

  const onDragStart = (id: string) => setDraggedCardId(id);
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  
  const onDrop = (columnId: string) => {
    if (!draggedCardId) return;
    setCards(prev => prev.map(card => 
      card.id === draggedCardId ? { ...card, column_id: columnId } : card
    ));
    setDraggedCardId(null);
  };

  const handleEditClick = (card: KanbanCard) => {
    setEditingCard(card);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;
    setCards(prev => prev.map(c => c.id === editingCard.id ? { ...c, ...editingCard } as KanbanCard : c));
    setIsEditModalOpen(false);
  };

  const openWhatsApp = (phone?: string) => {
    if (!phone) return alert('Telefone não cadastrado.');
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter dark:text-white">Fluxo de Oportunidades</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pipeline de vendas e conversão de leads jurídicos.</p>
        </div>
        <button className="dynamic-btn px-6 py-3 rounded-xl text-xs uppercase tracking-widest">
          <i className="fas fa-plus mr-2"></i> Novo Lead
        </button>
      </header>

      <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar min-h-[60vh]">
        {columns.map(col => {
          const colCards = cards.filter(c => c.column_id === col.id);
          return (
            <div 
              key={col.id} 
              className="w-80 flex-shrink-0 space-y-4"
              onDragOver={onDragOver}
              onDrop={() => onDrop(col.id)}
            >
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }}></div>
                  <h3 className="text-[11px] font-black dark:text-white uppercase tracking-widest">{col.title}</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{colCards.length}</span>
              </div>

              <div className="space-y-4 min-h-[400px]">
                {colCards.map(card => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => onDragStart(card.id)}
                    className="soft-glass p-5 cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-all border-l-4"
                    style={{ borderLeftColor: col.color }}
                  >
                    <div className="flex justify-between items-start mb-4">
                       <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${card.priority === 'alta' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-500'}`}>
                        {card.priority}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(card)} className="text-slate-400 hover:text-blue-500 transition-colors"><i className="fas fa-edit text-[10px]"></i></button>
                        <button onClick={() => openWhatsApp(card.phone)} className="text-emerald-500 hover:scale-110 transition-transform"><i className="fab fa-whatsapp text-xs"></i></button>
                      </div>
                    </div>
                    <h4 className="text-sm font-black dark:text-white mb-1">{card.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">{card.description}</p>
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                      <span className="text-xs font-black dark:text-white text-emerald-500">R$ {card.value.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="soft-glass w-full max-w-md p-10 bg-white dark:bg-slate-900 shadow-2xl">
            <h2 className="text-2xl font-black dark:text-white mb-6 uppercase tracking-tighter">Editar Lead</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <input 
                className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl outline-none text-sm dark:text-white" 
                value={editingCard?.title || ''} 
                onChange={e => setEditingCard({...editingCard, title: e.target.value})} 
                placeholder="Título"
              />
              <textarea 
                className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl outline-none text-sm dark:text-white h-24" 
                value={editingCard?.description || ''} 
                onChange={e => setEditingCard({...editingCard, description: e.target.value})} 
                placeholder="Descrição"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl outline-none text-sm dark:text-white" 
                  value={editingCard?.value || 0} 
                  onChange={e => setEditingCard({...editingCard, value: parseFloat(e.target.value)})} 
                  placeholder="Valor"
                />
                <input 
                  className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl outline-none text-sm dark:text-white" 
                  value={editingCard?.phone || ''} 
                  onChange={e => setEditingCard({...editingCard, phone: e.target.value})} 
                  placeholder="WhatsApp"
                />
              </div>
              <div className="flex justify-end gap-3 pt-6">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-xs font-black uppercase text-slate-500">Cancelar</button>
                <button type="submit" className="dynamic-btn px-10 py-3 rounded-xl text-xs uppercase tracking-widest">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
