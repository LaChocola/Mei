"use strict";

const booruCmd = require("./booru");

jest.mock("../people");

// Stub test to be expanded on later
test("!booru", async function() {
    var { bot, m, args, prefix } = setupCmd("booru");

    await booruCmd.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "No search tags were added. Defaulting to search for `giantess` on site: `giantessbooru.com`");
});
