"use strict";

const ex = require("./ex");

// Stub test to be expanded on later
test("!ex", async function() {
    var { bot, m, args, prefix } = setupCmd("ex");

    await ex.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "Cannot access sad panda 🐼");
});
