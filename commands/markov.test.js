"use strict";

const markov = require("./markov");

// Stub test to be expanded on later
test("!markov", async function() {
    var { bot, m, args, prefix } = setupCmd("markov");

    await markov.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("That user does not have enough messages to make a markov", 5000);
});
