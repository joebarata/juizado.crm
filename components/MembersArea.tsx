
import React, { useState } from 'react';

export const MembersArea: React.FC<{ onBack: () => void, onGoToCRM: () => void }> = ({ onBack, onGoToCRM }) => {
  const [activeModule, setActiveModule] = useState(0);

  const modules = [
    { title: 'Onboarding & Setup', lessons: 5, progress: 100 },
    { title: 'Dominando o Push Intimações', lessons: 8, progress: 65 },
    { title: 'LexFlow AI para Peças', lessons: 4, progress: 0 },
    { title: 'Estratégico e BI Jurídico', lessons: 6, progress: 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <aside className="fixed left-0 top-0 bottom-0 w-80 bg-slate-900 border-r border-white/5 p-8 overflow-y-auto">
        <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white mb-10 block">
          <i className="fas fa-arrow-left mr-2"></i> Voltar à Landing
        </button>

        <div className="mb-12">
          <h2 className="text-xl font-black tracking-tighter mb-2">LexFlow<span className="text-blue-500">Academy</span></h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Área de Membros Elite</p>
        </div>

        <nav className="space-y-6">
          {modules.map((mod, i) => (
            <button 
              key={i} 
              onClick={() => setActiveModule(i)}
              className={`w-full text-left p-4 rounded-2xl transition-all border ${activeModule === i ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-500/20' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
            >
              <h4 className="text-xs font-black uppercase tracking-tight mb-2">{mod.title}</h4>
              <div className="flex justify-between items-center text-[9px] font-black text-white/50 mb-3">
                <span>{mod.lessons} Aulas</span>
                <span>{mod.progress}% Concluído</span>
              </div>
              <div className="w-full h-1 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/40" style={{ width: `${mod.progress}%` }}></div>
              </div>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-8 right-8">
          <button onClick={onGoToCRM} className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">
            Ir para o CRM 360
          </button>
        </div>
      </aside>

      <main className="ml-80 p-12 max-w-5xl">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">{modules[activeModule].title}</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Módulo atual de treinamento avançado.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black">Dr. Ricardo Silva</p>
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Membro Premium</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-xs">RS</div>
          </div>
        </header>

        <div className="aspect-video w-full rounded-[32px] overflow-hidden bg-slate-900 border border-white/10 relative group mb-10 shadow-2xl">
          <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-50" alt="Video Placeholder" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform shadow-2xl shadow-blue-500/40">
              <i className="fas fa-play ml-1"></i>
            </button>
          </div>
          <div className="absolute bottom-8 left-8">
            <span className="text-[10px] font-black bg-blue-600 px-3 py-1.5 rounded-lg uppercase">Aula 01: Primeiros Passos</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="soft-glass p-8 bg-white/5 border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest mb-4">Material de Apoio</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl group cursor-pointer hover:bg-blue-600/20">
                <div className="flex items-center gap-4">
                  <i className="fas fa-file-pdf text-rose-500"></i>
                  <span className="text-xs font-bold">Guia_Rapido_CRM.pdf</span>
                </div>
                <i className="fas fa-download text-xs text-slate-500 group-hover:text-white"></i>
              </div>
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl group cursor-pointer hover:bg-blue-600/20">
                <div className="flex items-center gap-4">
                  <i className="fas fa-file-word text-blue-500"></i>
                  <span className="text-xs font-bold">Checklist_Onboarding.docx</span>
                </div>
                <i className="fas fa-download text-xs text-slate-500 group-hover:text-white"></i>
              </div>
            </div>
          </div>

          <div className="soft-glass p-8 bg-blue-600/10 border-blue-500/20">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-500 mb-4">Suporte LexFlow</h3>
            <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">Dúvidas sobre o conteúdo? Nossos especialistas estão prontos para te ajudar.</p>
            <button className="w-full py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all">
              Chamar no WhatsApp
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
