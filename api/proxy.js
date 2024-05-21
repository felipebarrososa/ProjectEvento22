const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const API_URL = 'https://sa-east-1.aws.data.mongodb-api.com/app/data-oomgips/endpoint/data/v1/action/insertOne';
    const API_KEY = 'SrWyoUgVrJtOD6MFft5M7QPh1NmquKxFbm8KkhrP9PTl3MOo4vhQOmWE48j75eYP';

    if (req.method === 'POST') {
        const body = req.body;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': API_KEY
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
