"use strict";

const Haikudos = require("haikudos");

// Wrap Haikudo's callback in a promise
async function HaikudosPromise() {
    return new Promise(function(resolve, reject) {
        Haikudos(function(haiku) {
            resolve(haiku);
        });
    });
}

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var haiku = await HaikudosPromise();
        bot.createMessage(m.channel.id, {
            embed: {
                color: 0xA260F6,
                description: haiku
            }
        });
    },
    help: "Random Haiku's"
};
