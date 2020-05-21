"use strict";

const aesthetics = require("./aesthetics");

// Stub test to be expanded on later
test("!aesthetics", async function() {
    var { bot, m, args, prefix } = setupCmd("aesthetics");

    await aesthetics.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("You need to add something to say");
});
