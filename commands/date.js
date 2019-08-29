"use strict";

// TODO: Replace this with moment
const timeago = require("timeago.js");
const timediff = require("timediff");

const utils = require("../utils");

module.exports = {
    main: function(Bot, m, args, prefix) {
        var name1 = m.cleanContent.replace(/!date /i, "");

        var member = m.guild.members.find(m => utils.isSameMember(m, name1));
        var mentioned = m.mentions[0] || member || m.author;
        var id = undefined;
        var name = undefined;
        if (mentioned) {
            id = mentioned.id;
            name = mentioned.username;
        }
        if (!id) {
            var args2 = m.cleanContent.replace("!date ", "").replace("<@", "").replace(">", "").trim();
            if (!isNaN(+args2)) {
                id = args2;
            }
        }

        mentioned = m.guild.members.find(m => utils.isSameMember(m, name1));
        member = m.mentions[0] || mentioned || m.author;
        args2 = m.content.replace("!date ", "").replace("<@", "").replace(">", "").trim();
        if (args2.length > 1) {
            id = args2;
        }
        if (id != undefined) {
            member = m.channel.guild.members.get(id);
        }
        else if (!id) {
            member = m.channel.guild.members.get(member.id);
        }
        if (!member) {
            Bot.createMessage(m.channel.id, "I could not find that member or id in this server").then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                }, 5000);
            });
            return;
        }
        var date = member.joinedAt;
        var date2 = member.createdAt;
        name = member.nick || member.username;
        var length = new Date(date).toDateString();
        var length2 = new Date(date2).toDateString();
        var ago = timeago.format(date);
        var ago2 = timeago.format(date2);
        var diff = timediff(date2, date, "D");
        Bot.createMessage(m.channel.id, "**" + name + "**\nJoined: " + length + " | " + ago + "\nCreated: " + length2 + " | " + ago2);
        if (diff.days < 2) {
            Bot.createMessage(m.channel.id, ":warning: **" + name + "** Joined less than 24 hours after creating account");
        }
    },
    help: "Date a user joined the server"
};
