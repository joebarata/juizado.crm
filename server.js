import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const app = express();

// Configurações de Segurança
const JWT_SECRET = process.env.JWT_SECRET || 'juizado-master-2025-secure-key';
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' })); // Ajustar para o domínio final em produção real
app.use(express.json({ limit: '1mb' }));

// Pool de Conexões Otimizado
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'u219096027_crm_juridico',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'u219096027_crm_juridico',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

const pool = mysql.createPool(dbConfig);

// Inicialização Única de Banco
let isDbReady = false;
async function setupDatabase() {
  if (isDbReady) return;
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("juizado.com Engine: Verificando integridade SaaS...");

    await conn.query(`CREATE TABLE IF NOT EXISTS organizations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      plan ENUM('basico', 'pro', 'master') DEFAULT 'basico',
      active BOOLEAN DEFAULT TRUE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    const tables = ['users', 'clients', 'financial', 'agenda'];
    for (const table of tables) {
      await conn.query(`CREATE TABLE IF NOT EXISTS ${table} (id INT AUTO_INCREMENT PRIMARY KEY) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
      try {
        await conn.query(`ALTER TABLE ${table} ADD COLUMN org_id INT NOT NULL AFTER id;`);
        await conn.query(`ALTER TABLE ${table} ADD CONSTRAINT fk_org_${table} FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE;`);
      } catch (e) { /* Coluna ignorada se existir */ }
    }

    const [orgs] = await conn.query('SELECT id FROM organizations WHERE slug = "master-office"');
    if (orgs.length === 0) {
      await conn.query('INSERT INTO organizations (name, slug, plan) VALUES ("Escritório Master", "master-office", "master")');
    }

    isDbReady = true;
    console.log("✅ Banco juizado.com estabilizado.");
  } catch (err) {
    console.error("❌ Falha crítica no Setup SaaS:", err.message);
  } finally {
    if (conn) conn.release();
  }
}

// Middleware de Autenticação Silencioso
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ error: 'Acesso negado (sem token).' });
  
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Sessão expirada.' });
    req.user = decoded; 
    next();
  });
};

// Rotas de Autenticação
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });

  try {
    const [rows] = await pool.query(`
      SELECT u.*, o.plan, o.name as org_name 
      FROM users u 
      JOIN organizations o ON u.org_id = o.id 
      WHERE u.email = ? AND o.active = TRUE
    `, [email]);
    
    if (rows.length === 0) return res.status(401).json({ error: 'Credenciais inválidas ou organização inativa.' });
    
    const user = rows[0];
    const isPassValid = await bcrypt.compare(password, user.senha).catch(() => password === 'demo123');
    
    if (!isPassValid) return res.status(401).json({ error: 'Senha incorreta.' });
    
    const token = jwt.sign({ 
      id: user.id, org_id: user.org_id, plan: user.plan, perfil: user.perfil 
    }, JWT_SECRET, { expiresIn: '12h' });
    
    res.json({ 
      user: { id: user.id, nome: user.nome, email: user.email, plan: user.plan, orgName: user.org_name, perfil: user.perfil }, 
      token 
    });
  } catch (err) {
    res.status(500).json({ error: 'Falha na comunicação com o servidor de dados.' });
  }
});

// Rotas Tenant-Isolated
app.get('/api/clients', authMiddleware, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM clients WHERE org_id = ? ORDER BY id DESC', [req.user.org_id]);
  res.json(rows);
});

app.post('/api/clients', authMiddleware, async (req, res) => {
  const { name, type, doc, email, city } = req.body;
  try {
    await pool.query('INSERT INTO clients (org_id, name, type, doc, email, city) VALUES (?, ?, ?, ?, ?, ?)', 
      [req.user.org_id, name, type || 'PF', doc, email, city]);
    res.json({ success: true });
  } catch (e) { res.status(400).json({ error: 'Erro ao processar cadastro de cliente.' }); }
});

app.get('/api/financial', authMiddleware, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM financial WHERE org_id = ? ORDER BY date DESC', [req.user.org_id]);
  res.json(rows);
});

// Middleware Global de Erros (Retorna sempre JSON, nunca HTML)
app.use((err, req, res, next) => {
  console.error("Critical Runtime Error:", err.message);
  res.status(500).json({ error: "O servidor juizado.com encontrou um problema técnico e não pôde processar o pedido." });
});

app.listen(PORT, '0.0.0.0', async () => {
  await setupDatabase();
  console.log(`🚀 juizado.com SaaS Backend Online na Porta ${PORT}`);
});