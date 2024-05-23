const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/api/proxy', async (req, res) => {
    const config = {
        method: 'post',
        url: 'https://sa-east-1.aws.data.mongodb-api.com/app/data-oomgips/endpoint/data/v1/action/insertOne',
        headers: {
            'Content-Type': 'application/json',
            'api-key': 'SrWyoUgVrJtOD6MFft5M7QPh1NmquKxFbm8KkhrP9PTl3MOo4vhQOmWE48j75eYP'
        },
        data: {
            collection: 'cadastro',
            database: 'test',
            dataSource: 'Cluster0',
            document: req.body
        }
    };

    try {
        const response = await axios(config);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao salvar o cadastro', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
