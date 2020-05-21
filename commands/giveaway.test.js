"use strict";

const giveaway = require("./giveaway");

jest.mock("../servers");

// Stub test to be expanded on later
test("!giveaway", async function() {
    var { bot, m, args, prefix } = setupCmd("giveaway");

    await giveaway.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "Please add something to giveaway. \n\ni.e. `!giveaway Dragon Dildos` for giving away 'Dragon Dildos'\nor `!giveaway Dragon Dildos | 1` for giving away 'Dragon Dildos' in 1 hour (time defaults to 0.5 hours)");
});
