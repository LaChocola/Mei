"use strict";

const play = require("./play");

jest.mock("../misc");
jest.mock("../servers");

// Stub test to be expanded on later
test("!play", async function() {
    var { bot, m, args, prefix } = setupCmd("play");

    await play.main(bot, m, args, prefix);

    expect(m.channel.createMessage).toBeCalledWith("Please say what you want to do. e.g. `!play <youtube link>`, `!play queue`, `!play current`, or `!play stop`");
});
