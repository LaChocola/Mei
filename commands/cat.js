"use strict";

const request = require("request");
const randomCat = require("random-cat");

module.exports = {
    main: async function (Bot, m, args, prefix) {
        request("http://aws.random.cat/meow", function (err, res, body) {
            if (res.statusCode === 200) {
                var catURL = JSON.parse(body);
                const data = {
                    "embed": {
                        "color": 0xA260F6,
                        "image": {
                            "url": catURL.file
                        },
                        "author": {
                            "name": "| Here is your random cat:",
                            "icon_url": "https://owo.whats-th.is/a5f22a.png"
                        }
                    }
                };
                Bot.createMessage(m.channel.id, data);
                return;
            }
            else {
                var catURL2 = randomCat.get();
                if (catURL2.length > 14) {
                    const data = {
                        "embed": {
                            "color": 0xA260F6,
                            "image": {
                                "url": catURL2
                            },
                            "author": {
                                "name": "| Here is your random cat:",
                                "icon_url": "https://owo.whats-th.is/a5f22a.png"
                            }
                        }
                    };
                    Bot.createMessage(m.channel.id, data);
                    return;
                }
                // Random 403 error that sometimes occurs...
                Bot.createMessage(m.channel.id, "Sorry, no kitties at the moment. :frowning2: Please try again later.");
            }
        });
    },
    help: "Random Cats"
};
