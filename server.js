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
  connectTimeout: 20000
};

const pool = mysql.createPool(dbConfig);

// CPFs de teste da documentação ConectaGov (Homologação)
const testCpfs = {
  "77689062768": {
    Cpf: "77689062768", Nome: "ANA CLAUDIA TESTE", NomeSocial: "", 
    SituacaoCadastral: "0", DescSituacaoCadastral: "REGULAR", 
    NomeMae: "MARIA DA SILVA TESTE", DataNascimento: "19850520", 
    Logradouro: "RUA DAS FLORES", NumeroLogradouro: "100", Bairro: "CENTRO", 
    Municipio: "BRASILIA", UF: "DF", Cep: 70000000, Estrangeiro: "N", DataInscricao: "20100101"
  },
  "00045024936": {
    Cpf: "00045024936", Nome: "JOSE CARLOS HOMOLOGA", NomeSocial: "", 
    SituacaoCadastral: "2", DescSituacaoCadastral: "SUSPENSA", 
    NomeMae: "IRENE HOMOLOGA", DataNascimento: "19701010", 
    Logradouro: "AVENIDA PAULISTA", NumeroLogradouro: "1000", Bairro: "BELA VISTA", 
    Municipio: "SAO PAULO", UF: "SP", Cep: 10000000, Estrangeiro: "N", DataInscricao: "19950505"
  }
};

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Token não fornecido.' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Sessão expirada.' });
    req.user = decoded;
    next();
  });
};

// ENDPOINT CONSULTA CPF (PROXY)
app.get('/api/cpf/:cpf', authMiddleware, async (req, res) => {
  const { cpf } = req.params;
  
  // Lógica de Homologação (CPFs de teste fornecidos)
  if (testCpfs[cpf]) {
    return res.json([testCpfs[cpf]]);
  }

  // Em um cenário real com credenciais ConectaGov/Serpro:
  // 1. Autenticar no Serpro Oauth2 para pegar o Bearer Token
  // 2. Chamar https://apigateway.conectagov.estaleiro.serpro.gov.br/api-cpf-light/v2/consulta/cpf
  
  // Por enquanto, simulamos uma resposta regular para CPFs não listados nos testes
  // para permitir a demonstração da UI
  res.json([{
    Cpf: cpf,
    Nome: "CONSULTA REAL SIMULADA",
    NomeSocial: "",
    SituacaoCadastral: "0",
    DescSituacaoCadastral: "REGULAR",
    NomeMae: "MAE DA SILVA CONSULTA",
    DataNascimento: "19900101",
    Logradouro: "RUA EM PROCESSAMENTO",
    NumeroLogradouro: "S/N",
    Bairro: "BAIRRO FISCAL",
    Municipio: "SAO PAULO",
    UF: "SP",
    Cep: 10000000,
    Estrangeiro: "N",
    DataInscricao: "20080315"
  }]);
});

// Outras rotas permanecem iguais...
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Usuário inválido.' });
    const user = rows[0];
    if (!bcrypt.compareSync(password, user.senha)) return res.status(401).json({ error: 'Senha incorreta.' });
    const token = jwt.sign({ id: user.id, email: user.email, perfil: user.perfil }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ user: { id: user.id.toString(), nome: user.nome, email: user.email, perfil: user.perfil, ativo: true }, token });
  } catch (err) { res.status(500).json({ error: 'Erro interno.' }); }
});

app.get('/api/judges', authMiddleware, async (req, res) => {
  try { const [rows] = await pool.query('SELECT * FROM judges ORDER BY win_rate DESC'); res.json(rows); } 
  catch (err) { res.status(500).json([]); }
});

app.get('/api/clients', authMiddleware, async (req, res) => {
  try { const [rows] = await pool.query('SELECT * FROM clients ORDER BY createdAt DESC'); res.json(rows); } 
  catch (err) { res.status(500).json([]); }
});

app.get('/api/financial', authMiddleware, async (req, res) => {
  try { const [rows] = await pool.query('SELECT * FROM financial ORDER BY date DESC'); res.json(rows); } 
  catch (err) { res.status(500).json([]); }
});

app.get('/api/agenda', authMiddleware, async (req, res) => {
  try { const [rows] = await pool.query('SELECT * FROM agenda ORDER BY date DESC'); res.json(rows); } 
  catch (err) { res.status(500).json([]); }
});

app.get('/api/users', authMiddleware, async (req, res) => {
  try { const [rows] = await pool.query('SELECT id, nome, email, perfil, ativo, oab, createdAt FROM users'); res.json(rows); } 
  catch (err) { res.status(500).json([]); }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 LexFlow Backend Online na Porta ${PORT}`);
});
