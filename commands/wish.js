"use strict";

const Jimp = require("jimp");
const unidecode = require("unidecode");

// This version of Jimp has an alphabet I created to emulated the DeviantArt username font 'Trebuchet' and timestamp font
// They are both available at https://github.com/LaChocola/Mei/tree/master/db/fonts

var time = new Date().toDateString().slice(4).replace(` ${new Date().getFullYear()}`, `, ${new Date().getFullYear()}`);

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        function isThisUsernameThatUsername(member) {
            var memberName = member.nick || member.username;
            return memberName.toLowerCase() === m.author.username.toLowerCase();
        }
        var member = m.guild.members.find(isThisUsernameThatUsername);
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        name = unidecode(name)
        if (name.length > 13) {
            name = name.slice(0, 11) + "..";
        }
        var pic = `https://images.discordapp.net/avatars/${mentioned.id}/${mentioned.avatar}.png?size=1024`;
        if (pic.includes("null")) {
            bot.createMessage(m.channel.id, "You need an avatar to use this command");
            return;
        }
        else if (m.mentions.length > 1) {
            bot.createMessage(m.channel.id, "This Command can't be used with more than one mention");
            return;
        }
        bot.sendChannelTyping(m.channel.id).then(async function() {
            try {
                const bg = await Jimp.read("https://owo.whats-th.is/4Vp1MUG.png");
                const avy = await Jimp.read(pic);
                const nameFont = await Jimp.loadFont("https://raw.githubusercontent.com/LaChocola/Mei/master/db/fonts/trebuchetms/TrebuchetMS.fnt");
                const timeFont = await Jimp.loadFont("https://raw.githubusercontent.com/LaChocola/Mei/master/db/fonts/timefont/timeFont.fnt");
                avy.resize(141, 116);
                bg.clone()
                    .blit(avy, 15, 12)
                    .print(nameFont, 215, 30, name)
                    .print(timeFont, 460, 37, time)
                    .getBuffer(Jimp.MIME_PNG, function(err, buffer) {
                        bot.createMessage(m.channel.id, "", {
                            file: buffer,
                            name: "wish.png"
                        });
                    });
            }
            catch (error) {
                console.log(error);
                return bot.createMessage(m.channel.id, "Something went wrong...");
            }
        });
    },
    help: ";)",
    type: "Image Command"
};
