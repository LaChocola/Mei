"use strict";

const serversdb = require("../servers");
const misc = require("../misc");
const ids = require("../ids");

// If the guild owner has changed, then update the guild data
async function updateGuildData(Bot, m, data) {
    var guildData = data[m.guild.id];
    if (!guildData) {
        return;
    }
    if (guildData.owner !== m.guild.ownerID) {
        Bot.createMessage(m.channel.id, "New server owner detected, updating database.")
            .then(misc.deleteIn(5000));
        guildData.owner = m.guild.ownerID;
        await serversdb.save(data);
    }
}

/*  
 * Check if user is a mod
 *
 * User must be at least one of the following:
 *  - Guild owner
 *  - Have at least one of the following permissions:
 *      - banMembers
 *      - administrator
 *      - manageChannels
 *      - manageGuild
 *      - manageMessages
 *  - Configured as a guild mod in Mei (!edit mod add @role)
 *  - Have a role that is configured as a guild mod role in Mei (!edit mod add @role)
 */
function isMod(guildData, member, guild) {
    var isOwner = member.id === guild.ownerID;
    if (isOwner) {
        return true;
    }

    var perms = member.permission.json;
    var pArray = ["banMembers", "administrator", "manageChannels", "manageGuild", "manageMessages"];
    // var pArray = ["banMembers", "administrator", "manageChannels", "manageGuild", "manageMessages", "kickMembers"];
    var hasPerms = pArray.some(p => perms[p]);
    if (hasPerms) {
        return true;
    }

    var userIsMod = guildData && guildData.mods && guildData.mods[member.id];
    if (userIsMod) {
        return true;
    }

    var hasModRole = guildData && guildData.modRoles && member.roles.some(roleId => guildData.modRoles[roleId]);
    if (hasModRole) {
        return true;
    }

    return false;
}

// Get recent messages from a channel
async function getMessages(Bot, channelId, messageCount, userId) {
    var msgIds;
    if (userId) {
        var maxHistoryCount = 102;
        var msgHistory = await Bot.getMessages(channelId, maxHistoryCount);
        msgIds = msgHistory
            .filter(msg => msg.author.id === userId)
            .slice(0, messageCount)
            .map(msg => msg.id);
    }
    else {
        var msgs = await Bot.getMessages(channelId, messageCount);
        msgIds = msgs.map(msg => msg.id);
    }
    return msgIds;
}

// Bulk delete messages
async function deleteMessages(Bot, channelId, msgIds, message) {
    // Only messages less than two weeks old can be bulk deleted
    var twoWeeksAgo = Date.now() - 1421280000000;
    var twoWeeksAgoId = misc.timestampToSnowflake(twoWeeksAgo);
    var [bulkDelete, singleDelete] = misc.splitArray(msgIds, id => id > twoWeeksAgoId);

    while (bulkDelete.length >= 2) {
        // Only 2-100 messages can be bulk deleted at a time
        var toDelete = bulkDelete.splice(0, 100);
        await Bot.deleteMessages(channelId, toDelete, message);
    }

    // If there is a remaining message we couldn't bulk delete, then just single delete it
    if (bulkDelete[0]) {
        singleDelete.push(bulkDelete[0]);
    }

    for (let id of singleDelete) {
        await Bot.deleteMessage(channelId, id, message);
    }
}

module.exports = {
    main: async function (Bot, m, args, prefix) {
        await m.delete();

        var argsArray = m.cleanContent.replace(`${prefix}clean `, "").split(" ");

        var data = await serversdb.load();
        await updateGuildData(Bot, m, data);
        var guildData = data[m.guild.id];
        var member = m.guild.members.get(m.author.id);

        // If a number is included in args, delete that many message
        var intArg = argsArray.find(arg => misc.isNum(arg));
        var deleteCount = misc.toNum(intArg) || 10;

        // If "all" is included in args, delete messages from everyone
        var argAll = argsArray.includes("all");

        // If a user is mentioned, delete messages from that user
        var mentionedId = m.mentions[0] && m.mentions[0].id;

        // Only Chocola or mods can run this command
        var userIsMod = isMod(guildData, member, m.guild);
        var isChocola = m.author.id === ids.users.chocola;

        if (!(userIsMod || isChocola)) {
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
            Bot.createMessage(m.channel.id, rejectResponse);
            return;
        }

        if (!(mentionedId || argAll)) {
            Bot.createMessage(m.channel.id, "Please mention who you want to clean or say 'all', and optionally, a number of messages to delete from them")
                .then(misc.deleteIn(5000));
            return;
        }

        var msgIds = await getMessages(Bot, m.channel.id, deleteCount, mentionedId);

        if (msgIds.length === 0) {
            Bot.createMessage(m.channel.id, "Nothing to clean up")
                .then(misc.deleteIn(5000));
            return;
        }

        var progressMsg = await Bot.createMessage(m.channel.id, `Cleaning ${msgIds.length} messages`);
        await deleteMessages(Bot, m.channel.id, msgIds, encodeURIComponent(`${msgIds.length} messages cleaned. Approved by ${m.author.username}#${m.author.discriminator}`));
        await progressMsg.delete();
        Bot.createMessage(m.channel.id, `Cleaned ${msgIds.length} messages`)
            .then(misc.deleteIn(5000));
    },
    help: "Clean stuff. `!clean @Chocola X` to delete the last X messages. Defaults to 100"
};
