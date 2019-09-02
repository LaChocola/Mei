"use strict";

const conf = require("../conf");

module.exports = {
    main: function(bot, m, args, prefix) {
        if (m.author.id === conf.users.owner) {
            m.reply(":ok_hand:");
        }
        else {
            m.reply("Stop Whining");
        }
    },
    help: "No"
};
