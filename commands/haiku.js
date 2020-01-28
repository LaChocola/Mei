"use strict";

const Haikudos = require("haikudos");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        Haikudos(function(haiku) {
            Bot.createMessage(m.channel.id, {
                embed: {
                    color: 0xA260F6,
                    description: haiku
                }
            });
        });
    },
    help: "Random Haiku's"
};
