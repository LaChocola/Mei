"use strict";

const escapeStringRegexp = require("escape-string-regexp");

const misc = require("../misc");
const splitPages = require("../utils/splitPages");

// Returns a list of commands
/*  [
 *      {
 *          name: "commandname",
 *          help: "command help string",
 *          hidden: true/false,
 *      },
 *      ...
 *  ]
 */
async function getCommands() {
    var commandNames = await misc.listCommands();
    var commands = commandNames.map(function(name) {
        var cmd = misc.quickloadCommand(name);

        return {
            name: name,
            help: cmd.help,
            hidden: cmd.hidden
        };
    });

    return commands;
}

// Takes a command and prefix, and returns a help line string
function formatHelpLine(command, prefix) {
    var help = command.help.replace(new RegExp(escapeStringRegexp("[prefix]"), "g"), prefix);
    var helpLine = "`" + prefix + command.name + "` " + help + ".";
    return helpLine;
}

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var commands = await getCommands();
        var publicCommands = commands.filter(c => !c.hidden);
        var helpText = publicCommands.map(c => formatHelpLine(c, prefix)).join("\n");
        var pages = splitPages(helpText, 2048);

        pages.forEach(function(p) {
            m.channel.createMessage({
                embed: {
                    color: 0x5A459C,
                    description: p
                }
            });
        });
    },
    help: "List of commands"
};
