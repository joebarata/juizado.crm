
import React from 'react';

export const LandingPage: React.FC<{ onGoToLogin: () => void, onGoToMembers: () => void }> = ({ onGoToLogin, onGoToMembers }) => {
  
  const pains = [
    {
      title: "Prazos Perdidos",
      desc: "O maior medo de um advogado. Depender de conferência manual no PJE é um risco sistêmico.",
      solution: "O LexFlow monitora tribunais em tempo real e emite alertas antes da intimação oficial aparecer.",
      icon: "fa-clock-rotate-left",
      color: "blue"
    },
    {
      title: "Sobrecarga de Redação",
      desc: "Petições repetitivas consomem 60% do tempo produtivo da sua equipe jurídica.",
      solution: "Nossa IA gera minutas personalizadas em segundos, baseada no histórico do seu escritório.",
      icon: "fa-file-lines",
      color: "purple"
    },
    {
      title: "Financeiro Opaco",
      desc: "Você sabe quanto faturou, mas não sabe qual área do direito realmente paga suas contas.",
      solution: "DRE automático e lucratividade por área. Gestão de honorários sucumbenciais e contratuais.",
      icon: "fa-chart-mixed",
      color: "emerald"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-600 font-sans overflow-x-hidden">
      
      {/* GLOSSY DEEP BACKGROUND - Camadas de Blur para Profundidade */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <i className="fas fa-balance-scale"></i>
            </div>
            <span className="text-xl font-black tracking-tighter">LexFlow<span className="text-blue-600">360</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={onGoToMembers} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Academy</button>
            <button onClick={onGoToLogin} className="dynamic-btn px-8 py-3 rounded-2xl text-[10px] uppercase tracking-widest">Acessar Sistema</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-44 pb-20 px-6 z-10 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            A Nova Era da Gestão Jurídica
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9] animate-fade-up">
            A Advocacia <br /> 
            <span className="bg-gradient-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent">Hiperconectada.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Centralize processos, equipe e finanças em uma infraestrutura de dados de alta performance com IA nativa. Escalabilidade com ordem.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <button onClick={onGoToLogin} className="dynamic-btn px-12 py-6 rounded-3xl text-sm uppercase tracking-widest shadow-2xl shadow-blue-600/30 w-full sm:w-auto">
              Agendar Trial Gratuito
            </button>
            <button onClick={onGoToMembers} className="px-12 py-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all w-full sm:w-auto">
              Ver Vídeo Demo
            </button>
          </div>
        </div>
      </section>

      {/* PAIN GRID */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pains.map((p, i) => (
              <div key={i} className="soft-glass p-10 border-white/5 hover:border-blue-500/30 transition-all group">
                <div className={`w-14 h-14 rounded-2xl bg-${p.color}-500/10 flex items-center justify-center text-${p.color}-500 mb-8 border border-${p.color}-500/20 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all`}>
                  <i className={`fas ${p.icon} text-2xl`}></i>
                </div>
                <h3 className="text-2xl font-black mb-4">{p.title}</h3>
                <p className="text-sm text-slate-400 mb-8 leading-relaxed italic border-l-2 border-white/10 pl-6">"{p.desc}"</p>
                <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Solução LexFlow:</p>
                  <p className="text-sm text-slate-300 font-medium">{p.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI TECH SECTION */}
      <section className="py-32 px-6 bg-slate-950/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-4">Tecnologia Gemini 3 Pro</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">IA Nativa que domina o Direito.</h3>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              Diferente de sistemas legados que apenas salvam arquivos, nossa IA analisa o teor de intimações, sugere teses e resume processos de mil páginas em segundos.
            </p>
            <div className="flex items-center gap-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex-1">
                <i className="fas fa-bolt text-blue-500 mb-4 block"></i>
                <p className="text-xs font-black uppercase tracking-widest mb-2">Push em Tempo Real</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Varredura via ComunicaAPI</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex-1">
                <i className="fas fa-brain-circuit text-purple-500 mb-4 block"></i>
                <p className="text-xs font-black uppercase tracking-widest mb-2">Drafting de Peças</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Modelos dinâmicos com IA</p>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="soft-glass p-1 rounded-[40px] border-white/10 shadow-2xl rotate-2 max-w-md w-full">
              <div className="bg-[#020617] p-10 rounded-[38px] space-y-6">
                <div className="h-4 bg-white/5 rounded-full w-3/4"></div>
                <div className="h-4 bg-white/5 rounded-full w-full"></div>
                <div className="h-40 bg-blue-600/5 rounded-2xl border border-blue-500/20 flex flex-col items-center justify-center gap-3">
                  <i className="fas fa-sparkles text-4xl text-blue-500 animate-pulse"></i>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">IA Processando...</span>
                </div>
                <div className="h-4 bg-white/5 rounded-full w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-48 px-6 text-center">
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-12">Escalabilidade <br /> com Ordem.</h2>
        <button onClick={onGoToLogin} className="dynamic-btn px-20 py-8 rounded-[40px] text-lg uppercase tracking-widest shadow-2xl shadow-blue-600/40">
          Começar Trial Gratuito
        </button>
      </section>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">LexFlow 360 • Hostinger Cloud Node • © 2024</p>
      </footer>
    </div>
  );
};
