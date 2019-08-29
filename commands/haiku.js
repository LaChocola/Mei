"use strict";

const Haikudos = require("haikudos");

module.exports = {
    main: function(Bot, m, args, prefix) {
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
