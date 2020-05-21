"use strict";

const ship = require("./ship");

// Stub test to be expanded on later
test("!ship", async function() {
    var { bot, m, args, prefix } = setupCmd("ship");

    await ship.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "Ship someone together~\n\nUse `!ship <@user1> <@user2>` or `!ship username1 | username2`");
});
