const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/api/proxy', async (req, res) => {
    try {
        const response = await axios.post('https://sa-east-1.aws.data.mongodb-api.com/app/data-oomgips/endpoint/data/v1/action/insertOne', {
            collection: 'cadastro',
            database: 'test',
            dataSource: 'Cluster0',
            document: req.body
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': 'SrWyoUgVrJtOD6MFft5M7QPh1NmquKxFbm8KkhrP9PTl3MOo4vhQOmWE48j75eYP'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao salvar no MongoDB:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Erro ao salvar o cadastro', error: error.message });
    }
});


module.exports = app;
