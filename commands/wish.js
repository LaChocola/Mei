"use strict";

// This version of Jimp has an alphabet I created to emulated the DeviantArt username font "Trebuchet" and timestamp font
// They are both availible at https://github.com/LaChocola/Mei/tree/master/data/fonts
const Jimp = require("jimp");
const moment = require("moment");

const utils = require("../utils");

var nameFontPath = utils.getPkgPath("/data/fonts/trebuchetms/TrebuchetMS.fnt");  // Relative to package root
var timeFontPath = utils.getPkgPath("/data/fonts/timefont/timeFont.fnt");        // Relative to package root

module.exports = {
    main: async function(bot, m, args, prefix) {
        if (m.mentions.length > 1) {
            m.reply("This Command cant be used with more than one mention");
            return;
        }

        var user = m.mentions[0] || m.author;
        var member = m.guild.members.get(user.id);

        var name = member.name;
        if (name.length > 13) {
            name = name.slice(0, 11) + "..";
        }

        var time = moment().format("MMM D, YYYY");

        var avatarUrl = user.dynamicAvatarURL("png", 1024);
        var templateUrl = "https://buttsare.sexy/4Vp1MUG.png";

        await m.channel.sendTyping();
        const bg = await Jimp.read(templateUrl);
        const avy = await Jimp.read(avatarUrl);
        const nameFont = await Jimp.loadFont(nameFontPath);
        const timeFont = await Jimp.loadFont(timeFontPath);
        avy.resize(141, 116);
        var image = bg.clone()
            .blit(avy, 15, 12)
            .print(nameFont, 215, 30, name)
            .print(timeFont, 460, 37, time);
        var buffer = await image.getBuffer(Jimp.MIME_PNG);

        m.channel.createMessage("", {
            file: buffer,
            name: "wish.png"
        });
    },
    help: ";)"
};
