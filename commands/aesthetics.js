"use strict";

const aesthetics = require("aesthetics");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var msg = m.cleanContent.slice(`${prefix}aesthetics`.length).trim();
        if (msg === "") {
            await m.reply("You need to add something to say");
            return;
        }

        await m.reply({
            embed: {
                color: 0xA260F6,
                description: `**${aesthetics(msg)}**`
            }
        });
    },
    help: "Vaporwave Text"
};
