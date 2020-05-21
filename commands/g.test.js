"use strict";

const g = require("./g");

jest.mock("../getStory");

// Stub test to be expanded on later
test("!g", async function() {
    var { bot, m, args, prefix } = setupCmd("g");

    await g.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("STORY");
});
