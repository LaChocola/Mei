"use strict";

const Sagiri = require("sagiri");
const qs = require("querystring");

var conf = require("../conf");

var enabled = Boolean(conf.tokens.sauce);

if (enabled) {
    var handler = new Sagiri(conf.tokens.sauce);
}
else {
    console.warn("Sauce token not found. Disabling sauce command.");
}

module.exports = {
    main: async function(bot, m, args, prefix) {
        if (!enabled) {
            return;
        }
        let data;
        var link;
        if (m.content.length < 7 && !m.attachments || m.content == `${prefix}sauce` && m.attachments.length == 0) {
            m.reply("Please add an image, or image url");
            return;
        }
        else if (m.attachments[0]) {
            link = m.attachments[0].url;
        }
        else {
            link = m.cleanContent.replace(`${prefix}sauce `, "");
        }
        handler.getSauce(link).then(res => {
            data = res[0];
            var desc = data.original.data.title || data.site;
            const msg = {
                color: 0xA260F6,
                fields: [{
                    name: "Similarity",
                    value: `${data.similarity}%`,
                    inline: true
                },
                {
                    name: "Site",
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
            };
            m.reply({
                embed: msg
            });
        }).catch((err) => {
            console.log(err.message);
            err = err.toString();
            if (err.includes("You need an image") || err.includes("Supplied URL is not usable") || err.includes("Error: Got HTML response while expecting JSON")) {
                m.reply("No sauce found, please try uploading an image");
                return;
            }
            if (err.includes("No Results")) {
                m.reply("No Results found, sorry :sob:");
                return;
            }
            m.reply("An error has occured, please try using an actual image and trying again");
            return;
        });
    },
    help: "sauce",
    enabled: enabled
};
