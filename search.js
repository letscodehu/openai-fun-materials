require("dotenv").config()

const OpenAI = require('openai')
const pg = require('pg');
const pgvector = require('pgvector/pg');

async function search(term) {
    const client = new pg.Client({ database: 'postgres', password: 'example', user: 'postgres' });
    await client.connect();

    await pgvector.registerType(client);

    const openai = new OpenAI();
    const response = await openai.embeddings.create({ input: term, model: 'text-embedding-3-small' });
    const embedding = response.data[0].embedding;

    const result = await client.query('SELECT content FROM documents ORDER BY embedding <-> $1 LIMIT 1', [pgvector.toSql(embedding)]);
    client.end()
    return result.rows[0].content
}
module.exports = search
