module.exports = {
    main: function(Bot, m, args) {
        var name1 = m.cleanContent.replace("!avy ", "");
        var isThisUsernameThatUsername = function(member) {
            var memberName = member.nick || member.username
            if (memberName.toLowerCase() == name1.toLowerCase()) {
                return true;
            }
        }
        var member = m.guild.members.find(isThisUsernameThatUsername)
        var mentioned = m.mentions[0] || member || m.author
        var avy = m.channel.guild.members.get(mentioned.id).avatarURL || mentioned.avatarURL
        avy = avy.replace(/\.gif\?size=[0-9]+/ig, ".gif").replace(".jpg?size=128", ".webp?size=1024")
        Bot.createMessage(m.channel.id, avy);
    },
    help: "Avatars"
}
