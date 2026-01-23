
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
import { FiscalDocumentModule } from './components/FiscalDocumentModule';

const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3001/api' : '/api';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'members' | 'crm'>('landing');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'agenda' | 'lawyers' | 'financial' | 'ai' | 'kanban' | 'planning' | 'documents' | 'intelligence' | 'library' | 'fiscal'>('dashboard');
  const [auth, setAuth] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  
  const [clients, setClients] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [financials, setFinancials] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('juizado_session');
    if (saved) {
      try {
        const session = JSON.parse(saved);
        if (session && session.token) {
          setAuth(session);
          setCurrentView('crm');
        }
      } catch (e) {
        localStorage.removeItem('juizado_session');
      }
    }
  }, []);

  useEffect(() => {
    if (auth && auth.token) loadAllData();
  }, [auth]);

  const fetchSafe = async (url: string, options: any) => {
    try {
      const res = await fetch(url, options);
      const contentType = res.headers.get("content-type");
      
      if (contentType && contentType.includes("text/html")) {
        throw new Error("HTML_RESPONSE");
      }
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Erro ${res.status}`);
      }
      return await res.json();
    } catch (e: any) {
      console.warn(`Fetch error for ${url}:`, e.message);
      return null;
    }
  };

  const loadAllData = async () => {
    if (!auth || !auth.token) return;
    
    // Se for usuário demo (id: 0), não tentamos buscar no banco real para evitar erros 404/403
    if (auth.user?.id === 0) {
      console.log("Modo Demo Ativo: Ignorando fetch de banco real.");
      return;
    }

    const h = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` };
    const options = { headers: h };

    const [cData, eData, fData, uData] = await Promise.all([
      fetchSafe(`${API_URL}/clients`, options),
      fetchSafe(`${API_URL}/agenda`, options),
      fetchSafe(`${API_URL}/financial`, options),
      fetchSafe(`${API_URL}/users`, options)
    ]);

    if (cData) setClients(cData);
    if (eData) setEvents(eData);
    if (fData) setFinancials(fData);
    if (uData) setUsers(uData);
  };

  const handleLogin = (res: any) => {
    setAuth(res);
    setCurrentView('crm');
    localStorage.setItem('juizado_session', JSON.stringify(res));
  };

  const handleLogout = () => {
    localStorage.removeItem('juizado_session');
    setAuth(null);
    setCurrentView('landing');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: 'fa-chart-line', minPlan: 'basico' },
    { id: 'intelligence', label: 'Prazos', icon: 'fa-bolt-lightning', minPlan: 'pro' },
    { id: 'kanban', label: 'Leads', icon: 'fa-columns', minPlan: 'basico' },
    { id: 'fiscal', label: 'Fiscal', icon: 'fa-barcode', minPlan: 'master' },
    { id: 'agenda', label: 'Agenda', icon: 'fa-calendar-alt', minPlan: 'basico' },
    { id: 'ai', label: 'IA Jurídica', icon: 'fa-wand-magic-sparkles', minPlan: 'pro' },
    { id: 'planning', label: 'Estratégico', icon: 'fa-chess-knight', minPlan: 'master' },
    { id: 'documents', label: 'Modelos', icon: 'fa-file-signature', minPlan: 'basico' },
    { id: 'clients', label: 'Clientes', icon: 'fa-user-tie', minPlan: 'basico' },
    { id: 'financial', label: 'Financeiro', icon: 'fa-wallet', minPlan: 'basico' },
    { id: 'lawyers', label: 'Equipe', icon: 'fa-users-gear', adminOnly: true, minPlan: 'basico' },
  ];

  const checkPlanAccess = (itemId: string) => {
    if (auth?.user?.id === 0) return true;
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return true;
    const userPlan = auth?.user?.plan || 'basico';
    const planLevels: any = { 'basico': 0, 'pro': 1, 'master': 2 };
    return planLevels[userPlan] >= planLevels[item.minPlan];
  };

  if (currentView === 'landing') return <LandingPage onGoToLogin={() => setCurrentView('login')} onGoToMembers={() => setCurrentView('members')} />;
  if (currentView === 'login') return <Login onLogin={handleLogin} onBack={() => setCurrentView('landing')} />;
  if (currentView === 'members') return <MembersArea onBack={() => setCurrentView('landing')} onGoToCRM={() => setCurrentView('login')} />;

  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || auth?.user?.perfil === 'admin');

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 overflow-hidden font-sans text-white">
      
      <div className="fixed top-6 left-8 z-[100] hidden lg:flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
          <i className="fas fa-balance-scale"></i>
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter text-white">juizado<span className="text-blue-600">.com</span></h1>
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{auth?.user?.orgName || 'Escritório Digital'}</p>
        </div>
      </div>

      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] hidden lg:block">
        <div className="flex items-center gap-1.5 p-2 rounded-[28px] bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)]">
          {filteredMenuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)} 
              className={`group w-11 h-11 flex flex-col items-center justify-center rounded-xl transition-all duration-300 transform hover:scale-125 hover:-translate-y-2 relative ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
              <i className={`fas ${item.icon} text-lg`}></i>
              <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 bg-slate-800 text-[8px] px-2 py-1 rounded border border-white/10 pointer-events-none transition-opacity whitespace-nowrap uppercase font-black tracking-widest">{item.label}</span>
              {!checkPlanAccess(item.id) && <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-900 flex items-center justify-center"><i className="fas fa-lock text-[5px] text-white"></i></div>}
            </button>
          ))}
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          <button onClick={handleLogout} className="w-11 h-11 flex items-center justify-center rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all">
            <i className="fas fa-power-off"></i>
          </button>
        </div>
      </nav>

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 z-[100] lg:hidden flex items-center justify-around px-2">
         {filteredMenuItems.slice(0, 5).map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-blue-500' : 'text-slate-500'}`}>
               <i className={`fas ${item.icon} text-lg`}></i>
               <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
         ))}
      </nav>

      <main className="flex-1 overflow-y-auto pt-24 pb-24 lg:pb-8 lg:pt-28 px-4 md:px-10 custom-scrollbar bg-slate-950">
        <div className="max-w-7xl mx-auto">
          {!checkPlanAccess(activeTab) ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-fade-up">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 text-3xl border border-amber-500/20 shadow-2xl shadow-amber-500/10">
                <i className="fas fa-lock"></i>
              </div>
              <div className="max-w-md">
                <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Módulo Restrito</h2>
                <p className="text-slate-400 font-medium leading-relaxed">Esta funcionalidade exclusiva requer o upgrade para o plano {menuItems.find(i => i.id === activeTab)?.minPlan.toUpperCase()}.</p>
                <button className="dynamic-btn mt-8 px-10 py-4 rounded-2xl text-xs uppercase tracking-widest font-black">Upgrade Imediato</button>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
              {activeTab === 'intelligence' && <IntelligenceModule clients={clients} lawyers={users} onDelegate={loadAllData} />}
              {activeTab === 'clients' && <ClientManager clients={clients} onAdd={loadAllData} />}
              {activeTab === 'financial' && <FinancialManager transactions={financials} onAdd={loadAllData} />}
              {activeTab === 'agenda' && <Agenda events={events} onAdd={loadAllData} />}
              {activeTab === 'documents' && <DocumentTemplates />}
              {activeTab === 'library' && <LegalLibrary />}
              {activeTab === 'ai' && <div className="max-w-4xl mx-auto"><AIAssistant /></div>}
              {activeTab === 'planning' && <StrategicPlanning />}
              {activeTab === 'lawyers' && <LawyerManager users={users} onUpdate={loadAllData} />}
              {activeTab === 'fiscal' && <FiscalDocumentModule />}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
