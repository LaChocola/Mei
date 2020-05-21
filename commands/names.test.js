"use strict";

const names = require("./names");

jest.mock("../people");

// Stub test to be expanded on later
test("!names", async function() {
    var { bot, m, args, prefix } = setupCmd("names");

    await names.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "I could find any names list for **Natalie** :(");
});
