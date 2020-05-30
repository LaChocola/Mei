"use strict";

const pls = require("./pls");

// Setup the variables for a pls command (slightly modified version of a normal command)
function setupPlsCmd(subCmdName, args) {
    args = args || "";
    var { bot, m } = setupCmd();
    m.content = `pls ${subCmdName} ${args}`.trim();
    m.cleanContent = m.content;
    return { bot, m };
}

// Stub test to be expanded on later
test("pls reload", async function() {
    var { bot, m } = setupPlsCmd("pls");
    await pls(bot, m);

    expect(m.reply).not.toBeCalled();
});
