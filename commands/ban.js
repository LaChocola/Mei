"use strict";

const serversdb = require("../servers");
const misc = require("../misc");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        var guildsdata = await serversdb.load();

        var argsArray = args.split(" ").filter(a => a);

        var memberIsMod = misc.isMod(m.member, m.guild, guildsdata[m.guild.id]);
        var hasPerms = misc.hasSomePerms(m.member, ["administrator", "banMembers"]);
        if (!(memberIsMod || hasPerms)) {
            var responses = [
                "Are you a real villan?",
                "Have you ever caught a good guy?\nLike a real super hero?",
                "Have you ever tried a disguise?",
                "What are you doing?!?!?!",
                "*NO!*, Don't touch that!",
                "Fuck Off",
                "Roses are red\nfuck me ;)"
            ];
            var response = misc.choose(responses);
            m.reply(response, 5000);
            m.deleteIn(5000);
            return;
        }

        var undoArg = argsArray.includes("undo");

        var modName = m.member.name;
        var [mentionString, reason] = m.content.replace(prefix + "ban ", "").replace(/\bundo\b/, "").split(" | ", 2);
        if (!reason) {
            reason = `Banned by: ${modName}`;
        }

        var stringIds = mentionString.split(" ").filter(id => /\d+/.test(id));
        var mentionIds = m.mentions.map(m => m.id);
        var idsToBan = misc.unique(stringIds.concat(mentionIds));

        if (idsToBan.length === 0) {
            m.reply("Please provide an id or mention to ban a user", 5000);
            m.deleteIn(5000);
            return;
        }

        for (var id of idsToBan) {
            var userToBan = await Bot.users.get(id) || { fullname: "Unknown User" };

            if (undoArg) {
                try {
                    await m.guild.unbanMember(id, "Unbanned by: " + modName);
                    m.reply(misc.chooseHand() + " Successfully unbanned: " + userToBan.fullname + " (" + id + ")", 5000);
                }
                catch (err) {
                    if (err.code === 50013) {
                        if (id === m.guild.ownerID) {
                            m.reply("Uhm, think about what you just tried to do...", 5000);
                        }
                        else {
                            m.reply("I do not have permisson to unban that user. Please make sure I have the `Ban Member` permission", 5000);
                        }
                        return;
                    }

                    m.reply("Something went wrong while trying to unban that member", 5000);
                }
            }
            else {
                try {
                    await m.guild.banMember(id, 0, reason);
                    m.reply(misc.chooseHand() + " Successfully banned: " + userToBan.fullname + " (" + id + ")", 5000);
                }
                catch (err) {
                    if (err.code === 50013) {
                        if (id === m.guild.ownerID) {
                            m.reply("I can not ban the owner of the server, sorry.", 5000);
                        }
                        else {
                            m.reply("I do not have permisson to ban that user. Please make sure I have the `Ban Member` permission, and that my highest role is above theirs", 5000);
                        }
                        return;
                    }

                    m.reply("Something went wrong while trying to ban that member", 5000);
                }
            }
        }
        m.deleteIn(5000);
    },
    help: "Ban someone..."
};
