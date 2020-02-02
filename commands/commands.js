"use strict";

const escapeStringRegexp = require("escape-string-regexp");

const commands = require("../commands");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        var message = Object.entries(commands.commands)
            .filter(([commandName, cmd]) => !cmd.hidden)    // eslint-disable-line no-unused-vars
            .map(([commandName, cmd]) => "`" + prefix + commandName + "` " + cmd.help.replace(new RegExp(escapeStringRegexp("[prefix]"), "g"), prefix) + ".")
            .join("\n");

        // TODO: Create function to split large embeds into chunks
        await m.reply({
            embed: {
                color: 0x5A459C,
                description: message
            }
        });
    },
    help: "List of commands"
};
