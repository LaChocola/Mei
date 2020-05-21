"use strict";

const tf = require("./tf");

jest.mock("../getStory");

// Stub test to be expanded on later
test("!tf", async function() {
    var { bot, m, args, prefix } = setupCmd("tf");

    await tf.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("STORY");
});
