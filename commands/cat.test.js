"use strict";

const request = require("request-promise");

const cat = require("./cat");

request.mockResolvedValue(JSON.stringify({ file: "https://cats.com/cat.jpg" }));

// Stub test to be expanded on later
test("!cat", async function() {
    var { bot, m, args, prefix } = setupCmd("cat");

    await cat.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", {
        embed: {
            author: {
                icon_url: "https://owo.whats-th.is/a5f22a.png",
                name: "| Here is your random cat:"
            },
            color: 10641654,
            image: {
                url: "https://cats.com/cat.jpg"
            }
        }
    });
});
