"use strict";

const artist = require("./artist");

jest.mock("../people");

// Stub test to be expanded on later
test("!artist", async function() {
    var { bot, m, args, prefix } = setupCmd("artist");

    await artist.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "I could find any links for **Natalie** :(");
});
