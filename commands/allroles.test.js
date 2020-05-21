"use strict";

const allroles = require("./allroles");

// Stub test to be expanded on later
test("!allroles", async function() {
    var { bot, m, args, prefix } = setupCmd("allroles");

    await allroles.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("Code Monkey  |  Mei  |  Sizebot");
});
