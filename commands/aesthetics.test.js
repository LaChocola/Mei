"use strict";

const aesthetics = require("./aesthetics");

// Stub test to be expanded on later
test("!aesthetics", async function() {
    var { bot, m, args, prefix } = setupCmd("aesthetics");

    await aesthetics.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith("You need to add something to say");
});

test("!aesthetics This should be printed in FULL-WIDTH characters.", async function() {
    var { bot, m, args, prefix } = setupCmd("aesthetics", "This should be printed in FULL-WIDTH characters.");

    await aesthetics.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith({
        embed: {
            color: 0xA260F6,
            description: "**Ｔｈｉｓ　ｓｈｏｕｌｄ　ｂｅ　ｐｒｉｎｔｅｄ　ｉｎ　ＦＵＬＬ－ＷＩＤＴＨ　ｃｈａｒａｃｔｅｒｓ．**"
        }
    });
});
