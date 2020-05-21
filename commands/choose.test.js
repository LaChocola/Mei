"use strict";

const choose = require("./choose");

jest.mock("../misc");

// Stub test to be expanded on later
test("!choose", async function() {
    var { bot, m, args, prefix } = setupCmd("choose");

    await choose.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "You need to add your choices, seperated by ` | `");
});
