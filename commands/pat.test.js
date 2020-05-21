"use strict";

const pat = require("./pat");

jest.mock("../misc");

// Stub test to be expanded on later
test("!pat", async function() {
    var { bot, m, args, prefix } = setupCmd("pat");

    await pat.main(bot, m, args, prefix);

    expect(bot.createMessage).toBeCalledWith(
        "658894691311550474",
        {
            embed: {
                author: {
                    icon_url: "https://cdn.discordapp.com/avatars/137269976255037440/a_1ef11f3e09a2bd2c07b9c881d614d287.gif?size=128",
                    name: "Natalie"
                },
                color: 10641654,
                image: {
                    url: "https://78.media.tumblr.com/f95f14437809dfec8057b2bd525e6b4a/tumblr_omvkl2SzeK1ql0375o1_500.gif"
                },
                title: "It's okay to pat yourself too~"
            }
        }
    );
});
