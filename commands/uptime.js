"use strict";

const prettyMs = require("pretty-ms");

module.exports = {
    main: async function (Bot, m, args, prefix) {
        var prettyUptime = prettyMs(Bot.uptime, {
            verbose: true
        });
        Bot.createMessage(m.channel.id, "I have been running for:\n:alarm_clock: " + prettyUptime + " :alarm_clock:");
    },
    help: "Uptime"
};
