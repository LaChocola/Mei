"use strict";

const edit = require("./edit");

jest.mock("../servers");
jest.mock("../misc");

// Stub test to be expanded on later
test("!edit", async function() {
    var { bot, m, args, prefix } = setupCmd("edit");

    await edit.main(bot, m, args, prefix);

    expect(m.reply).toBeCalledWith(
        "These are the settings you can **edit** (Bold represents the default setting):\n\n"
        + "`prefix`: <prefix>, Change the prefix Mei uses in this server, Default prefix is **`!`**\n\n"
        + "`mod`: add | remove, <@person> | <@role>. Add a moderator, or a role for moderators to use Mei's admin features, and edit settings\n\n"
        + "`roles`: add <role> | remove <role> | create <role> | delete <role>, Add or remove the roles Mei can give to users, or create and delete roles in the server. (Roles created by Mei will have no power and no color, and will be at the bottom of the role list)\n\n"
        + "`notifications`: banlog | updates | welcome, enable <@channel> | disable, Allows you to enable, disable, or change channels that certain notifications appear in. Currently supports a log channel for all bans, a log of all users joining and leaving, and editing the welcome message that Mei gives when users join, and what channel each appears in.\n\n"
        + "`art`: remove | add <#channel>, Adds a channel for Mei to use in the `!art` command"
    );
});
