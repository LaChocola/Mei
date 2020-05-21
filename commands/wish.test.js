"use strict";

const wish = require("./wish");

// Stub test to be expanded on later
test("!wish", async function() {
    var { bot, m, args, prefix } = setupCmd("wish");

    await wish.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "", { file: "BUFFER", name: "wish.png" });
});
