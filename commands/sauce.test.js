"use strict";

const sauce = require("./sauce");

// Stub test to be expanded on later
test("!sauce", async function() {
    var { bot, m, args, prefix } = setupCmd("sauce");

    await sauce.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith("658894691311550474", "Please add an image, or image url");
});
