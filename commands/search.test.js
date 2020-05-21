"use strict";

const search = require("./search");

// Stub test to be expanded on later
test("!search", async function() {
    var { bot, m, args, prefix } = setupCmd("search");

    await search.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("Google Stuff\nAdd a term to search for the result using the format `!search <term>`. Ex: `!search discord`", 10000, true);
});
