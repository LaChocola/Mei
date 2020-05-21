"use strict";

const evalCmd = require("./eval");

jest.mock("../misc");

// Stub test to be expanded on later
test("!eval", async function() {
    var { bot, m, args, prefix } = setupCmd("eval");

    await evalCmd.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "Are you a real villain?");
});
