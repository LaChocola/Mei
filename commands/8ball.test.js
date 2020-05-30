"use strict";

const eightball = require("./8ball");

test("!8ball", async function() {
    var { bot, m, args, prefix } = setupCmd("8ball");

    await eightball.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("Please add something");
});

test("!8ball Will this test succeed?", async function() {
    var { bot, m, args, prefix } = setupCmd("8ball", "Will this test succeed?");

    await eightball.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("***Will this test succeed?***\n:8ball: it is certain");
});
