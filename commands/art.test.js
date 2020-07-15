"use strict";

const art = require("./art");

jest.mock("../servers");

// Stub test to be expanded on later
test("!art", async function() {
    var { bot, m, args, prefix } = setupCmd("art");

    await art.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("An art channel has not been set up for this server. Please have a mod add one using the command: `!edit art add #channel`", 10000, true);
});
