"use strict";

module.exports = {
    main: function(Bot, m, args, prefix) {
        if (m.mentions.length > 2) {
            Bot.createMessage(m.channel.id, "Thats too many pats to give :angry:");
            return;
        }
        Bot.sendChannelTyping(m.channel.id).then(async () => {
            if (m.mentions.length == 1 && m.author.id == m.mentions[0].id) { // If the user mentions only themself
                Bot.createMessage(m.channel.id, `Lovely shi... Alone? Don't be like that ${m.author.username} ;-; *hugs you*`);
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
            var url = m.channel.guild.members.get(m.author.id).avatarURL;
            var image = imageArray[Math.floor(Math.random() * imageArray.length)];
            var author = m.channel.guild.members.get(m.author.id).nick || m.channel.guild.members.get(m.author.id).username;
            var url = m.channel.guild.members.get(m.author.id).avatarURL;
            if (m.mentions.length == 1 && m.author.id != m.mentions[0].id) {
                var pet = m.channel.guild.members.get(m.mentions[0].id).nick || m.channel.guild.members.get(m.mentions[0].id).username;
                const data = {
                    "embed": {
                        "title": pet + ", You got a pat from " + author + "~",
                        "color": 0xA260F6,
                        "image": {
                            "url": image
                        },
                        "author": {
                            "name": author,
                            "icon_url": url
                        }
                    }
                };
                Bot.createMessage(m.channel.id, data);
                return;
            }
            else {
                const data = {
                    "embed": {
                        "title": "It's okay to pat yourself too~",
                        "color": 0xA260F6,
                        "image": {
                            "url": image
                        },
                        "author": {
                            "name": author,
                            "icon_url": url
                        }
                    }
                };
                Bot.createMessage(m.channel.id, data);
                return;
            }
        });
    },
    help: ":3"
};
