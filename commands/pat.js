"use strict";

const misc = require("../misc");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        if (m.mentions.length > 2) {
            bot.createMessage(m.channel.id, "That's too many pats to give :angry:");
            return;
        }
        await bot.sendChannelTyping(m.channel.id);

        // If the user mentions only themself
        if (m.mentions.length === 1 && m.author.id === m.mentions[0].id) {
            bot.createMessage(m.channel.id, `Lovely shi... Alone? Don't be like that ${m.author.username} ;-; *hugs you*`);
            return;
        }

        var imageArray = [
            "https://78.media.tumblr.com/f95f14437809dfec8057b2bd525e6b4a/tumblr_omvkl2SzeK1ql0375o1_500.gif",
            "https://m.popkey.co/a5cfaf/1x6lW.gif",
            "http://giant.gfycat.com/PoisedWindingCaecilian.gif",
            "https://i.imgur.com/NxTmYnV.gif",
            "http://gifimage.net/wp-content/uploads/2017/07/head-pat-gif.gif",
            "https://78.media.tumblr.com/313a6fcdf842ba0e0f393de0746f6cd6/tumblr_oc9tu4rAff1v8ljjro1_500.gif",
            "http://i.imgur.com/xj0iJ.gif"
        ];

        var image = misc.choose(imageArray);
        var member = m.channel.guild.members.get(m.author.id);
        var authorName = member.nick || member.username;
        var url = member.avatarURL;

        var title = "It's okay to pat yourself too~";
        if (m.mentions.length === 1) {
            var mentionedMember = m.channel.guild.members.get(m.mentions[0].id);
            var pet = mentionedMember.nick || mentionedMember.username;
            title = pet + ", You got a pat from " + authorName + "~";
        }

        bot.createMessage(m.channel.id, {
            embed: {
                title: title,
                color: 0xA260F6,
                image: {
                    url: image
                },
                author: {
                    name: authorName,
                    icon_url: url
                }
            }
        });
    },
    help: ":3"
};
