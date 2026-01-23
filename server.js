import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors());
app.use(express.json());

// Configurações do Banco de Dados fornecidas pelo usuário
const dbConfig = {
  host: 'localhost',
  user: 'u219096027_crm_juridico',
  password: 'Rm@1020304',
  database: 'u219096027_crm_juridico',
};

// --- MOTOR DE AUTO-MIGRAÇÃO ---
async function setupDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("LexFlow Engine: Conectado ao MySQL. Verificando integridade...");

    // Tabela de Usuários
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        passwordHash VARCHAR(255) NOT NULL,
        role ENUM('ADMIN', 'LAWYER', 'ASSISTANT', 'FINANCIAL') DEFAULT 'LAWYER',
        active BOOLEAN DEFAULT TRUE,
        oab VARCHAR(50),
        specialty VARCHAR(100),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de Clientes
    await connection.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type ENUM('PF', 'PJ') DEFAULT 'PF',
        doc VARCHAR(50),
        email VARCHAR(255),
        city VARCHAR(100),
        cases INT DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela Financeira
    await connection.query(`
      CREATE TABLE IF NOT EXISTS financial (
        id VARCHAR(50) PRIMARY KEY,
        description VARCHAR(255),
        amount DECIMAL(10,2),
        type ENUM('receita', 'despesa'),
        status ENUM('pago', 'pendente'),
        date DATE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Verificação de Admin Inicial
    const [rows] = await connection.query('SELECT * FROM users WHERE role = "ADMIN" LIMIT 1');
    if (rows.length === 0) {
      console.log("LexFlow Engine: Criando Admin Mestre no Banco de Dados...");
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync('admin123', salt);
      await connection.query(
        'INSERT INTO users (id, name, email, passwordHash, role, oab, specialty) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['master-admin', 'Administrador LexFlow', 'admin@admin.com', hash, 'ADMIN', 'MASTER', 'Sócio Diretor']
      );
    }

  } catch (err) {
    console.error("Erro crítico no banco de dados:", err);
  } finally {
    if (connection) connection.end();
  }
}

// --- ROTAS DA API ---

// Autenticação
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ? AND active = TRUE', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciais inválidas' });
    
    const user = rows[0];
    const valid = bcrypt.compareSync(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Senha incorreta' });

    delete user.passwordHash;
    res.json(user);
  } finally {
    connection.end();
  }
});

// Listar Usuários (Equipe)
app.get('/api/users', async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.query('SELECT id, name, email, role, active, oab, specialty, createdAt FROM users');
    res.json(rows);
  } finally {
    connection.end();
  }
});

// Criar Usuário
app.post('/api/users', async (req, res) => {
  const { name, email, password, role, oab, specialty } = req.body;
  const connection = await mysql.createConnection(dbConfig);
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password || '123456', salt);
    const id = Math.random().toString(36).substr(2, 9);
    await connection.query(
      'INSERT INTO users (id, name, email, passwordHash, role, oab, specialty) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, email, hash, role, oab, specialty]
    );
    res.json({ success: true, id });
  } finally {
    connection.end();
  }
});

// Clientes
app.get('/api/clients', async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.query('SELECT * FROM clients ORDER BY createdAt DESC');
    res.json(rows);
  } finally {
    connection.end();
  }
});

app.post('/api/clients', async (req, res) => {
  const { name, type, doc, email, city } = req.body;
  const connection = await mysql.createConnection(dbConfig);
  const id = Math.random().toString(36).substr(2, 9);
  try {
    await connection.query(
      'INSERT INTO clients (id, name, type, doc, email, city) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, type, doc, email, city]
    );
    res.json({ success: true, id });
  } finally {
    connection.end();
  }
});

// Porta de execução na Hostinger (padrão)
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  await setupDatabase();
  console.log(`LexFlow API rodando na porta ${PORT}`);
});