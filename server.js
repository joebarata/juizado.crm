import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'lexflow-secure-token-360';

// Configurações do Banco de Dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'u219096027_crm_juridico',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'u219096027_crm_juridico',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000 // Aumentado para 20s para mitigar latência na Hostinger
};

const pool = mysql.createPool(dbConfig);

async function setupDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("LexFlow Engine: Conexão segura estabelecida.");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        perfil ENUM('admin', 'advogado', 'demo') DEFAULT 'advogado',
        ativo BOOLEAN DEFAULT TRUE,
        oab VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
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

    await connection.query(`CREATE TABLE IF NOT EXISTS clients (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, type ENUM('PF', 'PJ') DEFAULT 'PF', doc VARCHAR(50), email VARCHAR(255), city VARCHAR(100), cases INT DEFAULT 0, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
    await connection.query(`CREATE TABLE IF NOT EXISTS financial (id INT AUTO_INCREMENT PRIMARY KEY, description VARCHAR(255), amount DECIMAL(10,2), type ENUM('receita', 'despesa'), status ENUM('pago', 'pendente'), date DATE, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
    await connection.query(`CREATE TABLE IF NOT EXISTS agenda (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), description TEXT, date DATE, time TIME, type ENUM('audiencia', 'prazo', 'reuniao', 'outro'), createdAt DATETIME DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    // Inserir Admin Padrão
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', ['admin@admin.com']);
    if (rows.length === 0) {
      const hashed = bcrypt.hashSync('admin123', 10);
      await connection.query('INSERT INTO users (nome, email, senha, perfil) VALUES (?, ?, ?, ?)', ['Administrador', 'admin@admin.com', hashed, 'admin']);
    }

    // Inserir Juízes Base
    const [existingJudges] = await connection.query('SELECT count(*) as count FROM judges');
    if (existingJudges[0].count === 0) {
      await connection.query(`
        INSERT INTO judges (name, court, win_rate, avg_days, risk_score, total_cases, specialty) VALUES 
        ('Dr. João Silva', '1ª Vara Cível - SP', 75.6, 420, 2, 290, 'Consumidor'),
        ('Dra. Maria Oliveira', '3ª Vara Família - RJ', 42.3, 580, 7, 150, 'Sucessões'),
        ('Dr. Carlos Rocha', 'JEC - Curitiba', 88.0, 180, 1, 410, 'Dano Moral'),
        ('Dra. Helena Souza', '5ª Vara Fazenda Pública', 61.2, 730, 5, 85, 'Administrativo'),
        ('Dr. Ricardo Borges', '2ª Vara Cível - BH', 55.4, 390, 4, 112, 'Imobiliário')
      `);
    }
  } catch (err) {
    console.error("❌ ERRO MOTOR DB:", err.message);
  } finally {
    if (connection) connection.release();
  }
}

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Token não fornecido.' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Sessão expirada.' });
    req.user = decoded;
    next();
  });
};

// Logger de Requisições para diagnóstico na Hostinger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ROTAS API
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Usuário inválido.' });
    const user = rows[0];
    if (!bcrypt.compareSync(password, user.senha)) return res.status(401).json({ error: 'Senha incorreta.' });
    const token = jwt.sign({ id: user.id, email: user.email, perfil: user.perfil }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ user: { id: user.id.toString(), nome: user.nome, email: user.email, perfil: user.perfil, ativo: true }, token });
  } catch (err) { 
    res.status(500).json({ error: 'Erro interno no login.' }); 
  }
});

app.get('/api/judges', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM judges ORDER BY win_rate DESC');
    res.json(rows);
  } catch (err) { 
    res.status(500).json({ error: 'Erro ao buscar juízes.' }); 
  }
});

app.get('/api/clients', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients ORDER BY createdAt DESC');
    res.json(rows);
  } catch (err) { res.status(500).json([]); }
});

app.get('/api/financial', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM financial ORDER BY date DESC');
    res.json(rows);
  } catch (err) { res.status(500).json([]); }
});

app.get('/api/agenda', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM agenda ORDER BY date DESC');
    res.json(rows);
  } catch (err) { res.status(500).json([]); }
});

app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nome, email, perfil, ativo, oab, createdAt FROM users');
    res.json(rows);
  } catch (err) { res.status(500).json([]); }
});

// Captura 404 (Deve ser o último da API)
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: `Recurso ${req.url} não encontrado no LexFlow API.` });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', async () => {
  await setupDatabase();
  console.log(`🚀 LexFlow Backend Online na Porta ${PORT}`);
});