"use strict";

process.on("unhandledRejection", (err, promise) => {
    console.error("== Node detected an unhandled rejection! ==");
    console.error(err ? err.stack : promise);
});

const fs = require("fs").promises;

if (!fs) {
    console.log("Mei requires Node.js version 10 or above");
    return;
}

const Promise = require("bluebird");
const mongoose = require("mongoose");
require("colors");

const ErisPlus = require("./erisplus");
const Eris = ErisPlus(require("eris"));

const conf = require("./conf");
conf.load();

// Connect to MongoDB
// https://mongoosejs.com/docs/connections.html
mongoose.Promise = Promise;
mongoose.connect(conf.mongo.uri, { useNewUrlParser: true, promiseLibrary: Promise });

mongoose.connection.on("error", function() {
    console.error("Mongoose connection error");
});
mongoose.connection.once("open", function() {
    console.info("Mongoose connected to the database");
});

mongoose.set("useFindAndModify", false);

const Global = require("./models/global");
const Command = require("./models/command");
const Guild = require("./models/guild");
const User = require("./models/user");

const misc = require("./misc");
const ids = require("./ids");
const commands = require("./commands");

commands.loadAll();

var bot = Eris(conf.tokens.mei);

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
    var guilddata = await Guild.get(guild.id);
    if (!guilddata.notifications.banlog) {
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

    bot.createMessage(guilddata.notifications.banlog, msg);
});

bot.on("guildBanRemove", async function(guild, user) {
    var guilddata = await Guild.get(guild.id);
    if (!guilddata.notifications.banlog) {
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

    bot.createMessage(guilddata.notifications.banlog, msg);
});

// Handle DMs
bot.on("messageCreate", async function(m) {
    if (!m.guild) {
        console.log(`${m.author.fullname} (${m.author.id}): ${m.content}`);
        try {
            await m.reply("Your messages do not serve me here, bug.");
        }
        catch(err) {
            if (err.code !== 50007) {
                console.log(err);
            }
        }
    }
});

// pls commands
bot.on("messageCreate", async function(m) {
    if (m.author.bot) {
        return;
    }

    if (!m.guild) {
        return;
    }

    if (m.author.id !== ids.users.chocola) {
        return;
    }

    if (m.content.includes("pls")) {
        if (m.content.includes("stop")) {
            var sentMsg = await m.reply("Let me rest my eyes for a moment");
            await misc.delay(1500);
            await sentMsg.delete("Timeout");
            await m.delete("Timeout");
            process.exit(0);
        }

        if (m.content.includes("override")) {
            await m.reply("Chocola Recognized. Permission overrides engaged. I am at your service~", 2000);
            return;
        }

        if (m.guild.id === ids.guilds.smallworld) {
            if (m.content.includes(" mute") && m.mentions.length > 0) {
                for (let mention of m.mentions) {
                    await bot.addGuildMemberRole(m.guild.id, mention.id, ids.roles.role2, "Daddy said shush");
                    await m.reply(misc.chooseHand(), 5000);
                }
                return;
            }
            if (m.content.includes(" unmute") && m.mentions.length > 0) {
                for (let mention of m.mentions) {
                    await bot.removeGuildMemberRole(m.guild.id, mention.id, ids.roles.role2, "Daddy said speak");
                    await m.reply(misc.chooseHand(), 5000);
                }
                return;
            }
        }

        if (m.content.includes("disable")) {
            let commandName = m.content.replace("pls", "").replace("disable", "").replace("!", "").trim().toLowerCase();
            let cmd = commands.commands[commandName];
            if (!cmd) {
                await m.reply(`${commandName} is not a valid command, please try again.`, 5000);
                await m.deleteIn(5000);
                return;
            }
            if (cmd.disable) {
                await m.reply(`${commandName} is already disabled. Doing nothing.`, 5000);
                await m.deleteIn(5000);
                return;
            }
            commands.disable(commandName);
            await m.reply(`${commandName} has been disabled.`, 5000);
            await m.deleteIn(5000);
            return;
        }

        if (m.content.includes("enable")) {
            let commandName = m.content.replace("pls", "").replace("enable", "").replace("!", "").trim().toLowerCase();
            let cmd = commands.commands[commandName];
            if (!cmd) {
                await m.reply(`${commandName} is not a valid command, please try again.`, 5000);
                await m.deleteIn(5000);
                return;
            }
            if (!cmd.disable) {
                await m.reply(`${commandName} is already enabled. Doing nothing.`, 5000);
                await m.deleteIn(5000);
                return;
            }
            commands.enable(commandName);
            await m.reply(`${commandName} has been enabled.`, 5000);
            await m.deleteIn(5000);
            return;
        }
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
    // If shit bot says "you joined" in #welcome
    if (m.guild.id === ids.guilds.r_macrophilia
        && m.author.id === ids.users.dyno
        && m.content.includes("you joined")
    ) {
        // remove the No channel access role
        bot.removeGuildMemberRole(m.guild.id, m.mentions[0].id, ids.roles.role1, "Removed from role assign");
    }
});

// commands
bot.on("messageCreate", async function(m) {
    if (m.author.bot) {
        return;
    }

    if (!m.guild) {
        return;
    }

    var globaldata = await Global.get();

    // Ignore banned users
    if (globaldata.banned.some(b => b.userid === m.author.id)) {
        return;
    }

    var guilddata = await Guild.get(m.guild.id);
    var prefix = guilddata.prefix || conf.prefix;

    // Game mode
    if (guilddata.game.channel === m.channel.id
        && guilddata.game.player === m.author.id
        && guilddata.game.active
        && guilddata.game.choices.includes(m.content)
    ) {
        m.content = prefix + "t " + m.content;
    }

    // Only accept commands starting with prefix
    if (!m.content.startsWith(prefix)) {
        return;
    }
    // Ignore play command on this guild
    if (m.guild.id === ids.guilds.guild2 && m.content.startsWith(`${prefix}play`)) {
        return;
    }

    var commandName = m.content.slice(prefix.length).split(" ", 1)[0].toLowerCase();

    var cmd = commands.commands[commandName];
    // Ignore non-existant commands
    if (!cmd) {
        return;
    }

    globaldata.totalCommandUses++;
    await globaldata.save();

    var commanddata = Command.get(commandName);
    commanddata.totalUses++;
    commanddata.incrementUser(m.author.id);
    await commanddata.save();

    var args = m.content.replace(/\[\?\]/ig, "").slice(`${prefix}${commandName}`.length).trim();
    var loguser = `${m.author.fullname}`.magenta.bold;
    var logserver = `${m.guild.name}`.cyan.bold;
    var logchannel = `#${m.channel.name}`.green.bold;
    var logdivArrow = " > ".blue.bold;
    var logdivDash = " - ".blue.bold;
    var logcmd = `${prefix}${commandName}`.bold;
    var logargs = `${args}`.bold;

    console.log("CMD".black.bgGreen + " " + loguser + logdivDash + logserver + logdivArrow + logchannel + " " + logcmd.blue);
    if (args) {
        console.log("ARG".black.bgCyan + " " + logargs.blue.bold);
    }

    try {
        await cmd.main(bot, m, args, prefix);
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
    var guilddata = await Guild.get(guild.id);

    var memberCount = guild.members.filter(m => !m.bot).length;

    var updatesChannelId = guilddata.notifications.updates;
    if (updatesChannelId) {
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

        var joinDiff = member.joinedAt - member.createdAt;
        if (joinDiff < 86400000) {
            try {
                await bot.createMessage(updatesChannelId, `:warning: **${member.name}** Joined less than 24 hours after creating their account`);
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    var welcomeChannelId = guilddata.notifications.welcome.channel;
    var welcomeMessage = guilddata.notifications.welcome.message;
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
});

bot.on("guildMemberRemove", async function(guild, member) {
    var guilddata = await Guild.get(guild.id);

    var memberCount = guild.members.filter(m => !m.bot).length;
    var updatesChannelId = guilddata.notifications.updates;
    if (updatesChannelId) {
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

    var leaveChannelId = guilddata.notifications.leave.channel;
    var leaveMessage = guilddata.notifications.leave.message;
    if (leaveChannelId && leaveMessage) {
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

        // Load guild data and message
        var guilddata = await Guild.get(m.guild.id);

        // Giveaway isn't running
        if (!guilddata.giveaway.running) {
            return;
        }

        // Ignore the giveaway creator
        if (userID === guilddata.giveaway.creator) {
            return;
        }

        // Giveaway is not for this message
        if (m.id !== guilddata.giveaway.message) {
            return;
        }

        guilddata.giveaway.contestants.addToSet(userID);
        await guilddata.save();
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

        // Load guild data and message
        var guilddata = await Guild.get(m.guild.id);

        // Giveaway isn't running
        if (!guilddata.giveaway.running) {
            return;
        }

        // Ignore the giveaway creator
        if (userID === guilddata.giveaway.creator) {
            return;
        }

        // Giveaway is not for this message
        if (m.id !== guilddata.giveaway.message) {
            return;
        }

        if (guilddata.giveaway.contestants.includes(userID)) {
            guilddata.giveaway.contestants.pull();
            await guilddata.save();
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
        // Load the guild data
        var guilddata = await Guild.get(m.guild.id);

        // If guild hoards are disabled and the emoji is not 😍, then skip adding to a hoard
        if (!guilddata.hoards && emoji.name !== "😍") {
            return;
        }

        // Load the people data
        var userdata = await User.get(userID);

        // If the user doesn't have this hoard, skip add
        var hoard = userdata.hoards.find(h => h.emoji === emoji.name);
        if (!hoard) {
            return;
        }

        // Load the message
        m = await bot.getMessage(m.channel.id, m.id);

        // Get the links
        var links = getLinks(m);
        if (links.length === 0) {
            return;
        }

        // Get a list of links that are not yet in the hoard
        var newLinks = links.filter(link => !hoard.items.some(i => link === i.url));
        if (newLinks.length === 0) {
            return;
        }

        // Add each link to the hoard
        var newItems = newLinks.forEach(link => ({ url: link, authorid: m.author.id }));
        hoard.items.push({ $each: newItems });  // Special mongoose magic to add the items atomically

        // Save the changes to the hoard
        await userdata.save();

        // Don't increment the user's own adds
        if (m.author.id === userID) {
            return;
        }

        // Increment the author's adds
        var authordata = await User.get(userID);

        // Save the oldAdds count so we can check if we triggered a milestone
        var oldAdds = authordata.adds;
        authordata.adds += newLinks.length;

        // Save the changes to the author adds
        await authordata.save();

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
        if (!guilddata.hoardMilestones.enabled) {
            return;
        }
        // If set, use the guild's preferred milestone display time
        var displayTime = guilddata.hoardMilestones.displayTime;

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
        // Load guild data
        var guilddata = await Guild.get(m.guild.id);

        // If guild hoards are disabled and the emoji is not 😍, then skip removing from a hoard
        if (!guilddata.hoards && emoji.name !== "😍") {
            return;
        }

        // Load the people data
        var userdata = await User.get(userID);

        // If the user doesn't have this hoard, skip removal
        var hoard = userdata.hoards.find(h => h.emoji === emoji.name);
        if (!hoard) {
            return;
        }

        // Load the message
        m = await bot.getMessage(m.channel.id, m.id);

        // Get the links from the message
        var links = getLinks(m);
        if (links.length === 0) {
            return;
        }

        // Get a list of items to remove from the hoard
        var itemsToRemove = hoard.items.filter(i => links.includes(i.url) && i.authorid === m.author.id);
        if (itemsToRemove.length === 0) {
            return;
        }

        // Remove each item from the hoard
        itemsToRemove.forEach(i => i.remove());
        userdata.save();

        // Decrement author adds count
        var authordata = await User.get(m.author.id);
        authordata.adds = Math.max(0, authordata.adds - itemsToRemove.length);
        authordata.save();
    }
    catch (err) {
        console.log(err);
    }
});

bot.connect();
