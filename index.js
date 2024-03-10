const OpenAI = require("openai");
const lunr = require("lunr")
const fs = require("fs")
require("dotenv").config()
const openai = new OpenAI();

const rawContent = fs.readFileSync("content.txt").toString().split("\n").filter(s => s != "")
const question = process.argv[2] || "What is your name"

async function main() {
    const content = search(question)
    const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        stream: true,
        messages: [
            {
                "role": "system",
                "content": "Use only this to answer:" + content
            },
            {
                "role": "user",
                "content": question
            }
        ],

    })
    for await (const part of stream) {
        process.stdout.write(part.choices[0]?.delta?.content || '');
    }
}

function search(term) {
    const idx = lunr.Index.load(JSON.parse(fs.readFileSync("index.json")))
    const result = idx.search(term)
    console.log(result)
    return rawContent[parseInt(result[0].ref)]
}

main()
