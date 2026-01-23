import React from 'react';

export const LandingPage: React.FC<{ onGoToLogin: () => void, onGoToMembers: () => void }> = ({ onGoToLogin, onGoToMembers }) => {
  
  const pains = [
    {
      title: "O Medo do Prazo Fatal",
      desc: "Aquela dor no estômago ao abrir o PJe e descobrir uma intimação que você não viu. O erro humano é o maior inimigo do seu faturamento.",
      solution: "Nossa IA varre todos os tribunais do Brasil 24h por dia e te avisa via WhatsApp antes mesmo de ser publicado no Diário Oficial.",
      icon: "fa-clock-rotate-left",
      color: "rose"
    },
    {
      title: "Caos Financeiro Invisível",
      desc: "Você trabalha 12h por dia, mas no final do mês a conta mal fecha. Onde estão os honorários sucumbenciais? Onde está o lucro real?",
      solution: "DRE Jurídico automático. Controle cada centavo, do custo da diligência ao fechamento do maior contrato, com clareza absoluta.",
      icon: "fa-receipt",
      color: "emerald"
    },
    {
      title: "O 'Juridiquês' que Afasta",
      desc: "Gastar horas no telefone explicando andamentos para clientes que não entendem termos técnicos. Você perde tempo e o cliente perde a confiança.",
      solution: "Tradutor LexFlow: Nossa rede neural Gemini traduz termos técnicos para mensagens claras e tranquilizadoras automaticamente.",
      icon: "fa-comments-dollar",
      color: "blue"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Ricardo Oliveira",
      role: "Gestor de 500+ processos",
      text: "Antes do juizado.com, eu vivia em estado de alerta. Hoje, a IA cuida da varredura e eu foco na estratégia. Recuperei minha paz e meu faturamento subiu 30%.",
      avatar: "RO"
    },
    {
      name: "Dra. Ana Beatriz Silva",
      role: "Advogada Autônoma",
      text: "A tradução de andamentos mudou minha relação com os clientes. Eles se sentem ouvidos e eu não perco mais tempo em ligações repetitivas. Essencial.",
      avatar: "AB"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-600 font-sans overflow-x-hidden">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
              <i className="fas fa-balance-scale"></i>
            </div>
            <span className="text-2xl font-black tracking-tighter">juizado<span className="text-blue-600">.com</span></span>
          </div>
          <button onClick={onGoToLogin} className="dynamic-btn px-8 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-black">
            Acessar Plataforma
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-48 pb-32 px-6 z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Tecnologia de Elite para Advogados
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9] animate-fade-up">
            Pare de ser o <br /> 
            <span className="bg-gradient-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent glow-text">escravo do seu PJe.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-16 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-up opacity-90">
            Recupere até 15 horas da sua semana automatizando a triagem de intimações e a comunicação com clientes. Gestão jurídica baseada em dados, não em palpites.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-up">
            <button onClick={onGoToLogin} className="dynamic-btn px-16 py-7 rounded-[32px] text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/40 w-full sm:w-auto">
              Descobrir como automatizar meu escritório
            </button>
            <button onClick={onGoToMembers} className="px-12 py-7 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all w-full sm:w-auto">
              Ver Demonstração
            </button>
          </div>
        </div>
      </section>

      {/* PAIN & SOLUTION SECTION */}
      <section className="py-32 px-6 relative z-10 bg-slate-950/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.6em] mb-6">O Diagnóstico</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter">O custo invisível da ineficiência.</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {pains.map((p, i) => (
              <div key={i} className="soft-glass p-10 flex flex-col h-full border-white/5 hover:border-blue-500/20 transition-all group">
                <div className={`w-16 h-16 rounded-[24px] bg-${p.color}-500/10 flex items-center justify-center text-${p.color}-500 mb-10 border border-${p.color}-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl`}>
                  <i className={`fas ${p.icon} text-3xl`}></i>
                </div>
                <h3 className="text-2xl font-black mb-6 tracking-tight">{p.title}</h3>
                <p className="text-sm text-slate-400 mb-10 leading-relaxed font-medium">"{p.desc}"</p>
                <div className="mt-auto pt-8 border-t border-white/5">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">A Solução Juizado.com:</p>
                  <p className="text-sm text-slate-200 font-bold leading-relaxed">{p.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTHORITY SECTION */}
      <section className="py-32 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <div>
              <h2 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.6em] mb-6">Autoridade e Dados</h2>
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">Inteligência alimentada pelo CNJ.</h3>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Não operamos no escuro. O <strong>juizado.com</strong> integra-se nativamente com a API oficial do Datajud e utiliza o modelo <strong>Gemini 3 Pro</strong> para processar informações processuais com precisão cirúrgica.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="soft-glass p-6 text-center">
                <p className="text-4xl font-black text-blue-500 mb-1">100%</p>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sincronizado via Datajud</p>
              </div>
              <div className="soft-glass p-6 text-center">
                <p className="text-4xl font-black text-emerald-500 mb-1">+24h</p>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Antecedência média</p>
              </div>
            </div>
          </div>
          <div className="relative animate-float">
            <div className="soft-glass p-2 rounded-[56px] border-white/10 shadow-3xl bg-gradient-to-br from-blue-600/20 to-transparent">
              <div className="bg-[#020617] p-12 rounded-[54px] space-y-8">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                   <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-white/5 rounded-full w-4/5"></div>
                  <div className="h-4 bg-white/5 rounded-full w-full"></div>
                </div>
                <div className="h-64 bg-blue-600/10 rounded-[40px] border border-blue-500/20 flex flex-col items-center justify-center gap-6 group overflow-hidden relative">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>
                  <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl shadow-2xl shadow-blue-500/50 relative z-10 group-hover:scale-110 transition-transform">
                    <i className="fas fa-microchip"></i>
                  </div>
                  <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] relative z-10">AI Engine: Validated</span>
                </div>
                <div className="h-4 bg-white/5 rounded-full w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section className="py-32 px-6 bg-slate-900/40 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.6em] mb-6">A Voz da Experiência</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter">Quem usa, não volta atrás.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {testimonials.map((t, i) => (
              <div key={i} className="soft-glass p-12 relative overflow-hidden group">
                <i className="fas fa-quote-right absolute top-8 right-8 text-6xl text-white/5 pointer-events-none transition-transform group-hover:scale-125"></i>
                <p className="text-xl font-medium text-slate-300 mb-10 leading-relaxed relative z-10 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-6 border-t border-white/5 pt-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">{t.name}</h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-48 px-6 text-center relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-9xl font-black tracking-tighter mb-16 leading-[0.8] drop-shadow-2xl">
            Retome o controle <br /> do seu tempo.
          </h2>
          <div className="space-y-8">
            <button onClick={onGoToLogin} className="dynamic-btn px-20 py-8 rounded-[40px] text-lg uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/50">
              Quero o Trial Beta Especial
            </button>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Vagas limitadas para o ciclo de triagem automatizada 2025.
            </p>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <i className="fas fa-balance-scale text-xs text-blue-500"></i>
            </div>
            <span className="text-sm font-black tracking-tight">juizado.com</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase text-slate-500 tracking-widest">
            <a href="#" className="hover:text-blue-500 transition-colors">LGPD Compliance</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-blue-500 transition-colors">SLA de Varredura</a>
          </div>
          <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.6em]">Plataforma SaaS • Hostinger Enterprise Cloud • © 2025</p>
        </div>
      </footer>
    </div>
  );
};