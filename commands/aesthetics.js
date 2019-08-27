"use strict";

const aesthetics = require("aesthetics");

module.exports = {
    main: function(Bot, m, args, prefix) {
        var msg = m.cleanContent.replace(`${prefix}aesthetics `, "");
        if (m.content == `${prefix}aesthetics`) {
            var msg = "You need to add something to say";
        }
        var text = aesthetics(msg);
        var embed = "**" + text + "**";
        Bot.createMessage(m.channel.id, {
            embed: {
                color: 0xA260F6,
                description: embed
            }
        });
        return;
    },
    help: "Vaporwave Text"
};
