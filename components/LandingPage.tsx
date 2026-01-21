
import React from 'react';

export const LandingPage: React.FC<{ onGoToLogin: () => void, onGoToMembers: () => void }> = ({ onGoToLogin, onGoToMembers }) => {
  
  const pains = [
    {
      title: "O Caos das Intimações",
      desc: "Você ainda depende de conferência manual ou sistemas lentos? Um prazo perdido custa uma carreira.",
      solution: "Nossa IA varre o PJE em tempo real via ComunicaAPI e delega o prazo antes de você abrir o e-mail.",
      icon: "fa-triangle-exclamation",
      color: "rose"
    },
    {
      title: "O 'Juridiquês' que Afasta",
      desc: "Clientes ligando o dia todo sem entender o que 'Concluso para Despacho' significa.",
      solution: "O LexFlow traduz automaticamente andamentos complexos para linguagem leiga e envia no WhatsApp do cliente.",
      icon: "fa-comments-slash",
      color: "amber"
    },
    {
      title: "Faturamento vs. Lucro",
      desc: "Escritórios que faturam muito mas não sabem para onde o dinheiro vai no final do mês.",
      solution: "Financeiro 360 com DRE automático e lucratividade por área do direito em tempo real.",
      icon: "fa-money-bill-transfer",
      color: "emerald"
    }
  ];

  const features = [
    {
      icon: "fa-bolt-lightning",
      title: "Push Intimações PJE",
      desc: "Sincronização imediata com todos os tribunais. Zero delay entre a publicação e a sua tela.",
      badge: "Real-Time"
    },
    {
      icon: "fa-brain-circuit",
      title: "LexFlow AI Core",
      desc: "Resuma processos de 500 páginas e gere teses personalizadas com Gemini 3 Pro em segundos.",
      badge: "Gemini 3"
    },
    {
      icon: "fa-chart-pie",
      title: "BI & Estratégico",
      desc: "Dashboards de performance que mostram exatamente qual área do seu escritório dá lucro.",
      badge: "Data-Driven"
    },
    {
      icon: "fa-file-signature",
      title: "Automação Dinâmica",
      desc: "Contratos e petições que se preenchem sozinhos usando dados dos clientes cadastrados.",
      badge: "Scale"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-600 font-sans overflow-x-hidden">
      
      {/* GLOSSY OVERLAYS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]"></div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <i className="fas fa-balance-scale"></i>
            </div>
            <span className="text-2xl font-black tracking-tighter">LexFlow<span className="text-blue-600">360</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={onGoToMembers} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Academy</button>
            <button onClick={onGoToLogin} className="dynamic-btn px-8 py-3 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl">Acessar CRM</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Infraestrutura de Alta Performance
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.95] animate-fade-up">
            A Advocacia <br /> 
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 bg-clip-text text-transparent">
              Hiperconectada.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Enquanto outros CRMs são apenas pastas de arquivos digitais, o LexFlow 360 é uma infraestrutura de dados com IA nativa feita para quem busca <strong>Escalabilidade com Ordem</strong>.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <button onClick={onGoToLogin} className="dynamic-btn px-12 py-6 rounded-3xl text-sm uppercase tracking-widest shadow-[0_0_50px_rgba(37,99,235,0.3)]">
              Agendar Trial Gratuito
            </button>
            <button onClick={onGoToMembers} className="px-12 py-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              Ver Vídeo Demo
            </button>
          </div>
        </div>
      </section>

      {/* PAIN POINTS SECTION (O CONTRASTE) */}
      <section className="py-24 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mb-4">O Problema</h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter">Por que escritórios comuns param de crescer?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pains.map((p, i) => (
              <div key={i} className="soft-glass p-10 border-white/5 bg-slate-900/40 relative group">
                <div className={`w-12 h-12 rounded-xl bg-${p.color}-500/10 flex items-center justify-center text-${p.color}-500 mb-6 text-xl`}>
                  <i className={`fas ${p.icon}`}></i>
                </div>
                <h4 className="text-xl font-black mb-4 text-white group-hover:text-rose-400 transition-colors">{p.title}</h4>
                <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed italic border-l-2 border-white/10 pl-4">"{p.desc}"</p>
                <div className="pt-6 border-t border-white/5">
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">A Solução LexFlow:</p>
                  <p className="text-sm text-slate-300 font-medium">{p.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES (GLOSSY GRID) */}
      <section className="py-24 px-6 z-10 relative bg-blue-600/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Arquitetura de Dados</h2>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">Projetado para ser o cérebro da sua operação jurídica.</h3>
            </div>
            <p className="text-slate-500 font-medium max-w-sm">Design glossy, minimalista e focado em alta densidade de informação para tomada de decisão rápida.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="soft-glass p-8 border-white/5 hover:border-blue-500/40 hover:bg-blue-600/5 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 text-2xl mb-6 border border-white/10 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <i className={`fas ${f.icon}`}></i>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-black">{f.title}</h4>
                  <span className="text-[8px] font-black uppercase bg-blue-500/10 text-blue-500 px-2 py-1 rounded border border-blue-500/20">{f.badge}</span>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI DEEP TECH */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white mb-8 shadow-2xl shadow-blue-600/40">
              <i className="fas fa-microchip text-3xl"></i>
            </div>
            <h2 className="text-5xl font-black tracking-tighter mb-8 leading-tight">IA que realmente entende o Direito.</h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
              Não fazemos apenas resumos simples. Nossa engine Gemini 3 Pro analisa o teor de intimações, identifica prazos fatais e sugere a tese jurídica mais adequada com base em súmulas recentes.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <i className="fas fa-check-circle text-blue-500"></i>
                <span className="text-sm font-bold">Resumo de petições de 200+ páginas em 5s.</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <i className="fas fa-check-circle text-blue-500"></i>
                <span className="text-sm font-bold">Análise preditiva de êxito por magistrado.</span>
              </div>
            </div>
          </div>
          <div className="relative">
             <div className="soft-glass p-8 bg-slate-900 shadow-2xl transform rotate-3 border-blue-500/20">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">LexFlow AI Insight</span>
                  <i className="fas fa-robot text-blue-500"></i>
                </div>
                <div className="space-y-4">
                   <div className="h-4 bg-white/10 rounded-full w-3/4"></div>
                   <div className="h-4 bg-white/10 rounded-full w-full"></div>
                   <div className="h-24 bg-blue-600/10 rounded-2xl border border-blue-500/20 flex items-center justify-center">
                      <i className="fas fa-wand-magic-sparkles text-3xl text-blue-500 animate-pulse"></i>
                   </div>
                   <div className="h-4 bg-white/10 rounded-full w-1/2"></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10">Escalabilidade com Ordem.</h2>
          <p className="text-slate-500 text-lg font-medium mb-12">Chega de CRMs lentos. Junte-se à elite da advocacia brasileira.</p>
          <button onClick={onGoToLogin} className="dynamic-btn px-16 py-7 rounded-[32px] text-base uppercase tracking-widest shadow-2xl shadow-blue-600/40">
            Começar Agora Gratuitamente
          </button>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">LexFlow 360 • Built for High-Performance Firms</p>
      </footer>
    </div>
  );
};
