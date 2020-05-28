"use strict";

const escapeStringRegexp = require("escape-string-regexp");
const Jimp = require("jimp");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var names = m.cleanContent.replace(new RegExp("^[ " + escapeStringRegexp(prefix) + "ship\\t]+[^a-zA-Z]+|[" + escapeStringRegexp(prefix) + "ship \\t]+[^a-zA-Z]$|" + escapeStringRegexp(prefix) + "ship", "i"), "").split(" | ");
        if (names[0] !== undefined) {
            if (names[0].startsWith("@")) {
                names[0] = names[0].slice(1);
            }
            var name1 = names[0];

            var member = m.guild.members.find(function(member) {
                var memberName = member.nick || member.username;
                return memberName.toLowerCase() === name1.toLowerCase();
            });

            if (member !== undefined) {
                if (m.mentions.length > -1 && m.mentions.length < 2 && !m.mentions.find(u => u.id === member.id)) {
                    m.mentions.push(member.user);
                }
            }

            if (names[1] !== undefined) {
                if (names[1].startsWith("@")) {
                    names[1] = names[1].slice(1);
                }
                var name2 = names[1];

                var member2 = m.guild.members.find(function(member) {
                    var memberName = member.nick || member.username;
                    return memberName.toLowerCase() === name2.toLowerCase();
                });

                if (member2 !== undefined) {
                    if (m.mentions.length > -1 && m.mentions.length < 2 && !m.mentions.find(u => u.id === member2.id)) {
                        m.mentions.push(member2.user);
                    }
                }

            }
        }

        var random;
        if (args.toLowerCase().includes("random")) {
            random = m.channel.guild.members.filter(m => !m.bot && m.status !== "offline");
            var random1 = random[Math.floor(Math.random() * random.length)];
            random = random[Math.floor(Math.random() * random.length)];
            m.mentions.push(random, random1);
        }

        if (m.mentions.length === 1) { // If the user mentions only one person assign a random match
            random = m.channel.guild.members.filter(m => !m.bot && m.status !== "offline");
            random = random[Math.floor(Math.random() * random.length)];
            m.mentions.push(random);
        }

        if (m.mentions.length !== 2) { // If there are not 2 people mentioned,
            bot.createMessage(m.channel.id, "Ship someone together~\n\nUse `" + prefix + "ship <@user1> <@user2>` or `" + prefix + "ship username1 | username2`");
            return;
        }

        if (m.mentions[0].avatar == null) { // If there is no avatar
            bot.createMessage(m.channel.id, `Lovely shi... Where's your avatar? You should add one ${m.mentions[0].username} ;-; *winks*\n~~no avatar/profile pic was detected~~`);
            return;
        }

        if (m.mentions[1].avatar == null) { // If there is no avatar
            bot.createMessage(m.channel.id, `Lovely shi... Where's your avatar? You should add one ${m.mentions[1].username} *winks*\n~~no avatar/profile pic was detected~~`);
            return;
        }

        bot.sendChannelTyping(m.channel.id).then(async function() {
            try {
                var firstName = m.channel.guild.members.get(m.mentions[0].id).nick || m.mentions[0].username;
                var lastName = m.channel.guild.members.get(m.mentions[1].id).nick || m.mentions[1].username;
                if (firstName === lastName) {
                    bot.createMessage(m.channel.id, "Lovely shi...Uhm, can you two stop being weird?\n~~both names are the same~~");
                    return;
                }
                var firstPart = firstName.substring(0, firstName.length / 2);
                var lastPart = lastName.substring(lastName.length / 2);
                var bg = await Jimp.read("https://cdn.discordapp.com/attachments/356012822016163841/560222284606865450/b3e61a.png");
                var file = "ship.png";
                // Planned support for gif avatars
                /*
                if (m.mentions[0].avatarURL.includes(".gif") || m.mentions[1].avatarURL.includes(".gif")) {
                    bg = await Jimp.read("https://cdn.discordapp.com/attachments/356012822016163841/689994984044232746/bg.gif");
                    file = "ship.gif";
                    console.log("Gif PFP detected");
                }
                const user1 = await Jimp.read(`https://images.discordapp.net/avatars/${m.mentions[0].id}/${m.mentions[0].avatar}.${m.mentions[0].avatarURL.includes(".gif") ? "gif" : "png"}?size=1024`);
                const user2 = await Jimp.read(`https://images.discordapp.net/avatars/${m.mentions[1].id}/${m.mentions[1].avatar}.${m.mentions[0].avatarURL.includes(".gif") ? "gif" : "png"}?size=1024`);
                */
                const user1 = await Jimp.read(`https://images.discordapp.net/avatars/${m.mentions[0].id}/${m.mentions[0].avatar}.png?size=1024`); // TODO Repalce with gif supporting detection
                const user2 = await Jimp.read(`https://images.discordapp.net/avatars/${m.mentions[1].id}/${m.mentions[1].avatar}.png?size=1024`); // TODO Repalce with gif supporting detection
                user1.resize(128, 128);
                user2.resize(128, 128);
                var out = bg.resize(384, 128).composite(user1, 0, 0).composite(user2, 256, 0);
                var buffer = await out.getBufferAsync(Jimp.AUTO);
                if (random && !random1) {
                    bot.createMessage(m.channel.id, `Lovely shi... Alone? Don't be like that ${m.author.username} ;-; I will find someone for you~ ~~Only one user was detected. Auto matching with a random online member~~\nIntroducing: **${firstPart}${lastPart}**`, {
                        "file": buffer,
                        "name": file
                    });
                    return;
                }
                if (random && random1) {
                    bot.createMessage(m.channel.id, `Lovely shi... No one? What were you expecting ${m.author.username}? :thinking: I will find some people to match~ ~~No users were detected. Auto matching 2 random online members~~\nIntroducing: **${firstPart}${lastPart}**`, {
                        "file": buffer,
                        "name": file
                    });
                    return;
                }
                bot.createMessage(m.channel.id, `Lovely shipping~\nIntroducing: **${firstPart}${lastPart}**`, {
                    "file": buffer,
                    "name": file
                });
            }
            catch (error) {
                console.log(error);
                return bot.createMessage(m.channel.id, "Something went wrong...");
            }
        });
    },
    help: "Shipping~"
};
