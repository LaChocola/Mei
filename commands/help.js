"use strict";

const fs = require("fs");

module.exports = {
    main: function(bot, m, args, prefix) {
        args = args.replace(prefix, "");
        if (args != "") {
            var commands = fs.readdirSync("./commands/");
            if (commands.indexOf(args + ".js") > -1) {
                var cmd = require("./" + args + ".js");
                if (!cmd.hidden) {
                    m.reply("`" + prefix + args + "`, " + cmd.help);
                    return;
                }
                return;
            }
            else {
                m.reply("That command doesn't exist.");
                return;
            }
        }
        else {
            m.reply(`To show a help for a certain command, say \`${prefix}help <command>\`.\nIf you want a list of commands, say \`${prefix}commands\`.`);
            return;
        }
    },
    help: "Command help"
};
