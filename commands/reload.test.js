"use strict";

const reload = require("./say");

// Stub test to be expanded on later
test("!reload", async function() {
    var { bot, m, args, prefix } = setupCmd("reload");

    await reload.main(bot, m, args, prefix);

    expect(m.reply).not.toBeCalled();
});
