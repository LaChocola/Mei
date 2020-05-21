"use strict";

const invite = require("./invite");

// Stub test to be expanded on later
test("!invite", async function() {
    var { bot, m, args, prefix } = setupCmd("invite");

    await invite.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "Here is my Invite Link, Cya soon~ <https://discordapp.com/oauth2/authorize?client_id=309220487957839872&scope=bot&permissions=527825985>");
});
