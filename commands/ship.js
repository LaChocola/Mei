"use strict";

const Jimp = require("jimp");

const utils = require("../utils");

module.exports = {
    main: async function(bot, m, args, prefix) {
        utils.parseNameMentions(m, " | ");

        var member1 = m.guild.members.get(m.mentions[0] && m.mentions[0].id);
        var member2 = m.guild.members.get(m.mentions[1] && m.mentions[1].id);

        if (member1 === m.author.id && !member2) { // If the user mentions only themself
            m.reply(`Lovely shi... Alone? Don't be like that ${m.author.username} ;-; *hugs you*\n~~only one user was detected~~`);
            return;
        }
        if (m.mentions.length !== 2) { // If there are not 2 people mentioned,
            m.reply("Ship someone together~\n\nUse `!ship <@user1> <@user2>` or `!ship username1 | username2`");
            return;
        }

        await m.channel.sendTyping();

        var firstName = member1.name;
        var lastName = member2.name;
        if (firstName === lastName) {
            m.reply("Lovely shi...Uhm, can you two stop being weird?\n~~both names are the same~~");
            return;
        }
        var firstPart = firstName.substring(0, firstName.length / 2);
        var lastPart = lastName.substring(lastName.length / 2);

        var templateUrl = "https://cdn.discordapp.com/attachments/356012822016163841/560222284606865450/b3e61a.png";
        var avatar1Url = member1.user.dynamicAvatarURL("png", 1024);
        var avatar2Url = member2.user.dynamicAvatarURL("png", 1024);

        const bg = await Jimp.read(templateUrl);
        const user1 = await Jimp.read(avatar1Url);
        const user2 = await Jimp.read(avatar2Url);
        bg.resize(384, 128);
        user1.resize(128, 128);
        user2.resize(128, 128);
        var image = bg.clone()
            .blit(user1, 0, 0)
            .blit(user2, 256, 0);
        var buffer = await image.getBufferAsync(Jimp.MIME_PNG);

        m.channel.createMessage("Lovely shipping~\n"
            + `Introducing: **${firstPart}${lastPart}**`,
            {
                file: buffer,
                name: "ship.png"
            });
    },
    help: "Shipping~"
};
