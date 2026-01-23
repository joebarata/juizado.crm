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

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'u219096027_crm_juridico',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'u219096027_crm_juridico',
  waitForConnections: true,
  connectionLimit: 20
};

const pool = mysql.createPool(dbConfig);

async function setupDatabase() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("juizado.com Engine: SaaS Mode Active.");

    await conn.query(`CREATE TABLE IF NOT EXISTS organizations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      plan ENUM('basico', 'pro', 'master') DEFAULT 'basico',
      active BOOLEAN DEFAULT TRUE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    // Ensure all data tables have org_id
    const tables = ['users', 'clients', 'financial', 'agenda'];
    for (const table of tables) {
      await conn.query(`CREATE TABLE IF NOT EXISTS ${table} (id INT AUTO_INCREMENT PRIMARY KEY) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
      try {
        await conn.query(`ALTER TABLE ${table} ADD COLUMN org_id INT NOT NULL AFTER id;`);
        await conn.query(`ALTER TABLE ${table} ADD CONSTRAINT fk_org_${table} FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;`);
      } catch (e) { /* column exists */ }
    }

    // Default Seed Organization
    const [orgs] = await conn.query('SELECT id FROM organizations WHERE slug = "master-office"');
    if (orgs.length === 0) {
      await conn.query('INSERT INTO organizations (name, slug, plan) VALUES ("Escritório Master", "master-office", "master")');
    }

  } catch (err) {
    console.error("❌ ERRO SETUP SaaS:", err.message);
  } finally {
    if (conn) conn.release();
  }
}

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Sessão inválida.' });
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Sessão expirada.' });
    req.user = decoded; // Contains id, org_id, plan
    next();
  });
};

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(`
      SELECT u.*, o.plan, o.name as org_name 
      FROM users u 
      JOIN organizations o ON u.org_id = o.id 
      WHERE u.email = ? AND o.active = TRUE
    `, [email]);
    
    if (rows.length === 0) return res.status(401).json({ error: 'Utilizador ou Organização não encontrados.' });
    
    const user = rows[0];
    if (!bcrypt.compareSync(password, user.senha)) return res.status(401).json({ error: 'Senha incorreta.' });
    
    const token = jwt.sign({ 
      id: user.id, 
      org_id: user.org_id, 
      plan: user.plan, 
      perfil: user.perfil 
    }, JWT_SECRET, { expiresIn: '12h' });
    
    res.json({ 
      user: { id: user.id, nome: user.nome, email: user.email, plan: user.plan, orgName: user.org_name }, 
      token 
    });
  } catch (err) { res.status(500).json({ error: 'Erro no servidor juizado.com.' }); }
});

// TENANT ISOLATED ROUTES
app.get('/api/clients', authMiddleware, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM clients WHERE org_id = ?', [req.user.org_id]);
  res.json(rows);
});

app.get('/api/financial', authMiddleware, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM financial WHERE org_id = ?', [req.user.org_id]);
  res.json(rows);
});

app.get('/api/agenda', authMiddleware, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM agenda WHERE org_id = ?', [req.user.org_id]);
  res.json(rows);
});

app.listen(3001, '0.0.0.0', async () => {
  await setupDatabase();
  console.log(`🚀 juizado.com SaaS Backend Online`);
});
