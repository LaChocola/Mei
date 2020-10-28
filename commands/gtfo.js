"use strict";

const Jimp = require("jimp");
const unidecode = require("unidecode");
const request = require("request-promise");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        if (m.author.id !== "161027274764713984" && m.author.id !== "271803699095928832") {
            return;
        }
        function isThisUsernameThatUsername(member) {
            var memberName = member.nick || member.username;
            return memberName.toLowerCase() === m.author.username.toLowerCase();
        }
        var member = m.guild.members.find(isThisUsernameThatUsername);
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        if (name.length > 13) {
            name = name.slice(0, 11) + "..";
        }
        try {
            var body = await request(`https://nizebot.bew.by/user/${m.channel.guild.id}/${mentioned.id}`, { simple: true });
            var res = JSON.parse(body);
            if (res && res.nickname) {
                name = res.nickname
            }
        }
        catch (err) {
            if (err.statusCode !=  404) {
                console.log(err);
                return bot.createMessage(m.channel.id, "Something went wrong...");
            }
        }
        name = `Ban ${unidecode(name)}`
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
                const bg = await Jimp.read("https://cdn.discordapp.com/attachments/363775546435305492/770121257281650768/banblank.png");
                const nameFont = await Jimp.loadFont("https://raw.githubusercontent.com/LaChocola/Mei/master/db/fonts/whitney/whitneysemibold.ttf.fnt");
                bg.clone()
                    .print(nameFont, 14, 8.5, name)
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
    help: "GTFO",
    type: "Image Command"
};
