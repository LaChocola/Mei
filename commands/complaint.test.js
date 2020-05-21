"use strict";

const complaint = require("./complaint");

// Stub test to be expanded on later
test("!complaint", async function() {
    var { bot, m, args, prefix } = setupCmd("complaint");

    await complaint.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalled();
});
