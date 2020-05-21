"use strict";

const commands = require("./commands");

jest.mock("../misc");

test("!commands", async function() {
    var { bot, m, args, prefix } = setupCmd("commands");

    await commands.main(bot, m, args, prefix);

    expect(m.channel.createMessage).toBeCalledWith({embed: {
        color: 0x5A459C,
        description: "`!8ball` !8ball help string.\n`!aesthetics` !aesthetics help string.\n`!art` !art help string."
    }});
});
