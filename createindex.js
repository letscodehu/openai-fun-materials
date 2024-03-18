const fs = require("fs")
require("dotenv").config()

const OpenAI = require('openai')
const pg = require('pg');
const pgvector = require('pgvector/pg');

async function index() {
    const client = new pg.Client({ database: 'postgres', password: 'example', user: 'postgres' });
    await client.connect();

    await client.query('CREATE EXTENSION IF NOT EXISTS vector');
    await pgvector.registerType(client);

    await client.query('DROP TABLE IF EXISTS documents');
    await client.query('CREATE TABLE documents (id bigserial PRIMARY KEY, content text, embedding vector(1536))');

    const input = fs.readFileSync("content.txt").toString().split("\n").filter(s => s != "")

    const openai = new OpenAI();
    const response = await openai.embeddings.create({ input: input, model: 'text-embedding-3-small' });
    const embeddings = response.data.map((v) => v.embedding);

    for (let [i, content] of input.entries()) {
        await client.query('INSERT INTO documents (content, embedding) VALUES ($1, $2)', [content, pgvector.toSql(embeddings[i])]);
    }
}

index()
