"use strict";

const clean = require("./clean");

jest.mock("../servers");
jest.mock("../misc");

// Stub test to be expanded on later
test("!clean", async function() {
    var { bot, m, args, prefix } = setupCmd("clean");

    await clean.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("Please mention who you want to clean or say 'all', and optionally, a number of messages to delete from them", 5000);
});
