"use strict";

const avy = require("./avy");

// Stub test to be expanded on later
test("!avy", async function() {
    var { bot, m, args, prefix } = setupCmd("avy");

    await avy.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith({
        embed: {
            color: 0xA260F6,
            title: "Natalie",
            description: "[Link](https://cdn.discordapp.com/avatars/137269976255037440/a_1ef11f3e09a2bd2c07b9c881d614d287.gif?size=1024)",
            image: {
                url: "https://cdn.discordapp.com/avatars/137269976255037440/a_1ef11f3e09a2bd2c07b9c881d614d287.gif?size=1024"
            }
        }
    });
});
