"use strict";

const escapeStringRegexp = require("escape-string-regexp");
const path = require("path");
const fs = require("fs").promises;

function format(file, help, prefix) {
    var line = "`" + prefix + file.replace(".js", "") + "` " + help + ".";
    return line;
}

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        var files = await fs.readdir(path.join(__dirname));
        var lines = [];
        files.forEach(function(file) {
            const cmd = require(path.join(__dirname, file));
            if (!cmd.hidden) {
                lines.push(format(file, cmd.help.replace(new RegExp(escapeStringRegexp("[prefix]"), "g"), prefix), prefix));
            }
        });
        var middle = Math.floor(lines.length);
        var pageOne = lines.slice(0, middle).join("\n");
        var pageTwo = lines.slice(middle).join("\n");

        Bot.createMessage(m.channel.id, {
            embed: {
                color: 0x5A459C,
                description: "\u200b",
                fields: [
                    {
                        name: "\u200b",
                        value: pageOne,
                        inline: false
                    },
                    {
                        name: "\u200b",
                        value: pageTwo,
                        inline: false
                    }
                ]
            }
        });
    },
    help: "List of commands"
};
