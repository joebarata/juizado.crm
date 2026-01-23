const API_URL = 'http://localhost:3001/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'LAWYER' | 'ASSISTANT' | 'FINANCIAL';
  active: boolean;
  oab?: string;
  specialty?: string;
  createdAt: string;
}

export const authService = {
  init: async () => {
    // A inicialização agora ocorre no servidor server.js
    console.log("LexFlow 360: Conectado ao Backend MySQL");
  },

  getUsers: async (): Promise<User[]> => {
    const res = await fetch(`${API_URL}/users`);
    return res.json();
  },

  createUser: async (userData: any) => {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error('Falha ao criar usuário.');
    return res.json();
  },

  authenticate: async (email: string, pass: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      
      if (!res.ok) return null;
      return res.json();
    } catch (e) {
      console.error("Erro de conexão com API:", e);
      return null;
    }
  }
};