"use strict";

const escapeStringRegexp = require("escape-string-regexp");

const cmdmanager = require("../cmdmanager");
const splitPages = require("../utils/splitPages");

// Takes a command and prefix, and returns a help line string
function formatHelpLine(command, prefix) {
    var help = command.help.replace(new RegExp(escapeStringRegexp("[prefix]"), "g"), prefix);
    var helpLine = "`" + prefix + command.name + "` " + help + ".";
    return helpLine;
}

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var commands = cmdmanager.getAll();
        var publicCommands = commands.filter(c => !c.hidden);
        var helpText = publicCommands.map(c => formatHelpLine(c, prefix)).join("\n");
        var pages = splitPages(helpText, 2048);

        pages.forEach(function(p) {
            m.reply({
                embed: {
                    color: 0x5A459C,
                    description: p
                }
            });
        });
    },
    help: "List of commands"
};
