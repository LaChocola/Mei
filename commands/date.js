var timeago = require("timeago.js");
var timediff = require('timediff');
module.exports = {
    main: function(Bot, m, args, prefix) {
        var number = m.author.id
        if (m.mentions.length > 0) {
            var number = m.mentions[0].id
        }
        var guild = m.channel.guild
        var name1 = m.cleanContent.replace(/!date /i, "")
        var isThisUsernameThatUsername = function(member) {
            var memberName = member.nick || member.username
            if (memberName.toLowerCase() == name1.toLowerCase()) {
                return true;
            }
        }
        var mentioned = m.guild.members.find(isThisUsernameThatUsername)
        var member = m.mentions[0] || mentioned || m.author
        var date = member.joinedAt;
        var date2 = member.createdAt;
        var name = member.nick || member.username
        var length = new Date(date).toDateString();
        var length2 = new Date(date2).toDateString();
        var ago = timeago().format(date);
        var ago2 = timeago().format(date2);
        var diff = timediff(date2, date, "D")
        Bot.createMessage(m.channel.id, "**" + name + "**\nJoined: " + length + " | " + ago + "\nCreated: " + length2 + " | " + ago2)
        if (diff.days < 2) {
            Bot.createMessage(m.channel.id, ":warning: **" + name + "** Joined less than 24 hours after creating account");
        }
    },
    help: "Date a user joined the server"
}
