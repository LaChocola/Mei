"use strict";

const haiku = require("./haiku");

// Stub test to be expanded on later
test("!haiku", async function() {
    var { bot, m, args, prefix } = setupCmd("haiku");

    await haiku.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", {
        embed: {
            color: 0xA260F6,
            description: "THIS IS NOT A HAIKU"
        }
    });
});
