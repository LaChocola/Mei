"use strict";

const Jimp = require("jimp");
// This version of Jimp has an alphabet I created to emulated the DeviantArt username font "Trebuchet" and timestamp font
// They are both availible at https://github.com/LaChocola/Mei/tree/master/db/fonts
var time = new Date().toDateString().slice(4).replace(` ${new Date().getFullYear()}`, `, ${new Date().getFullYear()}`);

const utils = require("../utils");

module.exports = {
    main: function(Bot, m, args, prefix) {
        var member = m.guild.members.find(m => utils.isSameMember(m, m.author));
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        if (name.length > 13) {
            name = name.slice(0, 11) + "..";
        }
        var pic = `https://images.discordapp.net/avatars/${m.author.id}/${m.author.avatar}.png?size=1024`;
        if (pic.includes("null")) {
            Bot.createMessage(m.channel.id, "You need an avatar to use this command");
            return;
        }
        if (m.mentions.length == 1) {
            pic = `https://images.discordapp.net/avatars/${m.mentions[0].id}/${m.mentions[0].avatar}.png?size=1024`;
        }
        else if (m.mentions.length > 1) {
            Bot.createMessage(m.channel.id, "This Command cant be used with more than one mention");
            return;
        }
        Bot.sendChannelTyping(m.channel.id).then(async () => {
            try {
                const bg = await Jimp.read("https://buttsare.sexy/4Vp1MUG.png");
                const avy = await Jimp.read(pic);
                const nameFont = await Jimp.loadFont("https://raw.githubusercontent.com/LaChocola/Mei/master/db/fonts/trebuchetms/TrebuchetMS.fnt");
                const timeFont = await Jimp.loadFont("https://raw.githubusercontent.com/LaChocola/Mei/master/db/fonts/timefont/timeFont.fnt");
                avy.resize(141, 116);
                bg.clone()
                    .blit(avy, 15, 12)
                    .print(nameFont, 215, 30, name)
                    .print(timeFont, 460, 37, time)
                    .getBuffer(Jimp.MIME_PNG, function(err, buffer) {
                        Bot.createMessage(m.channel.id, "", {
                            "file": buffer,
                            "name": "wish.png"
                        });
                    });
            }
            catch (error) {
                console.log(error);
                return Bot.createMessage(m.channel.id, "Something went wrong...");
            }
        });
    },
    help: ";)",
    type: "Image Command"
};
