"use strict";

const ids = require("../ids");

module.exports = {
    main: async function(Bot, m, args, prefix) {
        var response;
        if (m.author.id === ids.users.chocola) {
            response = ":ok_hand:";
        }
        else {
            response = "Stop Whining";
        }
        Bot.createMessage(m.channel.id, response);
    },
    help: "No"
};
