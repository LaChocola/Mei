"use strict";

const escapeStringRegexp = require("escape-string-regexp");
const path = require("path");
const fs = require("fs").promises;

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        function format(file, help) {
            const line = "`" + prefix + file.replace(".js", "") + "` " + help + ".";
            return line;
        }
        const files = await fs.readdir(path.join(__dirname));
        const lines = [];
        files.forEach(function(file) {
            if (lines.length < 1800) {
                const cmd = require(path.join(__dirname, file));
                if (!cmd.hidden) {
                    lines.push(format(file, cmd.help.replace(new RegExp(escapeStringRegexp("[prefix]"), "g"), prefix)));
                }
            }
        });
        const message = lines.join("\n");
        console.log(message.length);
        console.log(message);

        Bot.createMessage(m.channel.id, {
            embed: {
                color: 0x5A459C,
                description: message
            }
        });
    },
    help: "List of commands"
};
