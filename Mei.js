"use strict";

process.on("unhandledRejection", (err, promise) => {
    console.error("== Node detected an unhandled rejection! ==");
    console.error(err ? err.stack : promise);
});

const bot = require("eris");

Object.defineProperty(bot.Message.prototype, "guild", {
    get: function guild() {
        return this.channel.guild;
    }
});

require("colors");
const fs = require("fs").promises;
const reload = require("require-reload")(require);

const config = reload("./etc/config.json");
const datadb = require("./data");
const peopledb = require("./people");
const serversdb = require("./servers");

var Bot = bot(config.tokens.mei);
var hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"];
var hand = hands[Math.floor(Math.random() * hands.length)];
var commandContentsMap = {};

function reply(m, text, timeout) {
    Bot.createMessage(m.channel, text)
        .then(function (sendMessage) {
            return setTimeout(function () {
                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                Bot.deleteMessage(m.channel.id, sendMessage.id, "Timeout");
            }, timeout);
        })
        .catch((err) => {
            console.log("\nError Occured while sending message\n");
            console.log(err);
        });
}

Bot.on("guildBanAdd", async function (guild, user) {
    var server = await serversdb.load();
    if (server[guild.id]) {
        if (server[guild.id].notifications) {
            if (server[guild.id].notifications.banLog) {
                var banned = await Bot.getGuildBan(guild.id, user.id);
                var userFull = await Bot.users.filter(m => m.id === user.id)[0];
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
                                "value": `${await Bot.guilds.get(guild.id).memberCount} members`,
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
                var channel = server[guild.id].notifications.banLog;
                Bot.createMessage(channel, msg);
            }
        }
    }
});

Bot.on("guildBanRemove", async function (guild, user) {
    var server = await serversdb.load();
    if (server[guild.id]) {
        if (server[guild.id].notifications) {
            if (server[guild.id].notifications.banLog) {
                var userFull = await Bot.users.filter(m => m.id === user.id)[0];
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
                                "value": `${await Bot.guilds.get(guild.id).memberCount} members`,
                                "inline": true
                            }
                        ]
                    }
                };
                var channel = server[guild.id].notifications.banLog;
                Bot.createMessage(channel, msg);
            }
        }
    }
});

Bot.on("messageCreate", async function (m) {
    const timestamps = [Date.now()];
    function updateTimestamps() {
        const latest = timestamps[timestamps.length - 1];
        const now = Date.now();
        timestamps[timestamps.length - 1] = now - latest;
        timestamps.push(now);
    }
    if (!m.channel.guild) {
        console.log(`${m.author.username}#${m.author.discriminator} (${m.author.id}): ${m.content}`);
        Bot.getDMChannel(m.author.id).then(function (DMchannel) {
            Bot.createMessage(DMchannel.id, "Your messages do not serve me here, bug.");
            return;
        }).catch((err) => {
            if (err.code === 50007) {
                return;
            }
            console.log(err);
        });
        /*
        if (m.author.id !== "161027274764713984") {
          console.log("Guild 1:",m.channel.guild)
          var roles = new Collection(bot.Role)
          var members = new Collection(bot.User)
          var channels = new Collection(bot.Channel)
          members.add(m.author, bot.User, true)
          channels.add(m.channel, bot.Channel, true)
          roles.add({"name": "fakeRole", "id": "00001"}, bot.Role, true)
          var fakeGuild = {
            name: m.author.username,
            ownerid: m.author.id,
            id: m.channel.id,
            iconURL: m.author.iconURL,
            roles: roles,
            members: members,
            channels: channels
          }
          console.log(`Guild 2: ${m.channel.guild}`)
        };
        */
        return;
    }
    if (m.content.toLowerCase().match(/\bchocola\b/i) || m.content.toLowerCase().match(/\bchoco\b/i) || m.content.toLowerCase().match(/\bchoc\b/i) || m.content.toLowerCase().match(/\bmei\b/i)) {
        var present = await m.channel.guild.members.get("161027274764713984");
        if (!present) {
            return;
        }
        if (m.author.id === "161027274764713984" || m.author.id === "309220487957839872") {
            return;
        }
        Bot.getDMChannel("161027274764713984").then(async function (DMchannel) {
            Bot.createMessage(DMchannel.id, `You were mentioned in <#${m.channel.id}> by <@${m.author.id}>. Message: <https://discordapp.com/channels/${m.channel.guild.id}/${m.channel.id}/${m.id}>`).then(function (msg) {
                Bot.createMessage(DMchannel.id, m.content);
            }).catch((err) => {
                if (err.code === 50007) {
                    return;
                }
                console.log(err);
            });
        });
    }
    var data = await datadb.load();
    if (data.banned.global[m.author.id]) {
        return;
    }
    updateTimestamps();
    var config = reload("./etc/config.json");
    var server = await serversdb.load();
    var prefix = config.prefix;
    if (server[m.channel.guild.id] && server[m.channel.guild.id].game && server[m.channel.guild.id].game.channel === m.channel.id && server[m.channel.guild.id].game.player === m.author.id) {
        if (server[m.channel.guild.id].game.active && server[m.channel.guild.id].game.choices.includes(m.content)) {
            m.content = prefix + "t " + m.content;
        }
    }
    updateTimestamps();
    if (server[m.channel.guild.id] && server[m.channel.guild.id].prefix) {
        prefix = server[m.channel.guild.id].prefix;
    }
    if (m.guild.id === "373589430448947200") {
        if (m.content.includes("you joined") === true && m.author.id === "155149108183695360") { // If shit bot says "you joined" in #welcome
            Bot.removeGuildMemberRole(m.channel.guild.id, m.mentions[0].id, "375633311449481218", "Removed from role assign"); // remove the No channel access role
        }
    }
    if (m.author.id === "161027274764713984" && m.content.includes("pls")) {
        if (m.content.includes("stop")) {
            Bot.createMessage(m.channel.id, "Let me rest my eyes for a moment").then((msg) => {
                return setTimeout(function () {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout").then(() => {
                        process.exit(0);
                    });
                }, 1500);
            });
        }
        if (m.content.includes("override")) {
            reply(m, "Chocola Recognized. Permission overrides engaged. I am at your service~", 2000);
        }
        if (m.channel.guild.id === "354709664509853708") {
            if (m.content.includes(" mute") && m.mentions.length > 0) {
                if (m.mentions.length > 1) {
                    var mentions = m.mentions;
                    for (const mention of mentions) {
                        Bot.addGuildMemberRole(m.channel.guild.id, mention.id, "363854631035469825", "Daddy said shush").then(() => {
                            return Bot.createMessage(m.channel.id, hand).then((m) => {
                                return setTimeout(function () {
                                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                }, 5000);
                            });
                        });
                    }
                    return;
                }
                Bot.addGuildMemberRole(m.channel.guild.id, m.mentions[0].id, "363854631035469825", "Daddy said shush").then(() => {
                    return Bot.createMessage(m.channel.id, hand).then((m) => {
                        return setTimeout(function () {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                });
            }
            if (m.content.includes(" unmute") && m.mentions.length > 0) {
                if (m.mentions.length > 1) {
                    var mentions = m.mentions;
                    for (const mention of mention) {
                        Bot.removeGuildMemberRole(m.channel.guild.id, mention.id, "363854631035469825", "Daddy said speak").then(() => {
                            return Bot.createMessage(m.channel.id, hand).then((m) => {
                                return setTimeout(function () {
                                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                }, 5000);
                            });
                        });
                    }
                    return;
                }
                Bot.removeGuildMemberRole(m.channel.guild.id, m.mentions[0].id, "363854631035469825", "Daddy said speak").then(() => {
                    return Bot.createMessage(m.channel.id, hand).then((m) => {
                        return setTimeout(function () {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                });
            }
        }
        if (m.content.includes("disable")) {
            var command = m.content.replace("pls", "").replace("disable", "").replace("!", "").trim();
            var commands = await fs.readdir("./commands/");
            if (commands.indexOf(command + ".js") > -1) {
                const commandContents = await fs.readFile("./commands/" + command + ".js");
                if (commandContentsMap[command] !== commandContents) {
                    var cmd = await reload("./commands/" + command + ".js");
                    commandContentsMap[command] = commandContents;
                }
                else {
                    var cmd = await require("./commands/" + command + ".js");
                }
                console.log(cmd);

                if (cmd.disable) {
                    Bot.createMessage(m.channel.id, `${command} is already disabled. Doing nothing.`).then((msg) => {
                        return setTimeout(async function () {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                cmd.disable = true;
                console.log(cmd);
                await fs.writeFile("./commands/" + command + ".js", JSON.stringify(cmd));
                Bot.createMessage(m.channel.id, `${command} has been disabled.`).then((msg) => {
                    return setTimeout(async function () {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
            else {
                Bot.createMessage(m.channel.id, `${command} is not a valid command, please try again.`).then((msg) => {
                    return setTimeout(async function () {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
        }
        if (m.content.includes("enable")) {
            var command = m.content.replace("pls", "").replace("enable", "").replace("!", "").trim();
            var commands = await fs.readdir("./commands/");
            if (commands.indexOf(command + ".js") > -1) {
                const commandContents = await fs.readFile("./commands/" + command + ".js");
                if (commandContentsMap[command] !== commandContents) {
                    var cmd = await reload("./commands/" + command + ".js");
                    commandContentsMap[command] = commandContents;
                }
                else {
                    var cmd = await require("./commands/" + command + ".js");
                }
                if (!cmd.disable) {
                    Bot.createMessage(m.channel.id, `${command} is already enabled. Doing nothing.`).then((msg) => {
                        return setTimeout(async function () {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                cmd.disable = false;
                await fs.writeFile("./commands/" + command + ".js", JSON.stringify(cmd));
                Bot.createMessage(m.channel.id, `${command} has been enabled.`).then((msg) => {
                    return setTimeout(async function () {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
            else {
                Bot.createMessage(m.channel.id, `${command} is not a valid command, please try again.`).then((msg) => {
                    return setTimeout(async function () {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
        }
    }
    if (m.channel.guild.id === "196027622944145408" && m.content.startsWith(`${prefix}play`)) {
        return;
    }
    updateTimestamps();
    var loguser = `${m.author.username}#${m.author.discriminator}`.magenta.bold;
    var logserver = `${m.channel.guild.name}`.cyan.bold || "Direct Message".cyan.bold;
    var logchannel = `#${m.channel.name}`.green.bold;
    var logdivs = [" > ".blue.bold, " - ".blue.bold];
    var commands = await fs.readdir("./commands/");
    updateTimestamps();
    if (m.content.startsWith(prefix)) {
        var command = m.content.split(" ")[0].replace(prefix, "").toLowerCase();
        if (commands.includes(command + ".js")) {
            updateTimestamps();
            const commandContents = await fs.readFile("./commands/" + command + ".js");
            if (commandContentsMap[command] !== commandContents) {
                var cmd = reload("./commands/" + command + ".js");
                commandContentsMap[command] = commandContents;
            }
            else {
                var cmd = require("./commands/" + command + ".js");
            }
            if (m.author.id === "309220487957839872" && !cmd.self) {
                return;
            }
            updateTimestamps();

            // Track command usage in ../db/data.json
            var data = await datadb.load();
            updateTimestamps();
            data.commands.totalRuns++;
            if (!data.commands[command]) {
                data.commands[command] = {};
                data.commands[command].totalUses = 0;
                data.commands[command].users = {};
            }
            if (!data.commands[command].users[m.author.id]) {
                data.commands[command].users[m.author.id] = 0;
            }
            data.commands[command].users[m.author.id]++;
            data.commands[command].totalUses++;
            updateTimestamps();
            await datadb.save(data);

            var args = m.content.replace(/\[\?\]/ig, "").split(" ");
            args.splice(0, 1);
            args = args.join(" ");
            var logcmd = `${prefix}${command}`.bold;
            var logargs = `${args}`.bold;
            try {
                updateTimestamps();
                timestamps.pop();
                await fs.appendFile("db/timestamps.txt", timestamps.reduce((a, b) => a + b) + "ms | " + timestamps.join(", ") + "\n");
                console.log("CMD".black.bgGreen + " " + loguser + logdivs[1] + logserver + logdivs[0] + logchannel + " " + logcmd.blue);
                if (args) {
                    console.log("ARG".black.bgCyan + " " + logargs.blue.bold);
                }
                await cmd.main(Bot, m, args, prefix);
            }
            catch (err) {
                console.log(err);
                Bot.createMessage(m.channel.id, "An error has occured.").then((msg) => {
                    return setTimeout(function () {
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    }, 5000);
                });
                console.log("CMD".black.bgRed + " " + loguser + logdivs[1] + logserver + logdivs[0] + logchannel + " " + logcmd.red);
                if (args) {
                    console.log("ARG".black.bgCyan + " " + logargs.red.bold);
                }
                console.log("");
            }
        }
    }
});

Bot.on("guildMemberAdd", async function (guild, member) {
    var server = await serversdb.load();
    var prefix = config[prefix];
    if (server[guild.id] && server[guild.id].prefix) {
        prefix = server[guild.id];
    }
    var name = guild[name];
    var count = guild.memberCount - guild.members.filter(m => m.bot).length;
    var date = member.joinedAt;
    var date2 = member.createdAt;
    var name = member.nick || member.username;
    var diff = date - date2;
    if (server[guild.id]) {
        if (server[guild.id].notifications) {
            if (server[guild.id].notifications.updates) {
                var channel = server[guild.id].notifications.updates;
                Bot.createMessage(channel, {
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
                if (diff < 86400000) {
                    Bot.createMessage(channel, `:warning: **${name}** Joined less than 24 hours after creating their account`).catch((err) => {
                        console.log(err);
                    });
                }
            }
            if (server[guild.id].notifications.welcome) {
                var channel = Object.keys(server[guild.id].notifications.welcome)[0];
                var message = server[guild.id].notifications.welcome[channel];
                message = message.replace("[name]", `${member.username}`).replace("[user]", `${member.username}#${member.discriminator}`).replace("[server]", `${guild.name}`).replace("[mention]", `${member.mention}`).replace("[count]", `${guild.memberCount - guild.members.filter(m => m.bot).length}`);
                if (channel && message) {
                    Bot.createMessage(channel, message).catch((err) => {
                        console.log(err);
                    });
                }
            }
        }
    }
});

Bot.on("guildMemberRemove", async function (guild, member) {
    var server = await serversdb.load();
    var count = guild.memberCount - guild.members.filter(m => m.bot).length;
    if (server[guild.id]) {
        if (server[guild.id].notifications) {
            if (server[guild.id].notifications.updates) {
                var channel = server[guild.id].notifications.updates;
                Bot.createMessage(channel, {
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
            if (server[guild.id].notifications.leave) {
                var channel = Object.keys(server[guild.id].notifications.leave)[0];
                var message = server[guild.id].notifications.leave[channel];
                message = message.replace("[name]", `${member.username}`).replace("[user]", `${member.username}#${member.discriminator}`).replace("[server]", `${guild.name}`).replace("[mention]", `${member.mention}`).replace("[count]", `${guild.memberCount - guild.members.filter(m => m.bot).length}`);
                Bot.createMessage(channel, message).catch((err) => {
                    console.log(err);
                });
            }
        }
    }
});

Bot.on("guildCreate", async function (guild) {
    Bot.getDMChannel("161027274764713984").then(function (DMchannel) {
        Bot.createMessage(DMchannel.id, {
            embed: {
                color: 0xA260F6,
                title: "I was invited to the guild: " + guild.name + "(" + guild.id + ")\nI am now in " + Bot.guilds.size + " guilds",
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

Bot.on("guildDelete", async function (guild) {
    Bot.getDMChannel("161027274764713984").then(function (DMchannel) {
        Bot.createMessage(DMchannel.id, {
            embed: {
                color: 0xA260F6,
                title: "I was removed from the guild: " + guild.name + "(" + guild.id + ")\nI am now in " + Bot.guilds.size + " guilds",
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

Bot.on("messageReactionAdd", async function (m, emoji, userID) {
    var server = await serversdb.load();
    var people = await peopledb.load();
    m = await Bot.getMessage(m.channel.id, m.id);

    try {
        if (emoji.name === "😍") {
            if (m.attachments.length === 0 && m.embeds.length === 0) {
                var link = m.cleanContent;
            }
            else if (m.attachments[0] && m.attachments.length !== 0) {
                if (m.attachments.length === 1) {
                    var link = m.attachments[0].url;
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
                    var link = m.embeds[0].image.url;
                }
            }

            if (link || (links && links[0])) {
                if (!people.people[userID]) {
                    people.people[userID] = {};
                    await peopledb.save(people);
                }
                if (!people.people[userID].hoard) {
                    people.people[userID].hoard = {};
                    people.people[userID].hoard["😍"] = {};
                    await peopledb.save(people);
                }
                var hoard = people.people[userID].hoard["😍"];
                var adds = undefined;
                if (server[m.channel.guild.id]) {
                    adds = server[m.channel.guild.id].adds;
                }
                if (hoard) {
                    if (links && links[0]) {
                        for (var link of links) {
                            if (!hoard[link]) {
                                hoard[link] = m.author.id;
                                await peopledb.save(people);
                                if (!people.people[m.author.id]) {
                                    people.people[m.author.id] = {};
                                    await peopledb.save(people);
                                }
                                if (!people.people[m.author.id].adds) {
                                    people.people[m.author.id].adds = 0;
                                    await peopledb.save(people);
                                }
                                if (m.author.id !== userID) {
                                    people.people[m.author.id].adds++;
                                    await peopledb.save(people);
                                    if (!adds) {
                                        if (Number(people.people[m.author.id].adds) % 10 === 0 && m.author.id !== "309220487957839872") {
                                            var user = Bot.users.filter(u => u.id === m.author.id)[0];
                                            Bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${Number(people.people[m.author.id].adds)} hoard adds.`).then((m) => {
                                                return setTimeout(function () {
                                                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                                }, 60000);
                                            }).catch((err) => {
                                                console.log(err);
                                            });
                                        }
                                        return;
                                    }
                                    else if (adds) {
                                        if (!isNaN(Number(adds))) {
                                            if (Number(people.people[m.author.id].adds) % 10 === 0 && m.author.id !== "309220487957839872") {
                                                var user = Bot.users.filter(u => u.id === m.author.id)[0];
                                                Bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${Number(people.people[m.author.id].adds)} hoard adds.`).then((m) => {
                                                    return setTimeout(function () {
                                                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                                    }, adds);
                                                }).catch((err) => {
                                                    console.log(err);
                                                });
                                            }
                                        }
                                        return;
                                    }
                                }
                            }
                        }
                        return;
                    }
                    if (!hoard[link] && !(links && links[0])) {
                        hoard[link] = m.author.id;
                        await peopledb.save(people);
                        if (!people.people[m.author.id]) {
                            people.people[m.author.id] = {};
                            await peopledb.save(people);
                        }
                        if (!people.people[m.author.id].adds) {
                            people.people[m.author.id].adds = 0;
                            await peopledb.save(people);
                        }
                        if (m.author.id !== userID) {
                            people.people[m.author.id].adds++;
                            await peopledb.save(people);
                            if (!adds) {
                                if (Number(people.people[m.author.id].adds) % 10 === 0 && m.author.id !== "309220487957839872") {
                                    var user = Bot.users.filter(u => u.id === m.author.id)[0];
                                    Bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${Number(people.people[m.author.id].adds)} hoard adds.`).then((m) => {
                                        return setTimeout(function () {
                                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                        }, 60000);
                                    }).catch((err) => {
                                        console.log(err);
                                    });
                                }
                                return;
                            }
                            else if (adds) {
                                if (!isNaN(Number(adds))) {
                                    if (Number(people.people[m.author.id].adds) % 10 === 0 && m.author.id !== "309220487957839872") {
                                        var user = Bot.users.filter(u => u.id === m.author.id)[0];
                                        Bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${Number(people.people[m.author.id].adds)} hoard adds.`).then((m) => {
                                            return setTimeout(function () {
                                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                            }, adds);
                                        }).catch((err) => {
                                            console.log(err);
                                        });
                                    }
                                }
                                return;
                            }
                        }
                        return;
                    }
                }
            }
        }

        if (server[m.channel.guild.id]) {
            if (server[m.channel.guild.id].giveaways) {
                if (server[m.channel.guild.id].giveaways.running && emoji.id === "367892951780818946" && userID !== "309220487957839872" && userID !== server[m.channel.guild.id].giveaways.creator) {
                    if (m.id === server[m.channel.guild.id].giveaways.mID) {
                        server[m.channel.guild.id].giveaways.current.contestants[userID] = "entered";
                        await serversdb.save(server);
                        return;
                    }
                }
            }

            if (server[m.channel.guild.id].hoards !== false && emoji.name !== "😍") {
                if (people.people[userID] && people.people[userID].hoard && people.people[userID].hoard[emoji.name]) {
                    if (m.attachments.length === 0 && m.embeds.length === 0) {
                        var link = m.cleanContent;
                    }
                    else if (m.attachments[0] && m.attachments.length !== 0) {
                        if (m.attachments.length === 1) {
                            var link = m.attachments[0].url;
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
                        var link = m.embeds[0].image.url;
                    }

                    if (link || (links && links[0])) {
                        var hoard = people.people[userID].hoard[emoji.name];
                        if (hoard) {
                            if (links && links[0]) {
                                for (var link of links) {
                                    if (!hoard[link]) {
                                        hoard[link] = m.author.id;
                                        await peopledb.save(people);
                                        if (!people.people[m.author.id]) {
                                            people.people[m.author.id] = {};
                                            await peopledb.save(people);
                                        }
                                        if (!people.people[m.author.id].adds) {
                                            people.people[m.author.id].adds = 0;
                                            await peopledb.save(people);
                                        }
                                        if (m.author.id !== userID) {
                                            people.people[m.author.id].adds++;
                                            await peopledb.save(people);
                                            if (!adds) {
                                                if (Number(people.people[m.author.id].adds) % 10 === 0 && m.author.id !== "309220487957839872") {
                                                    var user = Bot.users.filter(u => u.id === m.author.id)[0];
                                                    Bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${Number(people.people[m.author.id].adds)} hoard adds.`).then((m) => {
                                                        return setTimeout(function () {
                                                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                                        }, 60000);
                                                    }).catch((err) => {
                                                        console.log(err);
                                                    });
                                                }
                                            }
                                            else if (adds) {
                                                if (!isNaN(Number(adds))) {
                                                    if (Number(people.people[m.author.id].adds) % 10 === 0 && m.author.id !== "309220487957839872") {
                                                        var user = Bot.users.filter(u => u.id === m.author.id)[0];
                                                        Bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${Number(people.people[m.author.id].adds)} hoard adds.`).then((m) => {
                                                            return setTimeout(function () {
                                                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                                            }, adds);
                                                        }).catch((err) => {
                                                            console.log(err);
                                                        });
                                                    }
                                                }
                                                return;
                                            }
                                        }
                                    }
                                }
                                return;
                            }
                            if (!hoard[link] && !(links && links[0])) {
                                hoard[link] = m.author.id;
                                await peopledb.save(people);
                                if (!people.people[m.author.id]) {
                                    people.people[m.author.id] = {};
                                    await peopledb.save(people);
                                }
                                if (!people.people[m.author.id].adds) {
                                    people.people[m.author.id].adds = 0;
                                    await peopledb.save(people);
                                }
                                if (m.author.id !== userID) {
                                    people.people[m.author.id].adds++;
                                    await peopledb.save(people);
                                    if (!adds) {
                                        if (Number(people.people[m.author.id].adds) % 10 === 0 && m.author.id !== "309220487957839872") {
                                            var user = Bot.users.filter(u => u.id === m.author.id)[0];
                                            Bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${Number(people.people[m.author.id].adds)} hoard adds.`).then((m) => {
                                                return setTimeout(function () {
                                                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                                }, 60000);
                                            }).catch((err) => {
                                                console.log(err);
                                            });
                                        }
                                    }
                                    else if (adds) {
                                        if (!isNaN(Number(adds))) {
                                            if (Number(people.people[m.author.id].adds) % 10 === 0 && m.author.id !== "309220487957839872") {
                                                var user = Bot.users.filter(u => u.id === m.author.id)[0];
                                                Bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${Number(people.people[m.author.id].adds)} hoard adds.`).then((m) => {
                                                    return setTimeout(function () {
                                                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                                    }, adds);
                                                }).catch((err) => {
                                                    console.log(err);
                                                });
                                            }
                                        }
                                        return;
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
        console.log(err);
    }
});

Bot.on("messageReactionRemove", async function (m, emoji, userID) {
    var server = await serversdb.load();
    var people = await peopledb.load();
    m = await Bot.getMessage(m.channel.id, m.id);

    try {
        if (emoji.name === "😍") {
            if (m.attachments.length === 0 && m.embeds.length === 0) {
                var link = m.cleanContent;
            }
            else if (m.attachments[0] && m.attachments.length !== 0) {
                if (m.attachments.length === 1) {
                    var link = m.attachments[0].url;
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
                    var link = m.embeds[0].image.url;
                }
            }
            if (people.people[userID]) {
                if (people.people[userID].hoard) {
                    var hoard = people.people[userID].hoard["😍"];
                }
            }
            if (hoard) {
                if (links && links[0]) {
                    for (let link of links) {
                        hoard = people.people[userID].hoard[emoji.name];
                        if (hoard[link]) {
                            delete hoard[link];
                            await peopledb.save(people);
                            if (people.people[m.author.id]) {
                                if (!people.people[m.author.id].adds) {
                                    people.people[m.author.id].adds = 0;
                                }
                                await peopledb.save(people);
                            }
                            if (m.author.id !== userID) {
                                people.people[m.author.id].adds--;
                                await peopledb.save(people);
                            }
                        }
                    }
                    return;
                }
                if (hoard[link] && !(links && links[0])) {
                    delete hoard[link];
                    await peopledb.save(people);
                    if (people.people[m.author.id]) {
                        if (!people.people[m.author.id].adds) {
                            people.people[m.author.id].adds = 0;
                        }
                        await peopledb.save(people);
                    }
                    if (m.author.id !== userID) {
                        people.people[m.author.id].adds--;
                        await peopledb.save(people);
                    }
                }
                return;
            }
        }

        if (server[m.channel.guild.id]) {
            if (server[m.channel.guild.id].giveaways) {
                if (server[m.channel.guild.id].giveaways.running && emoji.id === "367892951780818946" && userID !== "309220487957839872" && userID !== server[m.channel.guild.id].giveaways.creator) {
                    if (m.id === server[m.channel.guild.id].giveaways.mID) {
                        if (server[m.channel.guild.id].giveaways.current.contestants[userID]) {
                            delete server[m.channel.guild.id].giveaways.current.contestants[userID];
                            await serversdb.save(server);
                            return;
                        }
                    }
                }
            }

            if (server[m.channel.guild.id].hoards !== false && emoji.name !== "😍") {
                if (!people.people[userID]) {
                    return;
                }
                if (!people.people[userID].hoard) {
                    return;
                }
                if (people.people[userID].hoard[emoji.name]) {
                    if (m.attachments.length === 0 && m.embeds.length === 0) {
                        var link = m.cleanContent;
                    }
                    else if (m.attachments[0] && m.attachments.length !== 0) {
                        if (m.attachments.length === 1) {
                            var link = m.attachments[0].url;
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
                        var link = m.embeds[0].image.url;
                    }
                    var hoard = people.people[userID].hoard[emoji.name];
                    if (hoard) {
                        if (links && links[0]) {
                            for (var link of links) {
                                hoard = people.people[userID].hoard[emoji.name];
                                if (hoard[link]) {
                                    delete hoard[link];
                                    await peopledb.save(people);
                                    if (people.people[m.author.id]) {
                                        if (!people.people[m.author.id].adds) {
                                            people.people[m.author.id].adds = 0;
                                        }
                                        await peopledb.save(people);
                                    }
                                    if (m.author.id !== userID) {
                                        people.people[m.author.id].adds--;
                                        await peopledb.save(people);
                                    }
                                }
                            }
                            return;
                        }
                        if (hoard[link] && !(links && links[0])) {
                            delete hoard[link];
                            await peopledb.save(people);
                            if (people.people[m.author.id]) {
                                if (!people.people[m.author.id].adds) {
                                    people.people[m.author.id].adds = 0;
                                }
                                await peopledb.save(people);
                            }
                            if (m.author.id !== userID) {
                                people.people[m.author.id].adds--;
                                await peopledb.save(people);
                            }
                        }
                        return;
                    }
                }
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});

Bot.connect();
