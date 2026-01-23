
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'lexflow-ultra-secure-key-2024';

// Configuração Hostinger / Local
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'u219096027_crm_juridico',
  password: process.env.DB_PASSWORD || 'Rm@1020304',
  database: process.env.DB_NAME || 'u219096027_crm_juridico',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Inicialização de tabelas e Admin Automático
async function setupDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("LexFlow Engine: Conectado ao MySQL.");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        perfil ENUM('admin', 'advogado') DEFAULT 'advogado',
        ativo BOOLEAN DEFAULT TRUE,
        oab VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Regra OAB: Criação automática do Admin se não existir
    const [admins] = await connection.query('SELECT * FROM users WHERE email = "admin@admin.com"');
    if (admins.length === 0) {
      const hash = bcrypt.hashSync('admin123', 10);
      await connection.query(
        'INSERT INTO users (nome, email, senha, perfil, ativo) VALUES (?, ?, ?, ?, ?)', 
        ['Administrador Sistema', 'admin@admin.com', hash, 'admin', true]
      );
      console.log('✅ ADMIN criado automaticamente (admin@admin.com / admin123)');
    }

    // Outras tabelas de suporte
    await connection.query(`CREATE TABLE IF NOT EXISTS clients (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, type ENUM('PF', 'PJ') DEFAULT 'PF', doc VARCHAR(50), email VARCHAR(255), city VARCHAR(100), cases INT DEFAULT 0, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await connection.query(`CREATE TABLE IF NOT EXISTS financial (id INT AUTO_INCREMENT PRIMARY KEY, description VARCHAR(255), amount DECIMAL(10,2), type ENUM('receita', 'despesa'), status ENUM('pago', 'pendente'), date DATE, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    await connection.query(`CREATE TABLE IF NOT EXISTS agenda (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), description TEXT, date DATE, time TIME, type ENUM('audiencia', 'prazo', 'reuniao', 'outro'), createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);

  } catch (err) {
    console.error("❌ ERRO NO SETUP DO BANCO:", err.message);
  } finally {
    if (connection) connection.release();
  }
}

// ROTA DE LOGIN REAL
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'E-mail não encontrado no banco de dados.' });
    }

    const user = rows[0];

    if (!user.ativo) {
      return res.status(403).json({ error: 'Usuário inativo. Contate o administrador.' });
    }

    const isMatch = bcrypt.compareSync(password, user.senha);
    if (!isMatch) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, perfil: user.perfil },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      user: {
        id: user.id.toString(),
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        ativo: !!user.ativo
      },
      token
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: 'Erro interno no servidor de banco de dados.' });
  }
});

// MIDDLEWARE DE PROTEÇÃO
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Token necessário.' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Sessão expirada.' });
    req.user = decoded;
    next();
  });
};

// API: Listar Usuários
app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nome, email, perfil, ativo FROM users ORDER BY nome');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

// API: Criar Usuário (pelo Admin)
app.post('/api/users', authMiddleware, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hash = bcrypt.hashSync(password, 10);
    await pool.query(
      'INSERT INTO users (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
      [name, email, hash, role.toLowerCase()]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao cadastrar usuário (email duplicado?).' });
  }
});

// API: Clientes
app.get('/api/clients', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients ORDER BY createdAt DESC');
    res.json(rows);
  } catch (err) { res.json([]); }
});

app.post('/api/clients', authMiddleware, async (req, res) => {
  const { name, type, doc, email, city } = req.body;
  try {
    await pool.query('INSERT INTO clients (name, type, doc, email, city) VALUES (?, ?, ?, ?, ?)', [name, type, doc, email, city]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Erro ao salvar cliente.' }); }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  await setupDatabase();
  console.log(`🚀 LexFlow Server Online na Porta ${PORT}`);
});
