"use strict";

const Jimp = require("jimp");

const utils = require("../utils");

module.exports = {
    main: function(bot, m, args, prefix) {
        var member = m.guild.members.find(m => utils.isSameMember(m, m.author));
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        if (name.length > 11) {
            name = name.slice(0, 11) + "..";
        }
        if (m.mentions.length > 1) {
            m.reply("This Command can't be used with more than one mention");
            return;
        }
        name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        if (name.length > 10) {
            name = name.slice(0, 10) + "..";
        }
        m.channel.sendTyping().then(async () => {
            try {
                const bg = await Jimp.read("https://buttsare.sexy/b3e262.jpg");
                const nameFont = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
                bg.clone()
                    .print(nameFont, 550, 145, name)
                    .getBuffer(Jimp.MIME_PNG, function(err, buffer) {
                        m.reply("Weirdo", {
                            "file": buffer,
                            "name": "furry.png"
                        });
                    });
            }
            catch (error) {
                console.log(error);
                return m.reply("Something went wrong...");
            }
        });
    },
    help: "idk",
    type: "Image Command"
};
