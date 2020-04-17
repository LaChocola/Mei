"use strict";

const serversdb = require("../servers");
const misc = require("../misc");

// Get recent messages from a channel
async function getMessages(bot, channelId, messageCount, userId) {
    var msgIds;
    if (userId) {
        var maxHistoryCount = 102;
        var msgHistory = await bot.getMessages(channelId, maxHistoryCount);
        msgIds = msgHistory
            .filter(msg => msg.author.id === userId)
            .slice(0, messageCount)
            .map(msg => msg.id);
    }
    else {
        var msgs = await bot.getMessages(channelId, messageCount);
        msgIds = msgs.map(msg => msg.id);
    }
    return msgIds;
}

// Bulk delete messages
async function deleteMessages(bot, channelId, msgIds, message) {
    // Only messages less than two weeks old can be bulk deleted
    var twoWeeksAgo = Date.now() - 1421280000000;
    var twoWeeksAgoId = misc.timestampToSnowflake(twoWeeksAgo);
    var [bulkDelete, singleDelete] = misc.splitArray(msgIds, id => id > twoWeeksAgoId);

    while (bulkDelete.length >= 2) {
        // Only 2-100 messages can be bulk deleted at a time
        var toDelete = bulkDelete.splice(0, 100);
        await bot.deleteMessages(channelId, toDelete, message);
    }

    // If there is a remaining message we couldn't bulk delete, then just single delete it
    if (bulkDelete[0]) {
        singleDelete.push(bulkDelete[0]);
    }

    for (let id of singleDelete) {
        await bot.deleteMessage(channelId, id, message);
    }
}

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        await m.delete();

        var argsArray = m.cleanContent.replace(`${prefix}clean `, "").split(" ");

        var guildsdata = await serversdb.load();

        await misc.updateGuild(m, guildsdata);

        // If a number is included in args, delete that many message
        var intArg = argsArray.find(arg => misc.isNum(arg));
        var deleteCount = misc.toNum(intArg) || 10;

        // If "all" is included in args, delete messages from everyone
        var argAll = argsArray.includes("all");

        // If a user is mentioned, delete messages from that user
        var mentionedId = m.mentions[0] && m.mentions[0].id;

        // Only Chocola or mods can run this command
        var memberIsMod = misc.isMod(m.member, m.guild, guildsdata[m.guild.id]);
        var hasPerms = misc.hasSomePerms(m.member, ["administrator", "manageMessages"]);
        if (!(memberIsMod || hasPerms)) {
            var rejectResponses = [
                "Are you a real villan?",
                "Have you ever caught a good guy?\nLike a real super hero?",
                "Have you ever tried a disguise?",
                "What are you doing?!?!?!",
                "*NO!*, Don't touch that!",
                "Fuck Off",
                "Roses are red\nfuck me ;)"
            ];
            var rejectResponse = misc.choose(rejectResponses);
            m.reply(rejectResponse);
            return;
        }

        if (!(mentionedId || argAll)) {
            m.reply("Please mention who you want to clean or say 'all', and optionally, a number of messages to delete from them", 5000);
            return;
        }

        var msgIds = await getMessages(bot, m.channel.id, deleteCount, mentionedId);

        if (msgIds.length === 0) {
            m.reply("Nothing to clean up", 5000);
            return;
        }

        var progressMsg = await m.reply(`Cleaning ${msgIds.length} messages`);
        await deleteMessages(bot, m.channel.id, msgIds, encodeURIComponent(`${msgIds.length} messages cleaned. Approved by ${m.member.fullname}`));
        await progressMsg.delete();
        m.reply(`Cleaned ${msgIds.length} messages`, 5000);
    },
    help: "Clean stuff. `[prefix]clean @Chocola X` to delete the last X messages. Defaults to 100"
};
