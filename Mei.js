#!/usr/bin/env node

"use strict";

process.on("unhandledRejection", (err, promise) => {
    console.error("== Node detected an unhandled rejection! ==");
    console.error(err ? err.stack : promise);
});

const moment = require("moment");
// colors module extends string prototype
const colors = require("colors");  // eslint-disable-line no-unused-vars
const Eris = require("eris");

const botplus = require("./botplus");
const Profiler = require("./utils/Profiler");
const commands = require("./commands");

const conf = require("./conf");
const utils = require("./utils");
const dbs = require("./dbs");

console.log("Loading...");

botplus.extend(Eris);
if (!conf.tokens.mei) {
    console.error("Mei token not found. Quitting.");
    return;
}
var bot = Eris(conf.tokens.mei);

bot.on("ready", async function() {
    console.log("Mei is running");
});

bot.on("guildBanAdd", async function(guild, user) {
    var guildDb = await dbs.guild.load();
    if (guildDb[guild.id]) {
        if (guildDb[guild.id].notifications) {
            if (guildDb[guild.id].notifications.banLog) {
                var banned = await guild.getBan(user.id);
                var userFull = bot.users.filter(m => m.id === user.id)[0];
                var origID = userFull.id || null;
                var hash = userFull.avatar || null;
                var avy = `https://cdn.discordapp.com/avatars/${origID}/${hash}.jpg?size=128`;
                var name = userFull.nick || user.username;
                var msg = {
                    "embed": {
                        "color": 13632027,
                        "timestamp": new Date().toISOString(),
                        "thumbnail": {
                            "url": avy
                        },
                        "author": {
                            "name": "User Banned"
                        },
                        "fields": [
                            {
                                "name": "User:",
                                "value": `${name}#${user.discriminator}`,
                                "inline": true
                            },
                            {
                                "name": "ID:",
                                "value": banned.user.id,
                                "inline": true
                            },
                            {
                                "name": "\nBot:",
                                "value": banned.user.bot,
                                "inline": true
                            },
                            {
                                "name": "\nRemaining:",
                                "value": `${bot.guilds.get(guild.id).memberCount} members`,
                                "inline": true
                            }
                        ]
                    }
                };
                if (banned.reason) {
                    if (banned.reason.toLowerCase().startsWith("banned by: ")) {
                        banned.reason = banned.reason + " (Automated ban through Mei)";
                    }
                    msg.embed.fields.push({
                        "name": "\nReason:",
                        "value": banned.reason,
                        "inline": true
                    });
                }
                var channel = guildDb[guild.id].notifications.banLog;
                bot.createMessage(channel, msg);
            }
        }
    }
});

bot.on("guildBanRemove", async function(guild, user) {
    var guildDb = await dbs.guild.load();
    if (guildDb[guild.id]) {
        if (guildDb[guild.id].notifications) {
            if (guildDb[guild.id].notifications.banLog) {
                var userFull = bot.users.filter(m => m.id === user.id)[0];
                var origID = userFull.id || null;
                var hash = userFull.avatar || null;
                var avy = `https://cdn.discordapp.com/avatars/${origID}/${hash}.jpg?size=128`;
                var name = userFull.nick || user.username;
                var msg = {
                    "embed": {
                        "color": 8311585,
                        "timestamp": new Date().toISOString(),
                        "thumbnail": {
                            "url": avy
                        },
                        "author": {
                            "name": "User UnBanned"
                        },
                        "fields": [
                            {
                                "name": "User:",
                                "value": `${name}#${user.discriminator}`,
                                "inline": true
                            },
                            {
                                "name": "ID:",
                                "value": user.id,
                                "inline": true
                            },
                            {
                                "name": "\nBot:",
                                "value": user.bot,
                                "inline": true
                            },
                            {
                                "name": "\nRemaining:",
                                "value": `${bot.guilds.get(guild.id).memberCount} members`,
                                "inline": true
                            }
                        ]
                    }
                };
                var channel = guildDb[guild.id].notifications.banLog;
                bot.createMessage(channel, msg);
            }
        }
    }
});

/*
function createFakeGuild(m) {
    console.debug(`${m.author.username}#${m.author.discriminator} (${m.author.id}): ${m.content}`);

    if (m.author.id !== conf.users.owner) {
        console.debug("Guild 1:", m.channel.guild);
        var roles = new Eris.Collection(Eris.Role);
        var members = new Eris.Collection(Eris.User);
        var channels = new Eris.Collection(Eris.Channel);
        members.add(m.author, Eris.User, true);
        channels.add(m.channel, Eris.Channel, true);
        roles.add({ name: "fakeRole", id: "00001" }, Eris.Role, true);
        console.debug("Guild 2:", m.channel.guild);
    }
}
*/

async function trackUsage(commandName, authorId, profiler) {
    var globalData = await dbs.global.load(); // Track command usage in ../db/data.json

    profiler.mark();

    globalData.commands.totalRuns++;

    if (!globalData.commands[commandName]) {
        globalData.commands[commandName] = {
            totalUses: 0,
            users: {}
        };
    }

    var commandData = globalData.commands[commandName];
    if (!commandData.users[authorId]) {
        commandData.users[authorId] = 0;
    }
    commandData.users[authorId]++;
    commandData.totalUses++;

    profiler.mark();

    await dbs.user.save(globalData);
}

function getCommand(m) {
    if (!m.content.startsWith(m.prefix)) {
        return;
    }
    var args = m.content.substring(m.prefix.length).trim().split(/\s+/g);
    var commandName = args.shift().toLowerCase();
    return commandName;
}

// Handle commands
bot.on("messageCreate", async function(m) {
    // Ignore messages from bots
    if (m.author.bot) {
        return;
    }

    var guild = m.channel.guild;
    if (!guild) {
        // createFakeGuild(m);
        try {
            var dmChannel = await m.author.getDMChannel();
            await dmChannel.createMessage("Your messages do not serve me here, bug.");
        }
        catch (err) {
            if (err.code === 50007) {
                return;
            }
            console.error(err);
        }
        return;
    }

    var profiler = new Profiler();
    profiler.mark();

    var globalData = await dbs.global.load();
    if (globalData && globalData.banned && globalData.banned.global && globalData.banned.global[m.author.id]) {
        return;
    }

    profiler.mark();

    var guildDb = await dbs.guild.load();
    var guildData = guildDb[guild.id];
    m.prefix = guildData && guildData.prefix || conf.prefix;

    profiler.mark();

    var commandNames = commands.list();

    profiler.mark();

    var commandName = getCommand(m);
    if (!commandNames.includes(commandName)) {
        return;
    }

    await trackUsage(commandName, m.author.id, profiler);

    profiler.mark();
    profiler.save();

    await commands.run(commandName, m);
});

// Text adventure?
bot.on("messageCreate", async function(m) {
    // Ignore messages from bots
    if (m.author.bot) {
        return;
    }

    var guild = m.channel.guild;
    var guildDb = await dbs.guild.load();
    var guildData = guildDb[guild.id];

    // Unimplemented hack that makes every command from a certain user in a certain channel trigger the t command
    if (!(guildData
        && guildData.game
        && guildData.game.channel === m.channel.id
        && guildData.game.player === m.author.id
        && guildData.game.active
        && guildData.game.choices.includes(m.content))) {
        return;
    }

    // Run the text adventure code
});

// Automatically remove the "No channel access" role from users on r/Macrophilia
bot.on("messageCreate", async function(m) {
    if (m.channel.guild.id === conf.guilds.r_macrophilia) {
        if (m.content.includes("you joined") === true && m.author.id === conf.users.dyno) { // If shit bot says "you joined" in #welcome
            m.channel.guild.removeMemberRole(m.mentions[0].id, conf.roles.role1, "Removed from role assign"); // remove the No channel access role
        }
    }
});

// Alert Chocola of mentions
bot.on("messageCreate", async function(m) {
    // Ignore messages from bots
    if (m.author.bot) {
        return;
    }

    if (!m.content.toLowerCase().match(/\b(chocola|choco|choc)\b/i)) {
        return;
    }
    if (m.author.id === conf.users.chocola) {
        return;
    }

    var member = m.channel.guild.members.get(conf.users.chocola);
    if (!member) {
        return;
    }

    var dmChannel = await member.user.getDMChannel();

    try {
        await dmChannel.createMessage(`You were mentioned in <#${m.channel.id}> by <@${m.author.id}>. Message: <https://discordapp.com/channels/${m.guild.id}/${m.channel.id}/${m.id}>`);
        await dmChannel.createMessage(m.content);
    }
    catch (err) {
        if (err.code === 50007) {
            return;
        }
        console.log(err);
    }
});

bot.on("guildMemberAdd", async function(guild, member) {
    var guildDb = await dbs.guild.load();
    var name = undefined;
    name = guild[name]; // TODO: name is undefined...
    var count = guild.memberCount - guild.members.filter(m => m.bot).length;
    var date = member.joinedAt;
    var date2 = member.createdAt;
    name = member.nick || member.username;
    var diffDays = moment(date2).diff(date, "days");
    if (guildDb[guild.id]) {
        if (guildDb[guild.id].notifications) {
            if (guildDb[guild.id].notifications.updates) {
                let channel = guildDb[guild.id].notifications.updates;
                bot.createMessage(channel, {
                    embed: {
                        color: 0xA260F6,
                        title: `${member.username} (${member.id}) joined ${guild.name}\nWe now have: ${count} people! :smiley:`,
                        timestamp: new Date().toISOString(),
                        author: {
                            name: member.username,
                            icon_url: member.avatarURL
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
                if (diffDays < 2) {
                    bot.createMessage(channel, `:warning: **${name}** Joined less than 24 hours after creating their account`).catch((err) => {
                        console.log(err);
                    });
                }
            }
            if (guildDb[guild.id].notifications.welcome) {
                let channel = Object.keys(guildDb[guild.id].notifications.welcome)[0];
                var message = guildDb[guild.id].notifications.welcome[channel];
                message = message.replace("[name]", `${member.username}`).replace("[user]", `${member.username}#${member.discriminator}`).replace("[server]", `${guild.name}`).replace("[mention]", `${member.mention}`).replace("[count]", `${guild.memberCount - guild.members.filter(m => m.bot).length}`);
                if (channel && message) {
                    bot.createMessage(channel, message).catch((err) => {
                        console.log(err);
                    });
                }
            }
        }
    }
});

bot.on("guildMemberRemove", async function(guild, member) {
    var guildDb = await dbs.guild.load();
    var count = guild.memberCount - guild.members.filter(m => m.bot).length;
    if (guildDb[guild.id]) {
        if (guildDb[guild.id].notifications) {
            if (guildDb[guild.id].notifications.updates) {
                let channel = guildDb[guild.id].notifications.updates;
                bot.createMessage(channel, {
                    embed: {
                        color: 0xA260F6,
                        title: `${member.username} (${member.id}) left ${guild.name}\nWe now have: ${count} people! :frowning2:`,
                        timestamp: new Date().toISOString(),
                        author: {
                            name: member.username,
                            icon_url: member.avatarURL
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
            if (guildDb[guild.id].notifications.leave) {
                let channel = Object.keys(guildDb[guild.id].notifications.leave)[0];
                var message = guildDb[guild.id].notifications.leave[channel];
                message = message.replace("[name]", `${member.username}`).replace("[user]", `${member.username}#${member.discriminator}`).replace("[server]", `${guild.name}`).replace("[mention]", `${member.mention}`).replace("[count]", `${guild.memberCount - guild.members.filter(m => m.bot).length}`);
                bot.createMessage(channel, message).catch((err) => {
                    console.log(err);
                });
            }
        }
    }
});

bot.on("guildCreate", async function(guild) {
    bot.getDMChannel(conf.users.owner).then(function(DMchannel) {
        bot.createMessage(DMchannel.id, {
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
    }).catch((err) => {
        if (err.code === 50007) {
            return;
        }
        console.log(err);
    });
});

bot.on("guildDelete", async function(guild) {
    bot.getDMChannel(conf.users.owner).then(function(DMchannel) {
        bot.createMessage(DMchannel.id, {
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
    }).catch((err) => {
        if (err.code === 50007) {
            return;
        }
        console.log(err);
    });
});

bot.on("messageReactionAdd", async function(m, emoji, userID) {
    m = await m.channel.getMessage(m.id);   // fetch message if not cached

    try {
        var guildDb = await dbs.guild.load();

        if (emoji.name === "😍") {
            var link;
            if (m.attachments.length === 0 && m.embeds.length === 0) {
                link = m.cleanContent;
            }
            else if (m.attachments[0] && m.attachments.length !== 0) {
                if (m.attachments.length === 1) {
                    link = m.attachments[0].url;
                }
                else if (m.attachments.length > 1) {
                    var links = [];
                    for (var attachment of m.attachments) {
                        if (attachment.url) {
                            links.push(attachment.url);
                        }
                    }
                }
            }
            else if (m.embeds[0]) {
                if (m.embeds[0].image) {
                    link = m.embeds[0].image.url;
                }
            }
            if (link || (links && links[0])) {
                var userDb = await dbs.user.load();
                if (!userDb.people[userID]) {
                    userDb.people[userID] = {};
                    await dbs.user.save(userDb);
                }

                var personData = userDb.people[userID];
                if (!personData.hoard) {
                    personData.hoard = {
                        "😍": {}
                    };
                    await dbs.user.save(userDb);
                }
                userDb = await dbs.user.load();  // Why load it a second time?
                personData = userDb.people[userID];

                var authorData = userDb.people[m.author.id];
                var hoard = personData.hoard["😍"];
                // This should never be false?
                if (hoard) {
                    if (links && links[0]) {
                        for (let link of links) {
                            if (!hoard[link]) {
                                hoard[link] = m.author.id;
                                await dbs.user.save(userDb);
                                if (!userDb.people[m.author.id]) {
                                    userDb.people[m.author.id] = {};
                                    await dbs.user.save(userDb);
                                    userDb = await dbs.user.load();
                                }
                                if (!userDb.people[m.author.id].adds) {
                                    userDb.people[m.author.id].adds = 0;
                                    await dbs.user.save(userDb);
                                    userDb = await dbs.user.load();
                                }
                                if (m.author.id !== userID) {
                                    userDb.people[m.author.id].adds++;
                                    await dbs.user.save(userDb);
                                    if (utils.toNum(userDb.people[m.author.id].adds) % 10 === 0 && m.author.id !== m.bot.user.id) {
                                        var user = bot.users.filter(u => u.id === m.author.id)[0];
                                        bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${utils.toNum(userDb.people[m.author.id].adds)} hoard adds.`, 60000);
                                    }
                                }
                            }
                        }
                        return;
                    }
                    if (!hoard[link] && !(links && links[0])) {
                        hoard[link] = m.author.id;
                        await dbs.user.save(userDb);
                        if (!userDb.people[m.author.id]) {
                            userDb.people[m.author.id] = {};
                            await dbs.user.save(userDb);
                            userDb = await dbs.user.load();
                        }
                        if (!userDb.people[m.author.id].adds) {
                            userDb.people[m.author.id].adds = 0;
                            await dbs.user.save(userDb);
                            userDb = await dbs.user.load();
                        }
                        if (m.author.id !== userID) {
                            userDb.people[m.author.id].adds++;
                            await dbs.user.save(userDb);
                            if (utils.toNum(userDb.people[m.author.id].adds) % 10 === 0 && m.author.id !== m.bot.user.id) {
                                let user = bot.users.filter(u => u.id === m.author.id)[0];
                                bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${utils.toNum(userDb.people[m.author.id].adds)} hoard adds.`, 60000);
                            }
                        }
                        return;
                    }
                }
            }
        }
        if (guildDb[m.guild.id]) {
            if (guildDb[m.guild.id].giveaways) {
                if (guildDb[m.guild.id].giveaways.running && emoji.id === conf.emojis.giveaway && userID !== m.bot.user.id && userID !== guildDb[m.guild.id].giveaways.creator) {
                    if (m.id === guildDb[m.guild.id].giveaways.mID) {
                        guildDb[m.guild.id].giveaways.current.contestants[userID] = "entered";
                        await dbs.guild.save(guildDb);
                        return;
                    }
                }
            }
            userDb = await dbs.user.load();
            if (guildDb[m.guild.id].hoards !== false && emoji.name !== "😍") {
                if (userDb.people[userID] && userDb.people[userID].hoard && userDb.people[userID].hoard[emoji.name]) {
                    if (m.attachments.length === 0 && m.embeds.length === 0) {
                        link = m.cleanContent;
                    }
                    else if (m.attachments[0] && m.attachments.length !== 0) {
                        if (m.attachments.length === 1) {
                            link = m.attachments[0].url;
                        }
                        else if (m.attachments.length > 1) {
                            var links = [];
                            for (var attachment of m.attachments) {
                                if (attachment.url) {
                                    links.push(attachment.url);
                                }
                            }
                        }
                    }
                    else if (m.embeds[0] && m.embeds[0].image) {
                        link = m.embeds[0].image.url;
                    }
                    if (link || (links && links[0])) {
                        var userDb = await dbs.user.load();
                        var hoard = userDb.people[userID].hoard[emoji.name];
                        if (hoard) {
                            if (links && links[0]) {
                                for (let link of links) {
                                    if (!hoard[link]) {
                                        hoard[link] = m.author.id;
                                        await dbs.user.save(userDb);
                                        if (!userDb.people[m.author.id]) {
                                            userDb.people[m.author.id] = {};
                                            await dbs.user.save(userDb);
                                            userDb = await dbs.user.load();
                                        }
                                        if (!userDb.people[m.author.id].adds) {
                                            userDb.people[m.author.id].adds = 0;
                                            await dbs.user.save(userDb);
                                            userDb = await dbs.user.load();
                                        }
                                        if (m.author.id !== userID) {
                                            userDb.people[m.author.id].adds++;
                                            await dbs.user.save(userDb);
                                            if (utils.toNum(userDb.people[m.author.id].adds) % 10 === 0 && m.author.id !== m.bot.user.id) {
                                                let user = bot.users.filter(u => u.id === m.author.id)[0];
                                                bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${utils.toNum(userDb.people[m.author.id].adds)} hoard adds.`, 60000);
                                            }
                                        }
                                    }
                                }
                                return;
                            }
                            if (!hoard[link] && !(links && links[0])) {
                                hoard[link] = m.author.id;
                                await dbs.user.save(userDb);
                                if (!userDb.people[m.author.id]) {
                                    userDb.people[m.author.id] = {};
                                    await dbs.user.save(userDb);
                                    userDb = await dbs.user.load();
                                }
                                if (!userDb.people[m.author.id].adds) {
                                    userDb.people[m.author.id].adds = 0;
                                    await dbs.user.save(userDb);
                                    userDb = await dbs.user.load();
                                }
                                if (m.author.id !== userID) {
                                    userDb.people[m.author.id].adds++;
                                    await dbs.user.save(userDb);
                                    if (utils.toNum(userDb.people[m.author.id].adds) % 10 === 0 && m.author.id !== m.bot.user.id) {
                                        let user = bot.users.filter(u => u.id === m.author.id)[0];
                                        bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${utils.toNum(userDb.people[m.author.id].adds)} hoard adds.`, 60000);
                                    }
                                }
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
    catch (err) {
        console.error(err);
    }
});

bot.on("messageReactionRemove", async function(m, emoji, userID) {
    m = await m.channel.getMessage(m.id);   // fetch message if not cached

    var guildDb = await dbs.guild.load();
    var id = userID;
    var userDb = await dbs.user.load();
    if (emoji.name === "😍") {
        var link;
        if (m.attachments.length === 0 && m.embeds.length === 0) {
            link = m.cleanContent;
        }
        else if (m.attachments[0] && m.attachments.length !== 0) {
            if (m.attachments.length === 1) {
                link = m.attachments[0].url;
            }
            else if (m.attachments.length > 1) {
                var links = [];
                for (var attachment of m.attachments) {
                    if (attachment.url) {
                        links.push(attachment.url);
                    }
                }
            }
        }
        else if (m.embeds[0]) {
            if (m.embeds[0].image) {
                link = m.embeds[0].image.url;
            }
        }
        if (userDb.people[id]) {
            if (userDb.people[id].hoard) {
                var hoard = userDb.people[id].hoard["😍"];
            }
        }
        if (hoard) {
            if (links && links[0]) {
                for (let link of links) {
                    hoard = userDb.people[id].hoard[emoji.name];
                    if (hoard[link]) {
                        delete hoard[link];
                        await dbs.user.save(userDb);
                        userDb = await dbs.user.load();
                        if (userDb.people[m.author.id]) {
                            if (!userDb.people[m.author.id].adds) {
                                userDb.people[m.author.id].adds = 0;
                            }
                            await dbs.user.save(userDb);
                            userDb = await dbs.user.load();
                        }
                        if (m.author.id !== id) {
                            userDb.people[m.author.id].adds--;
                            await dbs.user.save(userDb);
                        }
                    }
                }
                return;
            }
            if (hoard[link] && !(links && links[0])) {
                delete hoard[link];
                await dbs.user.save(userDb);
                userDb = await dbs.user.load();
                if (userDb.people[m.author.id]) {
                    if (!userDb.people[m.author.id].adds) {
                        userDb.people[m.author.id].adds = 0;
                    }
                    await dbs.user.save(userDb);
                    userDb = await dbs.user.load();
                }
                if (m.author.id !== id) {
                    userDb.people[m.author.id].adds--;
                    await dbs.user.save(userDb);
                }
            }
            return;
        }
    }
    if (guildDb[m.guild.id]) {
        if (guildDb[m.guild.id].giveaways) {
            if (guildDb[m.guild.id].giveaways.running && emoji.id === conf.emojis.giveaway && userID !== m.bot.user.id && userID !== guildDb[m.guild.id].giveaways.creator) {
                if (m.id === guildDb[m.guild.id].giveaways.mID) {
                    if (guildDb[m.guild.id].giveaways.current.contestants[userID]) {
                        delete guildDb[m.guild.id].giveaways.current.contestants[userID];
                        await dbs.guild.save(guildDb);
                        return;
                    }
                }
            }
        }
        userDb = await dbs.user.load();
        if (guildDb[m.guild.id].hoards !== false && emoji.name !== "😍") {
            if (!userDb.people[id]) {
                return;
            }
            if (!userDb.people[id].hoard) {
                return;
            }
            if (userDb.people[id].hoard[emoji.name]) {
                var link;
                if (m.attachments.length === 0 && m.embeds.length === 0) {
                    link = m.cleanContent;
                }
                else if (m.attachments[0] && m.attachments.length !== 0) {
                    if (m.attachments.length === 1) {
                        link = m.attachments[0].url;
                    }
                    else if (m.attachments.length > 1) {
                        var links = [];
                        for (var attachment of m.attachments) {
                            if (attachment.url) {
                                links.push(attachment.url);
                            }
                        }
                    }
                }
                else if (m.embeds[0]) {
                    link = m.embeds[0].image.url;
                }
                var hoard = userDb.people[id].hoard[emoji.name];
                if (hoard) {
                    if (links && links[0]) {
                        for (let link of links) {
                            hoard = userDb.people[id].hoard[emoji.name];
                            if (hoard[link]) {
                                delete hoard[link];
                                await dbs.user.save(userDb);
                                if (userDb.people[m.author.id]) {
                                    if (!userDb.people[m.author.id].adds) {
                                        userDb.people[m.author.id].adds = 0;
                                    }
                                    await dbs.user.save(userDb);
                                    userDb = await dbs.user.load();
                                }
                                if (m.author.id !== id) {
                                    userDb.people[m.author.id].adds--;
                                    await dbs.user.save(userDb);
                                }
                            }
                        }
                        return;
                    }
                    if (hoard[link] && !(links && links[0])) {
                        delete hoard[link];
                        await dbs.user.save(userDb);
                        userDb = await dbs.user.load();
                        if (userDb.people[m.author.id]) {
                            if (!userDb.people[m.author.id].adds) {
                                userDb.people[m.author.id].adds = 0;
                            }
                            await dbs.user.save(userDb);
                            userDb = await dbs.user.load();
                        }
                        if (m.author.id !== id) {
                            userDb.people[m.author.id].adds--;
                            await dbs.user.save(userDb);
                        }
                    }
                    return;
                }
            }
        }
    }
});

bot.connect();
