"use strict";

const evalCmd = require("./eval");

jest.mock("../misc");

// TODO: Test does not exit correctly
// Stub test to be expanded on later
test("!eval", async function() {
    var { bot, m, args, prefix } = setupCmd("eval");

    await evalCmd.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("Are you a real villain?", 5000, true);
});
