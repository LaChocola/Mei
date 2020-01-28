"use strict";

const randomPuppy = require("random-puppy");

module.exports = {
    main: async function(Bot, m, args, prefix) {
        var url = await randomPuppy();
        Bot.createMessage(m.channel.id, {
            embed: {
                color: 0xA260F6,
                image: {
                    url: url
                },
                author: {
                    name: "| Here is your random dog:",
                    icon_url: "https://owo.whats-th.is/7083a2.png"
                }
            }
        });
    },
    help: "Random Dogs"
};
