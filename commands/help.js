"use strict";

const path = require("path");
const fs = require("fs").promises;

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        args = args.replace(prefix, "");
        if (args !== "") {
            var commands = await fs.readdir(path.join(__dirname));
            if (commands.indexOf(args + ".js") > -1) {
                var cmd = require(path.join(__dirname, args + ".js"));
                if (!cmd.hidden) {
                    Bot.createMessage(m.channel.id, "`" + prefix + args + "`, " + cmd.help);
                    return;
                }
                return;
            }
            else {
                Bot.createMessage(m.channel.id, "That command doesn't exist.");
                return;
            }
        }
        else {
            Bot.createMessage(m.channel.id, `To show a help for a certain command, say \`${prefix}help <command>\`.\nIf you want a list of commands, say \`${prefix}commands\`.`);
            return;
        }
    },
    help: "Command help"
};
