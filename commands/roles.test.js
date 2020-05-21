"use strict";

const roles = require("./roles");

jest.mock("../servers");

// Stub test to be expanded on later
test("!roles", async function() {
    var { bot, m, args, prefix } = setupCmd("roles");

    await roles.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "You do not currently have any assigned roles in this server.");
});
