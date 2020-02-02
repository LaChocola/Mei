"use strict";

const escapeStringRegexp = require("escape-string-regexp");

const ids = require("../ids");
const commands = require("../commands");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        if (m.author.id !== ids.users.chocola) {
            return;
        }

        // Remove prefix from command name, if it exists
        var commandName = args.replace(new RegExp("^" + escapeStringRegexp(prefix)), "").toLowerCase();

        if (commandName === "") {
            await m.reply(`To reload a command, say \`${prefix}reload <command>\`.`);
            return;
        }

        try {
            if (commandName === "all") {
                commands.reloadAll();
            }
            else {
                commands.reload(commandName);
            }
        }
        catch (err) {
            if (err instanceof commands.CommandsError) {
                m.reply(err.message);
                return;
            }
            throw err;
        }

        m.reply(`Reloaded ${commandName}`);
    },
    help: "Reload a command",
    hidden: true
};
