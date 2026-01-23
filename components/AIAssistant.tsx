import React, { useState } from 'react';
import { translateLegalToNatural } from '../services/geminiService';

export const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('Vistos em correição. Manifeste-se o exequente sobre o laudo pericial anexado aos autos no prazo de 15 dias, sob pena de preclusão.');
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
    <div className="soft-glass bg-gradient-to-br from-blue-700/10 to-indigo-900/10 p-12 border-blue-500/20 animate-fade-up">
      <div className="flex items-center gap-6 mb-10">
        <div className="w-16 h-16 rounded-[24px] bg-blue-600/20 flex items-center justify-center backdrop-blur-3xl border border-blue-500/30 shadow-2xl shadow-blue-500/10">
          <i className="fas fa-wand-magic-sparkles text-2xl text-blue-500"></i>
        </div>
        <div>
          <h3 className="text-2xl font-black text-white tracking-tighter">juizado.com AI</h3>
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Inteligência Jurídica Generativa</p>
        </div>
      </div>

      <div className="space-y-8 relative z-10">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Entrada Técnica (PJE/Andamentos)</label>
          <textarea 
            className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 outline-none h-40 placeholder:text-slate-700 text-white transition-all custom-scrollbar"
            placeholder="Cole aqui o texto do tribunal para tradução..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <button 
          onClick={handleTranslate}
          disabled={isTranslating}
          className="dynamic-btn w-full py-5 rounded-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-2xl shadow-blue-600/20"
        >
          {isTranslating ? (
            <><i className="fas fa-spinner fa-spin"></i> Descodificando Linguagem...</>
          ) : (
            <><i className="fas fa-bolt-lightning"></i> Gerar Explicação Humana</>
          )}
        </button>

        {output && (
          <div className="bg-blue-600/5 border border-blue-500/20 p-8 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-700 shadow-inner">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Explicação Gerada:</p>
            </div>
            <p className="text-lg font-bold text-white leading-relaxed italic opacity-90">"{output}"</p>
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-end gap-3">
               <button onClick={() => navigator.clipboard.writeText(output)} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all" title="Copiar"><i className="fas fa-copy"></i></button>
               <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all" title="Enviar WhatsApp"><i className="fab fa-whatsapp text-lg"></i></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};