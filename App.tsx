
import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ClientManager } from './components/ClientManager';
import { AIAssistant } from './components/AIAssistant';
import { Agenda } from './components/Agenda';
import { LawyerManager } from './components/LawyerManager';
import { FinancialManager } from './components/FinancialManager';
import { KanbanPipeline } from './components/KanbanPipeline';
import { StrategicPlanning } from './components/StrategicPlanning';
import { DocumentTemplates } from './components/DocumentTemplates';
import { IntelligenceModule } from './components/IntelligenceModule';
import { LegalLibrary } from './components/LegalLibrary';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'agenda' | 'lawyers' | 'financial' | 'ai' | 'kanban' | 'planning' | 'documents' | 'intelligence' | 'library'>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [lawyers] = useState([
    { id: '1', name: 'Dr. Ricardo Silva', oab: '123.456/SP' },
    { id: '2', name: 'Dra. Beatriz Mendes', oab: '654.321/SP' }
  ]);

  const [clients, setClients] = useState([
    { id: '1', name: 'João Silva Oliveira', type: 'PF', doc: '123.456.789-00', email: 'joao@email.com', city: 'São Paulo', cases: 3, history: [] as any[] },
    { id: '2', name: 'Tech Solutions Global', type: 'PJ', doc: '12.345.678/0001-90', email: 'legal@tech.com', city: 'Curitiba', cases: 1, history: [] as any[] }
  ]);

  const [events, setEvents] = useState([
    { id: '1', title: 'Audiência de Conciliação', description: 'Vara de Família - Caso João vs Maria', date: new Date().toISOString().split('T')[0], time: '14:00', type: 'audiencia' },
  ]);

  const [transactions, setTransactions] = useState([
    { id: '1', desc: 'Honorários de Sucumbência', val: 5400.50, type: 'receita', status: 'pago', date: '2024-06-12' },
  ]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const addClient = (newClient: any) => setClients(prev => [{...newClient, history: []}, ...prev]);
  
  const handleDelegation = (data: { pub: any, clientId: string, lawyerId: string, deadline: string }) => {
    const newEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: `PRAZO: ${data.pub.cnj}`,
      description: `Responsável: ${lawyers.find(l => l.id === data.lawyerId)?.name}. Conteúdo: ${data.pub.content}`,
      date: data.deadline,
      time: '23:59',
      type: 'prazo'
    };
    setEvents(prev => [...prev, newEvent]);
    setClients(prev => prev.map(cli => {
      if (cli.id === data.clientId) {
        return {
          ...cli,
          history: [{
            date: new Date().toLocaleDateString(),
            type: 'Intimação',
            description: data.pub.content,
            responsible: lawyers.find(l => l.id === data.lawyerId)?.name
          }, ...cli.history]
        };
      }
      return cli;
    }));
    setActiveTab('clients');
  };

  const addTransaction = (t: any) => {
    setTransactions(prev => [t, ...prev]);
    setActiveTab('financial');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'intelligence', label: 'Push Intimações', icon: 'fa-bolt-lightning' },
    { id: 'kanban', label: 'Oportunidades', icon: 'fa-columns' },
    { id: 'planning', label: 'Estratégico & BI', icon: 'fa-chess-knight' },
    { id: 'documents', label: 'Modelos & Peças', icon: 'fa-file-signature' },
    { id: 'library', label: 'Acervo & Teses', icon: 'fa-book-bookmark' },
    { id: 'clients', label: 'Clientes', icon: 'fa-user-tie' },
    { id: 'agenda', label: 'Prazos & Agenda', icon: 'fa-calendar-alt' },
    { id: 'lawyers', label: 'Equipe Jurídica', icon: 'fa-users-gear' },
    { id: 'financial', label: 'Financeiro 360', icon: 'fa-wallet' },
    { id: 'ai', label: 'LexFlow AI', icon: 'fa-wand-magic-sparkles' },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      <aside className="w-72 h-full backdrop-blur-3xl border-r border-slate-200 dark:border-white/10 flex flex-col z-30 bg-white/70 dark:bg-slate-900/70">
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <i className="fas fa-balance-scale"></i>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter dark:text-white leading-tight">LexFlow<span className="text-blue-600">360</span></h1>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase">Sistema ERP Elite</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${activeTab === item.id ? 'sidebar-item-active shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
              <i className={`fas ${item.icon} w-5 text-lg transition-transform group-hover:scale-110`}></i>
              <span className="tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-100 dark:border-white/5 space-y-6">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
            <span className="text-[10px] font-black uppercase text-slate-500">{isDarkMode ? 'Modo Escuro' : 'Modo Claro'}</span>
            <i className={`fas ${isDarkMode ? 'fa-moon text-blue-400' : 'fa-sun text-amber-500'}`}></i>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-20 w-full backdrop-blur-xl border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-10 bg-white/40 dark:bg-slate-900/40 z-20">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workspace</span>
            <i className="fas fa-chevron-right text-[8px] text-slate-300"></i>
            <span className="text-sm font-black dark:text-white tracking-tight">{menuItems.find(i => i.id === activeTab)?.label}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-10">
            {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
            {activeTab === 'intelligence' && <IntelligenceModule clients={clients} lawyers={lawyers} onDelegate={handleDelegation} />}
            {activeTab === 'clients' && <ClientManager clients={clients} onAdd={addClient} />}
            {activeTab === 'financial' && <FinancialManager transactions={transactions} onAdd={addTransaction} />}
            {activeTab === 'agenda' && <Agenda events={events} setEvents={setEvents} />}
            {activeTab === 'documents' && <DocumentTemplates />}
            {activeTab === 'library' && <LegalLibrary />}
            {activeTab === 'kanban' && <KanbanPipeline onConversion={addTransaction} />}
            {activeTab === 'planning' && <StrategicPlanning />}
            {activeTab === 'lawyers' && <LawyerManager />}
            {activeTab === 'ai' && <div className="max-w-3xl mx-auto"><AIAssistant /></div>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
