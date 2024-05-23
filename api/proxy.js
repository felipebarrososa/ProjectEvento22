const { Client } = require('pg');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { nome, email, whatsapp, cidade, estado } = req.body;

    const client = new Client({
        connectionString: process.env.POSTGRES_CONNECTION_STRING
    });

    try {
        await client.connect();

        const query = 'INSERT INTO cadastros(nome, email, whatsapp, cidade, estado) VALUES($1, $2, $3, $4, $5) RETURNING *';
        const values = [nome, email, whatsapp, cidade, estado];
        
        const result = await client.query(query, values);

        await client.end();

        res.status(200).json({ message: 'Cadastro realizado com sucesso.', data: result.rows[0] });
    } catch (error) {
        console.error('Erro ao salvar o cadastro:', error);
        res.status(500).json({ message: 'Erro ao salvar o cadastro', error: error.message });
    }
};
