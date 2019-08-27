"use strict";

var _ = require("../data.js");

var data = _.load();

const isSameMember = require("./utils/isSameMember");

module.exports = {
    main: async function(Bot, m, args, prefix) {
        if (m.author.id !== "161027274764713984") {
            return;
        }
        var hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"];
        var hand = hands[Math.floor(Math.random() * hands.length)];
        var name1 = m.cleanContent.replace(`${prefix}ignore`, "").replace(/\bundo\b/, "").trim().split(" | ");
        var member = m.guild.members.find(m => isSameMember(m, name1[0]) || isSameMember(m, name1[1]));
        var mentioned = m.mentions[0] || member;
        var id;
        var name;
        if (mentioned) {
            id = mentioned.id;
            name = mentioned.username;
        }
        var args2 = m.cleanContent.replace(`${prefix}ignore`, "").replace(/\bundo\b/, "").replace("<@", "").replace(">", "").trim().split(" | ");
        if (!id) {
            if (!isNaN(Number(args2[0]))) {
                id = args2[0];
            }
        }
        if (args2[1]) {
            if (!isNaN(Number(args2[1]))) {
                id = args2[1];
                return;
            }
            var reason = args2[1].trim();
        }
        if (!name) {
            var user = await Bot.users.get(id);
            if (!user || !user.username) {
                name = "Unknown User";
                return;
            }
            name = user.username;
        }
        var discrim = await Bot.users.get(id).discriminator;
        if (discrim) {
            name = `${name}#${discrim}`;
        }
        if (!id) {
            Bot.createMessage(m.channel.id, "User or User ID not found. Please enter a user or user id, and try again").then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                }, 2500);
            });
        }
        args = args.split(" ");
        if (args.indexOf("undo") > -1) {
            if (!data.banned.global[id]) {
                Bot.createMessage(m.channel.id, `The ID "${id}" was not found in the list of ignored users. Nothing to undo.`).then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    }, 5000);
                });
                return;
            }
            if (data.banned.global[id]) {
                delete data.banned.global[id];
                _.save(data);
                Bot.createMessage(m.channel.id, `Welcome back, ${name} (${id}) ${hand}`).then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    }, 5000);
                });
            }
            return;
        }
        if (id) {
            if (data.banned.global[id]) {
                Bot.createMessage(m.channel.id, `${name} (${id}) is already in the ignored users list. Nothing to add.`).then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    }, 5000);
                });
                return;
            }
            if (!reason) {
                data.banned.global[id] = "No Reason specified";
            }
            if (reason) {
                data.banned.global[id] = reason;
            }
        }
        console.log(id, reason, data.banned.global);

        _.save(data);
        Bot.createMessage(m.channel.id, `Goodbye, ${name} (${id}) ${hand}`).then((msg) => {
            return setTimeout(function() {
                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
            }, 5000);
        });
    },
    help: "No",
    hidden: true
};
