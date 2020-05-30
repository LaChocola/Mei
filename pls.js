"use strict";

const ids = require("./ids");
const misc = require("./misc");
const datadb = require("./data");
const cmdmanager = require("./cmdmanager");

var plsCommands = {
    // eslint-disable-next-line no-unused-vars
    "stop": async function(bot, m, args) {
        await m.reply("Let me rest my eyes for a moment", 1500, true);
        // This needs a delay in order to give m.reply() time to delete the messages
        await misc.delay(2000);
        process.exit(0);
    },
    // eslint-disable-next-line no-unused-vars
    "override": async function(bot, m, args) {
        await m.reply("Chocola Recognized. Permission overrides engaged. I am at your service~", 2000);
    },
    // eslint-disable-next-line no-unused-vars
    "mute": async function(bot, m, args) {
        if (!m.guild.id === ids.guilds.smallworld) {
            return;
        }
        if (m.mentions.length === 0) {
            return;
        }
        for (let mention of m.mentions) {
            await bot.addGuildMemberRole(m.guild.id, mention.id, ids.roles.role2, "Daddy said shush");
            await m.reply(misc.chooseHand(), 5000);
        }
    },
    // eslint-disable-next-line no-unused-vars
    "unmute": async function(bot, m, args) {
        if (!m.guild.id === ids.guilds.smallworld) {
            return;
        }
        if (m.mentions.length === 0) {
            return;
        }
        for (let mention of m.mentions) {
            await bot.removeGuildMemberRole(m.guild.id, mention.id, ids.roles.role2, "Daddy said speak");
            await m.reply(misc.chooseHand(), 5000);
        }
    },
    // eslint-disable-next-line no-unused-vars
    "disable": async function(bot, m, args) {
        let command = args;
        let data = await datadb.load();

        if (!command) {
            await m.reply("Please specify a command to disable.", 5000, true);
            return;
        }

        if (!cmdmanager.has(command)) {
            await m.reply(`"${command}" is not a valid command, please try again.`, 5000, true);
            return;
        }

        if (!await cmdmanager.isEnabled(command, data)) {
            await m.reply(`"${command}" is already disabled. Doing nothing.`, 5000, true);
            return;
        }

        await cmdmanager.disable(command, data);
        await m.reply(`"${command}" has been disabled.`, 5000, true);
    },
    // eslint-disable-next-line no-unused-vars
    "enable": async function(bot, m, args) {
        let command = args;
        let data = await datadb.load();

        if (!command) {
            await m.reply("Please specify a command to enable.", 5000, true);
            return;
        }

        if (!cmdmanager.has(command)) {
            await m.reply(`"${command}" is not a valid command, please try again.`, 5000, true);
            return;
        }

        if (await cmdmanager.isEnabled(command, data)) {
            await m.reply(`"${command}" is already enabled. Doing nothing.`, 5000, true);
            return;
        }

        await cmdmanager.enable(command, data);
        await m.reply(`"${command}" has been enabled.`, 5000, true);
    },
    // eslint-disable-next-line no-unused-vars
    "load": async function(bot, m, args) {
        // TODO: Add load command
    },
    // eslint-disable-next-line no-unused-vars
    "unload": async function(bot, m, args) {
        // TODO: Add unload command
    },
    // eslint-disable-next-line no-unused-vars
    "reload": async function(bot, m, args) {
        // TODO: Add reload command
    }
};

async function pls(bot, m) {
    if (m.author.bot) {
        return;
    }

    if (!m.guild) {
        return;
    }

    if (!(m.author.id === ids.users.chocola || m.author.id === await bot.getOwnerID())) {
        return;
    }

    var [ cmdName, subCmdName, args] = misc.splitBySpace(m.content, 2);
    cmdName = cmdName.toLowerCase();
    subCmdName = subCmdName.toLowerCase();

    if (cmdName !== "pls") {
        return;
    }

    var cmd = plsCommands[subCmdName];
    if (!cmd) {
        return;
    }

    await cmd(bot, m, args);
}

module.exports = pls;
