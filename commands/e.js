"use strict";

const request = require("request-promise");
const unidecode = require("unidecode");

module.exports = {
    main: async function(Bot, m, args, prefix) {
        if (m.content === `${prefix}e`) {
            Bot.createMessage(m.channel.id, "Please add something i.e. ``!e Whats cooler than being cool``");
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

        Bot.createMessage(m.channel.id, emojis);
    },
    help: "Emojify text"
};
