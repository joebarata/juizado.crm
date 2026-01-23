import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
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
import { MembersArea } from './components/MembersArea';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'members' | 'crm'>('landing');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'agenda' | 'lawyers' | 'financial' | 'ai' | 'kanban' | 'planning' | 'documents' | 'intelligence' | 'library'>('dashboard');
  const [user, setUser] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    const savedUser = localStorage.getItem('lexflow_session');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      setCurrentView('crm');
    }

    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/clients');
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (e) {
      console.error("Erro ao carregar clientes do MySQL");
    }
  };

  const handleLogin = (userData: any) => {
    localStorage.setItem('lexflow_session', JSON.stringify(userData));
    setUser(userData);
    setCurrentView('crm');
  };

  const handleLogout = () => {
    localStorage.removeItem('lexflow_session');
    setUser(null);
    setCurrentView('landing');
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
    { id: 'lawyers', label: 'Equipe Jurídica', icon: 'fa-users-gear', adminOnly: true },
    { id: 'financial', label: 'Financeiro 360', icon: 'fa-wallet' },
    { id: 'ai', label: 'LexFlow AI', icon: 'fa-wand-magic-sparkles' },
  ];

  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || user?.role === 'ADMIN');

  if (currentView === 'landing') return <LandingPage onGoToLogin={() => setCurrentView('login')} onGoToMembers={() => setCurrentView('members')} />;
  if (currentView === 'login') return <Login onLogin={handleLogin} onBack={() => setCurrentView('landing')} />;
  if (currentView === 'members') return <MembersArea onBack={() => setCurrentView('landing')} onGoToCRM={() => setCurrentView('login')} />;

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans text-white">
      <aside className="w-72 h-full backdrop-blur-3xl border-r border-white/10 flex flex-col z-30 bg-slate-900/70">
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <i className="fas fa-balance-scale"></i>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white leading-tight">LexFlow<span className="text-blue-600">360</span></h1>
              <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Sistema ERP Elite</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredMenuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-white/5'}`}>
              <i className={`fas ${item.icon} w-5 text-lg transition-transform group-hover:scale-110`}></i>
              <span className="tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/5 space-y-4">
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors">
            <i className="fas fa-sign-out-alt mr-2"></i> Encerrar Sessão
          </button>
          <div className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-black uppercase text-slate-500">Acesso Seguro</span>
            <i className="fas fa-shield-halved text-blue-400"></i>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-20 w-full backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-10 bg-slate-900/40 z-20">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workspace</span>
            <i className="fas fa-chevron-right text-[8px] text-slate-300"></i>
            <span className="text-sm font-black text-white tracking-tight">{menuItems.find(i => i.id === activeTab)?.label}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-xs font-black text-white">{user?.name}</p>
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">PERFIL: {user?.role}</p>
            </div>
            <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=2563eb&color=fff`} className="w-10 h-10 rounded-xl border border-white/20" alt="Avatar" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-950">
          <div className="max-w-7xl mx-auto pb-10">
            {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
            {activeTab === 'intelligence' && <IntelligenceModule clients={clients} lawyers={[]} onDelegate={() => {}} />}
            {activeTab === 'clients' && <ClientManager clients={clients} onAdd={loadInitialData} />}
            {activeTab === 'financial' && <FinancialManager transactions={[]} onAdd={() => {}} />}
            {activeTab === 'agenda' && <Agenda events={[]} setEvents={() => {}} />}
            {activeTab === 'documents' && <DocumentTemplates />}
            {activeTab === 'library' && <LegalLibrary />}
            {activeTab === 'kanban' && <KanbanPipeline onConversion={() => {}} />}
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