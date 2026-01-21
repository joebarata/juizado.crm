import React, { useState } from 'react';
import { translateLegalToNatural } from '../services/geminiService';

export const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('Processo com trânsito em julgado e remessa à contadoria para liquidação de sentença.');
  const [output, setOutput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!input.trim()) return;
    setIsTranslating(true);
    const result = await translateLegalToNatural(input);
    setOutput(result);
    setIsTranslating(false);
  };

  return (
    <div className="soft-glass bg-gradient-to-br from-blue-700/10 to-indigo-900/10 p-10 border-blue-500/10 dark:border-blue-500/20 animate-fade-up">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center backdrop-blur-xl border border-blue-500/30">
          <i className="fas fa-microchip text-2xl text-blue-500"></i>
        </div>
        <div>
          <h3 className="text-xl font-black dark:text-white tracking-tight">LexFlow AI Intelligence</h3>
          <p className="text-blue-500 dark:text-blue-400 text-xs font-black uppercase tracking-widest">Tradutor de Juridiquês para Clientes</p>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Entrada Técnica (PJE/Andamentos)</label>
          <textarea 
            className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 outline-none h-32 placeholder:text-slate-300 dark:text-white transition-all"
            placeholder="Cole aqui o andamento processual..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <button 
          onClick={handleTranslate}
          disabled={isTranslating}
          className="dynamic-btn w-full py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isTranslating ? (
            <><i className="fas fa-spinner fa-spin"></i> Analisando Código Jurídico...</>
          ) : (
            <><i className="fas fa-bolt-lightning"></i> Simplificar para o Cliente</>
          )}
        </button>

        {output && (
          <div className="bg-blue-600/5 dark:bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500 shadow-inner">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Resultado Sugerido:</p>
            </div>
            <p className="text-base font-bold dark:text-white leading-relaxed italic">"{output}"</p>
            <div className="mt-4 flex justify-end gap-2">
               <button className="p-2 text-slate-400 hover:text-blue-500 transition-all" title="Copiar"><i className="fas fa-copy"></i></button>
               <button className="p-2 text-slate-400 hover:text-emerald-500 transition-all" title="Enviar via WhatsApp"><i className="fab fa-whatsapp"></i></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};