import React, { useState, useEffect, useCallback } from 'react';

const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3001/api' : '/api';

interface LegalLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  case_type: string;
  potential_value: number;
  urgency: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  column_id: string;
  description: string;
  fee_type: string;
  fee_value: number;
  probability: number;
  created_at?: string;
  assigned_to?: string;
  deadline?: string;
  source?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  stage: string;
}

const COLUMNS: KanbanColumn[] = [
  { id: 'new', title: 'Novos Leads', color: '#3b82f6', stage: 'capture' },
  { id: 'qualify', title: 'Qualificação', color: '#f59e0b', stage: 'qualification' },
  { id: 'proposal', title: 'Proposta', color: '#8b5cf6', stage: 'proposal' },
  { id: 'negotiation', title: 'Negociação', color: '#0ea5e9', stage: 'negotiation' },
  { id: 'won', title: 'Convertido', color: '#10b981', stage: 'converted' },
  { id: 'lost', title: 'Perdido', color: '#ef4444', stage: 'lost' },
];

const CASE_COLORS: Record<string, string> = {
  TRABALHISTA: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  CIVIL: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  FAMILIA: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  PENAL: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  EMPRESARIAL: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  TRIBUTARIO: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  OUTROS: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
};

const URGENCY_CONFIG = {
  BAIXA: { color: 'text-slate-400', bg: 'bg-slate-500/10', label: 'Baixa' },
  MEDIA: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Média' },
  ALTA: { color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Alta' },
  CRITICA: { color: 'text-rose-500', bg: 'bg-rose-500/10', label: 'Crítica' },
};

export const KanbanPipeline: React.FC = () => {
  const [leads, setLeads] = useState<LegalLead[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<LegalLead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<Partial<LegalLead>>({
    case_type: 'CIVIL',
    urgency: 'MEDIA',
    fee_type: 'FIXO',
    potential_value: 0,
    column_id: 'new',
    probability: 50,
    fee_value: 0,
    source: 'site'
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const session = localStorage.getItem('juizado_session');
      const token = session ? JSON.parse(session).token : '';
      
      // Em ambiente de desenvolvimento sem token, use mock
      if (!token && window.location.origin.includes('localhost')) {
        setTimeout(() => {
          setLeads(getMockLeads());
          setIsLoading(false);
        }, 500);
        return;
      }

      if (!token) {
        setLeads(getMockLeads());
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/leads`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (res.ok) {
        const data = await res.json();
        setLeads(Array.isArray(data) ? data : getMockLeads());
      } else if (res.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
        setLeads(getMockLeads());
      } else {
        setError('Erro ao carregar leads. Usando dados demo.');
        setLeads(getMockLeads());
      }
    } catch (e) {
      console.error('Fetch error:', e);
      setError('Falha na conexão. Usando dados demo.');
      setLeads(getMockLeads());
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getMockLeads = (): LegalLead[] => [
    { 
      id: '1', 
      name: 'Mário Silva', 
      phone: '11999999999', 
      email: 'mario@email.com',
      case_type: 'TRABALHISTA', 
      potential_value: 15000, 
      urgency: 'ALTA', 
      column_id: 'new', 
      description: 'Reclamação trabalhista - Horas extras não pagas há 6 meses', 
      fee_type: 'PERCENTUAL', 
      fee_value: 30, 
      probability: 70,
      assigned_to: 'Dr. Carlos',
      deadline: '2024-12-15',
      source: 'indicação'
    },
    { 
      id: '2', 
      name: 'Tech Solutions LTDA', 
      phone: '11888888888', 
      email: 'contato@techsolutions.com',
      case_type: 'EMPRESARIAL', 
      potential_value: 45000, 
      urgency: 'MEDIA', 
      column_id: 'qualify', 
      description: 'Revisão contratual internacional - Joint venture com empresa alemã', 
      fee_type: 'FIXO', 
      fee_value: 5000, 
      probability: 40,
      assigned_to: 'Dra. Ana',
      source: 'site'
    },
    { 
      id: '3', 
      name: 'Clara Mendes', 
      phone: '11777777777', 
      email: 'clara@email.com',
      case_type: 'FAMILIA', 
      potential_value: 8000, 
      urgency: 'CRITICA', 
      column_id: 'proposal', 
      description: 'Divórcio litigioso c/ partilha de bens e guarda compartilhada', 
      fee_type: 'MISTO', 
      fee_value: 2000, 
      probability: 90,
      assigned_to: 'Dr. Roberto',
      deadline: '2024-11-30',
      source: 'redes_sociais'
    },
    { 
      id: '4', 
      name: 'Construtora Alfa SA', 
      phone: '11666666666',
      email: 'juridico@construtoraalfa.com',
      case_type: 'CIVIL', 
      potential_value: 120000, 
      urgency: 'ALTA', 
      column_id: 'negotiation', 
      description: 'Ação de responsabilidade civil por danos estruturais em empreendimento', 
      fee_type: 'PERCENTUAL', 
      fee_value: 20, 
      probability: 60,
      assigned_to: 'Dr. Carlos',
      source: 'evento'
    },
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (colId: string) => {
    if (!draggedId) return;
    
    const lead = leads.find(l => l.id === draggedId);
    if (!lead) return;

    // Atualiza estado local imediatamente para feedback visual
    setLeads(prev => prev.map(l => 
      l.id === draggedId ? { ...l, column_id: colId } : l
    ));

    // Envia atualização para API
    try {
      const session = localStorage.getItem('juizado_session');
      const token = session ? JSON.parse(session).token : '';
      
      if (token) {
        await fetch(`${API_URL}/leads/${draggedId}`, {
          method: 'PATCH',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ column_id: colId })
        });
      }

      // Se moveu para "won", registrar como conversão
      if (colId === 'won' && lead.column_id !== 'won') {
        console.log(`Lead ${lead.name} convertido em cliente!`);
        // Aqui você pode disparar outras ações: notificação, criar processo, etc.
      }

    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      // Reverte se falhar
      setLeads(prev => prev.map(l => 
        l.id === draggedId ? { ...l, column_id: lead.column_id } : l
      ));
    }

    setDraggedId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name?.trim() || !formData.phone?.trim()) {
      alert('Nome e telefone são obrigatórios');
      return;
    }

    const leadData = {
      ...formData,
      id: `lead_${Date.now()}`,
      created_at: new Date().toISOString(),
      probability: formData.probability || 50,
      fee_value: formData.fee_value || 0
    };

    try {
      const session = localStorage.getItem('juizado_session');
      const token = session ? JSON.parse(session).token : '';
      
      if (token) {
        const res = await fetch(`${API_URL}/leads`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(leadData)
        });
        
        if (res.ok) {
          const savedLead = await res.json();
          setLeads(prev => [...prev, savedLead]);
          setIsModalOpen(false);
          setFormData({
            case_type: 'CIVIL',
            urgency: 'MEDIA',
            fee_type: 'FIXO',
            potential_value: 0,
            column_id: 'new',
            probability: 50,
            fee_value: 0,
            source: 'site'
          });
          return;
        }
      }

      // Fallback para demo/local
      const newLead = leadData as LegalLead;
      setLeads(prev => [...prev, newLead]);
      setIsModalOpen(false);
      setFormData({
        case_type: 'CIVIL',
        urgency: 'MEDIA',
        fee_type: 'FIXO',
        potential_value: 0,
        column_id: 'new',
        probability: 50,
        fee_value: 0,
        source: 'site'
      });

    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      alert('Erro ao salvar lead. Tente novamente.');
    }
  };

  const handleConvertToProcess = async (leadId: string) => {
    if (!window.confirm('Converter este lead em processo jurídico?')) return;
    
    try {
      const session = localStorage.getItem('juizado_session');
      const token = session ? JSON.parse(session).token : '';
      
      if (token) {
        const res = await fetch(`${API_URL}/leads/${leadId}/convert-to-process`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          alert('Processo criado com sucesso!');
          fetchLeads();
          return;
        }
      }
      
      // Simulação para demo
      alert('Processo criado (simulação) - Módulo de processos não integrado.');
      setLeads(prev => prev.filter(l => l.id !== leadId));
      
    } catch (error) {
      console.error('Erro ao converter:', error);
      alert('Erro ao converter lead.');
    }
  };

  const handleLeadClick = (lead: LegalLead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const calculateHonoraryValue = (lead: LegalLead): number => {
    switch (lead.fee_type) {
      case 'PERCENTUAL':
        return lead.potential_value * (lead.fee_value / 100);
      case 'MISTO':
        return lead.fee_value + (lead.potential_value * 0.15); // Exemplo: fixo + 15%
      case 'FIXO':
      default:
        return lead.fee_value;
    }
  };

  const totalPotential = leads.reduce((acc, curr) => acc + (Number(curr.potential_value) || 0), 0);
  const totalHonorary = leads.reduce((acc, curr) => acc + calculateHonoraryValue(curr), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-slate-400">Carregando pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-up">
      {/* HEADER E MÉTRICAS */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white">Pipeline de Leads Jurídicos</h1>
          <p className="text-sm font-medium text-slate-400 mt-2">Gestão de prospecção e conversão em honorários.</p>
        </div>
        
        <div className="flex items-center gap-6">
          {error && (
            <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
              <p className="text-xs text-rose-400">{error}</p>
            </div>
          )}
          
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Valor em Pipeline</p>
            <h3 className="text-2xl font-black text-emerald-500">R$ {totalPotential.toLocaleString('pt-BR')}</h3>
            <p className="text-[9px] text-slate-600 mt-1">Honorários: R$ {totalHonorary.toLocaleString('pt-BR')}</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-8 py-4 rounded-2xl text-xs font-black text-white uppercase tracking-widest shadow-2xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
          >
            <i className="fas fa-plus mr-2"></i> Captar Novo Lead
          </button>
        </div>
      </header>

      {/* KANBAN BOARD */}
      <div className="flex gap-8 overflow-x-auto pb-10 no-scrollbar min-h-[70vh]">
        {COLUMNS.map(col => {
          const colLeads = leads.filter(l => l.column_id === col.id);
          const colValue = colLeads.reduce((a, b) => a + (Number(b.potential_value) || 0), 0);
          const colHonorary = colLeads.reduce((a, b) => a + calculateHonoraryValue(b), 0);
          
          return (
            <div 
              key={col.id} 
              className="w-80 flex-shrink-0 flex flex-col gap-6"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.id)}
            >
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }}></div>
                  <div>
                    <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{col.title}</h3>
                    <p className="text-[9px] text-slate-500 mt-0.5">{colLeads.length} lead(s)</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold text-slate-600">R$ {colValue.toLocaleString('pt-BR')}</span>
                  <span className="text-[8px] text-slate-700">Hon: R$ {colHonorary.toLocaleString('pt-BR')}</span>
                </div>
              </div>

              <div className="flex-1 space-y-5">
                {colLeads.map(lead => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    onClick={() => handleLeadClick(lead)}
                    className={`soft-glass p-6 cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-all border-l-4 group ${lead.urgency === 'CRITICA' ? 'border-rose-500' : 'border-white/5 hover:border-blue-500/40'} hover:shadow-xl hover:shadow-blue-500/5`}
                  >
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex flex-col gap-2">
                        <span className={`text-[8px] font-black px-2 py-1 rounded-lg border uppercase tracking-widest ${CASE_COLORS[lead.case_type] || CASE_COLORS.OUTRONS}`}>
                          {lead.case_type}
                        </span>
                        {lead.deadline && new Date(lead.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                          <span className="text-[7px] font-black text-rose-500 px-2 py-1 bg-rose-500/10 rounded-md animate-pulse">
                            ⚠️ PRAZO PRÓXIMO
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://wa.me/55${lead.phone.replace(/\D/g, '')}`, '_blank');
                          }}
                          className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                        >
                          <i className="fab fa-whatsapp text-xs"></i>
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-blue-500">
                          <i className="fas fa-ellipsis-v text-xs"></i>
                        </button>
                      </div>
                    </div>

                    <h4 className="text-base font-black text-white mb-1 tracking-tight">{lead.name}</h4>
                    <p className="text-[10px] font-medium text-slate-500 line-clamp-2 leading-relaxed mb-6">"{lead.description}"</p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-black text-slate-600 uppercase">Valor Causa</p>
                          <p className="text-xs font-black text-white">R$ {Number(lead.potential_value).toLocaleString('pt-BR')}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-600 uppercase">Probabilidade</p>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full" 
                                style={{ width: `${lead.probability}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] font-black text-white">{lead.probability}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div>
                          <p className="text-[9px] font-black text-slate-600 uppercase">Urgência</p>
                          <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${URGENCY_CONFIG[lead.urgency].bg} ${URGENCY_CONFIG[lead.urgency].color}`}>
                            {URGENCY_CONFIG[lead.urgency].label}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-600 uppercase">Honorários</p>
                          <p className="text-xs font-black text-white">
                            R$ {calculateHonoraryValue(lead).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {col.id === 'won' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConvertToProcess(lead.id);
                        }}
                        className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
                      >
                        <i className="fas fa-gavel mr-2"></i>
                        Converter em Processo
                      </button>
                    )}
                  </div>
                ))}
                
                {colLeads.length === 0 && (
                  <div 
                    className="h-40 border-2 border-dashed border-white/5 rounded-[32px] flex items-center justify-center text-[10px] font-black text-slate-700 uppercase tracking-widest hover:border-white/10 hover:text-slate-600 transition-colors cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Adicionar Lead
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL NOVO LEAD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="soft-glass w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-12 bg-slate-900 border border-white/10 shadow-3xl rounded-3xl">
            <header className="mb-8 flex justify-between items-start sticky top-0 bg-slate-900/90 backdrop-blur-sm pt-2 pb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">Captura Estratégica</h2>
                <p className="text-xs font-medium text-slate-500 mt-1">Insira os dados técnicos do lead jurídico.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-500 hover:text-white text-2xl transition-colors"
              >
                &times;
              </button>
            </header>

            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 flex items-center gap-1">
                    <i className="fas fa-user text-[8px]"></i>
                    Nome do Lead *
                  </label>
                  <input 
                    required 
                    value={formData.name || ''}
                    className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: João Silva Advogados"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1 flex items-center gap-1">
                    <i className="fas fa-phone text-[8px]"></i>
                    WhatsApp / Telefone *
                  </label>
                  <input 
                    required 
                    value={formData.phone || ''}
                    className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">
                    Área Jurídica
                  </label>
                  <select 
                    value={formData.case_type}
                    className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    onChange={e => setFormData({...formData, case_type: e.target.value})}
                  >
                    <option value="CIVIL">Direito Civil</option>
                    <option value="TRABALHISTA">Direito Trabalhista</option>
                    <option value="FAMILIA">Direito de Família</option>
                    <option value="PENAL">Direito Penal</option>
                    <option value="EMPRESARIAL">Empresarial</option>
                    <option value="TRIBUTARIO">Tributário</option>
                    <option value="OUTROS">Outros</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">
                    Urgência
                  </label>
                  <select 
                    value={formData.urgency}
                    className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    onChange={e => setFormData({...formData, urgency: e.target.value as any})}
                  >
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                    <option value="CRITICA">Crítica</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">
                    Valor Potencial da Causa (R$)
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    step="100"
                    value={formData.potential_value || ''}
                    className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    onChange={e => setFormData({...formData, potential_value: parseFloat(e.target.value) || 0})}
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">
                    Tipo de Honorários
                  </label>
                  <select 
                    value={formData.fee_type}
                    className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    onChange={e => setFormData({...formData, fee_type: e.target.value})}
                  >
                    <option value="FIXO">Valor Fixo</option>
                    <option value="PERCENTUAL">Percentual (%)</option>
                    <option value="MISTO">Misto (Fixo + %)</option>
                  </select>
                </div>
              </div>

              {formData.fee_type !== 'FIXO' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">
                    {formData.fee_type === 'PERCENTUAL' ? 'Percentual de Honorários (%)' : 'Valor Fixo Inicial (R$)'}
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    step={formData.fee_type === 'PERCENTUAL' ? '1' : '100'}
                    value={formData.fee_value || ''}
                    className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    onChange={e => setFormData({...formData, fee_value: parseFloat(e.target.value) || 0})}
                    placeholder={formData.fee_type === 'PERCENTUAL' ? '30' : '2000'}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1 flex items-center gap-1">
                  <i className="fas fa-file-alt text-[8px]"></i>
                  Descrição do Caso / Objeto
                </label>
                <textarea 
                  value={formData.description || ''}
                  className="w-full h-32 p-5 bg-white/5 border border-white/5 rounded-2xl text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20 custom-scrollbar resize-none"
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva brevemente o caso, pontos críticos e expectativas do cliente..."
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-8 py-4 rounded-2xl text-[11px] font-black uppercase text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-12 py-5 rounded-2xl text-[11px] font-black text-white uppercase tracking-widest shadow-2xl shadow-blue-600/40 transition-all hover:scale-105 active:scale-95"
                >
                  <i className="fas fa-plus-circle mr-2"></i>
                  Inserir Lead no Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALHES DO LEAD */}
      {isDetailModalOpen && selectedLead && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="soft-glass w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-12 bg-slate-900 border border-white/10 shadow-3xl rounded-3xl">
            <header className="mb-8 flex justify-between items-start sticky top-0 bg-slate-900/90 backdrop-blur-sm pt-2 pb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter">{selectedLead.name}</h2>
                <p className="text-xs font-medium text-slate-500 mt-1">Detalhes completos do lead</p>
              </div>
              <button 
                onClick={() => setIsDetailModalOpen(false)} 
                className="text-slate-500 hover:text-white text-2xl transition-colors"
              >
                &times;
              </button>
            </header>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-[10px] font-black uppercase text-slate-500 mb-4">Informações Básicas</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase">Contato</p>
                      <p className="text-sm text-white">{selectedLead.phone}</p>
                      {selectedLead.email && (
                        <p className="text-sm text-slate-400">{selectedLead.email}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase">Área Jurídica</p>
                      <span className={`inline-block text-[10px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest mt-1 ${CASE_COLORS[selectedLead.case_type]}`}>
                        {selectedLead.case_type}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black uppercase text-slate-500 mb-4">Valores</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase">Valor da Causa</p>
                      <p className="text-xl font-black text-white">R$ {selectedLead.potential_value.toLocaleString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase">Honorários Estimados</p>
                      <p className="text-lg font-black text-emerald-500">R$ {calculateHonoraryValue(selectedLead).toLocaleString('pt-BR')}</p>
                      <p className="text-[10px] text-slate-500">({selectedLead.fee_type} - {selectedLead.fee_value}{selectedLead.fee_type === 'PERCENTUAL' ? '%' : 'R$'})</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black uppercase text-slate-500 mb-4">Descrição do Caso</h3>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-sm text-slate-300 leading-relaxed">{selectedLead.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase">Urgência</p>
                  <span className={`inline-block text-[10px] font-black px-3 py-1.5 rounded-md uppercase mt-1 ${URGENCY_CONFIG[selectedLead.urgency].bg} ${URGENCY_CONFIG[selectedLead.urgency].color}`}>
                    {URGENCY_CONFIG[selectedLead.urgency].label}
                  </span>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase">Probabilidade</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full" 
                        style={{ width: `${selectedLead.probability}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-black text-white">{selectedLead.probability}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase">Atribuído a</p>
                  <p className="text-sm text-white mt-1">{selectedLead.assigned_to || 'Não atribuído'}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/5">
                <button 
                  onClick={() => {
                    window.open(`https://wa.me/55${selectedLead.phone.replace(/\D/g, '')}`, '_blank');
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 py-4 rounded-2xl text-sm font-black text-white uppercase tracking-widest shadow-xl shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
                >
                  <i className="fab fa-whatsapp mr-2"></i>
                  Contatar via WhatsApp
                </button>
                {selectedLead.column_id === 'won' && (
                  <button 
                    onClick={() => handleConvertToProcess(selectedLead.id)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-4 rounded-2xl text-sm font-black text-white uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <i className="fas fa-gavel mr-2"></i>
                    Criar Processo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};