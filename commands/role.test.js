"use strict";

const role = require("./role");

jest.mock("../servers");

// Stub test to be expanded on later
test("!role", async function() {
    var { bot, m, args, prefix } = setupCmd("role");

    await role.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "What do you want to do? | `!role add <role name>` | `!role remove <role name>` | `!role list`");
});
