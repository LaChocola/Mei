"use strict";

const uptime = require("./uptime");

// Stub test to be expanded on later
test("!uptime", async function() {
    var { bot, m, args, prefix } = setupCmd("uptime");

    await uptime.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "I have been running for:\n:alarm_clock: 1 second :alarm_clock:");
});
