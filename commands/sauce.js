var config = require("../etc/config.json");
const Sagiri = require('sagiri');
const handler = new Sagiri(config.tokens.sauce);
const qs = require('querystring')

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
                    url: qs.encode(data.original.header.thumbnail)
                },
                description: "[" + desc + "](" + data.url + ")",
                author: {
                    name: "Sauce Found:",
                    icon_url: qs.encode(data.original.header.thumbnail)
                }
            }
            Bot.createMessage(m.channel.id, {
                embed: msg
            });
        }).catch((err) => {
            console.log(err.message);
            var err = err.toString()
            if (err.includes("You need an image") || err.includes("Supplied URL is not usable") || err.includes("Error: Got HTML response while expecting JSON")) {
                Bot.createMessage(m.channel.id, "No sauce found, please try uploading an image");
                return;
            }
            if (err.includes("No Results")) {
                Bot.createMessage(m.channel.id, "No Results found, sorry :sob:");
                return
            }
            Bot.createMessage(m.channel.id, "An error has occured, please try using an actual image and trying again");
            return;
        });
    },
    help: "sauce"
}
