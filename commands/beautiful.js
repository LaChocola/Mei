"use strict";

const Jimp = require("jimp");

const isSameMember = require("./utils/isSameMember");

module.exports = {
    main: function(Bot, m, args, prefix) {
        var member = m.guild.members.find(m => isSameMember(m, m.author));
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        var pic = `https://images.discordapp.net/avatars/${m.author.id}/${m.author.avatar}.png?size=1024`;
        if (pic.includes("null")) {
            Bot.createMessage(m.channel.id, "You need an avatar to use this command");
            return;
        }
        if (m.mentions.length == 1) {
            var pic = `https://images.discordapp.net/avatars/${m.mentions[0].id}/${m.mentions[0].avatar}.png?size=1024`;
        }
        else if (m.mentions.length > 1) {
            Bot.createMessage(m.channel.id, "This Command can't be used with more than one mention");
            return;
        }
        Bot.sendChannelTyping(m.channel.id).then(async () => {
            try {
                const bg = await Jimp.read("https://buttsare.sexy/495acb.jpg");
                const avy = await Jimp.read(pic);
                avy.resize(95, 106);
                bg.clone()
                    .blit(avy, 253, 23)
                    .blit(avy, 258, 224)
                    .getBuffer(Jimp.MIME_PNG, function(err, buffer) {
                        Bot.createMessage(m.channel.id, "", {
                            "file": buffer,
                            "name": name + "beautiful.png"
                        });
                    });
            }
            catch (error) {
                console.log(error);
                return Bot.createMessage(m.channel.id, "Something went wrong...");
            }
        });
    },
    help: "This is beautiful"
};
