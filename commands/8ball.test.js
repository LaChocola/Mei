"use strict";

const eightball = require("./8ball");

// Stub test to be expanded on later
test("!8ball", async function() {
    var { bot, m, args, prefix } = setupCmd("8ball");

    await eightball.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("Please add something");
});
