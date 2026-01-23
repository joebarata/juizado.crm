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

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: pass })
      });
      
      const text = await res.text();
      
      // Detecção de resposta HTML em vez de JSON (Erro de servidor ou rota 404 desviada)
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        console.error("Servidor retornou HTML em vez de JSON. Verifique as rotas da API no Hostinger.");
        throw new Error('Servidor em manutenção momentânea (Erro de rota).');
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Falha ao processar resposta do servidor.');
      }
      
      if (!res.ok) {
        throw new Error(data.error || 'Falha na autenticação.');
      }
      
      return data;
    } catch (err: any) {
      if (err.message.includes('Failed to fetch')) {
        throw new Error('Servidor de API inacessível. Verifique o status do Node.js no painel Hostinger.');
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
      
      const text = await res.text();
      if (text.trim().startsWith('<!DOCTYPE')) return [];
      
      const data = JSON.parse(text);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }
};