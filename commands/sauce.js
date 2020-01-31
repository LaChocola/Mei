"use strict";

const conf = require("../conf");
const sagiri = require("sagiri")(conf.tokens.sauce);

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        if (m.content.length < 7 && !m.attachments || m.content === `${prefix}sauce` && m.attachments.length === 0) {
            Bot.createMessage(m.channel.id, "Please add an image, or image url");
            return;
        }

        var link;
        if (m.attachments[0]) {
            link = m.attachments[0].url;
        }
        else {
            link = m.cleanContent.replace(`${prefix}sauce `, "");
        }

        try {
            var res = await sagiri(link);
            var data = res[0];

            var desc = data.raw.data.title || data.site;
            var image = String(data.raw.header.thumbnail.split(" ").join("%20"));
            var fields = [{
                name: "Similarity",
                value: `${data.similarity}%`,
                inline: true
            },
            {
                name: "Site",
                value: `${data.site}`,
                inline: true
            }];
            console.log(data.raw.data);
            if (data.raw.data.creator) {
                console.log("Pushing creator");
                fields.push({
                    name: "Creator",
                    value: `${String(data.raw.data.creator)}`,
                    inline: true
                });
            }
            if (data.raw.data.source) {
                console.log("Pushing source");
                fields.push({
                    name: "Source",
                    value: `${data.raw.data.source}`,
                    inline: true
                });
            }
            console.log(data);
            console.log(fields);
            console.log(image);

            const msg = {
                color: 0xA260F6,
                fields: fields,
                image: {
                    url: image
                },
                description: "[" + desc + "](" + data.url + ")",
                author: {
                    name: "Sauce Found:",
                    icon_url: image
                }
            };
            Bot.createMessage(m.channel.id, {
                embed: msg
            });
        }
        catch (err) {
            console.log(err);
            var errString = err.toString();
            if (errString.includes("You need an image") || errString.includes("Supplied URL is not usable") || errString.includes("Error: Got HTML response while expecting JSON")) {
                Bot.createMessage(m.channel.id, "No sauce found, please try uploading an image");
                return;
            }
            if (errString.includes("No Results")) {
                Bot.createMessage(m.channel.id, "No Results found, sorry :sob:");
                return;
            }
            Bot.createMessage(m.channel.id, "An error has occured, please try using an actual image and trying again");
            return;
        }
    },
    help: "sauce"
};
