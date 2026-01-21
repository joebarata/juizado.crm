
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (userData: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulação de autenticação LexFlow
    setTimeout(() => {
      if (email === 'admin@lexflow.com.br' && password === 'admin123') {
        onLogin({
          name: 'Dr. Ricardo Silva',
          role: 'ADMIN',
          oab: '123.456/SP',
          avatar: 'https://ui-avatars.com/api/?name=Ricardo+Silva&background=2563eb&color=fff'
        });
      } else {
        setError('Credenciais inválidas. Verifique seu e-mail e senha.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-[440px] animate-fade-up">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl shadow-2xl shadow-blue-500/40 mx-auto mb-6">
            <i className="fas fa-balance-scale"></i>
          </div>
          <h1 className="text-3xl font-black tracking-tighter dark:text-white leading-tight">LexFlow<span className="text-blue-600">360</span></h1>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mt-2">Intelligence Legal ERP</p>
        </div>

        <div className="soft-glass p-10 border-white/20 dark:border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">E-mail Profissional</label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@lexflow.com.br"
                  className="w-full pl-11 pr-4 py-4 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Senha de Acesso</label>
                <a href="#" className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:underline">Esqueci a senha</a>
              </div>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-4 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-500 animate-in fade-in slide-in-from-top-1">
                <i className="fas fa-exclamation-circle"></i>
                <span className="text-[11px] font-bold">{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="dynamic-btn w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-sm active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <><i className="fas fa-spinner fa-spin"></i> Autenticando...</>
              ) : (
                <><i className="fas fa-sign-in-alt"></i> Entrar no Sistema</>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Ambiente Seguro & Criptografado
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[11px] font-bold text-slate-400">
            Ainda não tem acesso? <span className="text-blue-500 cursor-pointer hover:underline">Fale com o Administrador</span>
          </p>
        </div>
      </div>
    </div>
  );
};
