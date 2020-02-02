"use strict";

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        var mentionedArg = m.cleanContent.slice(`${prefix}avy`.length).trim().toLowerCase();

        var mentioned;
        if (mentionedArg === "") {
            mentioned = m.member;
        }
        else if (m.mentions.length > 0) {
            mentioned = m.guild.members.get(m.mentions[0].id);
        }
        else {
            mentioned = m.guild.members.find(m => m.name.toLowerCase() === mentionedArg);
        }

        if (!mentioned) {
            await m.reply("I don't know who that is.");
            return;
        }

        if (mentioned.avatar === null) {
            if (mentioned.id === m.member.id) {
                await m.reply("You don't have an avatar.");
            }
            else {
                await m.reply(`${mentioned.name} doesn't have an avatar.`);
            }
            return;
        }

        var format = mentioned.avatar.startsWith("a_") ? "gif" : "png";
        var avy = mentioned.user.dynamicAvatarURL(format, 1024);

        await m.reply({
            embed: {
                color: 0xA260F6,
                title: `${mentioned.name}`,
                description: "[Link](" + avy + ")",
                image: {
                    url: avy
                }
            }
        });
    },
    help: "Avatars"
};
