"use strict";

const fs = require("fs");

module.exports = {
    main: function(Bot, m, args, prefix) {
        var args = args.replace(prefix, "")
        if (args != "") {
            var commands = fs.readdirSync("./commands/");
            if (commands.indexOf(args + ".js") > -1) {
                var cmd = require("./" + args + ".js");
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
}
