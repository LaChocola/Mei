"use strict";

const Jimp = require("jimp");

module.exports = {
    main: function(Bot, m, args, prefix) {
        var names = m.cleanContent.replace(/^[ !ship\t]+[^a-zA-Z]+|[!ship \t]+[^a-zA-Z]$|!ship/i, "").split(" | ")
        if (names[0] != undefined) {
            if (names[0].startsWith("@")) {
                names[0] = names[0].slice(1)
            }
            var name1 = names[0]
            var isThisUsernameThatUsername = function(member) {
                var memberName = member.nick || member.username
                if (memberName.toLowerCase() == name1.toLowerCase()) {
                    return true;
                }
            }
            var member = m.guild.members.find(isThisUsernameThatUsername)

            if (member != undefined) {
                if (m.mentions.length > -1 && m.mentions.length < 2 && !m.mentions.find(function(user) { return user.id == member.id })) {
                    m.mentions.push(member.user)
                }
            }

            if (names[1] != undefined) {
                if (names[1].startsWith("@")) {
                    names[1] = names[1].slice(1)
                }
                var name2 = names[1]

                var isThisUsernameThatUsername2 = function(member) {
                    var memberName = member.nick || member.username
                    if (memberName.toLowerCase() == name2.toLowerCase()) {
                        return true;
                    }
                }
                var member2 = m.guild.members.find(isThisUsernameThatUsername2)

                if (member2 != undefined) {
                    if (m.mentions.length > -1 && m.mentions.length < 2 && !m.mentions.find(function(user) { return user.id == member2.id })) {
                        m.mentions.push(member2.user)
                    }
                }

            }
        }

        var mentioned = m.mentions[0] || member || m.author
        if (m.mentions.length == 1 && m.author.id == m.mentions[0].id) { // If the user mentions only themself
            Bot.createMessage(m.channel.id, `Lovely shi... Alone? Don't be like that ${m.author.username} ;-; *hugs you*\n~~only one user was detected~~`)
            return;
        }
        if (m.mentions.length !== 2) { // If there are not 2 people mentioned,
            Bot.createMessage(m.channel.id, "Ship someone together~\n\nUse `!ship <@user1> <@user2>` or `!ship username1 | username2`")
            return;
        }


        Bot.sendChannelTyping(m.channel.id).then(async () => {
            try {
                var firstName = m.channel.guild.members.get(m.mentions[0].id).nick || m.mentions[0].username
                var lastName = m.channel.guild.members.get(m.mentions[1].id).nick || m.mentions[1].username
                if (firstName == lastName) {
                    Bot.createMessage(m.channel.id, "Lovely shi...Uhm, can you two stop being weird?\n~~both names are the same~~")
                    return;
                }
                var firstPart = firstName.substring(0, firstName.length / 2);
                var lastPart = lastName.substring(lastName.length / 2);

                const bg = await Jimp.read("https://cdn.discordapp.com/attachments/356012822016163841/560222284606865450/b3e61a.png");
                const user1 = await Jimp.read(`https://images.discordapp.net/avatars/${m.mentions[0].id}/${m.mentions[0].avatar}.png?size=1024`);
                const user2 = await Jimp.read(`https://images.discordapp.net/avatars/${m.mentions[1].id}/${m.mentions[1].avatar}.png?size=1024`);
                bg.resize(384, 128)
                user1.resize(128, 128);
                user2.resize(128, 128);
                bg.clone()
                    .blit(user1, 0, 0)
                    .blit(user2, 256, 0)
                    .getBuffer(Jimp.MIME_PNG, function(err, buffer) {
                        Bot.createMessage(m.channel.id, `Lovely shipping~\nIntroducing: **${firstPart}${lastPart}**`, {
                            "file": buffer,
                            "name": "ship.png"
                        })
                    });
            } catch (error) {
                console.log(error);
                return Bot.createMessage(m.channel.id, "Something went wrong...");
            }
        });
    },
    help: "Shipping~"
}
