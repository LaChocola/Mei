"use strict";

const conf = require("../conf");
const utils = require("../utils");

async function pls(bot, m, args, prefix) {
    var commandArgs = utils.commandParser.parse(m, prefix);
    if (!commandArgs) {
        return;
    }

    if (m.author.id !== conf.users.owner) {
        return;
    }
    if (m.command.label !== "pls") {
        return;
    }
    var subcommand = commandArgs[0];

    if (subcommand === "stop") {
        m.reply("Let me rest my eyes for a moment", 1500);
        m.deleteIn(1500);
        await utils.delay(1500);
        process.exit(0);
    }
    else if (subcommand === "override") {
        m.reply("Chocola Recognized. Permission overrides engaged. I am at your service~", 2000);
        m.deleteIn(2000);
    }
    /* TODO: Limit mute and unmute to guilds which have the conf.roles.role2 role
     *  OR allow each guilds to specify their own muted role
     *  OR automatically create a muted role as necessary
     */
    else if (subcommand === "mute") {
        if (m.mentions.length === 0) {
            // TODO: Provide a helpful message to user?
            return;
        }
        for (let mention of m.mentions) {
            m.guild.addMemberRole(mention.id, conf.roles.role2, "Daddy said shush");
        }
        m.reply(utils.hands.ok());
        m.deleteIn(5000);
    }
    if (subcommand === "unmute" && m.mentions.length > 0) {
        if (m.mentions.length === 0) {
            // TODO: Provide a helpful message to user?
            return;
        }
        for (let mention of m.mentions) {
            m.guild.removeMemberRole(mention.id, conf.roles.role2, "Daddy said speak");
        }
        m.reply(utils.hands.ok());
        m.deleteIn(5000);
    }
}

module.exports = {
    main: pls,
    hidden: true
};
