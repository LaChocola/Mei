"use strict";

const conf = require("../conf");
const app = require("apiai")(conf.tokens.apiai);

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var msg = m.cleanContent.replace(`${prefix}c `, "");
        if (m.content === `${prefix}c`) {
            bot.createMessage(m.channel.id, "Please add something i.e. ``" + prefix + "c How are you?``");
        }
        else {
            var request = app.textRequest(msg, {
                sessionId: "discordMei"
            });
            request.on("response", function(response) {
                let responseText = response.result.fulfillment.speech;
                bot.createMessage(m.channel.id, responseText);
            });

            request.on("error", function(error) {
                console.log(error);
                bot.createMessage(m.channel.id, error);
            });
            request.end();
        }
    },
    help: "Let's talk~"
};
