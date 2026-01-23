const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3001/api' : '/api';

export interface AuthResponse {
  user: any;
  token: string;
}

export const authService = {
  authenticate: async (email: string, pass: string): Promise<AuthResponse | null> => {
    // Demo Mode
    if (email === 'demo@juizado.com' && pass === 'demo123') {
      return { 
        user: { id: 0, nome: 'Advogado Demo', plan: 'pro', orgName: 'Demo Office' }, 
        token: 'demo-token' 
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
        throw new Error('O servidor juizado.com está em manutenção ou mal configurado.');
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha na autenticação.');
      
      return data;
    } catch (err: any) {
      throw err;
    }
  }
};
