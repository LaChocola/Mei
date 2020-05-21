"use strict";

const help = require("./help");

jest.mock("../misc");

// Stub test to be expanded on later
test("!help", async function() {
    var { bot, m, args, prefix } = setupCmd("help");

    await help.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "To show a help for a certain command, say `!help <command>`.\nIf you want a list of commands, say `!commands`.");
});
