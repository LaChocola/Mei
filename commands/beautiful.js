"use strict";

const Jimp = require("jimp");

module.exports = {
    main: async function(bot, m, args, prefix) {
        if (m.mentions.length > 1) {
            m.reply("This Command can't be used with more than one mention");
            return;
        }

        var user = m.mentions[0] || m.author;
        var member = m.guild.members.get(user.id);

        var name = member.name;
        if (name.length > 13) {
            name = name.slice(0, 11) + "..";
        }

        var avatarUrl = user.dynamicAvatarURL("png", 1024);
        var templateUrl = "https://buttsare.sexy/495acb.jpg";

        await m.channel.sendTyping();
        const bg = await Jimp.read(templateUrl);
        const avy = await Jimp.read(avatarUrl);
        // TODO: Fix the frame size and use a background with transparent frames
        avy.resize(95, 106);
        var image = bg.clone()
            .blit(avy, 253, 23)
            .blit(avy, 258, 224);
        var buffer = await image.getBufferAsync(Jimp.MIME_PNG);

        m.channel.createMessage("", {
            file: buffer,
            name: name + "beautiful.png"
        });
    },
    help: "This is beautiful"
};
