"use strict";

const commands = require("../commands");

const embedLimit = 1800;

function formatHelp(prefix, name, help) {
    return "`" + prefix + name + "` " + help + ".\n";
}

module.exports = {
    main: async function(bot, m, args, prefix) {
        const commandNames = commands.list();
        var loadedCommands = commandNames.map(n => commands.load(n));
        var publicCommands = loadedCommands.filter(c => !c.hidden);
        var lines = publicCommands.map(c => formatHelp(prefix, c.label, c.description));

        var embeds = [""];
        for (let line of lines) {
            // If adding a command to this message would make things too long, start a new message
            if (embeds[embeds.length - 1].length + line.length > embedLimit) {
                embeds.push("");
            }
            embeds[embeds.length - 1] += line;
        }

        for (let embed of embeds) {
            m.channel.createMessage({
                embed: {
                    color: 0x5A459C,
                    description: embed
                }
            });
        }
    },
    help: "List of commands"
};
