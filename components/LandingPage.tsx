import React from 'react';

export const LandingPage: React.FC<{ onGoToLogin: () => void, onGoToMembers: () => void }> = ({ onGoToLogin, onGoToMembers }) => {
  
  const pains = [
    {
      title: "Isolamento de Dados",
      desc: "Segurança absoluta para o seu escritório com infraestrutura SaaS multi-tenant.",
      solution: "O juizado.com garante que seus dados nunca se misturem com outros usuários.",
      icon: "fa-shield-halved",
      color: "blue"
    },
    {
      title: "IA Preditiva Master",
      desc: "Calcule riscos processuais usando modelos de IA treinados em milhões de decisões.",
      solution: "Gere estratégias vencedoras baseadas no perfil do magistrado e tribunal.",
      icon: "fa-brain",
      color: "purple"
    },
    {
      title: "Gestão 360 Escalável",
      desc: "Cresça sua banca sem perder o controle de prazos ou faturamento.",
      solution: "DRE automático e pipeline de leads integrado nativamente.",
      icon: "fa-rocket",
      color: "emerald"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-600 font-sans overflow-x-hidden">
      
      {/* GLOSSY DEEP BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <i className="fas fa-hammer"></i>
            </div>
            <span className="text-2xl font-black tracking-tighter">juizado<span className="text-blue-600">.com</span></span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <button onClick={onGoToMembers} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all">Academy</button>
            <button onClick={onGoToLogin} className="dynamic-btn px-10 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20">Acessar Plataforma</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-44 pb-32 px-6 z-10 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12 animate-fade-up shadow-inner">
            <span className="w-2 h-2 rounded-full bg-blue-50 animate-pulse"></span>
            A Nova Autoridade em Gestão SaaS Jurídica
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-12 leading-[0.85] animate-fade-up">
            Justiça em <br /> 
            <span className="bg-gradient-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent">Alta Performance.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-16 max-w-3xl mx-auto font-medium leading-relaxed animate-fade-up opacity-80" style={{ animationDelay: '0.1s' }}>
            Não é apenas um CRM. É a infraestrutura definitiva para escritórios que buscam o topo do mercado com IA e dados.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <button onClick={onGoToLogin} className="dynamic-btn px-16 py-7 rounded-[32px] text-base uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/40 w-full sm:w-auto">
              Iniciar Trial Gratuito
            </button>
            <button onClick={onGoToMembers} className="px-16 py-7 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl text-base font-black uppercase tracking-widest hover:bg-white/10 transition-all w-full sm:w-auto">
              Explorar Planos
            </button>
          </div>
        </div>
      </section>

      {/* PAIN GRID */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {pains.map((p, i) => (
              <div key={i} className="soft-glass p-12 border-white/5 hover:border-blue-500/40 transition-all group hover:-translate-y-2">
                <div className={`w-16 h-16 rounded-[24px] bg-${p.color}-500/10 flex items-center justify-center text-${p.color}-500 mb-10 border border-${p.color}-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl`}>
                  <i className={`fas ${p.icon} text-3xl`}></i>
                </div>
                <h3 className="text-3xl font-black mb-6 tracking-tight">{p.title}</h3>
                <p className="text-base text-slate-400 mb-10 leading-relaxed font-medium">"{p.desc}"</p>
                <div className="pt-8 border-t border-white/5">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">Diferencial juizado.com:</p>
                  <p className="text-base text-slate-300 font-bold">{p.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SaaS TECH SECTION */}
      <section className="py-32 px-6 bg-slate-950/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.6em] mb-6">Infraestrutura SaaS de Ponta</h2>
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter mb-10 leading-[0.9]">Tecnologia que <br /> escala com você.</h3>
            <p className="text-slate-400 text-xl mb-12 leading-relaxed font-medium">
              Esqueça instalações complexas. Com o juizado.com, sua organização está pronta para operar em 60 segundos com segurança de nível bancário e redundância global.
            </p>
            <div className="flex items-center gap-8">
              <div className="p-8 rounded-[32px] bg-white/5 border border-white/5 flex-1 hover:border-blue-500/30 transition-all">
                <i className="fas fa-server text-blue-500 mb-6 text-2xl block"></i>
                <p className="text-sm font-black uppercase tracking-widest mb-3">Multi-tenancy</p>
                <p className="text-[11px] text-slate-500 font-bold uppercase">Isolamento Org_ID</p>
              </div>
              <div className="p-8 rounded-[32px] bg-white/5 border border-white/5 flex-1 hover:border-purple-500/30 transition-all">
                <i className="fas fa-microchip text-purple-500 mb-6 text-2xl block"></i>
                <p className="text-sm font-black uppercase tracking-widest mb-3">API ConectaGov</p>
                <p className="text-[11px] text-slate-500 font-bold uppercase">Varredura via Serpro</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="soft-glass p-2 rounded-[56px] border-white/10 shadow-3xl bg-gradient-to-br from-blue-600/20 to-transparent">
              <div className="bg-[#020617] p-12 rounded-[54px] space-y-8">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                   <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="h-5 bg-white/5 rounded-full w-4/5"></div>
                <div className="h-5 bg-white/5 rounded-full w-full"></div>
                <div className="h-56 bg-blue-600/10 rounded-[32px] border border-blue-500/20 flex flex-col items-center justify-center gap-4 group">
                  <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl shadow-2xl shadow-blue-500/50 group-hover:scale-110 transition-transform">
                    <i className="fas fa-lock-open"></i>
                  </div>
                  <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em]">Org ID: Verified</span>
                </div>
                <div className="h-5 bg-white/5 rounded-full w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-48 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-16 leading-[0.8]">Domine o seu <br /> Juizado.</h2>
          <button onClick={onGoToLogin} className="dynamic-btn px-24 py-9 rounded-[48px] text-xl uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/40 transform hover:scale-105 active:scale-95 transition-all">
            Criar Minha Conta
          </button>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
            <i className="fas fa-hammer text-xs text-blue-500"></i>
          </div>
          <span className="text-sm font-black tracking-tight">juizado.com</span>
        </div>
        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.6em]">Plataforma SaaS • Hostinger Cloud Node • © 2025</p>
      </footer>
    </div>
  );
};