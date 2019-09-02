"use strict";

module.exports = {
    main: function(bot, m, args, prefix) {
        var time = process.hrtime();
        m.reply("Pong!").then(msg => {
            var ms = Math.round(process.hrtime(time)[1] / 1000000);
            m.edit("Pong! `" + ms + "ms`");
        });
    },
    help: "Bot Delay"
};
