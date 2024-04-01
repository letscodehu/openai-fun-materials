const OpenAI = require("openai");
const search = require("./search")
require("dotenv").config()
const openai = new OpenAI();

const question = process.argv[2] || "What is your name"

async function main() {
    const content = await search(question)
    console.log(content)
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

main()
