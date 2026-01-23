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
import { CNPJConsultation } from './components/CNPJConsultation';
import { CPFConsultation } from './components/CPFConsultation';
import { FiscalDocumentModule } from './components/FiscalDocumentModule';

const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3001/api' : '/api';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'members' | 'crm'>('landing');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'agenda' | 'lawyers' | 'financial' | 'ai' | 'kanban' | 'planning' | 'documents' | 'intelligence' | 'library' | 'cnpj' | 'cpf' | 'fiscal'>('dashboard');
  const [auth, setAuth] = useState<any>(null);
  const [showMoreMobile, setShowMoreMobile] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState<string | null>(null);
  
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
      
      if (!res.ok) return null;
      return await res.json();
    } catch (e: any) {
      if (e.message === "HTML_RESPONSE") {
        setMaintenanceMode("O servidor juizado.com está a responder em modo de manutenção ou erro de rota.");
      }
      return null;
    }
  };

  const loadAllData = async () => {
    if (!auth || !auth.token) return;
    try {
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
    } catch (e) {
      console.warn("juizado.com: Falha na sincronização SaaS.");
    }
  };

  const handleLogin = (authResponse: any) => {
    localStorage.setItem('juizado_session', JSON.stringify(authResponse));
    setAuth(authResponse);
    setCurrentView('crm');
  };

  const handleLogout = () => {
    localStorage.removeItem('juizado_session');
    setAuth(null);
    setCurrentView('landing');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line', main: true, minPlan: 'basico' },
    { id: 'intelligence', label: 'Intimações', icon: 'fa-bolt-lightning', main: true, minPlan: 'pro' },
    { id: 'kanban', label: 'CRM Leads', icon: 'fa-columns', main: true, minPlan: 'basico' },
    { id: 'fiscal', label: 'Doc. Fiscais', icon: 'fa-barcode', main: true, minPlan: 'master' },
    { id: 'agenda', label: 'Agenda', icon: 'fa-calendar-alt', main: true, minPlan: 'basico' },
    { id: 'ai', label: 'IA Jurídica', icon: 'fa-wand-magic-sparkles', minPlan: 'pro' },
    { id: 'planning', label: 'BI Estratégico', icon: 'fa-chess-knight', minPlan: 'master' },
    { id: 'documents', label: 'Modelos', icon: 'fa-file-signature', minPlan: 'basico' },
    { id: 'clients', label: 'Clientes', icon: 'fa-user-tie', minPlan: 'basico' },
    { id: 'financial', label: 'Financeiro', icon: 'fa-wallet', minPlan: 'basico' },
    { id: 'lawyers', label: 'Equipe', icon: 'fa-users-gear', adminOnly: true, minPlan: 'basico' },
  ];

  const checkPlanAccess = (itemId: string) => {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return true;
    const userPlan = auth?.user?.plan || 'basico';
    const planLevels = { 'basico': 0, 'pro': 1, 'master': 2 };
    return planLevels[userPlan] >= planLevels[item.minPlan];
  };

  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || auth?.user?.perfil === 'admin');
  const activeLabel = filteredMenuItems.find(i => i.id === activeTab)?.label;

  if (maintenanceMode) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 p-10 text-center">
      <div className="max-w-md space-y-6">
        <div className="text-blue-500 text-5xl mb-4"><i className="fas fa-server"></i></div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">juizado.com</h1>
        <p className="text-slate-400 font-medium">{maintenanceMode}</p>
        <button onClick={() => window.location.reload()} className="dynamic-btn px-8 py-3 rounded-xl text-xs uppercase tracking-widest">Tentar Novamente</button>
      </div>
    </div>
  );

  if (currentView === 'landing') return <LandingPage onGoToLogin={() => setCurrentView('login')} onGoToMembers={() => setCurrentView('members')} />;
  if (currentView === 'login') return <Login onLogin={handleLogin} onBack={() => setCurrentView('landing')} />;
  if (currentView === 'members') return <MembersArea onBack={() => setCurrentView('landing')} onGoToCRM={() => setCurrentView('login')} />;

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 overflow-hidden font-sans text-white">
      {/* MAC STYLE DOCK - DESKTOP */}
      <div className="fixed top-6 left-8 z-[60] hidden lg:flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
          <i className="fas fa-balance-scale text-lg"></i>
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter text-white leading-tight">juizado<span className="text-blue-600">.com</span></h1>
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{auth?.user?.orgName || 'Escritório'}</p>
        </div>
      </div>

      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] hidden lg:block">
        <div className="flex items-center gap-1.5 p-2 rounded-[28px] bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl overflow-x-auto no-scrollbar max-w-[80vw]">
          {filteredMenuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)} 
              className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 transform hover:scale-125 hover:-translate-y-2 relative ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
            >
              <i className={`fas ${item.icon} text-lg`}></i>
              {!checkPlanAccess(item.id) && <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-900 flex items-center justify-center"><i className="fas fa-lock text-[5px] text-white"></i></div>}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto pt-24 pb-24 lg:pb-8 lg:pt-28 px-4 md:px-10 custom-scrollbar bg-slate-950">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-left-4 duration-700">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">SaaS Workspace</span>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/5 px-4 py-1.5 rounded-full border border-blue-500/10 flex items-center gap-2">
              <i className="fas fa-circle text-[6px] animate-pulse"></i>
              {activeLabel}
            </span>
          </div>

          <div className="animate-in fade-in duration-500">
            {!checkPlanAccess(activeTab) ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 text-3xl"><i className="fas fa-lock"></i></div>
                <div className="max-w-md">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white">Módulo Master</h2>
                  <p className="text-slate-500 mt-2">Esta funcionalidade exige o Plano Master do juizado.com para análise profunda de dados.</p>
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
