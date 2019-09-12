"use strict";

module.exports = {
    main: async function(bot, m, args, prefix) {
        if (m.content == `${prefix}spray` || !m.mentions[0]) {
            m.reply("Please add someone to spray. i.e. ``!spray @Chocola``");
        }
        else {
            var message1 = [", and only made them wetter.", ", causing them to melt.", ", and only managed to iritate them.", ", it wasn't very effective.", ", I don't know why tho."];
            var message = message1[Math.floor(Math.random() * message1.length)];
            if (m.author.id == m.mentions[0].id) {
                var message2 = [", thats kinda weird.", ", maybe thats a fetish thing?", ", what a weirdo.", ", I guess everyone likes something.", ", I don't know why tho."];
                var messagefinal = message2[Math.floor(Math.random() * message1.length)];
                m.reply(":sweat_drops: " + m.author.username + " sprayed " + m.mentions[0].username + messagefinal);
            }
            else {
                m.reply(":sweat_drops: " + m.author.username + " sprayed " + m.mentions[0].username + message);
            }
        }
    },
    help: "Spray"
};
