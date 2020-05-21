"use strict";

const stats = require("./stats");

jest.mock("../data");

// Stub test to be expanded on later
test("!stats", async function() {
    var { bot, m, args, prefix } = setupCmd("stats");

    await stats.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", { content: "Stats for: Natalie\n", embed: {color: 5916060, description: "**`0`**/undefined commands (NaN%)\n\n" } });
});
