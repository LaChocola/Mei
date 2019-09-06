"use strict";

module.exports = {
    main: async function(bot, m, args, prefix) {
        var prettyMs = require("pretty-ms");
        var prettyUptime = prettyMs(bot.uptime, {
            verbose: true
        });
        m.reply("I have been running for:\n:alarm_clock: " + prettyUptime + " :alarm_clock:");
    },
    help: "Uptime"
};
