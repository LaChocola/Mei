"use strict";

const eightball = require("8ball")();

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var msg = m.cleanContent.slice(`${prefix}8ball`.length).trim();
        if (msg === "") {
            await m.reply("Please add something");
            return;
        }

        await m.reply(`***${msg}***\n:8ball: ${eightball}`);
    },
    help: "8ball"
};
