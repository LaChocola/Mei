"use strict";

const randomPuppy = require("random-puppy");

module.exports = {
    main: function(bot, m, args, prefix) {
        randomPuppy()
            .then(url => {
                const data = {
                    "embed": {
                        "color": 0xA260F6,
                        "image": {
                            "url": url
                        },
                        "author": {
                            "name": "| Here is your random dog:",
                            "icon_url": "https://buttsare.sexy/7083a2.png"
                        }
                    }
                };

                m.reply(data);
            });

    },
    help: "Random Dogs"
};
