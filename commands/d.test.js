"use strict";

const d = require("./d");

// Stub test to be expanded on later
test("!d", async function() {
    var { bot, m, args, prefix } = setupCmd("d");

    await d.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("Please put the roll in the format of `!d 1d20`. where `1` is the number of times to roll, and `20` is the highest number possilbe on the roll.", 15000, true);
});
