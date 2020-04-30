"use strict";

const ids = require("../ids");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var response;
        if (m.author.id === ids.users.chocola) {
            response = ":ok_hand:";
        }
        else {
            response = "Stop Whining";
        }
        bot.createMessage(m.channel.id, response);
    },
    help: "No"
};
