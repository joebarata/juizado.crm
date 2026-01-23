
const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3001/api' : '/api';

export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: 'admin' | 'advogado' | 'demo';
  ativo: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  authenticate: async (email: string, pass: string): Promise<AuthResponse | null> => {
    // Modo Demo local
    if (email === 'demo@crm.com' && pass === 'demo123') {
      const mockUser: User = { id: '0', nome: 'Usuário Demo', email: 'demo@crm.com', perfil: 'demo', ativo: true };
      return { user: mockUser, token: `demo-token-${btoa(email)}` };
    }

    // Modo Real (MySQL + JWT)
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erro inesperado no servidor.');
      }
      
      return data;
    } catch (err: any) {
      if (err.message.includes('Failed to fetch')) {
        throw new Error('Servidor offline. Verifique sua conexão ou se o Node.js está rodando na Hostinger.');
      }
      throw err;
    }
  },

  getUsers: async (): Promise<User[]> => {
    const session = localStorage.getItem('lexflow_session');
    if (!session) return [];
    
    try {
      const { token } = JSON.parse(session);
      const res = await fetch(`${API_URL}/users`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  }
};
