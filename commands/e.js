"use strict";

const request = require("request-promise");
const unidecode = require("unidecode");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        bot.createMessage(m.channel.id, "Sorry. This command is currently unavailable. The api used to make this command possible is no longer available. Sorry for any inconvenience.");
        return;
        /*
        if (m.content === `${prefix}e`) {
            bot.createMessage(m.channel.id, "Please add something i.e. ``" + prefix+ "e Whats cooler than being cool``");
            return;
        }
        args = unidecode(args);
        var base = "http://emoji.getdango.com/api/emoji?q=";
        var query = args.replace(/ /g, "+");
        var data = await request({
            url: base + query,
            json: true
        });

        var emojis = data.results
            .slice(0, 5)
            .map(r => r.text)
            .join(" ");

        bot.createMessage(m.channel.id, emojis);
        */
    },
    help: "Emojify text",
    hidden: true
};
