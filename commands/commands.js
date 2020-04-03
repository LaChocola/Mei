"use strict";

const escapeStringRegexp = require("escape-string-regexp");
const path = require("path");
const fs = require("fs").promises;

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
    var files = await fs.readdir(path.join(__dirname));

    var commands = files.map(function(file) {
        var cmd = require(path.join(__dirname, file));
        var cmdName = path.parse(file).name;

        return {
            name: cmdName,
            help: cmd.help,
            hidden: cmd.hidden
        };
    });

    return commands;
}

// Takes a command and prefix, and returns a help line string
function formatHelpLine(command, prefix) {
    var help = command.help.replace(new RegExp(escapeStringRegexp("[prefix]"), "g"));
    var helpLine = "`" + prefix + command.name + "` " + help + ".";
    return helpLine;
}

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
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
