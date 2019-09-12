"use strict";

const conf = require("../conf");
const utils = require("../utils");
const dbs = require("../dbs");

module.exports = {
    main: async function(bot, m, args, prefix) {
        var globalData = await dbs.global.load();

        if (m.author.id !== conf.users.owner) {
            return;
        }
        var name1 = m.cleanContent.replace(`${prefix}ignore`, "").replace(/\bundo\b/, "").trim().split(" | ");
        var member = m.guild.members.find(m => utils.isSameMember(m, name1[0]) || utils.isSameMember(m, name1[1]));
        var mentioned = m.mentions[0] || member;
        var id;
        var name;
        if (mentioned) {
            id = mentioned.id;
            name = mentioned.username;
        }
        var args2 = m.cleanContent.replace(`${prefix}ignore`, "").replace(/\bundo\b/, "").replace("<@", "").replace(">", "").trim().split(" | ");
        if (!id) {
            if (utils.isNum(args2[0])) {
                id = args2[0];
            }
        }
        if (args2[1]) {
            if (utils.isNum(args2[1])) {
                id = args2[1];
                return;
            }
            var reason = args2[1].trim();
        }
        if (!name) {
            var user = bot.users.get(id);
            if (!user || !user.username) {
                name = "Unknown User";
                return;
            }
            name = user.username;
        }
        var discrim = bot.users.get(id).discriminator;
        if (discrim) {
            name = `${name}#${discrim}`;
        }
        if (!id) {
            m.reply("User or User ID not found. Please enter a user or user id, and try again", 2500);
            m.deleteIn(2500);
        }
        args = args.split(" ");
        if (args.indexOf("undo") > -1) {
            if (!globalData.banned.global[id]) {
                m.reply(`The ID "${id}" was not found in the list of ignored users. Nothing to undo.`, 5000);
                m.deleteIn(5000);
                return;
            }
            if (globalData.banned.global[id]) {
                delete globalData.banned.global[id];
                await dbs.global.save(globalData);
                m.reply(`Welcome back, ${name} (${id}) ${utils.hands.ok()}`, 5000);
                m.deleteIn(5000);
            }
            return;
        }
        if (id) {
            if (globalData.banned.global[id]) {
                m.reply(`${name} (${id}) is already in the ignored users list. Nothing to add.`, 5000);
                m.deleteIn(5000);
                return;
            }
            if (!reason) {
                globalData.banned.global[id] = "No Reason specified";
            }
            if (reason) {
                globalData.banned.global[id] = reason;
            }
        }
        console.log(id, reason, globalData.banned.global);

        await dbs.global.save(globalData);
        m.reply(`Goodbye, ${name} (${id}) ${utils.hands.ok()}`, 5000);
        m.deleteIn(5000);
    },
    help: "No",
    hidden: true
};
