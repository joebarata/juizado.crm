const API_URL = 'http://localhost:3001/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'LAWYER' | 'ASSISTANT' | 'FINANCIAL';
  active: boolean;
  oab?: string;
  specialty?: string;
  createdAt?: string;
}

const getHeaders = () => {
  const session = localStorage.getItem('lexflow_session');
  const user = session ? JSON.parse(session) : null;
  return {
    'Content-Type': 'application/json',
    'x-user-id': user ? user.id : ''
  };
};

export const authService = {
  getUsers: async (): Promise<User[]> => {
    const res = await fetch(`${API_URL}/users`, { headers: getHeaders() });
    return res.json();
  },

  createUser: async (userData: any) => {
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  authenticate: async (email: string, pass: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    if (!res.ok) return null;
    return res.json();
  }
};