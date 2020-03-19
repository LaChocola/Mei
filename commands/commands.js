"use strict";

const escapeStringRegexp = require("escape-string-regexp");
const path = require("path");
const fs = require("fs").promises;

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
    helpLine = helpLine.slice(0, 1024);  // Limit each line to 1024 characters
    return helpLine;
}

// format lines into pages of a maximum size
function getPages(lines, limit) {
    var pages = [lines.shift()];    // Initialize first page with first line

    lines.forEach(function(line) {
        var appended = pages[pages.length - 1] + "\n" + line;
        if (appended.length <= limit) {
            // If appending the command help doesn't go past the page limit, then just append to the current page
            pages[pages.length - 1] = appended;
        }
        else {
            // Otherwise, start a new page
            pages.push(line);
        }
    });

    return pages;
}

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        var commands = await getCommands();
        var publicCommands = commands.filter(c => !c.hidden);
        var lines = publicCommands.map(c => formatHelpLine(c, prefix));
        var pages = getPages(lines, 1024);
        var fields = pages.map(function(p) {
            return {
                name: "\u200b",
                value: p,
                inline: false
            };
        });

        Bot.createMessage(m.channel.id, {
            embed: {
                color: 0x5A459C,
                fields: fields
            }
        });
    },
    help: "List of commands"
};
