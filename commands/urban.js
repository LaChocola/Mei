"use strict";

const request = require("request-promise");
const esc = require("unidecode");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var word = m.content.replace(`${prefix}urban`, "").trim();
        if (!word) {
            m.reply(`${this.help}\nAdd a term to search on Urban Dictionary. \`${prefix}urban <term>\`. Ex: \`${prefix}search discord\``, 10000);
            return;
        }
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
            bot.createMessage(m.channel.id, "Not found");
            return;
        }

        var message =
            "```" + result.definition + "```\n" +
            "Example: " + result.example + "\n" +
            "<" + result.permalink + ">";

        if (message.length > 2000) {
            bot.createMessage(m.channel.id, `Sorry, the definition of **${result.word}** is too long to post.`);
            return;
        }

        bot.createMessage(m.channel.id, {
            content: `Urban Dictionary definition of **${result.word}**:\n`,
            embed: {
                color: 0xA260F6,
                description: message
            }
        });
    },
    help: "Search Urban Dictionary"
};
