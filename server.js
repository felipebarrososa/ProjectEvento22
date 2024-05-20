const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para análise do corpo da solicitação JSON
app.use(bodyParser.json());

// Middleware para permitir solicitações de origens diferentes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Servir arquivos estáticos da pasta public
app.use(express.static('public'));

// Rota para enviar o arquivo JSON de cadastro
app.get('/cadastro.json', (req, res) => {
  const dataPath = __dirname + '/data/';
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const filePath = dataPath + today + '.json';

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Arquivo de cadastro não encontrado para o dia atual.');
  }
});

// Rota para lidar com a inserção de dados
app.post('/cadastro', (req, res) => {
  const dataPath = __dirname + '/data/';
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const filePath = dataPath + today + '.json';

  if (fs.existsSync(filePath)) {
    const newData = req.body;
    const currentData = JSON.parse(fs.readFileSync(filePath));
    currentData.push(newData);
    fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));
    res.json({ message: 'Cadastro realizado com sucesso.' });
  } else {
    const newData = [req.body];
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
    res.json({ message: 'Arquivo de cadastro criado e dados adicionados com sucesso.' });
  }
});

// Rota para lidar com a inserção de dados de check-in
app.post('/salvarCheckin', (req, res) => {
  const dataPath = __dirname + '/data/';
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const filePath = dataPath + today + '_checkin.json';

  const checkinData = req.body;

  let currentData = [];
  if (fs.existsSync(filePath)) {
    currentData = JSON.parse(fs.readFileSync(filePath));
  }
  currentData.push(checkinData);
  fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));
  res.json({ message: 'Check-in realizado com sucesso.' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
