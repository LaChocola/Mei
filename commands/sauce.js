var config = require("../etc/config.json");
const Sagiri = require('sagiri');
const handler = new Sagiri(config.tokens.sauce);

module.exports = {
    main: function(Bot, m, args, prefix) {
        let data;
        if (m.content.length < 7 && !m.attachments || m.content == `${prefix}sauce` && m.attachments.length == 0) {
            Bot.createMessage(m.channel.id, "Please add an image, or image url");
            return;
        } else if (m.attachments[0]) {
            var link = m.attachments[0].url
        } else {
            var link = m.cleanContent.replace(`${prefix}sauce `, "")
        }
        handler.getSauce(link).then(res => {
            data = res[0];
            var desc = data.original.data.title || data.site
            const msg = {
                color: 0xA260F6,
                fields: [{
                        name: 'Similarity',
                        value: `${data.similarity}%`,
                        inline: true
                    },
                    {
                        name: 'Site',
                        value: `${data.site}`,
                        inline: true
                    }
                ],
                image: {
                    url: data.original.header.thumbnail
                },
                description: "[" + desc + "](" + data.url + ")",
                author: {
                    name: "Sauce Found:",
                    icon_url: data.original.header.thumbnail
                }
            }
            console.log(data);
            Bot.createMessage(m.channel.id, {
                embed: msg
            });
        })
    },
    help: "sauce"
}
