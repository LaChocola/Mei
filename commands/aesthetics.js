"use strict";

const aesthetics = require("aesthetics");

module.exports = {
    main: async function(bot, m, args, prefix) {
        var msg = m.cleanContent.replace(`${prefix}aesthetics `, "").trim();
        if (msg.length === 0) {
            m.reply("You need to add something to say");
            return;
        }
        var text = aesthetics(msg);
        var embed = "**" + text + "**";
        m.reply({
            embed: {
                color: 0xA260F6,
                description: embed
            }
        });
    },
    help: "Vaporwave Text"
};
