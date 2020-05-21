"use strict";

const v = require("./v");

jest.mock("../getStory");

// Stub test to be expanded on later
test("!v", async function() {
    var { bot, m, args, prefix } = setupCmd("v");

    await v.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("STORY");
});
