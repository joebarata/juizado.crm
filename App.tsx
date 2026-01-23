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
        } else {
          localStorage.removeItem('juizado_session');
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
      if (e.message === "HTML_RESPONSE") {
        setErrorStatus("Erro de Configuração: O backend juizado.com respondeu com HTML (Provável erro de proxy ou arquivo inexistente).");
      } else {
        console.warn("API Error (Silenced for stability):", e.message);
      }
      return null;
    }
  };

  const loadAllData = async () => {
    if (!auth || !auth.token) return;
    const h = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` };
    const options = { headers: h };

    const [cData, eData, fData, uData] = await Promise.all([
      fetchSafe(`${API_URL}/clients`, options),
      fetchSafe(`${API_URL}/agenda`, options),
      fetchSafe(`${API_URL}/financial`, options),
      fetchSafe(`${API_URL}/users`, options)
    ]).catch(() => [null, null, null, null]);

    if (cData) setClients(cData);
    if (eData) setEvents(eData);
    if (fData) setFinancials(fData);
    if (uData) setUsers(uData);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: 'fa-chart-line', minPlan: 'basico' },
    { id: 'intelligence', label: 'Prazos', icon: 'fa-bolt-lightning', minPlan: 'pro' },
    { id: 'kanban', label: 'Negócios', icon: 'fa-columns', minPlan: 'basico' },
    { id: 'fiscal', label: 'Fiscal', icon: 'fa-barcode', minPlan: 'master' },
    { id: 'agenda', label: 'Agenda', icon: 'fa-calendar-alt', minPlan: 'basico' },
    { id: 'ai', label: 'AI', icon: 'fa-wand-magic-sparkles', minPlan: 'pro' },
    { id: 'planning', label: 'BI', icon: 'fa-chess-knight', minPlan: 'master' },
    { id: 'documents', label: 'Peças', icon: 'fa-file-signature', minPlan: 'basico' },
    { id: 'clients', label: 'Clientes', icon: 'fa-user-tie', minPlan: 'basico' },
    { id: 'financial', label: 'Grana', icon: 'fa-wallet', minPlan: 'basico' },
    { id: 'lawyers', label: 'Equipe', icon: 'fa-users-gear', adminOnly: true, minPlan: 'basico' },
  ];

  const checkPlanAccess = (itemId: string) => {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return true;
    const userPlan = auth?.user?.plan || 'basico';
    const planLevels: any = { 'basico': 0, 'pro': 1, 'master': 2 };
    return planLevels[userPlan] >= planLevels[item.minPlan];
  };

  if (errorStatus) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 p-8 text-center">
      <div className="max-w-md space-y-8 soft-glass p-12 border-rose-500/20">
        <div className="text-rose-500 text-6xl mb-4 animate-bounce"><i className="fas fa-satellite-dish"></i></div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">juizado.com</h1>
        <p className="text-slate-400 font-medium text-sm leading-relaxed">{errorStatus}</p>
        <button onClick={() => window.location.reload()} className="dynamic-btn w-full py-4 rounded-2xl text-xs uppercase tracking-widest">Reconectar ao Servidor</button>
      </div>
    </div>
  );

  if (currentView === 'landing') return <LandingPage onGoToLogin={() => setCurrentView('login')} onGoToMembers={() => setCurrentView('members')} />;
  if (currentView === 'login') return <Login onLogin={(res) => { setAuth(res); setCurrentView('crm'); localStorage.setItem('juizado_session', JSON.stringify(res)); }} onBack={() => setCurrentView('landing')} />;
  if (currentView === 'members') return <MembersArea onBack={() => setCurrentView('landing')} onGoToCRM={() => setCurrentView('login')} />;

  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || auth?.user?.perfil === 'admin');
  const activeLabel = filteredMenuItems.find(i => i.id === activeTab)?.label;

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 overflow-hidden font-sans text-white selection:bg-blue-600/30">
      {/* BRANDING DOCK - TOP LEFT */}
      <div className="fixed top-8 left-8 z-[100] hidden lg:flex items-center gap-4 group">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-600/40 group-hover:scale-110 transition-transform">
          <i className="fas fa-balance-scale text-xl"></i>
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white leading-tight">juizado<span className="text-blue-600">.com</span></h1>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">{auth?.user?.orgName || 'Workspace'}</p>
        </div>
      </div>

      {/* MAC STYLE DOCK - DESKTOP CENTERED BOTTOM */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] hidden lg:block">
        <div className="flex items-center gap-2 p-3 rounded-[32px] bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {filteredMenuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)} 
              title={item.label}
              className={`w-14 h-14 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 transform hover:scale-125 hover:-translate-y-4 relative group ${activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/40' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
              <i className={`fas ${item.icon} text-xl`}></i>
              <span className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-slate-800 text-[10px] px-3 py-1.5 rounded-lg border border-white/10 pointer-events-none transition-opacity whitespace-nowrap uppercase font-black tracking-widest">{item.label}</span>
              {!checkPlanAccess(item.id) && <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-lg"><i className="fas fa-lock text-[6px] text-white"></i></div>}
            </button>
          ))}
          <div className="w-px h-8 bg-white/10 mx-2"></div>
          <button onClick={() => { localStorage.removeItem('juizado_session'); setAuth(null); setCurrentView('landing'); }} className="w-14 h-14 flex items-center justify-center rounded-2xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all">
            <i className="fas fa-power-off text-xl"></i>
          </button>
        </div>
      </nav>

      {/* MOBILE NAV BAR */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 z-[100] lg:hidden flex items-center justify-around px-4">
         {filteredMenuItems.slice(0, 5).map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-blue-500' : 'text-slate-500'}`}>
               <i className={`fas ${item.icon} text-lg`}></i>
               <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
         ))}
      </nav>

      <main className="flex-1 overflow-y-auto pt-24 pb-32 lg:pb-32 lg:pt-32 px-4 md:px-12 custom-scrollbar bg-slate-950">
        <div className="max-w-7xl mx-auto pb-20">
          <div className="flex items-center gap-4 mb-10 animate-in fade-in slide-in-from-left-4 duration-1000">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.6em]">SaaS Engine 2.5</span>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/5 px-6 py-2 rounded-full border border-blue-500/10 flex items-center gap-3">
              <i className="fas fa-circle text-[6px] animate-pulse"></i>
              Módulo: {activeLabel}
            </span>
          </div>

          <div className="animate-in fade-in duration-500">
            {!checkPlanAccess(activeTab) ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-8 soft-glass p-12">
                <div className="w-24 h-24 rounded-[40px] bg-amber-500/10 flex items-center justify-center text-amber-500 text-4xl border border-amber-500/20 shadow-2xl shadow-amber-500/10"><i className="fas fa-lock"></i></div>
                <div className="max-w-md">
                  <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-4">Módulo Premium</h2>
                  <p className="text-slate-400 font-medium leading-relaxed">Esta funcionalidade estratégica do juizado.com requer o upgrade para o plano {menuItems.find(i => i.id === activeTab)?.minPlan.toUpperCase()}.</p>
                  <button className="dynamic-btn mt-10 px-12 py-4 rounded-2xl text-xs uppercase tracking-widest">Upgrade Imediato</button>
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
        </div>
      </main>
    </div>
  );
};

export default App;