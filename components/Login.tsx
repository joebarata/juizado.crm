import React, { useState } from 'react';
import { authService } from '../services/authService';

interface LoginProps {
  onLogin: (userData: any) => void;
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoAccess = () => {
    setEmail('demo@crm.com');
    setPassword('demo123');
  };

  const handleAdminAccess = () => {
    setEmail('admin@admin.com');
    setPassword('admin123');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await authService.authenticate(email, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Acesso negado. Credenciais inválidas.');
      }
    } catch (err) {
      setError('Falha na comunicação com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] animate-pulse"></div>
      </div>

      <div className="w-full max-w-[480px] relative z-10">
        <div className="soft-glass p-12 bg-slate-900/40 border-white/10 rounded-[40px] backdrop-blur-3xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl mx-auto mb-6">
              <i className="fas fa-balance-scale"></i>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter">LexFlow Access</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Escolha seu modo de entrada</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input required type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 bg-black/20 border border-white/5 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50" />
            <input required type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 bg-black/20 border border-white/5 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500/50" />
            
            {error && <div className="text-rose-500 text-[10px] font-black uppercase text-center">{error}</div>}

            <button type="submit" disabled={isLoading} className="dynamic-btn w-full py-4 rounded-xl text-xs uppercase tracking-widest">
              {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
            <button onClick={handleDemoAccess} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white transition-all">
              <p className="text-[10px] font-black uppercase tracking-widest">Modo Demo</p>
              <p className="text-[8px] font-bold opacity-70">Teste Sem Salvar</p>
            </button>
            <button onClick={handleAdminAccess} className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
              <p className="text-[10px] font-black uppercase tracking-widest">Modo Real</p>
              <p className="text-[8px] font-bold opacity-70">Gravar no Banco</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};