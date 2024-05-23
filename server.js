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
        console.log('Recebido novo cadastro:', req.body);
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
        console.log('Recebido novo check-in:', req.body);
        const novoCheckin = new Checkin(req.body);
        await novoCheckin.save();
        res.json({ message: 'Check-in realizado com sucesso.' });
    } catch (err) {
        console.error('Erro ao salvar o check-in:', err);
        res.status(500).json({ message: 'Erro ao salvar o check-in', error: err.message });
    }
});


app.post('/api/proxy', async (req, res) => {
    try {
        const response = await fetch('https://sa-east-1.aws.data.mongodb-api.com/app/data-oomgips/endpoint/data/v1/action/insertOne', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.MONGODB_API_KEY // Coloque sua chave de API aqui
            },
            body: JSON.stringify({
                collection: 'cadastros', // Substitua com o nome da sua coleção
                database: 'test', // Substitua com o nome do seu banco de dados
                dataSource: 'Cluster0', // Substitua com o nome do seu cluster
                document: req.body
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Failed to insert document: ${data.message}`);
        }

        res.status(response.status).json(data);
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
        res.status(500).json({ message: 'Erro ao enviar os dados', error: error.message });
    }
});
// Middleware para tratar 404
app.use((req, res, next) => {
    res.status(404).json({ message: 'Página não encontrada' });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});