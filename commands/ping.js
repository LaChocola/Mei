"use strict";

const Eris = require("eris");

async function main(m, args) {
    var time = process.hrtime();
    await m.reply("Pong!");
    var [secs, ns] = process.hrtime(time);
    var ms = (secs * 1000) + Math.round(ns / 1000000);
    m.edit("Pong! `" + ms + "ms`");
}

module.exports = new Eris.Command("ping", main, {
    description: "Bot Delay"
});
