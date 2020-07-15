"use strict";

const suggest = require("./suggest");

// Stub test to be expanded on later
test("!suggest", async function() {
    var { bot, m, args, prefix } = setupCmd("suggest");

    await suggest.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("Please add your suggestion. i.e. ``!suggest 'You were smushed by XXX when she forgot to check her seat before sitting down'``, but maybe not that short :P", 30000, true);
});
