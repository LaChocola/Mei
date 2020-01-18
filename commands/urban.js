"use strict";

const request = require("request-promise");
const esc = require("unidecode");

module.exports = {
    main: async function (Bot, m, args, prefix) {
        var word = m.content.replace(`${prefix}urban `, "");
        var urbanJsonURL = "http://api.urbandictionary.com/v0/define?term=" + esc(word);

        var result;
        try {
            var body = await request({
                url: urbanJsonURL,
                json: true
            });
            result = body.list[0];
        }
        catch (err) {
            result = null;
        }

        if (!result) {
            Bot.createMessage(m.channel.id, "Not found");
            return;
        }

        var message =
            "```" + result.definition + "```\n" +
            "Example: " + result.example + "\n" +
            "<" + result.permalink + ">";

        if (message.length > 2000) {
            Bot.createMessage(m.channel.id, `Sorry, the definition of **${result.word}** is too long to post.`);
            return;
        }

        Bot.createMessage(m.channel.id, {
            content: `Urban Dictionary definition of **${result.word}**:\n`,
            embed: {
                color: 0xA260F6,
                description: message
            }
        });
    },
    help: "Search Urban Dictionary"
};
