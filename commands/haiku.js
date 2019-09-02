"use strict";

const Haikudos = require("haikudos");

module.exports = {
    main: function(bot, m, args, prefix) {
        Haikudos(function(haiku) {
            m.reply({
                embed: {
                    color: 0xA260F6,
                    description: haiku
                }
            });
        });
    },
    help: "Random Haiku's"
};
