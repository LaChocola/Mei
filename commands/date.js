var timeago = require("timeago.js");

module.exports = {
    main: function(Bot, m, args) {
        var number = m.mentions[0].id || m.author.id
        var guild = m.channel.guild
        var member = guild.members.get(number);
        var date = member.joinedAt;
        var name = member.nick || member.username
        var length = new Date(date).toDateString();
        var ago = timeago().format(date);
        Bot.createMessage(m.channel.id, "**" + name + "** Joined:\n" + length + " | " + ago)
    },
    help: "Date a user joined the server"
}