"use strict";

const ping = require("./ping");

// Stub test to be expanded on later
test("!ping", async function() {
    var { bot, m, args, prefix } = setupCmd("ping");

    await ping.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "Pinging!");
});
