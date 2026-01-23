
const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3001/api' : '/api';

export interface AuthResponse {
  user: any;
  token: string;
}

export const authService = {
  authenticate: async (email: string, pass: string): Promise<AuthResponse | null> => {
    // Modo Demo Offline
    if (email === 'demo@juizado.com' && pass === 'demo123') {
      return { 
        user: { id: 0, nome: 'Advogado Demo', plan: 'pro', orgName: 'Demo Office', perfil: 'admin' }, 
        token: 'demo-token-bypass' 
      };
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: pass })
      });
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        throw new Error('Erro de Conexão: O servidor juizado.com está a responder com uma página HTML em vez de dados. Verifique a configuração do proxy.');
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Credenciais inválidas ou organização inativa.');
      
      return data;
    } catch (err: any) {
      throw err;
    }
  }
};
