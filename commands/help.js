"use strict";

const Eris = require("eris");

const commands = require("../commands");

async function main(m, args) {
    var label = args[0];
    if (!label) {
        m.reply(`To show a help for a certain command, say \`${m.prefix}help <command>\`.\nIf you want a list of commands, say \`${m.prefix}commands\`.`);
        return;
    }

    var cmdList = commands.list();
    if (!cmdList.includes(label)) {
        m.reply("That command doesn't exist.");
        return;
    }

    var cmd = commands.load(label);
    if (cmd.hidden) {
        m.reply("That command doesn't exist.");
        return;
    }

    m.reply("`" + m.prefix + cmd.label + "`, " + cmd.description);
}

module.exports = new Eris.Command("help", main, {
    description: "Command help"
});
