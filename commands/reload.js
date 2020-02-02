"use strict";

const conf = require("../conf");
const ids = require("../ids");
const commands = require("../commands");
const misc = require("../misc");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        if (m.author.id !== ids.users.chocola) {
            return;
        }

        var commandName = args.toLowerCase();
        if (commandName === "") {
            await m.reply(`To reload a command, say \`${prefix}reload <command>\`.`);
            return;
        }

        // Special case for reloading config file
        if (commandName === "config") {
            conf.load();
            await m.reply("Reloaded config");
            return;
        }

        try {
            if (commandName === "all") {
                commands.reloadAll();
            }
            else {
                // Remove prefix from command name, if it exists
                commandName = misc.removePrefix(prefix, commandName);
                commands.reload(commandName);
            }
        }
        catch (err) {
            if (err instanceof commands.CommandsError) {
                await m.reply(err.message);
                return;
            }
            throw err;
        }

        await m.reply(`Reloaded ${commandName}`);
    },
    help: "Reload a command",
    hidden: true
};
