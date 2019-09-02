"use strict";

// colors module extends string prototype
const colors = require("colors");  // eslint-disable-line no-unused-vars

module.exports = {
    main: function(bot, m, config) {
        bot.editStatus("Online", {
            name: "with Tinies"
        });
        var i = 0;
        bot.guilds.map(g => g.channels.size).forEach(c => {
            i += c;
        });
        console.log("");
        console.log("BOT".bgMagenta.yellow.bold + " Logged in as " + `${bot.user.username}#${bot.user.discriminator}`.cyan.bold);
        console.log("");
        console.log("INF".bgBlue.magenta + " Currently seeing: " + `${bot.guilds.size}`.green.bold + " guilds");
        console.log("INF".bgBlue.magenta + " Currently seeing: " + `${i}`.green.bold + " channels");
        console.log("INF".bgBlue.magenta + " Currently seeing: " + `${bot.users.size}`.green.bold + " users");
        console.log("");
    }
};
