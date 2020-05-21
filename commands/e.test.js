"use strict";

const e = require("./e");

// Stub test to be expanded on later
test("!e", async function() {
    var { bot, m, args, prefix } = setupCmd("e");

    await e.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "Please add something i.e. ``!e Whats cooler than being cool``");
});
