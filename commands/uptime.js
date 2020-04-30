"use strict";

const prettyMs = require("pretty-ms");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var prettyUptime = prettyMs(bot.uptime, {
            verbose: true
        });
        bot.createMessage(m.channel.id, "I have been running for:\n:alarm_clock: " + prettyUptime + " :alarm_clock:");
    },
    help: "Uptime"
};
