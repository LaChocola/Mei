"use strict";

const c = require("./c");

// Stub test to be expanded on later
test("!c", async function() {
    var { bot, m, args, prefix } = setupCmd("c");

    await c.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "Please add something i.e. ``!c How are you?``");
});
