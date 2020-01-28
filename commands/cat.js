"use strict";

const request = require("request-promise");
const randomCat = require("random-cat");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        var catURL;
        try {
            var body = await request("http://aws.random.cat/meow", { simple: true });
            var catBody = JSON.parse(body);
            catURL = catBody.file;
        }
        catch (err) {
            var possibleCatURL = randomCat.get();
            if (possibleCatURL.length > 14) {
                catURL = possibleCatURL;
            }
        }

        if (!catURL) {
            Bot.createMessage(m.channel.id, "Sorry, no kitties at the moment. :frowning2: Please try again later.");
            return;
        }

        Bot.createMessage(m.channel.id, {
            embed: {
                color: 0xA260F6,
                image: {
                    url: catURL
                },
                author: {
                    name: "| Here is your random cat:",
                    icon_url: "https://owo.whats-th.is/a5f22a.png"
                }
            }
        });
    },
    help: "Random Cats"
};
