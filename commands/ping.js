"use strict";

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var time = process.hrtime();
        bot.createMessage(m.channel.id, "Pinging!").then(function(msg) {
            var ms = Math.round(process.hrtime(time)[1] / 1000000);
            bot.editMessage(msg.channel.id, msg.id, "Pong! `" + ms + "ms`");
        });
    },
    help: "Bot Delay"
};
