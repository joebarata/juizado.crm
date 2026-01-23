import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors());
app.use(express.json());

// Configurações do Banco de Dados Real (Hostinger)
const dbConfig = {
  host: 'localhost',
  user: 'u219096027_crm_juridico',
  password: 'Rm@1020304',
  database: 'u219096027_crm_juridico',
};

const JWT_SECRET = process.env.JWT_SECRET || 'lexflow-secret-key-2024';

// --- MODO DEMO: Armazenamento em Memória (RAM) ---
let demoStore = {
  users: [
    { id: '0', nome: 'Usuário Demo', email: 'demo@crm.com', perfil: 'demo', ativo: true }
  ],
  clients: [
    { id: 'd1', name: 'Dr. Arthur Exemplo (Demo)', type: 'PF', doc: '000.000.000-00', email: 'arthur@demo.com', city: 'São Paulo', cases: 2 }
  ]
};

// --- MOTOR DE AUTO-MIGRAÇÃO E CRIAÇÃO DE ADMIN ---
async function setupDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("LexFlow Engine: Conectado ao MySQL Hostinger.");

    // Criar Tabela de Usuários com nomes sugeridos (nome, email, senha, perfil, ativo)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        perfil VARCHAR(50) DEFAULT 'advogado',
        ativo BOOLEAN DEFAULT TRUE,
        oab VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Outras tabelas essenciais
    await connection.query(`CREATE TABLE IF NOT EXISTS clients (id VARCHAR(50) PRIMARY KEY, name VARCHAR(255) NOT NULL, type ENUM('PF', 'PJ') DEFAULT 'PF', doc VARCHAR(50), email VARCHAR(255), city VARCHAR(100), cases INT DEFAULT 0, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await connection.query(`CREATE TABLE IF NOT EXISTS financial (id VARCHAR(50) PRIMARY KEY, description VARCHAR(255), amount DECIMAL(10,2), type ENUM('receita', 'despesa'), status ENUM('pago', 'pendente'), date DATE, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await connection.query(`CREATE TABLE IF NOT EXISTS agenda (id VARCHAR(50) PRIMARY KEY, title VARCHAR(255), description TEXT, date DATE, time TIME, type ENUM('audiencia', 'prazo', 'reuniao', 'outro'), createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);

    // GARANTIR ADMIN AUTOMÁTICO
    const [rows] = await connection.query('SELECT * FROM users WHERE email = "admin@admin.com"');
    if (rows.length === 0) {
      const hash = bcrypt.hashSync('admin123', 10);
      await connection.query(
        'INSERT INTO users (nome, email, senha, perfil, ativo) VALUES (?, ?, ?, ?, ?)', 
        ['Administrador Sistema', 'admin@admin.com', hash, 'admin', true]
      );
      console.log('✅ USUÁRIO ADMIN CRIADO AUTOMATICAMENTE: admin@admin.com / admin123');
    }
  } catch (err) {
    console.error("⚠️ Falha ao iniciar Banco Real. Verifique as credenciais da Hostinger.");
  } finally {
    if (connection) connection.end();
  }
}

// --- ROTAS DE AUTENTICAÇÃO ---

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // 1. PRIORIDADE: LOGIN DEMO (Sem Banco)
  if (email === 'demo@crm.com') {
    if (password !== 'demo123') {
      return res.status(401).json({ error: 'Senha inválida para usuário demo' });
    }
    
    // Gerar Token fictício (Base64)
    const token = Buffer.from(JSON.stringify({ id: 0, perfil: 'demo' })).toString('base64');
    
    return res.json({
      user: { id: '0', nome: 'Usuário Demo', email: 'demo@crm.com', perfil: 'demo', ativo: true },
      token: `demo-jwt-${token}`
    });
  }

  // 2. LOGIN REAL (MySQL)
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ? AND ativo = TRUE', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado ou inativo' });
    }

    const user = rows[0];
    const isPasswordValid = bcrypt.compareSync(password, user.senha);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta para o sistema real' });
    }

    // Gerar Token Real Simulado
    const token = Buffer.from(JSON.stringify({ id: user.id, perfil: user.perfil })).toString('base64');
    
    // Limpar senha do retorno
    delete user.senha;
    
    res.json({
      user: {
        id: user.id.toString(),
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        ativo: !!user.ativo
      },
      token: `real-jwt-${token}`
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro crítico de conexão com o servidor real' });
  } finally {
    if (connection) connection.end();
  }
});

// --- ROTAS DE DADOS (DIFERENCIANDO DEMO/REAL) ---

const getUserFromHeader = (req) => {
  const userId = req.headers['x-user-id'];
  return { id: userId, isDemo: userId === '0' };
};

app.get('/api/clients', async (req, res) => {
  const auth = getUserFromHeader(req);
  if (auth.isDemo) return res.json(demoStore.clients);

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM clients ORDER BY createdAt DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json([]);
  } finally {
    if (connection) connection.end();
  }
});

// Outras rotas simplificadas para garantir funcionamento
app.get('/api/users', async (req, res) => {
  const auth = getUserFromHeader(req);
  if (auth.isDemo) return res.json(demoStore.users);
  
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT id, nome, email, perfil, ativo FROM users');
    res.json(rows.map(r => ({ ...r, id: r.id.toString() })));
  } catch (err) {
    res.status(500).json([]);
  } finally {
    if (connection) connection.end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  await setupDatabase();
  console.log(`🚀 LexFlow Server Rodando na Porta ${PORT}`);
});