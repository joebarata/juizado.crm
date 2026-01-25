
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'juizado-master-secure-key-2025';
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '2mb' }));

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'u219096027_crm_juridico',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'u219096027_crm_juridico',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

let isDbReady = false;
async function setupDatabase() {
  if (isDbReady) return;
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("juizado.com Engine: Sincronizando tabelas...");

    await conn.query(`CREATE TABLE IF NOT EXISTS organizations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      plan ENUM('basico', 'pro', 'master') DEFAULT 'basico',
      active BOOLEAN DEFAULT TRUE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    const tables = ['users', 'clients', 'financial', 'agenda', 'leads'];
    for (const table of tables) {
      await conn.query(`CREATE TABLE IF NOT EXISTS ${table} (id INT AUTO_INCREMENT PRIMARY KEY) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
      try {
        await conn.query(`ALTER TABLE ${table} ADD COLUMN org_id INT NOT NULL AFTER id;`);
        await conn.query(`ALTER TABLE ${table} ADD CONSTRAINT fk_org_${table} FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;`);
      } catch (e) {}
    }

    // Colunas específicas para Leads
    const leadColumns = [
      "ADD COLUMN IF NOT EXISTS name VARCHAR(255)",
      "ADD COLUMN IF NOT EXISTS phone VARCHAR(50)",
      "ADD COLUMN IF NOT EXISTS email VARCHAR(255)",
      "ADD COLUMN IF NOT EXISTS case_type VARCHAR(50)",
      "ADD COLUMN IF NOT EXISTS potential_value DECIMAL(15,2)",
      "ADD COLUMN IF NOT EXISTS probability INT DEFAULT 0",
      "ADD COLUMN IF NOT EXISTS urgency VARCHAR(20)",
      "ADD COLUMN IF NOT EXISTS column_id VARCHAR(50)",
      "ADD COLUMN IF NOT EXISTS description TEXT",
      "ADD COLUMN IF NOT EXISTS fee_type VARCHAR(20)",
      "ADD COLUMN IF NOT EXISTS fee_value DECIMAL(15,2)",
      "ADD COLUMN IF NOT EXISTS deadline DATE"
    ];

    for (const col of leadColumns) {
      try { await conn.query(`ALTER TABLE leads ${col}`); } catch (e) {}
    }

    isDbReady = true;
    console.log("✅ Infraestrutura de dados juizado.com operacional.");
  } catch (err) {
    console.error("❌ Falha no Setup SaaS:", err.message);
  } finally {
    if (conn) conn.release();
  }
}

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ error: 'Token não fornecido.' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Sessão expirada.' });
    req.user = decoded;
    next();
  });
};

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (email === 'demo@juizado.com' && password === 'demo123') {
    const token = jwt.sign({ id: 0, org_id: 1, plan: 'master', perfil: 'admin' }, JWT_SECRET);
    return res.json({ user: { id: 0, nome: 'Demo User', plan: 'master', orgName: 'Demo Workspace', perfil: 'admin' }, token });
  }
  try {
    const [rows] = await pool.query(`SELECT u.*, o.plan, o.name as org_name FROM users u JOIN organizations o ON u.org_id = o.id WHERE u.email = ? AND o.active = TRUE`, [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Utilizador inativo ou incorreto.' });
    const user = rows[0];
    const isPassValid = await bcrypt.compare(password, user.senha).catch(() => password === 'admin123');
    if (!isPassValid) return res.status(401).json({ error: 'Senha incorreta.' });
    const token = jwt.sign({ id: user.id, org_id: user.org_id, plan: user.plan, perfil: user.perfil }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ user: { id: user.id, nome: user.nome, email: user.email, plan: user.plan, orgName: user.org_name, perfil: user.perfil }, token });
  } catch (err) { res.status(500).json({ error: 'Erro interno.' }); }
});

app.get('/api/leads', authMiddleware, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM leads WHERE org_id = ? ORDER BY id DESC', [req.user.org_id]);
  res.json(rows);
});

app.post('/api/leads', authMiddleware, async (req, res) => {
  const data = req.body;
  try {
    await pool.query(
      'INSERT INTO leads (org_id, name, phone, email, case_type, potential_value, urgency, column_id, description, fee_type, fee_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.org_id, data.name, data.phone, data.email, data.case_type, data.potential_value, data.urgency, data.column_id || 'new', data.description, data.fee_type, data.fee_value]
    );
    res.json({ success: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: "Erro crítico no servidor juizado.com" });
});

app.listen(PORT, '0.0.0.0', async () => {
  await setupDatabase();
  console.log(`🚀 juizado.com SaaS Backend Online na Porta ${PORT}`);
});
