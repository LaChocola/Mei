"use strict";

const timeago = require("timeago.js");

module.exports = {
    main: async function (Bot, m, args, prefix) {
        var name1 = m.cleanContent.replace(prefix, "").replace(/date/i, "").trim();
        function isThisUsernameThatUsername(member) {
            var memberName = member.nick || member.username;
            if (memberName.toLowerCase() === name1.toLowerCase()) {
                return true;
            }
        }

        var member = m.guild.members.find(isThisUsernameThatUsername);
        var mentioned = m.mentions[0] || member;
        var id = undefined;
        if (mentioned) {
            id = mentioned.id;
        }
        var args2 = m.content.replace(prefix, "").replace("date", "").replace("<@", "").replace(">", "").trim();
        if (!id) {
            if (!isNaN(+args2) && +args2.length > 1) {
                id = args2;
            }
            if (args2.length < 1) {
                id = m.author.id;
            }
        }
        if (!mentioned && id) {
            mentioned = await m.channel.guild.members.get(id);
        }
        if (!mentioned && +args2.length > 1) {
            Bot.createMessage(m.channel.id, "I could not find that member or id in this server").then((msg) => {
                return setTimeout(function () {
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                }, 5000);
            });
            return;
        }
        if (!mentioned.joinedAt) {
            mentioned = await m.channel.guild.members.get(id);
        }
        var date = mentioned.joinedAt;
        var date2 = mentioned.createdAt;
        var name = mentioned.nick || mentioned.username;
        var length = new Date(date).toDateString();
        var length2 = new Date(date2).toDateString();
        var ago = timeago.format(date);
        var ago2 = timeago.format(date2);
        var diff = date - date2;
        Bot.createMessage(m.channel.id, "**" + name + "**\nJoined: " + length + " | " + ago + "\nCreated: " + length2 + " | " + ago2);

        if (diff < 86400000) {
            Bot.createMessage(m.channel.id, ":warning: **" + name + "** Joined less than 24 hours after creating account");
        }
    },
    help: "Date a user joined the server"
};
