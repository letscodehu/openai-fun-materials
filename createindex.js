const lunr = require("lunr")
const fs = require("fs")
const rawContent = fs.readFileSync("content.txt").toString().split("\n").filter(s => s != "")

const content = rawContent.map((c, i) => { return { id: i, "content": c } })
const idx = lunr(function() {
    this.ref("id")
    this.field("content")
    content.forEach((doc) => {
        this.add(doc)
    }, this)
})
fs.writeFileSync("index.json", JSON.stringify(idx))
