"use strict";

const eightball = require("8ball");
const Eris = require("eris");

async function main(m, args) {
    var msg = m.fullArgs;

    if (!msg) {
        return "Please add something";
    }

    return `***${msg}***\n`
        + `:8ball: ${eightball()}`;
}

module.exports = new Eris.Command("8ball", main, {
    description: "8ball"
});
