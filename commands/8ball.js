"use strict";

const eightball = require("8ball")();

module.exports = {
    main: async function (Bot, m, args, prefix) {
        var msg = m.cleanContent.replace(`${prefix}8ball `, "");
        if (m.content === `${prefix}8ball`) {
            Bot.createMessage(m.channel.id, "Please add something");
        }
        else {
            Bot.createMessage(m.channel.id, "***" + msg + `***\n:8ball: ${eightball}`);
        }
    },
    help: "8ball"
};
