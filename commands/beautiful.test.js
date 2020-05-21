"use strict";

const beautiful = require("./beautiful");

// Stub test to be expanded on later
test("!beautiful", async function() {
    var { bot, m, args, prefix } = setupCmd("beautiful");

    await beautiful.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "", { file: "BUFFER", name: "Nataliebeautiful.png" });
});
