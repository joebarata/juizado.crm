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

// --- MODO DEMO: Armazenamento em Memória (RAM) ---
// Estes dados são reiniciados se o servidor parar.
let demoStore = {
  users: [
    { id: 'demo-user', name: 'Usuário Demonstrativo', email: 'demo@crm.com', role: 'LAWYER', active: true }
  ],
  clients: [
    { id: 'd1', name: 'Cliente Exemplo Demo', type: 'PF', doc: '000.000.000-00', email: 'exemplo@demo.com', city: 'São Paulo', cases: 2 }
  ],
  financial: [],
  agenda: []
};

// --- MOTOR DE AUTO-MIGRAÇÃO (MODO REAL) ---
async function setupDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("LexFlow Real Mode: Conectado ao MySQL.");

    await connection.query(`CREATE TABLE IF NOT EXISTS users (id VARCHAR(50) PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, passwordHash VARCHAR(255) NOT NULL, role ENUM('ADMIN', 'LAWYER', 'ASSISTANT', 'FINANCIAL') DEFAULT 'LAWYER', active BOOLEAN DEFAULT TRUE, oab VARCHAR(50), specialty VARCHAR(100), createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await connection.query(`CREATE TABLE IF NOT EXISTS clients (id VARCHAR(50) PRIMARY KEY, name VARCHAR(255) NOT NULL, type ENUM('PF', 'PJ') DEFAULT 'PF', doc VARCHAR(50), email VARCHAR(255), city VARCHAR(100), cases INT DEFAULT 0, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await connection.query(`CREATE TABLE IF NOT EXISTS financial (id VARCHAR(50) PRIMARY KEY, description VARCHAR(255), amount DECIMAL(10,2), type ENUM('receita', 'despesa'), status ENUM('pago', 'pendente'), date DATE, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);

    const [rows] = await connection.query('SELECT * FROM users WHERE email = "admin@admin.com"');
    if (rows.length === 0) {
      const hash = bcrypt.hashSync('admin123', 10);
      await connection.query('INSERT INTO users (id, name, email, passwordHash, role) VALUES (?, ?, ?, ?, ?)', ['master-admin', 'Admin Real', 'admin@admin.com', hash, 'ADMIN']);
    }
  } catch (err) {
    console.error("Erro no MySQL (Ignore se estiver em ambiente sem banco):", err.message);
  } finally {
    if (connection) connection.end();
  }
}

// --- MIDDLEWARE DE DECISÃO (REAL vs DEMO) ---
const isDemo = (req) => req.headers['x-user-id'] === 'demo-user';

// --- ROTAS ---

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Lógica Demo
  if (email === 'demo@crm.com' && password === 'demo123') {
    return res.json(demoStore.users[0]);
  }

  // Lógica Real
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ? AND active = TRUE', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciais inválidas' });
    
    const user = rows[0];
    const valid = bcrypt.compareSync(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Senha incorreta' });

    delete user.passwordHash;
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor real' });
  } finally {
    if (connection) connection.end();
  }
});

app.get('/api/clients', async (req, res) => {
  if (isDemo(req)) return res.json(demoStore.clients);

  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.query('SELECT * FROM clients ORDER BY createdAt DESC');
    res.json(rows);
  } finally { connection.end(); }
});

app.post('/api/clients', async (req, res) => {
  const clientData = { ...req.body, id: Math.random().toString(36).substr(2, 9) };
  
  if (isDemo(req)) {
    demoStore.clients.unshift(clientData);
    return res.json({ success: true, id: clientData.id });
  }

  const connection = await mysql.createConnection(dbConfig);
  try {
    await connection.query('INSERT INTO clients (id, name, type, doc, email, city) VALUES (?, ?, ?, ?, ?, ?)', 
      [clientData.id, clientData.name, clientData.type, clientData.doc, clientData.email, clientData.city]);
    res.json({ success: true, id: clientData.id });
  } finally { connection.end(); }
});

app.get('/api/users', async (req, res) => {
  if (isDemo(req)) return res.json(demoStore.users);
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.query('SELECT id, name, email, role, active FROM users');
    res.json(rows);
  } finally { connection.end(); }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  await setupDatabase();
  console.log(`LexFlow API rodando na porta ${PORT}`);
});