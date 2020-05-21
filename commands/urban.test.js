"use strict";

const urban = require("./urban");

// Stub test to be expanded on later
test("!urban", async function() {
    var { bot, m, args, prefix } = setupCmd("urban");

    await urban.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("Search Urban Dictionary\nAdd a term to search on Urban Dictionary. `!urban <term>`. Ex: `!search discord`", 10000);
});
