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
    setEmail('demo@juizado.com');
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
      const response = await authService.authenticate(email, password);
      if (response) {
        onLogin(response);
      } else {
        setError('Acesso negado. Verifique os dados da sua organização.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado na infraestrutura SaaS.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] animate-pulse"></div>
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        <div className="soft-glass p-12 bg-slate-900/50 border-white/10 rounded-[48px] backdrop-blur-3xl shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-xl shadow-blue-600/30">
              <i className="fas fa-hammer"></i>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">juizado<span className="text-blue-600">.com</span></h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-3">Infraestrutura SaaS de Elite</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-1 tracking-widest">Credenciais de Acesso</label>
              <input required type="email" placeholder="E-mail profissional" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 bg-black/30 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium" />
              <input required type="password" placeholder="Senha segura" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 bg-black/30 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/40 transition-all font-medium" />
            </div>
            
            {error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase text-center animate-shake">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                {error}
              </div>
            )}

            <button type="submit" disabled={isLoading} className="dynamic-btn w-full py-4.5 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20 disabled:opacity-50">
              {isLoading ? 'Conectando ao Tenant...' : 'Entrar na Plataforma'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
            <button onClick={handleDemoAccess} className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-500 hover:bg-amber-500/10 transition-all group text-center">
              <p className="text-[10px] font-black uppercase tracking-widest">Trial</p>
              <p className="text-[8px] font-bold opacity-60">Demonstração</p>
            </button>
            <button onClick={handleAdminAccess} className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-blue-500 hover:bg-blue-500/10 transition-all group text-center">
              <p className="text-[10px] font-black uppercase tracking-widest">Master</p>
              <p className="text-[8px] font-bold opacity-60">SaaS Principal</p>
            </button>
          </div>
          
          <button onClick={onBack} className="w-full mt-6 text-[9px] font-black uppercase text-slate-500 hover:text-white transition-colors tracking-widest">
            <i className="fas fa-arrow-left mr-2"></i> Voltar ao site
          </button>
        </div>
      </div>
    </div>
  );
};