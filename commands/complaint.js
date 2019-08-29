"use strict";

const conf = require("../conf");

module.exports = {
    main: function(Bot, m, args, prefix) {
        if (m.author.id === conf.chocolaId) {
            Bot.createMessage(m.channel.id, ":ok_hand:");
        }
        else {
            Bot.createMessage(m.channel.id, "Stop Whining");
        }
    },
    help: "No"
};
