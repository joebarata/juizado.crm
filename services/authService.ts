const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3001/api' : '/api';

export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: 'admin' | 'advogado' | 'demo';
  plan: 'basico' | 'pro' | 'master';
  orgName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  authenticate: async (email: string, pass: string): Promise<AuthResponse | null> => {
    // Modo Demo local para juizado.com
    if (email === 'demo@juizado.com' && pass === 'demo123') {
      const mockUser: User = { 
        id: '0', 
        nome: 'Usuário Demo', 
        email: 'demo@juizado.com', 
        perfil: 'demo', 
        plan: 'pro',
        orgName: 'Escritório de Testes'
      };
      return { user: mockUser, token: `demo-saas-token-${btoa(email)}` };
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: pass })
      });
      
      const text = await res.text();
      
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        throw new Error('Servidor juizado.com em manutenção (HTML Error).');
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Falha no processamento SaaS.');
      }
      
      if (!res.ok) {
        throw new Error(data.error || 'Autenticação SaaS negada.');
      }
      
      return data;
    } catch (err: any) {
      if (err.message.includes('Failed to fetch')) {
        throw new Error('Endpoint juizado.com offline. Verifique o status na Hostinger.');
      }
      throw err;
    }
  }
};