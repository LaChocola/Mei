"use strict";

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var time = process.hrtime();
        var msg = await bot.createMessage(m.channel.id, "Pinging!");
        var ms = Math.round(process.hrtime(time)[1] / 1000000);
        await msg.edit("Pong! `" + ms + "ms`");
    },
    help: "Bot Delay"
};
