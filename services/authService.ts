const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3001/api' : '/api';

export interface AuthResponse {
  user: any;
  token: string;
}

export const authService = {
  authenticate: async (email: string, pass: string): Promise<AuthResponse | null> => {
    // 1. Bypass Local / Demo juizado.com (Ativado por padrão para demos)
    if (email === 'demo@juizado.com' && pass === 'demo123') {
      return { 
        user: { id: 0, nome: 'Advogado Demo', plan: 'master', orgName: 'Workspace Pro', perfil: 'admin' }, 
        token: 'bypass-master-token-2025' 
      };
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: pass })
      });
      
      const contentType = res.headers.get("content-type");
      
      // Proteção contra erro de rota que entrega HTML (404/500 da Hostinger)
      if (contentType && contentType.includes("text/html")) {
        throw new Error('Erro de Configuração: O backend juizado.com não pôde ser alcançado via Proxy.');
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Acesso negado.');
      
      return data;
    } catch (err: any) {
      console.error("Auth Fail:", err.message);
      throw err;
    }
  }
};