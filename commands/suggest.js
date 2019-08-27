"use strict";

module.exports = {
    main: function(Bot, m, args, prefix) {
        var msg = m.cleanContent.replace(`${prefix}suggest `, "");
        var msg = msg.trim().replace(/\bXXX\b/ig, "[name]").replace(/"/ig, "\"").replace(/\b“\b/ig, "\"").replace(/\b”\b/ig, "\"").replace(/\b""\b/ig, "\"").replace(/"/ig, "''").replace("  ", " ");
        var msg = msg.replace(/\bfeet\b/ig, "[feet]").replace("`", "'");
        var person = m.author;
        if (m.content == `${prefix}suggest`) {
            Bot.createMessage(m.channel.id, "Please add your suggestion. i.e. ``!suggest 'You were smushed by XXX when she forgot to check her seat before sitting down'``, but maybe not that short :P").then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                }, 5000);
            });
        }
        if (msg.length < 175 && m.content.toLowerCase().includes("response")) {
            Bot.createMessage(m.channel.id, "Sorry, but that message is too short to be a reply. Please add some more length or detail, and try again.").then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                }, 5000);
            });
            return;
        }
        else {
            Bot.createMessage("446548104704032768", {
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
            Bot.createMessage(m.channel.id, "Suggestion: ``" + msg + "`` Sent to Chocola " + hand).then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                }, 5000);
            });
        }
    },
    help: "Suggest something"
};
