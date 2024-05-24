const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const ExcelJS = require('exceljs');
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

app.get('/api/export/checkins', async (req, res) => {
    const { data } = req.query;
    let query = 'SELECT * FROM checkins';
    let values = [];

    if (data) {
        query += ' WHERE DATE(checkinTime) = $1';
        values.push(data);
    }

    try {
        const result = await pool.query(query, values);
        const checkins = result.rows;

        // Verifique se há registros antes de prosseguir
        if (checkins.length === 0) {
            return res.status(404).json({ message: 'Nenhum check-in encontrado para a data fornecida.' });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Checkins');

        worksheet.columns = [
            { header: 'Nome', key: 'nome', width: 30 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'WhatsApp', key: 'whatsapp', width: 15 },
            { header: 'Cidade', key: 'cidade', width: 20 },
            { header: 'Estado', key: 'estado', width: 5 }
        ];

        checkins.forEach(row => {
            worksheet.addRow(row);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=checkins.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error('Erro ao exportar dados:', err);
        res.status(500).json({ message: 'Erro ao exportar dados', error: err.message });
    }
});

// Middleware para tratar 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Página não encontrada' });
});

// Exporta o app para ser usado como função serverless
module.exports = app;

// Inicia o servidor se não estiver em ambiente serverless
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}
    