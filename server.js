const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Conectando ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'));
db.once('open', () => {
    console.log('Conectado ao MongoDB');
});

// Definindo esquema e modelo do Mongoose
const cadastroSchema = new mongoose.Schema({
    nome: String,
    email: String,
    whatsapp: String,
    cidade: String,
    estado: String,
    createdAt: { type: Date, default: Date.now }
});

const checkinSchema = new mongoose.Schema({
    nome: String,
    email: String,
    whatsapp: String,
    cidade: String,
    estado: String,
    checkinTime: { type: Date, default: Date.now }
});

const Cadastro = mongoose.model('Cadastro', cadastroSchema);
const Checkin = mongoose.model('Checkin', checkinSchema);

// Middleware para análise do corpo da solicitação JSON
app.use(bodyParser.json());

// Middleware para permitir solicitações de origens diferentes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Servir arquivos estáticos da pasta principal
app.use(express.static(__dirname));

// Rota para lidar com a inserção de dados
app.post('/cadastro', async (req, res) => {
    try {
        const novoCadastro = new Cadastro(req.body);
        await novoCadastro.save();
        res.json({ message: 'Cadastro realizado com sucesso.' });
    } catch (err) {
        console.error('Erro ao salvar o cadastro:', err);
        res.status(500).json({ message: 'Erro ao salvar o cadastro' });
    }
});

// Rota para lidar com a inserção de dados de check-in
app.post('/salvarCheckin', async (req, res) => {
    try {
        const novoCheckin = new Checkin(req.body);
        await novoCheckin.save();
        res.json({ message: 'Check-in realizado com sucesso.' });
    } catch (err) {
        console.error('Erro ao salvar o check-in:', err);
        res.status(500).json({ message: 'Erro ao salvar o check-in' });
    }
});

// Servir a página HTML principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Cadastro.html');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
