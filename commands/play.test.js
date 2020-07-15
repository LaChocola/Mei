"use strict";

const play = require("./play");

jest.mock("../misc");
jest.mock("../servers");

beforeEach(function() {
    // Mock console to prevent messages from showing up during testing
    jest.spyOn(console, "debug").mockImplementation();
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
    jest.spyOn(console, "warn").mockImplementation();
});

afterEach(function() {
    // Unmock console
    console.debug.mockRestore();
    console.log.mockRestore();
    console.error.mockRestore();
    console.warn.mockRestore();
});

// Stub test to be expanded on later
test("!play", async function() {
    var { bot, m, args, prefix } = setupCmd("play");

    await play.main(bot, m, args, prefix);

    expect(m.channel.createMessage).toBeCalledWith("Please say what you want to do. e.g. `!play <youtube link>`, `!play queue`, `!play current`, or `!play stop`");
});
