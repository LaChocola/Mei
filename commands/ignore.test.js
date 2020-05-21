"use strict";

const ignore = require("./ignore");

jest.mock("../data");

// Stub test to be expanded on later
test("!ignore", async function() {
    var { bot, m, args, prefix } = setupCmd("ignore");

    await ignore.main(bot, m, args, prefix);

    expect(bot.createMessage).not.toBeCalled();
});
