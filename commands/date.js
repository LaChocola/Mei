var timeago = require("timeago.js");
var timediff = require('timediff');
module.exports = {
    main: function(Bot, m, args, prefix) {
        var number = m.author.id
        if (m.mentions.length > 0) {
            var number = m.mentions[0].id
        }
        var guild = m.channel.guild
        var member = guild.members.get(number);
        var date = member.joinedAt;
        var date2 = member.createdAt;
        var name = member.nick || member.username
        var length = new Date(date).toDateString();
        var length2 = new Date(date2).toDateString();
        var ago = timeago().format(date);
        var ago2 = timeago().format(date2);
        var diff = timediff(date2, date, "D")
        console.log(diff.days);
        Bot.createMessage(m.channel.id, "**" + name + "**\nJoined: " + length + " | " + ago + "\nCreated: " + length2 + " | " + ago2)
        if (diff.days < 2) {
            Bot.createMessage(m.channel.id, ":warning: **" + name + "** Joined less than 24 hours after creating account");
        }
    },
    help: "Date a user joined the server"
}
