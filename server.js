const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Conexão com o PostgreSQL usando pool de conexões
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  max: 10, // Número máximo de conexões no pool
  idleTimeoutMillis: 30000, // Tempo que a conexão pode ficar ociosa antes de ser fechada
  connectionTimeoutMillis: 2000, // Tempo máximo para tentar conectar antes de falhar
});

pool.on('connect', () => {
  console.log('Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Erro na conexão com o PostgreSQL:', err);
});

// Middlewares
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.static(__dirname));

// Rotas
app.post('/api/cadastro', async (req, res) => {
  const { nome, email, whatsapp, cidade, estado } = req.body;

  const query = 'INSERT INTO cadastros(nome, email, whatsapp, cidade, estado) VALUES($1, $2, $3, $4, $5) RETURNING *';
  const values = [nome, email, whatsapp, cidade, estado];

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(query, values);
      res.json({ message: 'Cadastro realizado com sucesso.', data: result.rows[0] });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Erro ao salvar o cadastro:', err);
    res.status(500).json({ message: 'Erro ao salvar o cadastro', error: err.message });
  }
});

app.post('/api/salvarCheckin', async (req, res) => {
  const { nome, email, whatsapp, cidade, estado } = req.body;

  const query = 'INSERT INTO checkins(nome, email, whatsapp, cidade, estado, checkinTime) VALUES($1, $2, $3, $4, $5, NOW()) RETURNING *';
  const values = [nome, email, whatsapp, cidade, estado];

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(query, values);
      res.json({ message: 'Check-in realizado com sucesso.', data: result.rows[0] });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Erro ao salvar o check-in:', err);
    res.status(500).json({ message: 'Erro ao salvar o check-in', error: err.message });
  }
});

// Middleware para tratar 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Página não encontrada' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
