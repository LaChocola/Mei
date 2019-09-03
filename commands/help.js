"use strict";

const Eris = require("eris");

const commands = require("../commands");

async function main(m, args) {
    var label = args[0];
    if (!label) {
        // TODO: Replace .commands with this
        return `To show a help for a certain command, say \`${m.prefix}help <command>\`.\n`
            + `If you want a list of commands, say \`${m.prefix}commands\`.`;
    }

    var cmdList = commands.list();
    if (!cmdList.includes(label)) {
        return "That command doesn't exist.";
    }

    var cmd = commands.load(label);
    if (cmd.hidden) {
        return "That command doesn't exist.";
    }

    return `**${m.prefix}${label}** ${cmd.usage || ""}\n`
        + `${cmd.fullDescription || cmd.description}`;
}

module.exports = new Eris.Command("help", main, {
    description: "Command help",
    fullDescription: "Use this command to get detailed help about specific commands.",
    usage: "<command>"
});
