"use strict";

process.on("unhandledRejection", (err, promise) => {
    console.error("== Node detected an unhandled rejection! ==");
    console.error(err ? err.stack : promise);
});

const Eris = require("./erisplus");

require("colors");
const fs = require("fs").promises;

const conf = require("./conf");
const cmdmanager = require("./cmdmanager");
const datadb = require("./data");
const peopledb = require("./people");
const serversdb = require("./servers");
const misc = require("./misc");
const ids = require("./ids");
const pls = require("./pls");

conf.load();
cmdmanager.loadAll();

var bot = Eris(conf.tokens.mei);

console.log(`Copyright (C) ${new Date().getFullYear()} Chocola
    
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.\n`);

if (!fs) {
    console.log("Mei requires Node.js version number 10 or above");
    return;
}

bot.on("ready", async function() {
    bot.editStatus("Online", {
        name: "with Tinies"
    });
    var channelCount = 0;
    bot.guilds.forEach(g => channelCount += g.channels.size);
    console.log("");
    console.log("BOT".bgMagenta.yellow.bold + " Logged in as " + `${bot.user.fullname}`.cyan.bold);
    console.log("");
    console.log("INF".bgBlue.magenta + " Currently seeing: " + `${bot.guilds.size}`.green.bold + " guilds");
    console.log("INF".bgBlue.magenta + " Currently seeing: " + `${channelCount}`.green.bold + " channels");
    console.log("INF".bgBlue.magenta + " Currently seeing: " + `${bot.users.size}`.green.bold + " users");
    console.log("");
});

bot.on("guildBanAdd", async function(guild, user) {
    var guildsdata = await serversdb.load();
    var guilddata = guildsdata[guild.id];
    var banLogChannelId = guilddata && guilddata.notifications && guilddata.notifications.banLog;
    if (!banLogChannelId) {
        return;
    }

    var msg = {
        embed: {
            color: 13632027,
            timestamp: new Date().toISOString(),
            thumbnail: {
                url: user.dynamicAvatarURL("jpg", 128)
            },
            author: {
                name: "User Banned"
            },
            fields: [
                {
                    name: "User:",
                    value: `${user.fullname}`,
                    inline: true
                },
                {
                    name: "ID:",
                    value: user.id,
                    inline: true
                },
                {
                    name: "\nBot:",
                    value: user.bot,
                    inline: true
                },
                {
                    name: "\nRemaining:",
                    value: `${guild.memberCount} members`,
                    inline: true
                }
            ]
        }
    };

    var banned = await bot.getGuildBan(guild.id, user.id);
    if (banned.reason) {
        if (banned.reason.toLowerCase().startsWith("banned by: ")) {
            banned.reason += " (Automated ban through Mei)";
        }
        msg.embed.fields.push({
            name: "\nReason:",
            value: banned.reason,
            inline: true
        });
    }

    bot.createMessage(banLogChannelId, msg);
});

bot.on("guildBanRemove", async function(guild, user) {
    var guildsdata = await serversdb.load();
    var guilddata = guildsdata[guild.id];
    var banLogChannelId = guilddata && guilddata.notifications && guilddata.notifications.banLog;
    if (!banLogChannelId) {
        return;
    }

    var msg = {
        embed: {
            color: 8311585,
            timestamp: new Date().toISOString(),
            thumbnail: {
                url: user.dynamicAvatarURL("jpg", 128)
            },
            author: {
                name: "User Unbanned"
            },
            fields: [
                {
                    name: "User:",
                    value: `${user.fullname}`,
                    inline: true
                },
                {
                    name: "ID:",
                    value: user.id,
                    inline: true
                },
                {
                    name: "\nBot:",
                    value: user.bot,
                    inline: true
                },
                {
                    name: "\nRemaining:",
                    value: `${guild.memberCount} members`,
                    inline: true
                }
            ]
        }
    };

    bot.createMessage(banLogChannelId, msg);
});

// Handle DMs
bot.on("messageCreate", async function(m) {
    if (m.author.bot) {
        return;
    }

    if (!m.guild) {
        console.log(`${m.author.fullname} (${m.author.id}): ${m.content}`);
        try {
            await m.reply("Your messages do not serve me here, bug.");
            return;
        }
        catch(err) {
            if (err.code !== 50007) {
                console.log(err);
                return;
            }
        }
    }
});

// pls commands
bot.on("messageCreate", async function(m) {
    try {
        await pls(bot, m);
    }
    catch(err) {
        console.error("Error processing pls command", err);
    }
});

// page Chocola
bot.on("messageCreate", async function(m) {
    if (m.author.bot) {
        return;
    }

    if (!m.guild) {
        return;
    }

    if (m.author.id === ids.users.chocola) {
        return;
    }

    var chocolaMentioned = m.content.toLowerCase().match(/\b(chocola|choco|choc|mei)\b/i);
    if (!chocolaMentioned) {
        return;
    }

    var chocolaPresent = await m.guild.members.get(ids.users.chocola);
    if (!chocolaPresent) {
        return;
    }

    var chocolaChannel = await bot.getDMChannel(ids.users.chocola);
    try {
        await chocolaChannel.createMessage(`You were mentioned in <#${m.channel.id}> by <@${m.author.id}>. Message: <https://discordapp.com/channels/${m.guild.id}/${m.channel.id}/${m.id}>`);
        await chocolaChannel.createMessage(m.content);
    }
    catch(err) {
        if (err.code === 50007) {
            return;
        }
        console.log(err);
    }
});

// shit bot
bot.on("messageCreate", async function(m) {
    if (m.author.bot) {
        return;
    }

    if (!m.guild) {
        return;
    }
    // If shit bot says "you joined" in #welcome
    if (m.guild.id === ids.guilds.r_macrophilia
        && m.author.id === ids.users.dyno
        && m.content.includes("you joined")
    ) {
        // remove the No channel access role
        bot.removeGuildMemberRole(m.guild.id, m.mentions[0].id, ids.roles.role1, "Removed from role assign");
    }
});

function sum(arr) {
    return arr.reduce((total, val) => total + val);
}

// commands
bot.on("messageCreate", async function(m) {
    if (m.author.bot) {
        return;
    }

    if (!m.guild) {
        return;
    }

    const timestamps = [Date.now()];
    var data = await datadb.load();

    // Ignore banned users
    if (data.banned.global[m.author.id]) {
        return;
    }

    timestamps.push(Date.now());

    // Guild specific prefix
    conf.load();
    var guildsdata = await serversdb.load();
    var guilddata = guildsdata[m.guild.id];
    m.prefix = guilddata && guilddata.prefix || conf.prefix;

    // Game mode
    if (guilddata
        && guilddata.game
        && guilddata.game.channel === m.channel.id
        && guilddata.game.player === m.author.id
        && guilddata.game.active
        && guilddata.game.choices.includes(m.content)
    ) {
        m.content = m.prefix + "t " + m.content;
    }

    // Only accept commands starting with prefix
    if (!m.content.startsWith(m.prefix)) {
        return;
    }

    timestamps.push(Date.now());
    // Ignore play command on this guild
    if (m.guild.id === ids.guilds.guild2 && m.content.startsWith(`${m.prefix}play`)) {
        return;
    }

    timestamps.push(Date.now());

    timestamps.push(Date.now());
    var cmdName = m.content.slice(m.prefix.length).split(" ", 1)[0].toLowerCase();
    // Ignore non-existent commands
    if (!cmdmanager.has(cmdName)) {
        return;
    }

    timestamps.push(Date.now());
    let cmd = cmdmanager.get(cmdName);

    timestamps.push(Date.now());
    data.commands.totalRuns++;
    if (!data.commands[cmdName]) {
        data.commands[cmdName] = {
            totalUses: 0,
            users: {},
            enabled: true
        };
    }
    if (!data.commands[cmdName].users[m.author.id]) {
        data.commands[cmdName].users[m.author.id] = 0;
    }
    data.commands[cmdName].users[m.author.id]++;
    data.commands[cmdName].totalUses++;

    timestamps.push(Date.now());
    await datadb.save(data);

    // Commands
    var args = m.content.split(" ");
    args.splice(0, 1);
    args = args.join(" ");
    var loguser = `${m.author.fullname}`.magenta.bold;
    var logserver = `${m.guild.name}`.cyan.bold;
    var logchannel = `#${m.channel.name}`.green.bold;
    var logdivArrow = " > ".blue.bold;
    var logdivDash = " - ".blue.bold;
    var logcmd = `${m.prefix}${cmdName}`.bold;
    var logargs = `${args}`.bold;

    timestamps.push(Date.now());
    var timediffs = timestamps.slice(1).map((t, i) => t - timestamps[i]);   // Turn timestamps into time diffs
    await fs.appendFile("db/timestamps.txt", sum(timediffs) + "ms | " + timediffs.join(", ") + "\n");
    console.log("CMD".black.bgGreen + " " + loguser + logdivDash + logserver + logdivArrow + logchannel + " " + logcmd.blue);
    if (args) {
        console.log("ARG".black.bgCyan + " " + logargs.blue.bold);
    }

    try {
        if (cmd.nsfw && !m.channel.nsfw) {
            m.reply("This command can only be used in NSFW channels");
            return;
        }

        if (!await cmdmanager.isEnabled(cmdName, data)) {
            m.reply(`Sorry. \`${m.prefix}${cmdName}\` has been temporarily disabled. Please try again later.`);
            console.warn("WRN".black.bgYellow
            + ` ${m.prefix}${cmdName} is currently disabled`.magenta.bold
            + " - ".blue.bold + m.guild.name.cyan.bold
            + " > ".blue.bold + "#" + m.channel.name.green.bold
            + " (" + `https://discordapp.com/channels/${m.guild.id}/${m.channel.id}/${m.id}`.bold.red
            + ")");
            return;
        }

        await cmd.main(bot, m, args, m.prefix);
    }
    catch (err) {
        console.log(err);
        await m.reply("An error has occured.", 5000);
        await m.deleteIn(5000);

        console.log("CMD".black.bgRed + " " + loguser + logdivDash + logserver + logdivArrow + logchannel + " " + logcmd.red);
        if (args) {
            console.log("ARG".black.bgCyan + " " + logargs.red.bold);
        }
        console.log("");
    }
});

bot.on("guildMemberAdd", async function(guild, member) {
    var memberCount = guild.realMemberCount;
    var date = member.joinedAt;
    var date2 = member.createdAt;
    var name = member.nick || member.username;
    var diff = date - date2;
    var guildsdata = await serversdb.load();
    var guilddata = guildsdata[guild.id];

    if (!(guilddata && guilddata.notifications)) {
        return;
    }

    if (guilddata.notifications.updates) {
        var updatesChannelId = guilddata.notifications.updates;
        try {
            await bot.createMessage(updatesChannelId, {
                embed: {
                    color: 0xA260F6,
                    title: `${member.username} (${member.id}) joined ${guild.name}\nWe now have: ${memberCount} people! :smiley:`,
                    timestamp: new Date().toISOString(),
                    author: {
                        name: member.username,
                        icon_url: member.avatarURL
                    }
                }
            });
        }
        catch (err) {
            console.log(err);
        }
        if (diff < 86400000) {
            try {
                await bot.createMessage(updatesChannelId, `:warning: **${name}** Joined less than 24 hours after creating their account`);
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    if (guilddata.notifications.welcome) {
        var [welcomeChannelId, welcomeMessage] = Object.entries(guilddata.notifications.welcome)[0];
        if (welcomeChannelId && welcomeMessage) {
            welcomeMessage = welcomeMessage
                .replace("[name]", `${member.username}`)
                .replace("[user]", `${member.fullname}`)
                .replace("[server]", `${guild.name}`)
                .replace("[mention]", `${member.mention}`)
                .replace("[count]", `${memberCount}`);
            try {
                await bot.createMessage(welcomeChannelId, welcomeMessage);
            }
            catch (err) {
                console.log(err);
            }
        }
    }
});

bot.on("guildMemberRemove", async function(guild, member) {
    var memberCount = guild.realMemberCount;
    var guildsdata = await serversdb.load();
    if (!(guildsdata[guild.id] && guildsdata[guild.id].notifications)) {
        return;
    }

    if (guildsdata[guild.id].notifications.updates) {
        var updatesChannelId = guildsdata[guild.id].notifications.updates;
        try {
            await bot.createMessage(updatesChannelId, {
                embed: {
                    color: 0xA260F6,
                    title: `${member.username} (${member.id}) left ${guild.name}\nWe now have: ${memberCount} people! :frowning2:`,
                    timestamp: new Date().toISOString(),
                    author: {
                        name: member.username,
                        icon_url: member.avatarURL
                    }
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    if (guildsdata[guild.id].notifications.leave) {
        var [leaveChannelId, leaveMessage] = Object.entries(guildsdata[guild.id].notifications.leave)[0];
        leaveMessage = leaveMessage
            .replace("[name]", `${member.username}`)
            .replace("[user]", `${member.fullname}`)
            .replace("[server]", `${guild.name}`)
            .replace("[mention]", `${member.mention}`)
            .replace("[count]", `${memberCount}`);
        try {
            await bot.createMessage(leaveChannelId, leaveMessage);
        }
        catch (err) {
            console.log(err);
        }
    }
});

bot.on("guildCreate", async function(guild) {
    try {
        var chocolaChannel = await bot.getDMChannel(ids.users.chocola);
        await chocolaChannel.createMessage({
            embed: {
                color: 0xA260F6,
                title: "I was invited to the guild: " + guild.name + "(" + guild.id + ")\nI am now in " + bot.guilds.size + " guilds",
                timestamp: new Date().toISOString(),
                author: {
                    name: guild.name,
                    icon_url: guild.iconURL
                }
            }
        });
    }
    catch (err) {
        if (err.code === 50007) {
            return;
        }
        console.log(err);
    }
});

bot.on("guildDelete", async function(guild) {
    try {
        var chocolaChannel = await bot.getDMChannel(ids.users.chocola);
        await chocolaChannel.createMessage({
            embed: {
                color: 0xA260F6,
                title: "I was removed from the guild: " + guild.name + "(" + guild.id + ")\nI am now in " + bot.guilds.size + " guilds",
                timestamp: new Date().toISOString(),
                author: {
                    name: guild.name,
                    icon_url: guild.iconURL
                }
            }
        });
    }
    catch (err) {
        if (err.code === 50007) {
            return;
        }
        console.log(err);
    }
});

// Giveaways
bot.on("messageReactionAdd", async function(m, emoji, userID) {
    try {
        // Only react to giveaway emoji
        if (emoji.id !== ids.emojis.giveaway) {
            return;
        }

        // Don't react to Mei
        if (userID === bot.user.id) {
            return;
        }

        // Load the message
        m = await bot.getMessage(m.channel.id, m.id);

        // Load guild data and message
        var guildsdata = await serversdb.load();
        var guilddata = guildsdata[m.guild.id];

        // Ignore the giveaway creator
        if (userID === guilddata.giveaways.creator) {
            return;
        }

        if (guilddata
            && guilddata.giveaways
            && guilddata.giveaways.running
            && m.id === guilddata.giveaways.mID
        ) {
            guilddata.giveaways.current.contestants[userID] = "entered";
            await serversdb.save(guildsdata);
        }
    }
    catch(err) {
        console.log(err);
    }
});

// Giveaways
bot.on("messageReactionRemove", async function(m, emoji, userID) {
    try {
        // Only react to giveaway emoji
        if (emoji.id !== ids.emojis.giveaway) {
            return;
        }

        // Don't react to Mei
        if (userID === bot.user.id) {
            return;
        }

        // Load the message
        m = await bot.getMessage(m.channel.id, m.id);

        // Load guild data and message
        var guildsdata = await serversdb.load();
        var guilddata = guildsdata[m.guild.id];

        // Ignore the giveaway creator
        if (userID === guilddata.giveaways.creator) {
            return;
        }

        if (guilddata
            && guilddata.giveaways
            && guilddata.giveaways.running
            && m.id === guilddata.giveaways.mID
            && guilddata.giveaways.current.contestants[userID]
        ) {
            delete guilddata.giveaways.current.contestants[userID];
            await serversdb.save(guildsdata);
        }
    }
    catch (err) {
        console.log(err);
    }
});

// Get links for a hoard from a message
function getLinks(m) {
    var links = [];
    if (m.attachments.length > 0) {
        links = m.attachments
            .map(a => a.url)
            .filter(url => url);
    }
    else if (m.embeds.length > 0 && m.embeds[0].image) {
        links = [m.embeds[0].image.url];
    }
    else {
        links = [m.cleanContent];
    }
    return links;
}

// Hoard adds
bot.on("messageReactionAdd", async function(m, emoji, userID) {
    try {
        // Load the message
        m = await bot.getMessage(m.channel.id, m.id);

        // Load the guild data
        var guildsdata = await serversdb.load();
        var guilddata = guildsdata[m.guild.id];

        // If guild hoards are disabled and the emoji is not 😍, then skip adding to a hoard
        var hoardsDisabled = guilddata && guilddata.hoards === false;
        if (hoardsDisabled && emoji.name !== "😍") {
            return;
        }

        // Get the links
        var links = getLinks(m);
        if (links.length === 0) {
            return;
        }

        // Load the people data
        var peopledata = await peopledb.load();

        // Save the hoard items
        if (!peopledata.people[userID]) {
            peopledata.people[userID] = {};
        }
        if (!peopledata.people[userID].hoard) {
            peopledata.people[userID].hoard = {};
        }
        // Add 😍 hoard if it doesn't exist
        if (!peopledata.people[userID].hoard["😍"]) {
            peopledata.people[userID].hoard["😍"] = {};
        }

        // If the user doesn't have this hoard, skip add
        var hoard = peopledata.people[userID].hoard[emoji.name];
        if (!hoard) {
            return;
        }

        // Get a list of links that are not yet in the hoard
        var newLinks = links.filter(link => !hoard[link]);
        if (newLinks.length === 0) {
            return;
        }

        // Add each link to the hoard
        newLinks.forEach(link => hoard[link] = m.author.id);

        // Save the changes to the hoard
        await peopledb.save(peopledata);

        // Increment the author's adds
        if (m.author.id === userID) {
            return;
        }
        if (!peopledata.people[m.author.id]) {
            peopledata.people[m.author.id] = {};
        }
        var authordata = peopledata.people[m.author.id];
        if (!authordata.adds) {
            authordata.adds = 0;
        }
        // Save the oldAdds count so we can check if we triggered a milestone
        var oldAdds = authordata.adds;
        authordata.adds += newLinks.length;

        // Save the changes to the author adds
        await peopledb.save(peopledata);

        // Milestone is reached every 10 hoard adds
        var milestone = Math.floor(oldAdds / 10) !== Math.floor(authordata.adds / 10);
        if (!milestone) {
            return;
        }

        // Don't display milestones for Mei
        if (m.author.id !== bot.user.id) {
            return;
        }

        // Don't display milestones if disabled on guild
        var guildAddsSetting = guilddata && guilddata.adds; // True or False or number of milliseconds to display milestone notifications
        if (guildAddsSetting === false) {
            return;
        }
        // If set, use the guild's preferred milestone display time
        var displayTime = 60000;
        if (misc.isNum(guildAddsSetting)) {
            displayTime = misc.toNum(guildAddsSetting);
        }

        // Display milestone
        var authoruser = bot.users.find(u => u.id === m.author.id);
        await m.reply(`${authoruser.fullname} reached ${authordata.adds} hoard adds.`, displayTime);
    }
    catch (err) {
        console.log(err);
    }
});

// Hoard adds
bot.on("messageReactionRemove", async function(m, emoji, userID) {
    try {
        // Load the message
        m = await bot.getMessage(m.channel.id, m.id);

        // Load guild data
        var guildsdata = await serversdb.load();
        var guilddata = guildsdata[m.guild.id];

        // If guild hoards are disabled and the emoji is not 😍, then skip removing from a hoard
        var hoardsDisabled = guilddata && guilddata.hoards === false;
        if (hoardsDisabled && emoji.name !== "😍") {
            return;
        }

        // Get the links from the message
        var links = getLinks(m);
        if (links.length === 0) {
            return;
        }

        // Load the people data
        var peopledata = await peopledb.load();

        // If the user doesn't have this hoard, skip removal
        var hoard = peopledata.people[userID] && peopledata.people[userID].hoard && peopledata.people[userID].hoard[emoji.name];
        if (!hoard) {
            return;
        }

        // Get a list of links that exist in the hoard
        var existingLinks = links.filter(link => hoard[link]);
        if (existingLinks.length === 0) {
            return;
        }

        // Remove each link from the hoard
        existingLinks.forEach(function(link) {
            var authorId = hoard[link];
            var author = peopledata.people[authorId];
            if (!author.adds) {
                author.adds = 0;
            }
            // Decrement the author adds (minimum 0)
            author.adds = Math.max(0, author.adds - 1);
            // Remove the link from the hoard
            delete hoard[link];
        });

        // Save the peopledata
        await peopledb.save(peopledata);
    }
    catch (err) {
        console.log(err);
    }
});

bot.connect();
