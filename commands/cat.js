"use strict";

const request = require("request");
const randomCat = require("random-cat");

module.exports = {
    main: function(bot, m, args, prefix) {
        request("http://aws.random.cat/meow", (err, res, body) => {
            if (res.statusCode == 200) {
                var catURL = JSON.parse(body);
                const data = {
                    "embed": {
                        "color": 0xA260F6,
                        "image": {
                            "url": catURL.file
                        },
                        "author": {
                            "name": "| Here is your random cat:",
                            "icon_url": "https://buttsare.sexy/a5f22a.png"
                        }
                    }
                };
                m.reply(data);
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
                                "icon_url": "https://buttsare.sexy/a5f22a.png"
                            }
                        }
                    };
                    m.reply(data);
                    return;
                }
                // Random 403 error that sometimes occurs...
                m.reply("Sorry, no kitties at the moment. :frowning2: Please try again later.");
            }
        });
    },
    help: "Random Cats"
};
