"use strict";

require("colors");

module.exports = {
    main: function(Bot, m, config) {
        Bot.editStatus('Online', {
            name: "with Tinies"
        })
        var i = 0;
        Bot.guilds.map(g => g.channels.size).forEach(c => {
            i += c;
        });
        console.log('');
        console.log("BOT".bgMagenta.yellow.bold + " Logged in as " + `${Bot.user.username}#${Bot.user.discriminator}`.cyan.bold);
        console.log('');
        console.log("INF".bgBlue.magenta + " Currently seeing: " + `${Bot.guilds.size}`.green.bold + " guilds");
        console.log("INF".bgBlue.magenta + " Currently seeing: " + `${i}`.green.bold + " channels");
        console.log("INF".bgBlue.magenta + " Currently seeing: " + `${Bot.users.size}`.green.bold + " users");
        console.log('');
    }
};
