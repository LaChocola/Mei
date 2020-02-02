"use strict";

const misc = require("../misc");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        if (m.content === `${prefix}spray` || !m.mentions[0]) {
            Bot.createMessage(m.channel.id, "Please add someone to spray. i.e. ``" + prefix + "spray @Chocola``");
        }
        else {
            var message1 = [", and only made them wetter.", ", causing them to melt.", ", and only managed to iritate them.", ", it wasn't very effective.", ", I don't know why tho."];
            var message = misc.choose(message1);
            if (m.author.id === m.mentions[0].id) {
                var message2 = [", that's kinda weird.", ", maybe that's a fetish thing?", ", what a weirdo.", ", I guess everyone likes something.", ", I don't know why tho."];
                var messagefinal = misc.choose(message2);
                Bot.createMessage(m.channel.id, ":sweat_drops: " + m.author.username + " sprayed " + m.mentions[0].username + messagefinal);
            }
            else {
                Bot.createMessage(m.channel.id, ":sweat_drops: " + m.author.username + " sprayed " + m.mentions[0].username + message);
            }
        }
    },
    help: "Spray"
};
