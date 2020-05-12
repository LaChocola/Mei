"use strict";

const fs = require("fs").promises;

async function updateLewds() {
    var lewdFile = await fs.readFile("lewds.json");
    var lewds = JSON.parse(lewdFile);
    var newLewds = {};
    for (let cat in lewds) {
        newLewds[cat] = [];
        for (let subcat in lewds[cat]) {
            for (let text of lewds[cat][subcat]) {
                var story = { tags: [subcat], text: text };
                newLewds[cat].push(story);
            }
        }
    }
    await fs.writeFile("newLewds.json", JSON.stringify(newLewds, null, 4));
}

updateLewds();
