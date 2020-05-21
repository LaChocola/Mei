"use strict";

const fetish = require("./fetish");

jest.mock("../people");

// Stub test to be expanded on later
test("!fetish", async function() {
    var { bot, m, args, prefix } = setupCmd("fetish");

    await fetish.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "I could find any fetish list for **Natalie** :(");
});
