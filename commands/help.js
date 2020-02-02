"use strict";

const escapeStringRegexp = require("escape-string-regexp");

const commands = require("../commands");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        // Remove prefix from command name, if it exists
        var commandName = args.replace(new RegExp("^" + escapeStringRegexp(prefix)), "").toLowerCase();

        if (commandName === "") {
            await m.reply(`To show a help for a certain command, say \`${prefix}help <command>\`.\nIf you want a list of commands, say \`${prefix}commands\`.`);
            return;
        }

        var cmd = commands.commands[commandName];
        if (!cmd || cmd.hidden) {
            await m.reply("That command doesn't exist.");
            return;
        }

        m.reply("`" + prefix + commandName + "` " + cmd.help.replace(new RegExp(escapeStringRegexp("[prefix]"), "g"), prefix));
    },
    help: "Command help"
};
