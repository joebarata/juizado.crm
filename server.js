import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'juizado-secure-saas-token-2025';
const MEU_DANFE_KEY = 'ea34d527-00b3-4af2-8d08-fefb4b2418e1';

// Configurações do Banco de Dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'u219096027_crm_juridico',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'u219096027_crm_juridico',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  connectTimeout: 20000
};

const pool = mysql.createPool(dbConfig);

// MIGRATION SCRIPT / DATABASE SETUP
async function setupDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("juizado.com Engine: SaaS Mode Active.");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        plan ENUM('basico', 'pro', 'master') DEFAULT 'basico',
        active BOOLEAN DEFAULT TRUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        org_id INT NOT NULL,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        perfil ENUM('admin', 'advogado', 'demo') DEFAULT 'advogado',
        ativo BOOLEAN DEFAULT TRUE,
        oab VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        org_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        type ENUM('PF', 'PJ') DEFAULT 'PF',
        doc VARCHAR(50),
        email VARCHAR(255),
        city VARCHAR(100),
        cases INT DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS financial (
        id INT AUTO_INCREMENT PRIMARY KEY,
        org_id INT NOT NULL,
        description VARCHAR(255),
        amount DECIMAL(10,2),
        type ENUM('receita', 'despesa'),
        status ENUM('pago', 'pendente'),
        date DATE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS agenda (
        id INT AUTO_INCREMENT PRIMARY KEY,
        org_id INT NOT NULL,
        title VARCHAR(255),
        description TEXT,
        date DATE,
        time TIME,
        type ENUM('audiencia', 'prazo', 'reuniao', 'outro'),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS judges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        court VARCHAR(100),
        win_rate DECIMAL(5,2),
        avg_days INT,
        risk_score INT,
        total_cases INT,
        specialty VARCHAR(100)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const [orgs] = await connection.query('SELECT * FROM organizations WHERE slug = ?', ['master-office']);
    let masterOrgId;
    if (orgs.length === 0) {
      const [res] = await connection.query('INSERT INTO organizations (name, slug, plan) VALUES (?, ?, ?)', ['Escritório Master', 'master-office', 'master']);
      masterOrgId = res.insertId;
    } else {
      masterOrgId = orgs[0].id;
    }

    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', ['admin@admin.com']);
    if (rows.length === 0) {
      const hashed = bcrypt.hashSync('admin123', 10);
      await connection.query('INSERT INTO users (org_id, nome, email, senha, perfil) VALUES (?, ?, ?, ?, ?)', [masterOrgId, 'Administrador SaaS', 'admin@admin.com', hashed, 'admin']);
    }

  } catch (err) {
    console.error("❌ ERRO ARQUITETURA SaaS:", err.message);
  } finally {
    if (connection) connection.release();
  }
}

// SAAS MIDDLEWARE
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Token não fornecido.' });
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Sessão expirada.' });
    req.user = decoded;
    next();
  });
};

// --- MEU DANFE PROXY ROUTES ---

app.post('/api/fiscal/add', authMiddleware, async (req, res) => {
  const { chave } = req.body;
  if (!chave || chave.length !== 44) return res.status(400).json({ error: 'Chave de acesso inválida.' });

  try {
    const response = await fetch(`https://api.meudanfe.com.br/v2/fd/add/${chave}`, {
      method: 'PUT',
      headers: { 'Api-Key': MEU_DANFE_KEY }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Falha na comunicação com Meu Danfe.' });
  }
});

app.get('/api/fiscal/pdf/:chave', authMiddleware, async (req, res) => {
  const { chave } = req.params;
  try {
    const response = await fetch(`https://api.meudanfe.com.br/v2/fd/get/da/${chave}`, {
      method: 'GET',
      headers: { 'Api-Key': MEU_DANFE_KEY }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Falha ao baixar PDF fiscal.' });
  }
});

// --- AUTH ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(`
      SELECT u.*, o.plan, o.name as org_name 
      FROM users u 
      JOIN organizations o ON u.org_id = o.id 
      WHERE u.email = ? AND o.active = TRUE
    `, [email]);
    
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciais inválidas.' });
    
    const user = rows[0];
    if (!bcrypt.compareSync(password, user.senha)) return res.status(401).json({ error: 'Senha incorreta.' });
    
    const token = jwt.sign({ id: user.id, org_id: user.org_id, plan: user.plan, perfil: user.perfil }, JWT_SECRET, { expiresIn: '12h' });
    
    res.json({ user: { id: user.id, nome: user.nome, email: user.email, perfil: user.perfil, plan: user.plan, orgName: user.org_name }, token });
  } catch (err) { res.status(500).json({ error: 'Erro interno login.' }); }
});

// --- TENANT API ---
app.get('/api/clients', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients WHERE org_id = ? ORDER BY createdAt DESC', [req.user.org_id]);
    res.json(rows);
  } catch (err) { res.status(500).json([]); }
});

app.post('/api/clients', authMiddleware, async (req, res) => {
  const { name, type, doc, email, city } = req.body;
  try {
    await pool.query('INSERT INTO clients (org_id, name, type, doc, email, city) VALUES (?, ?, ?, ?, ?, ?)', 
      [req.user.org_id, name, type, doc, email, city]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Erro client.' }); }
});

app.get('/api/financial', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM financial WHERE org_id = ? ORDER BY date DESC', [req.user.org_id]);
    res.json(rows);
  } catch (err) { res.status(500).json([]); }
});

app.post('/api/financial', authMiddleware, async (req, res) => {
  const { description, amount, type, status, date } = req.body;
  try {
    await pool.query('INSERT INTO financial (org_id, description, amount, type, status, date) VALUES (?, ?, ?, ?, ?, ?)', 
      [req.user.org_id, description, amount, type, status, date]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Erro financeiro.' }); }
});

app.get('/api/agenda', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM agenda WHERE org_id = ? ORDER BY date DESC', [req.user.org_id]);
    res.json(rows);
  } catch (err) { res.status(500).json([]); }
});

app.post('/api/agenda', authMiddleware, async (req, res) => {
  const { title, description, date, time, type } = req.body;
  try {
    await pool.query('INSERT INTO agenda (org_id, title, description, date, time, type) VALUES (?, ?, ?, ?, ?, ?)', 
      [req.user.org_id, title, description, date, time, type]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Erro agenda.' }); }
});

app.get('/api/judges', authMiddleware, async (req, res) => {
  if (req.user.plan === 'basico') return res.status(403).json({ error: 'Upgrade necessário.' });
  try {
    const [rows] = await pool.query('SELECT * FROM judges ORDER BY win_rate DESC');
    res.json(rows);
  } catch (err) { res.status(500).json([]); }
});

app.get('/api/users', authMiddleware, async (req, res) => {
  if (req.user.perfil !== 'admin') return res.status(403).json([]);
  try {
    const [rows] = await pool.query('SELECT id, nome, email, perfil, ativo, oab FROM users WHERE org_id = ?', [req.user.org_id]);
    res.json(rows);
  } catch (err) { res.status(500).json([]); }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', async () => {
  await setupDatabase();
  console.log(`🚀 juizado.com SaaS Backend Online na Porta ${PORT}`);
});
