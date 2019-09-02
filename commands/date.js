"use strict";

// TODO: Replace this with moment
const moment = require("moment");
const escapeStringRegexp = require("escape-string-regexp");

const utils = require("../utils");

function getArgs(msg, cmd, prefix) {
    var commandRegex = RegExp(`^${escapeStringRegexp(prefix)}${escapeStringRegexp(cmd)}`, "i");
    var commandArgs = msg.replace(commandRegex, "").trim();
    return commandArgs;
}

function getTagged(args) {
    var tagMatch = args.match(/<@(.*)>/);
    var taggedId = tagMatch && utils.isNum(tagMatch[0]) && tagMatch[0];
    return taggedId;
}

module.exports = {
    main: function(bot, m, args, prefix) {
        var commandArgs = getArgs(m.cleanContent, "date", prefix);

        var taggedId = getTagged(commandArgs);
        var member = m.guild.members.find(m => utils.isSameMember(m, commandArgs));
        var mentionedMember = m.mentions[0] || member || m.author;
        var mentionedId = (mentionedMember && mentionedMember.id) || taggedId;

        member = m.channel.guild.members.get(mentionedId);

        if (!member) {
            m.reply("I could not find that member or id in this server", 5000);
            m.deleteIn(5000);
            return;
        }

        var joinedDate = moment(member.joinedAt);
        var createdDate = moment(member.createdAt);
        var name = member.nick || member.username;
        var joinedString = joinedDate.format("ddd MMM DD YYYY");
        var createdString = createdDate.format("ddd MMM DD YYYY");
        var sinceJoined = joinedDate.fromNow();
        var sinceCreated = createdDate.fromNow();
        var daysBeforeJoining = joinedDate.diff(createdDate, "days");
        m.reply("**" + name + "**\nJoined: " + joinedString + " | " + sinceJoined + "\nCreated: " + createdString + " | " + sinceCreated);
        if (daysBeforeJoining < 1) {
            m.reply(":warning: **" + name + "** Joined less than 24 hours after creating account");
        }
    },
    help: "Date a user joined the server"
};
