
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (userData: any) => void;
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoLogin = () => {
    setEmail('admin@lexflow.com.br');
    setPassword('admin123');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (email === 'admin@lexflow.com.br' && password === 'admin123') {
        onLogin({
          name: 'Dr. Ricardo Silva',
          role: 'ADMIN',
          oab: '123.456/SP',
          avatar: 'https://ui-avatars.com/api/?name=Ricardo+Silva&background=2563eb&color=fff'
        });
      } else {
        setError('Acesso negado. Credenciais incompatíveis.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden font-sans">
      {/* Background Tech Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[480px] relative z-10">
        <div className="flex justify-between items-center mb-10">
          <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all group">
            <i className="fas fa-chevron-left text-[8px] group-hover:-translate-x-1 transition-transform"></i> Voltar ao Portal
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Servidor: Norte-Virgínia</span>
          </div>
        </div>

        <div className="soft-glass p-12 bg-slate-900/40 border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] backdrop-blur-3xl rounded-[40px]">
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl shadow-2xl shadow-blue-500/40 mx-auto mb-8 relative">
              <i className="fas fa-balance-scale"></i>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-[10px] font-black">360</div>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white leading-tight">Painel de Controle</h1>
            <p className="text-[10px] font-black text-slate-500 tracking-[0.4em] uppercase mt-3">Sessão Encriptada AES-256</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">ID de Acesso</label>
              <div className="relative group">
                <i className="fas fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors"></i>
                <input 
                  required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="advogado@escritorio.com"
                  className="w-full pl-14 pr-6 py-5 bg-black/40 border border-white/5 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Código Secreto</label>
                <button type="button" className="text-[9px] font-black uppercase text-blue-500 hover:underline">Esqueci a Senha</button>
              </div>
              <div className="relative group">
                <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors"></i>
                <input 
                  required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-14 pr-6 py-5 bg-black/40 border border-white/5 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder:text-slate-700"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-500 animate-in zoom-in-95 text-[11px] font-black uppercase tracking-widest">
                <i className="fas fa-shield-virus text-base"></i> {error}
              </div>
            )}

            <button type="submit" disabled={isLoading} className="dynamic-btn w-full py-6 rounded-[24px] text-xs uppercase tracking-[0.2em] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-4">
              {isLoading ? (
                <><i className="fas fa-circle-notch fa-spin"></i> Validando...</>
              ) : (
                <><i className="fas fa-sign-in-alt"></i> Autenticar Agora</>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 space-y-6">
            <button onClick={handleDemoLogin} className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all group">
              <i className="fas fa-flask mr-2 group-hover:animate-bounce"></i> Ingressar como Visitante (Demo)
            </button>
            <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-widest">
              LexFlow 360 v4.0.2 - Protected by CloudFlare
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
