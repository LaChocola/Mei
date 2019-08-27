"use strict";

const isSameMember = require("./utils/isSameMember");

module.exports = {
    main: function(Bot, m, args, prefix) {
        var name1 = m.cleanContent.replace(`${prefix}avy `, "");
        var member = m.guild.members.find(m => isSameMember(m, name1));
        var mentioned = m.mentions[0] || member || m.author;
        var avy = m.channel.guild.members.get(mentioned.id).avatarURL || mentioned.avatarURL;
        if (avy.includes("null")) {
            Bot.createMessage(m.channel.id, "You need an avatar to use this command");
            return;
        }
        avy = avy.replace(/\.gif\?size=[0-9]+/ig, ".gif").replace(".jpg?size=128", ".png?size=1024");
        Bot.createMessage(m.channel.id, {
            embed: {
                color: 0xA260F6,
                title: `${mentioned.nickname || mentioned.username}#${mentioned.discriminator}`,
                description: "[Link](" + avy + ")",
                image: {
                    url: avy
                }
            }
        });
    },
    help: "Avatars"
};
