"use strict";

const say = require("./say");

// Stub test to be expanded on later
test("!say", async function() {
    var { bot, m, args, prefix } = setupCmd("say");

    await say.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "Please add something to say. i.e. ``!say <whatever>``");
});
