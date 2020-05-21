"use strict";

const spray = require("./spray");

// Stub test to be expanded on later
test("!spray", async function() {
    var { bot, m, args, prefix } = setupCmd("spray");

    await spray.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "Please add someone to spray. i.e. ``!spray @Chocola``");
});
