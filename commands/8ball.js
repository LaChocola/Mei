"use strict";

const eightball = require("8ball");

module.exports = {
    main: function(bot, m, args, prefix) {
        var msg = m.cleanContent.replace(`${prefix}8ball `, "");
        if (m.content === `${prefix}8ball`) {
            m.reply("Please add something");
        }
        else {
            m.reply(`***${msg}***\n`
                + `:8ball: ${eightball()}`);
        }
    },
    help: "8ball"
};
