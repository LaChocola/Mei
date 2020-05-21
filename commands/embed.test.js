"use strict";

const embed = require("./embed");

// Stub test to be expanded on later
test("!embed", async function() {
    var { bot, m, args, prefix } = setupCmd("embed");

    await embed.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", { embed: { color: 10641654, description: "**Embedded Text:**\n" } });
});
