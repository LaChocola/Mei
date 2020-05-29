"use strict";

const escapeStringRegexp = require("escape-string-regexp");

const cmdmanager = require("../cmdmanager");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var commandName = args.replace(prefix, "");
        if (commandName !== "") {
            var commands = cmdmanager.list();
            if (commands.includes(args)) {
                var cmd = cmdmanager.get(commandName);
                if (!cmd.hidden) {
                    bot.createMessage(m.channel.id, "`" + prefix + args + "`, " + cmd.help.replace(new RegExp(escapeStringRegexp("[prefix]"), "g"), prefix));
                    return;
                }
                return;
            }
            else {
                bot.createMessage(m.channel.id, "That command doesn't exist.");
                return;
            }
        }
        else {
            bot.createMessage(m.channel.id, `To show a help for a certain command, say \`${prefix}help <command>\`.\nIf you want a list of commands, say \`${prefix}commands\`.`);
            return;
        }
    },
    help: "Command help"
};
