"use strict";

const date = require("./date");

// Stub test to be expanded on later
test("!date", async function() {
    var { bot, m, args, prefix } = setupCmd("date");

    await date.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "**Natalie**\nJoined: Invalid Date | just now\nCreated: Invalid Date | just now");
});
