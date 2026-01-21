
import React from 'react';

export const LegalLibrary: React.FC = () => {
  const folders = [
    { title: 'Tribunais Superiores', count: 124, icon: 'fa-landmark' },
    { title: 'Teses Vencedoras', count: 42, icon: 'fa-trophy' },
    { title: 'Acórdãos Paradigmas', count: 88, icon: 'fa-scale-balanced' },
    { title: 'Doutrina Interna', count: 15, icon: 'fa-book' }
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter dark:text-white">Central de Conhecimento</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Repositório estratégico de inteligência jurídica da banca.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-500">
             <i className="fas fa-cloud mr-2"></i> 4.2GB / 10GB
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {folders.map(folder => (
          <div key={folder.title} className="soft-glass p-8 group cursor-pointer hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              <i className={`fas ${folder.icon} text-xl`}></i>
            </div>
            <h3 className="text-sm font-black dark:text-white uppercase tracking-widest">{folder.title}</h3>
            <p className="text-xs font-bold text-slate-400 mt-2">{folder.count} arquivos</p>
          </div>
        ))}
      </div>

      <div className="soft-glass p-8">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Arquivos Recentes</h3>
        <div className="space-y-2">
          {[
            { name: 'Tese_ICMS_Exclusão_PIS_COFINS.pdf', size: '2.4mb', date: 'Há 2 dias' },
            { name: 'Manual_Boas_Praticas_Civel.docx', size: '1.1mb', date: 'Há 5 dias' },
            { name: 'Jurisprudencia_Vara_Familia_SP.pdf', size: '5.8mb', date: 'Ontem' }
          ].map((file, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
              <div className="flex items-center gap-4">
                <i className="far fa-file-pdf text-rose-500 text-lg"></i>
                <div>
                  <p className="text-xs font-bold dark:text-white">{file.name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{file.size} • {file.date}</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-blue-500"><i className="fas fa-download"></i></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
