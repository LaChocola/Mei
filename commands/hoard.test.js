"use strict";

const hoard = require("./hoard");

jest.mock("../people");

// Stub test to be expanded on later
test("!hoard", async function() {
    var { bot, m, args, prefix } = setupCmd("hoard");

    await hoard.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("Could not find any hoard for **Natalie**", 5000, true);
});
