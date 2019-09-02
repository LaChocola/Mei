"use strict";

const conf = require("../conf");
const utils = require("../utils");
const dbs = require("../dbs");

var globalData = dbs.global.load();

module.exports = {
    main: async function(Bot, m, args, prefix) {
        if (m.author.id !== conf.users.owner) {
            return;
        }
        var name1 = m.cleanContent.replace(`${prefix}ignore`, "").replace(/\bundo\b/, "").trim().split(" | ");
        var member = m.guild.members.find(m => utils.isSameMember(m, name1[0]) || utils.isSameMember(m, name1[1]));
        var mentioned = m.mentions[0] || member;
        var id;
        var name;
        if (mentioned) {
            id = mentioned.id;
            name = mentioned.username;
        }
        var args2 = m.cleanContent.replace(`${prefix}ignore`, "").replace(/\bundo\b/, "").replace("<@", "").replace(">", "").trim().split(" | ");
        if (!id) {
            if (utils.isNum(args2[0])) {
                id = args2[0];
            }
        }
        if (args2[1]) {
            if (utils.isNum(args2[1])) {
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
            if (!globalData.banned.global[id]) {
                Bot.createMessage(m.channel.id, `The ID "${id}" was not found in the list of ignored users. Nothing to undo.`).then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    }, 5000);
                });
                return;
            }
            if (globalData.banned.global[id]) {
                delete globalData.banned.global[id];
                dbs.global.save(globalData);
                Bot.createMessage(m.channel.id, `Welcome back, ${name} (${id}) ${utils.hands.ok()}`).then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    }, 5000);
                });
            }
            return;
        }
        if (id) {
            if (globalData.banned.global[id]) {
                Bot.createMessage(m.channel.id, `${name} (${id}) is already in the ignored users list. Nothing to add.`).then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    }, 5000);
                });
                return;
            }
            if (!reason) {
                globalData.banned.global[id] = "No Reason specified";
            }
            if (reason) {
                globalData.banned.global[id] = reason;
            }
        }
        console.log(id, reason, globalData.banned.global);

        dbs.global.save(globalData);
        Bot.createMessage(m.channel.id, `Goodbye, ${name} (${id}) ${utils.hands.ok()}`).then((msg) => {
            return setTimeout(function() {
                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
            }, 5000);
        });
    },
    help: "No",
    hidden: true
};
