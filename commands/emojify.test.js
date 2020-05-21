"use strict";

const emojify = require("./emojify");

// Stub test to be expanded on later
test("!emojify", async function() {
    var { bot, m, args, prefix } = setupCmd("emojify");

    await emojify.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "");
});
