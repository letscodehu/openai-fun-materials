const OpenAI = require("openai")
require("dotenv").config()
const openai = new OpenAI()

async function main() {
    const embeddings = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: ["Kutya", "macska"],
        encoding_format: "float"
    })
    console.log(embeddings.data)
}
main()
