"use strict";

const eightball = require("8ball");
const Eris = require("eris");

async function main(m, args) {
    var messageString = m.cleanContent.substring(m.prefix.length + m.command.label.length).trim();
    if (!messageString) {
        return "Please add something";
    }
    else {
        return `***${messageString}***\n`
            + `:8ball: ${eightball()}`;
    }
}

module.exports = new Eris.Command("8ball", main, {
    description: "8ball"
});
