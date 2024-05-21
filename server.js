const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na conexão com o MongoDB:'));
db.once('open', () => {
    console.log('Conectado ao MongoDB');
});

// Esquemas e modelos do Mongoose
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

// Middlewares
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.static(__dirname));

// Rotas
app.post('/cadastro', async (req, res) => {
    try {
        const novoCadastro = new Cadastro(req.body);
        await novoCadastro.save();
        res.json({ message: 'Cadastro realizado com sucesso.' });
    } catch (err) {
        console.error('Erro ao salvar o cadastro:', err);
        res.status(500).json({ message: 'Erro ao salvar o cadastro', error: err.message });
    }
});

app.post('/salvarCheckin', async (req, res) => {
    try {
        const novoCheckin = new Checkin(req.body);
        await novoCheckin.save();
        res.json({ message: 'Check-in realizado com sucesso.' });
    } catch (err) {
        console.error('Erro ao salvar o check-in:', err);
        res.status(500).json({ message: 'Erro ao salvar o check-in', error: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
