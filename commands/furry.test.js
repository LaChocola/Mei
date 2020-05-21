"use strict";

const furry = require("./furry");

jest.mock("../servers");

// Stub test to be expanded on later
test("!furry", async function() {
    var { bot, m, args, prefix } = setupCmd("furry");

    await furry.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "Weirdo", { file: "BUFFER", name: "furry.png" });
});
