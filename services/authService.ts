const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3001/api' : '/api';

export interface AuthResponse {
  user: any;
  token: string;
}

export const authService = {
  authenticate: async (email: string, pass: string): Promise<AuthResponse | null> => {
    // 1. Bypass Local / Demo juizado.com
    if (email === 'demo@juizado.com' && pass === 'demo123') {
      return { 
        user: { id: 0, nome: 'Advogado Demo', plan: 'pro', orgName: 'Juizado Demo Office', perfil: 'admin' }, 
        token: 'demo-token-bypass-saas-juizado' 
      };
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: pass })
      });
      
      const contentType = res.headers.get("content-type");
      
      // 2. Proteção contra Erro de Proxy / Servidor em Down (HTML)
      if (contentType && contentType.includes("text/html")) {
        throw new Error('A infraestrutura juizado.com está temporariamente indisponível (Erro de Rota Apache).');
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Acesso negado pelo servidor central juizado.com.');
      
      return data;
    } catch (err: any) {
      console.error("Auth Fail:", err.message);
      throw err;
    }
  }
};