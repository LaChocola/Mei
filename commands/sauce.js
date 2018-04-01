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
            Bot.createMessage(m.channel.id, {
                embed: msg
            });
        }).catch((err) => {
          console.log(err);
          var err = err.toString()
          if (err.indexOf("You need an image") > -1 || err.indexOf("Supplied URL is not usable") || err.indexOf("Error: Got HTML response while expecting JSON") > -1) {
            Bot.createMessage(m.channel.id, "No sauce found, please try uploading an image");
            return;
          }
          Bot.createMessage(m.channel.id, "An error has occured, please try using an actual image and trying again");
        });
    },
    help: "sauce"
}
