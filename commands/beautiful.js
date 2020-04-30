"use strict";

const Jimp = require("jimp");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        function isThisUsernameThatUsername(member) {
            var memberName = member.nick || member.username;
            if (memberName.toLowerCase() === m.author.username.toLowerCase()) {
                return true;
            }
        }
        var member = m.guild.members.find(isThisUsernameThatUsername);
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        var pic = `https://images.discordapp.net/avatars/${m.author.id}/${m.author.avatar}.png?size=1024`;
        if (pic.includes("null")) {
            bot.createMessage(m.channel.id, "You need an avatar to use this command");
            return;
        }
        if (m.mentions.length === 1) {
            pic = `https://images.discordapp.net/avatars/${m.mentions[0].id}/${m.mentions[0].avatar}.png?size=1024`;
        }
        else if (m.mentions.length > 1) {
            bot.createMessage(m.channel.id, "This Command can't be used with more than one mention");
            return;
        }

        await bot.sendChannelTyping(m.channel.id);

        try {
            const bg = await Jimp.read("https://owo.whats-th.is/495acb.jpg");
            const avy = await Jimp.read(pic);
            avy.resize(95, 106);
            bg.clone()
                .blit(avy, 253, 23)
                .blit(avy, 258, 224)
                .getBuffer(Jimp.MIME_PNG, function(err, buffer) {
                    bot.createMessage(m.channel.id, "", {
                        "file": buffer,
                        "name": name + "beautiful.png"
                    });
                });
        }
        catch (error) {
            console.log(error);
            bot.createMessage(m.channel.id, "Something went wrong...");
        }
    },
    help: "This is beautiful"
};
