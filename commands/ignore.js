"use strict";

const Global = require("../models/global");
const ids = require("../ids");
const misc = require("../misc");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        if (m.author.id !== ids.users.chocola) {
            return;
        }

        // Remove command
        var cleanArgs = misc.removePrefix(`${prefix}ignore`, m.cleanContent);

        // Remove undo arg, if present
        var undoArg = cleanArgs.startsWith("undo");
        if (undoArg) {
            cleanArgs = misc.removePrefix("undo", m.cleanContent);
        }

        var [nameArg, reason] = misc.split(cleanArgs, "|", 1);
        if (reason) {
            reason = reason.trim();
        }
        else {
            reason = "No Reason specified";
        }

        var globaldata = await Global.get();

        var mentioned = m.mentions[0];
        if (!mentioned) {
            nameArg = nameArg.trim().toLowerCase();
            mentioned = m.guild.members.find(m => nameArg === m.username.toLowerCase() || (m.nick && nameArg === m.nick.toLowerCase()));
        }
        if (!mentioned) {
            var idArg = nameArg.replace("<@", "").replace(">", "");
            if (misc.isNum(idArg)) {
                var user = await Bot.users.get(idArg);
                mentioned = {
                    id: idArg,
                    fullname: user && user.fullname || "Unknown User"
                };
            }
        }

        if (!mentioned) {
            await m.reply("User or User ID not found. Please enter a user or user id, and try again", 2500);
            await m.deleteIn(2500);
            return;
        }

        var userban = globaldata.banned.find(b => b.userid === mentioned.id);

        if (undoArg) {
            if (!userban) {
                await m.reply(`The ID "${mentioned.id}" was not found in the list of ignored users. Nothing to undo.`, 5000);
                await m.deleteIn(5000);
                return;
            }

            userban.remove();
            await globaldata.save();
            await m.reply(`Welcome back, ${mentioned.fullname} (${mentioned.id}) ${misc.chooseHand()}`, 5000);
            await m.deleteIn(5000);
        }
        else {
            if (userban) {
                await m.reply(`${misc.chooseHand()} (${mentioned.id}) is already in the ignored users list. Nothing to add.`, 5000);
                await m.deleteIn(5000);
                return;
            }

            globaldata.banned.push({ userid: mentioned.id, reason: reason });
            await globaldata.save();
            await m.reply(`Goodbye, ${mentioned.fullname} (${mentioned.id}) ${misc.chooseHand()}`);
            await m.deleteIn(5000);
            console.log(mentioned.id, reason, globaldata.banned);
        }
    },
    help: "No",
    hidden: true
};
