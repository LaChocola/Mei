"use strict";

const aesthetics = require("aesthetics");
const Eris = require("eris");

async function main(m, args) {
    var msg = m.fullArgs;

    if (!msg) {
        return "You need to add something to say";
    }

    var text = aesthetics(msg);
    var embed = "**" + text + "**";
    return {
        embed: {
            color: 0xA260F6,
            description: embed
        }
    };
}

module.exports = new Eris.Command("aesthetics", main, {
    description: "Vaporwave Text"
});

