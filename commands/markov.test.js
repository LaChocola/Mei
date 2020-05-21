"use strict";

const markov = require("./markov");

// Stub test to be expanded on later
test("!markov", async function() {
    var { bot, m, args, prefix } = setupCmd("markov");

    await markov.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith(m.channel.id, "That user does not have enough messages to make a markov");
});
