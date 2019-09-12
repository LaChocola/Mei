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

        var templateUrl = "https://buttsare.sexy/b3e262.jpg";

        await m.channel.sendTyping();

        const bg = await Jimp.read(templateUrl);
        const nameFont = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
        var image = bg.clone()
            .print(nameFont, 550, 145, name);
        var buffer = await image.getBufferAsync(Jimp.MIME_PNG);

        m.channel.createMessage("Weirdo", {
            file: buffer,
            name: "furry.png"
        });
    },
    help: "idk"
};
