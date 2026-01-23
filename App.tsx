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

const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3001/api' : '/api';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'members' | 'crm'>('landing');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'agenda' | 'lawyers' | 'financial' | 'ai' | 'kanban' | 'planning' | 'documents' | 'intelligence' | 'library' | 'cnpj' | 'cpf'>('dashboard');
  const [auth, setAuth] = useState<any>(null);
  const [showMoreMobile, setShowMoreMobile] = useState(false);
  
  const [clients, setClients] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [financials, setFinancials] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('lexflow_session');
    if (saved) {
      try {
        const session = JSON.parse(saved);
        if (session && session.token) {
          setAuth(session);
          setCurrentView('crm');
        } else {
          localStorage.removeItem('lexflow_session');
        }
      } catch (e) {
        localStorage.removeItem('lexflow_session');
      }
    }
  }, []);

  useEffect(() => {
    if (auth && auth.token) loadAllData();
  }, [auth]);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${auth?.token || ''}`
  });

  const loadAllData = async () => {
    if (!auth || !auth.token) return;
    try {
      const h = getHeaders();
      const options = { headers: h };
      const fetchSafe = async (url: string) => {
        try {
          const res = await fetch(url, options);
          if (!res.ok) return null;
          const text = await res.text();
          try { return JSON.parse(text); } catch (e) { return null; }
        } catch (e) { return null; }
      };

      const [cData, eData, fData, uData] = await Promise.all([
        fetchSafe(`${API_URL}/clients`),
        fetchSafe(`${API_URL}/agenda`),
        fetchSafe(`${API_URL}/financial`),
        fetchSafe(`${API_URL}/users`)
      ]);

      if (cData) setClients(cData);
      if (eData) setEvents(eData);
      if (fData) setFinancials(fData);
      if (uData) setUsers(uData);
    } catch (e) {
      console.warn("LexFlow: Erro de sincronização.", e);
    }
  };

  const handleLogin = (authResponse: any) => {
    localStorage.setItem('lexflow_session', JSON.stringify(authResponse));
    setAuth(authResponse);
    setCurrentView('crm');
  };

  const handleLogout = () => {
    localStorage.removeItem('lexflow_session');
    setAuth(null);
    setCurrentView('landing');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line', main: true },
    { id: 'intelligence', label: 'Intimações', icon: 'fa-bolt-lightning', main: true },
    { id: 'kanban', label: 'CRM Leads', icon: 'fa-columns', main: true },
    { id: 'agenda', label: 'Agenda', icon: 'fa-calendar-alt', main: true },
    { id: 'ai', label: 'IA Assistente', icon: 'fa-wand-magic-sparkles', main: true },
    { id: 'planning', label: 'BI Estratégico', icon: 'fa-chess-knight' },
    { id: 'documents', label: 'Modelos', icon: 'fa-file-signature' },
    { id: 'library', label: 'Biblioteca', icon: 'fa-book-bookmark' },
    { id: 'cnpj', label: 'CNPJ', icon: 'fa-building-shield' },
    { id: 'cpf', label: 'CPF', icon: 'fa-id-card' },
    { id: 'clients', label: 'Clientes', icon: 'fa-user-tie' },
    { id: 'financial', label: 'Financeiro', icon: 'fa-wallet' },
    { id: 'lawyers', label: 'Equipe', icon: 'fa-users-gear', adminOnly: true },
  ];

  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || auth?.user?.perfil === 'admin');
  const mobileMainItems = filteredMenuItems.filter(item => item.main);
  const mobileOtherItems = filteredMenuItems.filter(item => !item.main);

  if (currentView === 'landing') return <LandingPage onGoToLogin={() => setCurrentView('login')} onGoToMembers={() => setCurrentView('members')} />;
  if (currentView === 'login') return <Login onLogin={handleLogin} onBack={() => setCurrentView('landing')} />;
  if (currentView === 'members') return <MembersArea onBack={() => setCurrentView('landing')} onGoToCRM={() => setCurrentView('login')} />;

  const isDemoMode = auth?.user?.perfil === 'demo';
  const activeLabel = filteredMenuItems.find(i => i.id === activeTab)?.label;

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 overflow-hidden font-sans text-white">
      {/* DESKTOP FLOATING LOGO */}
      <div className="fixed top-6 left-8 z-[60] hidden lg:flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
          <i className="fas fa-balance-scale text-sm"></i>
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tighter text-white leading-tight">LexFlow<span className="text-blue-600">360</span></h1>
          {isDemoMode && <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest block -mt-1">Modo Demo</span>}
        </div>
      </div>

      {/* DESKTOP NAV DOCK (TOP CENTER) */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] hidden lg:block">
        <div className="flex items-center gap-1.5 p-2 rounded-[24px] bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl">
          {filteredMenuItems.map((item) => (
            <div key={item.id} className="relative group">
              {/* Tooltip */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap border border-white/5 shadow-xl pointer-events-none">
                {item.label}
              </div>
              
              <button 
                onClick={() => setActiveTab(item.id as any)} 
                className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 transform group-hover:scale-125 group-hover:-translate-y-2 ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
              >
                <i className={`fas ${item.icon} text-lg`}></i>
              </button>
            </div>
          ))}
        </div>
      </nav>

      {/* DESKTOP USER PROFILE (TOP RIGHT) */}
      <div className="fixed top-6 right-8 z-[60] hidden lg:flex items-center gap-4">
        <div className="flex flex-col items-end">
          <p className="text-xs font-black text-white">{auth?.user?.nome}</p>
          <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">{auth?.user?.perfil}</p>
        </div>
        <div className="relative group cursor-pointer">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth?.user?.nome || 'User')}&background=2563eb&color=fff`} className="w-10 h-10 rounded-xl border border-white/20 shadow-lg" alt="Avatar" />
          <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <div className="bg-slate-900 border border-white/10 p-2 rounded-xl shadow-2xl min-w-[160px]">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-white/5">
                <i className="fas fa-sign-out-alt"></i> Encerrar Sessão
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN VIEW AREA */}
      <main className="flex-1 overflow-y-auto pt-24 pb-24 lg:pb-8 lg:pt-28 px-4 md:px-10 custom-scrollbar bg-slate-950">
        <div className="max-w-full mx-auto">
          {/* WORKSPACE INDICATOR - THIN LINE */}
          <div className="flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-left-4 duration-700">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Workspace</span>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/5 px-3 py-1 rounded-full border border-blue-500/10">
              {activeLabel}
            </span>
          </div>

          <div className="animate-in fade-in duration-500">
            {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
            {activeTab === 'intelligence' && <IntelligenceModule clients={clients} lawyers={users} onDelegate={loadAllData} />}
            {activeTab === 'clients' && <ClientManager clients={clients} onAdd={loadAllData} />}
            {activeTab === 'financial' && <FinancialManager transactions={financials} onAdd={loadAllData} />}
            {activeTab === 'agenda' && <Agenda events={events} onAdd={loadAllData} />}
            {activeTab === 'documents' && <DocumentTemplates />}
            {activeTab === 'library' && <LegalLibrary />}
            {activeTab === 'cnpj' && <CNPJConsultation />}
            {activeTab === 'cpf' && <CPFConsultation />}
            {activeTab === 'kanban' && <KanbanPipeline />}
            {activeTab === 'planning' && <StrategicPlanning />}
            {activeTab === 'lawyers' && <LawyerManager users={users} onUpdate={loadAllData} />}
            {activeTab === 'ai' && <div className="max-w-4xl mx-auto"><AIAssistant /></div>}
          </div>
        </div>
      </main>
      
      {/* MOBILE BOTTOM NAV BAR */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-slate-900/90 backdrop-blur-2xl border-t border-white/10 h-20 px-6 flex items-center justify-between">
         {mobileMainItems.map((item) => (
           <button 
             key={item.id} 
             onClick={() => { setActiveTab(item.id as any); setShowMoreMobile(false); }} 
             className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === item.id ? 'text-blue-500' : 'text-slate-500'}`}
           >
             <i className={`fas ${item.icon} text-xl`}></i>
             <span className="text-[8px] font-black uppercase tracking-widest">{item.label.split(' ')[0]}</span>
           </button>
         ))}
         
         {/* MOBILE "MORE" BUTTON */}
         <button 
           onClick={() => setShowMoreMobile(!showMoreMobile)} 
           className={`flex flex-col items-center gap-1.5 transition-all ${showMoreMobile ? 'text-blue-500' : 'text-slate-500'}`}
         >
           <i className={`fas ${showMoreMobile ? 'fa-times' : 'fa-ellipsis-h'} text-xl`}></i>
           <span className="text-[8px] font-black uppercase tracking-widest">Mais</span>
         </button>

         {/* MOBILE "MORE" MENU OVERLAY */}
         {showMoreMobile && (
           <div className="absolute bottom-24 left-6 right-6 p-4 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-3 gap-4">
                {mobileOtherItems.map(item => (
                   <button 
                    key={item.id} 
                    onClick={() => { setActiveTab(item.id as any); setShowMoreMobile(false); }} 
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-white/5 transition-all"
                   >
                     <i className={`fas ${item.icon} text-lg text-slate-400`}></i>
                     <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter text-center">{item.label}</span>
                   </button>
                ))}
                <button onClick={handleLogout} className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-rose-500/10 transition-all col-span-3 border-t border-white/5 mt-2">
                  <i className="fas fa-sign-out-alt text-lg text-rose-500"></i>
                  <span className="text-[8px] font-bold text-rose-500 uppercase tracking-widest">Sair do LexFlow</span>
                </button>
              </div>
           </div>
         )}
      </footer>
    </div>
  );
};

export default App;
