"use strict";

const emojiRegex = require("emoji-regex");

const utils = require("../utils");
const dbs = require("../dbs");

/*
 * !hoard                        Show a random item from a random hoard
 * !hoard ??                     Show a random item from the given hoard
 * !hoard ?? 20                  Show the indexed item from the given hoard
 * !hoard Chocola#4832           Show a random item from someone else's random hoard
 * !hoard ?? Chocola#4832        Show a random item from someone else's given hoard
 * !hoard ?? Chocola#4832 20     Show the indexed item from someone else's given hoard
 * !hoard add ??                 Add a new hoard
 * !hoard remove ??              Remove a hoard
 * !hoard remove ?? 20           Remove an indexed item from a hoard
 */

// Separate subcommand and subcommandArgs.
// If no recognized subcommand is given, assume "show" is implied.
function getSubcommand(args) {
    var subcommand = args[0];

    if (["add", "remove"].includes(subcommand)) {
        args.shift();
    }
    else {
        subcommand = "show";
    }

    return subcommand;
}

// Find all the emojis in a string, both unicode and custom discord emojis
function getEmojis(args) {
    var customEmojiRegex = /<a?:([a-zA-Z0-9]+):[0-9]+>/g;
    var standardEmojiRegex = emojiRegex();
    var combinedRegex = new RegExp(`(?:${customEmojiRegex.source}|(${standardEmojiRegex.source}))`, "g");

    var emojis = [];

    // Find all the emojis, and remove them from the args
    var argsWithoutEmojis = args.filter(function(arg) {
        var emoji;
        var match = combinedRegex.exec(arg);
        if (match) {
            emoji = match[0] || match[1];
            emojis.push(emoji);
        }
        return !match;
    });

    // Replace the old args with the filtered args
    utils.replaceArray(argsWithoutEmojis, args);

    return emojis;
}

// Find the item index
// If no valid itemIndex is provided, then itemIndex is set to NaN, which returns false on all comparisons
function getItemIndex(args) {
    var i = args.findIndex(arg => arg.match(/^[0-9]+$/));

    var itemIndexArg;

    if (i !== -1) {
        itemIndexArg = args[i];
        args.splice(i, 1);
    }

    var itemIndex = utils.toNum(itemIndexArg) - 1;

    if (itemIndex < 0) {
        itemIndex = NaN;
    }

    return itemIndex;
}

async function loadHoards(userId) {
    var userDb = await dbs.user.load();
    if (!userDb.people) {
        userDb.people = {};
    }
    if (!userDb.people[userId]) {
        userDb.people[userId] = {};
    }
    var userData = userDb.people[userId];
    if (!userData.hoard) {
        userData.hoard = {};
    }
    var hoards = userData.hoard;
    return { userDb, hoards };    // TODO: Replace with with better data management
}

async function showHoardItem(m, emojis, itemIndex) {
    utils.parseNameMentions(m);

    var member = m.guild.members.get(m.mentions[0] && m.mentions[0].id) || m.member;

    if (emojis.length > 1) {
        m.reply("Sorry, you can only lookup one hoard at a time.", 5000);
        m.deleteIn(5000);
        return;
    }

    var hoardName = emojis[0];

    var { hoards } = await loadHoards(member.id);

    if (hoardName) {
        if (!hoards[hoardName]) {
            m.reply(`Cound not find ${hoardName} hoard for **${member.name}**`);
            m.deleteIn(5000);
            return;
        }

        if (Object.keys(hoards[hoardName]).length === 0) {
            let message = "No items in this hoard!";
            if (member.id === m.author.id) {
                message += ` React to messages with ${hoardName} to pull them up in their own hoard.`;
            }
            m.reply(message, 5000);
            m.deleteIn(5000);
            return;
        }
    }
    else {
        // If they didn't provide a hoardName, then ignore the itemIndex
        itemIndex = NaN;

        var hoardNames = Object.keys(hoards);

        if (hoardNames.length === 0) {
            m.reply(`Could not find any hoards for **${member.name}**`, 5000);
            m.deleteIn(5000);
            return;
        }

        var nonEmptyHoardNames = hoardNames.filter(name => Object.keys(hoards[name]).length > 0); // Only select from hoards that have items

        if (nonEmptyHoardNames.length === 0) {
            let message = "No items in any hoards!";
            if (member.id === m.author.id) {
                message += " React to messages with your hoard emoji's to pull them up in their own hoard.";
            }
            m.reply(message, 5000);
            m.deleteIn(5000);
            return;
        }

        hoardName = utils.choose(nonEmptyHoardNames);
    }

    var hoard = hoards[hoardName];
    var hoardItems = Object.keys(hoard);

    var hoardItem;
    if (utils.isNum(itemIndex)) {
        if (itemIndex > hoardItems.length + 1) {
            m.reply("Could not find that item in that hoard", 5000);
            m.deleteIn(5000);
            return;
        }

        hoardItem = hoardItems[itemIndex];
    }
    else {
        hoardItem = utils.choose(hoardItems);
    }

    var imgURLMatch = hoardItem.match(/([a-z\-_0-9/:.]*\.(?:png|jpg|gif|svg|jpeg)[:orig]*)/i);
    var imgURL = imgURLMatch && imgURLMatch[0];

    var msg = {
        content: `A Random piece, from **${member.name}**'s hoard`,
        embed: {
            color: 0xA260F6,
            author: {
                name: member.name,
                icon_url: member.avatarURL
            }
        }
    };

    var srcUserId = hoard[hoardItem];
    var srcUser = m.bot.users.get(srcUserId);
    if (srcUser) {
        msg.embed.footer = {
            icon_url: srcUser.dynamicAvatarURL("jpg", 128),
            text: `Original post by ${srcUser.username}`
        };
    }

    var description = `Item ${hoardItems.indexOf(hoardItem) + 1} of ${hoardItems.length} from the ${hoardName} hoard`;
    if (imgURL) {
        msg.embed.description = description;
        msg.embed.image = { url: imgURL };
    }
    else {
        msg.embed.description = hoardItem;
        msg.embed.title = description;
    }

    m.reply(msg);
}

async function addHoard(m, emojis) {
    if (emojis.length > 1) {
        m.reply("Sorry, you can only make a hoard by using 1 emoji.", 5000);
        m.deleteIn(5000);
        return;
    }

    if (emojis.length === 0) {
        m.reply("Which emoji do you want to create a hoard for?", 5000);
        m.deleteIn(5000);
        return;
    }

    var hoardName = emojis[0];

    var { userDb, hoards } = await loadHoards(m.author.id);

    if (hoards[hoardName]) {
        m.reply(hoardName + " is already one of your hoards", 5000);
        m.deleteIn(5000);
        return;
    }

    hoards[hoardName] = {};
    await dbs.user.save(userDb);

    m.reply("Successfully added hoard: " + hoardName, 5000);
    m.deleteIn(5000);
}

async function removeHoard(m, emojis) {
    if (emojis.length > 1) {
        m.reply("Sorry, you can only remove 1 hoard at a time.", 5000);
        m.deleteIn(5000);
        return;
    }

    if (emojis.length === 0) {
        m.reply("Which hoard do you want to remove?", 5000);
        m.deleteIn(5000);
        return;
    }

    var hoardName = emojis[0];

    var { userDb, hoards } = await loadHoards(m.author.id);

    if (!hoards[hoardName]) {
        m.reply("Count not find that hoard", 5000);
        m.deleteIn(5000);
        return;
    }

    delete hoards[hoardName];
    await dbs.user.save(userDb);

    m.reply(hoardName + " Successfully deleted", 5000);
    m.deleteIn(5000);
}

async function removeHoardItem(m, emojis, itemIndex) {
    if (emojis.length > 1) {
        m.reply("Sorry, you can only remove items from 1 hoard at a time.", 5000);
        m.deleteIn(5000);
        return;
    }

    if (emojis.length === 0) {
        m.reply("Which hoard do you want to remove items from?", 5000);
        m.deleteIn(5000);
        return;
    }

    var hoardName = emojis[0];

    var { userDb, hoards } = await loadHoards(m.author.id);

    if (!hoards[hoardName]) {
        m.reply("Could not find that hoard", 5000);
        m.deleteIn(5000);
        return;
    }

    var hoardItems = Object.keys(hoards[hoardName]);
    if (itemIndex > hoardItems.length - 1) {
        m.reply("Could not find that item in that hoard", 5000);
        m.deleteIn(5000);
        return;
    }

    var item = hoardItems[itemIndex];
    delete hoards[hoardName][item];
    await dbs.user.save(userDb);

    m.reply(`Successfully deleted item ${itemIndex + 1} from ${hoardName}`, 5000);
    m.deleteIn(5000);
}

module.exports = {
    main: async function(bot, m, args, prefix) {
        args = utils.split(m.fullArgs.trim());

        var subcommand = getSubcommand(args);

        var itemIndex = getItemIndex(args);

        var emojis = getEmojis(args);

        if (subcommand === "add") {
            await addHoard(m, emojis);
        }
        else if (subcommand === "remove") {
            if (utils.isNum(itemIndex)) {
                await removeHoardItem(m, emojis, itemIndex);
            }
            else {
                await removeHoard(m, emojis);
            }
        }
        else {
            await showHoardItem(m, emojis, itemIndex);
        }
    },
    help: "View hoards. React with :heart_eyes: to add"
};
