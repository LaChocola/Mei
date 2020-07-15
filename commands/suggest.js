"use strict";

const ids = require("../ids");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var msg = m.cleanContent.replace(`${prefix}suggest `, "");
        msg = msg.trim()
            .replace(/\bXXX\b/ig, "[name]")
            .replace(/"/ig, "\"")
            .replace(/\b“\b/ig, "\"")
            .replace(/\b”\b/ig, "\"")
            .replace(/\b""\b/ig, "\"")
            .replace(/"/ig, "''")
            .replace("  ", " ")
            .replace(/\bfeet\b/ig, "[feet]")
            .replace("`", "'");
        var person = m.author;
        if (m.content === `${prefix}suggest`) {
            m.reply("Please add your suggestion. i.e. ``" + prefix + "suggest 'You were smushed by XXX when she forgot to check her seat before sitting down'``, but maybe not that short :P", 30000, true);
        }
        else if (msg.length < 175 && m.content.toLowerCase().includes("response")) {
            m.reply("Sorry, but that message is too short to be a reply. Please add some more length or detail, and try again.", 10000);
        }
        else {
            bot.createMessage(ids.channels.suggestions, {
                embed: {
                    color: 0x5A459C,
                    description: msg,
                    footer: {
                        text: `A new suggestion from: ${person.username} (${person.id}) in the Guild: ${m.guild.name}`
                    }
                }
            });
            var hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"];
            var hand = hands[Math.floor(Math.random() * hands.length)];
            m.reply("Suggestion: ``" + msg + "`` Sent to Chocola " + hand, 10000, true);
        }
    },
    help: "Suggest something"
};
