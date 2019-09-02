"use strict";

const request = require("request");
const esc = require("unidecode");

module.exports = {
    main: function(bot, m, args, prefix) {
        var word = m.content.replace(`${prefix}urban `, "");
        var urbanJsonURL = "http://api.urbandictionary.com/v0/define?term=" + esc(word);
        request.get({
            url: urbanJsonURL,
            json: true
        }, function(e, r, b) {
            if (!e && b.list[0] !== undefined) {
                var message = [
                    "```" + b.list[0].definition + "```",
                    "Example: " + b.list[0].example,
                    "<" + b.list[0].permalink + ">"
                ].join("\n");
                if (message.length > 2000) {
                    m.reply(`Sorry, the definition of **${b.list[0].word}** is too long to post.`);
                    return;
                }
                m.reply({
                    content: `Urban Dictionary definition of **${b.list[0].word}**:\n`,
                    embed: {
                        color: 0xA260F6,
                        description: message
                    }
                });
            }
            else {
                m.reply("Not found");
            }
        });
    },
    help: "Search Urban Dictionary"
};
