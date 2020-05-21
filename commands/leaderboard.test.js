"use strict";

const leaderboard = require("./leaderboard");

jest.mock("../people");

// Stub test to be expanded on later
test("!leaderboard", async function() {
    var { bot, m, args, prefix } = setupCmd("leaderboard");

    await leaderboard.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", { embed: { author: { icon_url: undefined, name: "Current *Guild* Leaderboard:"}, color: 10641654, description: "", thumbnail: { url: null } } });
});
