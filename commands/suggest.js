"use strict";

const conf = require("../conf");
const utils = require("../utils");

module.exports = {
    main: async function(bot, m, args, prefix) {
        var msg = m.cleanContent.replace(`${prefix}suggest `, "");
        msg = msg.trim().replace(/\bXXX\b/ig, "[name]").replace(/"/ig, "\"").replace(/\b“\b/ig, "\"").replace(/\b”\b/ig, "\"").replace(/\b""\b/ig, "\"").replace(/"/ig, "''").replace("  ", " ");
        msg = msg.replace(/\bfeet\b/ig, "[feet]").replace("`", "'");
        var person = m.author;
        if (m.content == `${prefix}suggest`) {
            m.reply("Please add your suggestion. i.e. ``!suggest 'You were smushed by XXX when she forgot to check her seat before sitting down'``, but maybe not that short :P", 5000);
            m.deleteIn(5000);
        }
        if (msg.length < 175 && m.content.toLowerCase().includes("response")) {
            m.reply("Sorry, but that message is too short to be a reply. Please add some more length or detail, and try again.", 5000);
            return;
        }
        else {
            bot.createMessage(conf.channels.channel1, {
                embed: {
                    color: 0x5A459C,
                    description: msg,
                    footer: {
                        text: `A new suggestion from: ${person.username} (${person.id}) in the Guild: ${m.guild.name}`
                    }
                }
            });
            m.reply("Suggestion: ``" + msg + "`` Sent to Chocola " + utils.hands.ok(), 5000);
            m.deleteIn(5000);
        }
    },
    help: "Suggest something"
};
