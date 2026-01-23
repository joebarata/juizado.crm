import bcrypt from 'bcryptjs';

const DB_KEY = 'lexflow_db_users';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'ADMIN' | 'LAWYER' | 'ASSISTANT' | 'FINANCIAL';
  active: boolean;
  oab?: string;
  specialty?: string;
  createdAt: string;
}

export const authService = {
  // Inicializa o banco e cria o admin se necessário
  init: async () => {
    const users = authService.getUsers();
    const adminExists = users.some(u => u.role === 'ADMIN');

    if (!adminExists) {
      console.log("LexFlow Engine: Criando administrador mestre...");
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync('admin123', salt);
      
      const masterAdmin: User = {
        id: 'master-admin',
        name: 'Administrador LexFlow',
        email: 'admin@admin.com',
        passwordHash,
        role: 'ADMIN',
        active: true,
        oab: 'MASTER',
        specialty: 'Gestão Total',
        createdAt: new Date().toISOString()
      };
      
      authService.saveUser(masterAdmin);
      console.log("LexFlow Engine: Admin criado com sucesso. Use admin@admin.com / admin123");
    }
  },

  getUsers: (): User[] => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: User) => {
    const users = authService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  },

  deleteUser: (id: string) => {
    const users = authService.getUsers().filter(u => u.id !== id);
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  },

  createUser: async (userData: Partial<User> & { password?: string }) => {
    const users = authService.getUsers();
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Este e-mail já está cadastrado no sistema.');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(userData.password || '123456', salt);

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name || '',
      email: userData.email || '',
      passwordHash,
      role: userData.role || 'LAWYER',
      active: true,
      oab: userData.oab,
      specialty: userData.specialty,
      createdAt: new Date().toISOString()
    };

    authService.saveUser(newUser);
    return newUser;
  },

  authenticate: async (email: string, pass: string) => {
    const users = authService.getUsers();
    const user = users.find(u => u.email === email && u.active);

    if (!user) return null;

    const isValid = bcrypt.compareSync(pass, user.passwordHash);
    if (!isValid) return null;

    // Retorna o usuário sem a senha por segurança
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
};