const OpenAI = require("openai");
require("dotenv").config()
const openai = new OpenAI();

const question = process.argv[2] || "What is your name"
async function main() {
    const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        stream: true,
        messages: [
            {
                "role": "system",
                "content": "Your name is LetsBot, and you feel good."
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
