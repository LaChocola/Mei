"use strict";

const dog = require("./dog");

// Stub test to be expanded on later
test("!dog", async function() {
    var { bot, m, args, prefix } = setupCmd("dog");

    await dog.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith(
        "658894691311550474",
        {
            embed: {
                author: {
                    icon_url : "https://owo.whats-th.is/7083a2.png",
                    name: "| Here is your random dog:"
                },
                color: 10641654,
                image: {
                    url: "https://dogs.com/dogs.jpg"
                }
            }
        }
    );
});
