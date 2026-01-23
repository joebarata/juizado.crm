const API_URL = 'http://localhost:3001/api';

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

const getHeaders = () => {
  const session = localStorage.getItem('lexflow_session');
  const sessionData = session ? JSON.parse(session) : null;
  return {
    'Content-Type': 'application/json',
    'x-user-id': sessionData?.user?.id || '',
    'Authorization': `Bearer ${sessionData?.token || ''}`
  };
};

export const authService = {
  authenticate: async (email: string, pass: string): Promise<AuthResponse | null> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Erro de Autenticação:', errorData.error);
        return null;
      }
      
      return await res.json();
    } catch (err) {
      console.error('Falha de rede ao tentar login');
      return null;
    }
  },

  getUsers: async (): Promise<User[]> => {
    const res = await fetch(`${API_URL}/users`, { headers: getHeaders() });
    if (!res.ok) return [];
    return res.json();
  }
};