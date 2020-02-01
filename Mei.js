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
const path = require("path");
const fs = require("fs").promises;
const reload = require("require-reload")(require);

const conf = require("./conf");
const datadb = require("./data");
const peopledb = require("./people");
const serversdb = require("./servers");
const misc = require("./misc");
const ids = require("./ids");

conf.load();

var Bot = bot(conf.tokens.mei);
var hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"];
var hand = misc.choose(hands);
var commandContentsMap = {};

if (!fs) {
    console.log("Mei requires Node.js version 10 or above");
    return;
}

function reply(m, text, timeout) {
    Bot.createMessage(m.channel, text)
        .then(function(sendMessage) {
            return setTimeout(function() {
                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                Bot.deleteMessage(m.channel.id, sendMessage.id, "Timeout");
            }, timeout);
        })
        .catch((err) => {
            console.log("\nError Occured while sending message\n");
            console.log(err);
        });
}

Bot.on("ready", async function() {
    Bot.editStatus("Online", {
        name: "with Tinies"
    });
    var i = 0;
    Bot.guilds.map(g => g.channels.size).forEach(c => {
        i += c;
    });
    console.log("");
    console.log("BOT".bgMagenta.yellow.bold + " Logged in as " + `${Bot.user.username}#${Bot.user.discriminator}`.cyan.bold);
    console.log("");
    console.log("INF".bgBlue.magenta + " Currently seeing: " + `${Bot.guilds.size}`.green.bold + " guilds");
    console.log("INF".bgBlue.magenta + " Currently seeing: " + `${i}`.green.bold + " channels");
    console.log("INF".bgBlue.magenta + " Currently seeing: " + `${Bot.users.size}`.green.bold + " users");
    console.log("");
});

Bot.on("guildBanAdd", async function(guild, user) {
    var guildsdata = await serversdb.load();
    if (guildsdata[guild.id]) {
        if (guildsdata[guild.id].notifications) {
            if (guildsdata[guild.id].notifications.banLog) {
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
                var channel = guildsdata[guild.id].notifications.banLog;
                Bot.createMessage(channel, msg);
            }
        }
    }
});

Bot.on("guildBanRemove", async function(guild, user) {
    var guildsdata = await serversdb.load();
    if (guildsdata[guild.id]) {
        if (guildsdata[guild.id].notifications) {
            if (guildsdata[guild.id].notifications.banLog) {
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
                var channel = guildsdata[guild.id].notifications.banLog;
                Bot.createMessage(channel, msg);
            }
        }
    }
});

Bot.on("messageCreate", async function(m) {
    const timestamps = [Date.now()];
    function updateTimestamps() {
        const latest = timestamps[timestamps.length - 1];
        const now = Date.now();
        timestamps[timestamps.length - 1] = now - latest;
        timestamps.push(now);
    }
    if (!m.channel.guild) {
        console.log(`${m.author.username}#${m.author.discriminator} (${m.author.id}): ${m.content}`);
        Bot.getDMChannel(m.author.id).then(function(DMchannel) {
            Bot.createMessage(DMchannel.id, "Your messages do not serve me here, bug.");
            return;
        }).catch((err) => {
            if (err.code === 50007) {
                return;
            }
            console.log(err);
        });
        /*
        if (m.author.id !== ids.users.chocola) {
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
        var present = await m.channel.guild.members.get(ids.users.chocola);
        if (!present) {
            return;
        }
        if (m.author.id === ids.users.chocola || m.author.id === Bot.user.id) {
            return;
        }
        Bot.getDMChannel(ids.users.chocola).then(async function(DMchannel) {
            try {
                await Bot.createMessage(DMchannel.id, `You were mentioned in <#${m.channel.id}> by <@${m.author.id}>. Message: <https://discordapp.com/channels/${m.channel.guild.id}/${m.channel.id}/${m.id}>`);
                await Bot.createMessage(DMchannel.id, m.content);
            }
            catch(err) {
                if (err.code === 50007) {
                    return;
                }
                console.log(err);
            }
        });
    }
    var data = await datadb.load();
    if (data.banned.global[m.author.id]) {
        return;
    }
    updateTimestamps();
    conf.load();
    var guildsdata = await serversdb.load();
    var prefix = conf.prefix;
    if (guildsdata[m.channel.guild.id]
        && guildsdata[m.channel.guild.id].game
        && guildsdata[m.channel.guild.id].game.channel === m.channel.id
        && guildsdata[m.channel.guild.id].game.player === m.author.id
        && guildsdata[m.channel.guild.id].game.active
        && guildsdata[m.channel.guild.id].game.choices.includes(m.content)
    ) {
        m.content = prefix + "t " + m.content;
    }
    updateTimestamps();
    if (guildsdata[m.channel.guild.id] && guildsdata[m.channel.guild.id].prefix) {
        prefix = guildsdata[m.channel.guild.id].prefix;
    }
    if (m.guild.id === ids.guilds.r_macrophilia) {
        if (m.content.includes("you joined") === true && m.author.id === ids.users.dyno) { // If shit bot says "you joined" in #welcome
            Bot.removeGuildMemberRole(m.channel.guild.id, m.mentions[0].id, ids.roles.role1, "Removed from role assign"); // remove the No channel access role
        }
    }
    if (m.author.id === ids.users.chocola && m.content.includes("pls")) {
        if (m.content.includes("stop")) {
            Bot.createMessage(m.channel.id, "Let me rest my eyes for a moment").then((msg) => {
                return setTimeout(function() {
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
        if (m.channel.guild.id === ids.guilds.smallworld) {
            if (m.content.includes(" mute") && m.mentions.length > 0) {
                if (m.mentions.length > 1) {
                    let mentions = m.mentions;
                    for (let mention of mentions) {
                        Bot.addGuildMemberRole(m.channel.guild.id, mention.id, ids.roles.role2, "Daddy said shush").then(() => {
                            return Bot.createMessage(m.channel.id, hand).then((m) => {
                                return setTimeout(function() {
                                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                }, 5000);
                            });
                        });
                    }
                    return;
                }
                Bot.addGuildMemberRole(m.channel.guild.id, m.mentions[0].id, ids.roles.role2, "Daddy said shush").then(() => {
                    return Bot.createMessage(m.channel.id, hand).then((m) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                });
            }
            if (m.content.includes(" unmute") && m.mentions.length > 0) {
                if (m.mentions.length > 1) {
                    let mentions = m.mentions;
                    for (let mention of mentions) {
                        Bot.removeGuildMemberRole(m.channel.guild.id, mention.id, ids.roles.role2, "Daddy said speak").then(() => {
                            return Bot.createMessage(m.channel.id, hand).then((m) => {
                                return setTimeout(function() {
                                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                }, 5000);
                            });
                        });
                    }
                    return;
                }
                Bot.removeGuildMemberRole(m.channel.guild.id, m.mentions[0].id, ids.roles.role2, "Daddy said speak").then(() => {
                    return Bot.createMessage(m.channel.id, hand).then((m) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                });
            }
        }
        if (m.content.includes("disable")) {
            let command = m.content.replace("pls", "").replace("disable", "").replace("!", "").trim();
            let commands = await fs.readdir(path.join(__dirname, "commands"));
            if (commands.indexOf(command + ".js") > -1) {
                const commandContents = await fs.readFile(path.join(__dirname, "commands", command + ".js"));
                let cmd;
                if (commandContentsMap[command] !== commandContents) {
                    cmd = await reload(path.join(__dirname, "commands", command + ".js"));
                    commandContentsMap[command] = commandContents;
                }
                else {
                    cmd = await require(path.join(__dirname, "commands", command + ".js"));
                }
                console.log(cmd);

                if (cmd.disable) {
                    Bot.createMessage(m.channel.id, `${command} is already disabled. Doing nothing.`).then((msg) => {
                        return setTimeout(async function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                cmd.disable = true;
                console.log(cmd);
                await fs.writeFile(path.join(__dirname, "commands", command + ".js"), JSON.stringify(cmd));
                Bot.createMessage(m.channel.id, `${command} has been disabled.`).then((msg) => {
                    return setTimeout(async function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
            else {
                Bot.createMessage(m.channel.id, `${command} is not a valid command, please try again.`).then((msg) => {
                    return setTimeout(async function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
        }
        if (m.content.includes("enable")) {
            let command = m.content.replace("pls", "").replace("enable", "").replace("!", "").trim();
            let commands = await fs.readdir(path.join(__dirname, "commands"));
            if (commands.indexOf(command + ".js") > -1) {
                const commandContents = await fs.readFile(path.join(__dirname, "commands", command + ".js"));
                let cmd;
                if (commandContentsMap[command] !== commandContents) {
                    cmd = await reload(path.join(__dirname, "commands", command + ".js"));
                    commandContentsMap[command] = commandContents;
                }
                else {
                    cmd = await require(path.join(__dirname, "commands", command + ".js"));
                }
                if (!cmd.disable) {
                    Bot.createMessage(m.channel.id, `${command} is already enabled. Doing nothing.`).then((msg) => {
                        return setTimeout(async function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                cmd.disable = false;
                await fs.writeFile(path.join(__dirname, "commands", command + ".js"), JSON.stringify(cmd));
                Bot.createMessage(m.channel.id, `${command} has been enabled.`).then((msg) => {
                    return setTimeout(async function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
            else {
                Bot.createMessage(m.channel.id, `${command} is not a valid command, please try again.`).then((msg) => {
                    return setTimeout(async function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
        }
    }
    if (m.channel.guild.id === ids.guilds.guild2 && m.content.startsWith(`${prefix}play`)) {
        return;
    }
    updateTimestamps();
    var loguser = `${m.author.username}#${m.author.discriminator}`.magenta.bold;
    var logserver = `${m.channel.guild.name}`.cyan.bold || "Direct Message".cyan.bold;
    var logchannel = `#${m.channel.name}`.green.bold;
    var logdivs = [" > ".blue.bold, " - ".blue.bold];
    let commands = await fs.readdir(path.join(__dirname, "commands"));
    updateTimestamps();
    if (m.content.startsWith(prefix)) {
        let command = m.content.split(" ")[0].replace(prefix, "").toLowerCase();
        if (commands.includes(command + ".js")) {
            updateTimestamps();
            const commandContents = await fs.readFile(path.join(__dirname, "commands", command + ".js"));
            let cmd;
            if (commandContentsMap[command] !== commandContents) {
                cmd = reload(path.join(__dirname, "commands", command + ".js"));
                commandContentsMap[command] = commandContents;
            }
            else {
                cmd = require(path.join(__dirname, "commands", command + ".js"));
            }
            if (m.author.id === Bot.user.id && !cmd.self) {
                return;
            }
            updateTimestamps();

            data.commands.totalRuns++;
            if (!data.commands[command]) {
                data.commands[command] = {
                    totalUses: 0,
                    users: {}
                };
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
                    return setTimeout(function() {
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

Bot.on("guildMemberAdd", async function(guild, member) {
    var guildsdata = await serversdb.load();
    var count = guild.memberCount - guild.members.filter(m => m.bot).length;
    var date = member.joinedAt;
    var date2 = member.createdAt;
    var name = member.nick || member.username;
    var diff = date - date2;
    if (guildsdata[guild.id]) {
        if (guildsdata[guild.id].notifications) {
            if (guildsdata[guild.id].notifications.updates) {
                let channel = guildsdata[guild.id].notifications.updates;
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
            if (guildsdata[guild.id].notifications.welcome) {
                let channel = Object.keys(guildsdata[guild.id].notifications.welcome)[0];
                var message = guildsdata[guild.id].notifications.welcome[channel];
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

Bot.on("guildMemberRemove", async function(guild, member) {
    var guildsdata = await serversdb.load();
    var count = guild.memberCount - guild.members.filter(m => m.bot).length;
    if (guildsdata[guild.id]) {
        if (guildsdata[guild.id].notifications) {
            if (guildsdata[guild.id].notifications.updates) {
                let channel = guildsdata[guild.id].notifications.updates;
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
            if (guildsdata[guild.id].notifications.leave) {
                let channel = Object.keys(guildsdata[guild.id].notifications.leave)[0];
                var message = guildsdata[guild.id].notifications.leave[channel];
                message = message.replace("[name]", `${member.username}`).replace("[user]", `${member.username}#${member.discriminator}`).replace("[server]", `${guild.name}`).replace("[mention]", `${member.mention}`).replace("[count]", `${guild.memberCount - guild.members.filter(m => m.bot).length}`);
                Bot.createMessage(channel, message).catch((err) => {
                    console.log(err);
                });
            }
        }
    }
});

Bot.on("guildCreate", async function(guild) {
    Bot.getDMChannel(ids.users.chocola).then(function(DMchannel) {
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

Bot.on("guildDelete", async function(guild) {
    Bot.getDMChannel(ids.users.chocola).then(function(DMchannel) {
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

// Giveaways
Bot.on("messageReactionAdd", async function(m, emoji, userID) {
    try {
        if (emoji.id !== ids.emojis.giveaway) {
            return;
        }

        if (userID === Bot.user.id) {
            return;
        }

        var guildsdata = await serversdb.load();
        m = await Bot.getMessage(m.channel.id, m.id);
        var guildData = guildsdata[m.channel.guild.id];

        if (userID === guildData.giveaways.creator) {
            return;
        }

        if (guildData
            && guildData.giveaways
            && guildData.giveaways.running
            && m.id === guildData.giveaways.mID
        ) {
            guildData.giveaways.current.contestants[userID] = "entered";
            await serversdb.save(guildsdata);
        }
    }
    catch(err) {
        console.log(err);
    }
});

// Giveaways
Bot.on("messageReactionRemove", async function(m, emoji, userID) {
    try {
        if (emoji.id !== ids.emojis.giveaway) {
            return;
        }

        if (userID === Bot.user.id) {
            return;
        }

        var guildsdata = await serversdb.load();
        m = await Bot.getMessage(m.channel.id, m.id);
        var guildData = guildsdata[m.channel.guild.id];

        if (userID === guildData.giveaways.creator) {
            return;
        }

        if (guildData
            && guildData.giveaways
            && guildData.giveaways.running
            && m.id === guildData.giveaways.mID
            && guildData.giveaways.current.contestants[userID]
        ) {
            delete guildData.giveaways.current.contestants[userID];
            await serversdb.save(guildsdata);
        }
    }
    catch (err) {
        console.log(err);
    }
});

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
Bot.on("messageReactionAdd", async function(m, emoji, userID) {
    try {
        var guildsdata = await serversdb.load();
        var guildData = guildsdata[m.channel.guild.id];

        // If guild hoards are disabled and the emoji is not 😍, then skip adding to a hoard
        var hoardsDisabled = guildData && guildData.hoards === false;
        if (hoardsDisabled && emoji.name !== "😍") {
            return;
        }

        m = await Bot.getMessage(m.channel.id, m.id);

        // Get the links
        var links = getLinks(m);
        if (links.length === 0) {
            return;
        }

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
        var oldAdds = authordata.adds;
        authordata.adds += newLinks.length;

        await peopledb.save(peopledata);

        // Milestone is reached every 10 hoard adds
        var milestone = Math.floor(oldAdds / 10) !== Math.floor(authordata.adds / 10);
        if (!milestone) {
            return;
        }

        // Don't display milestones for Mei
        if (m.author.id !== Bot.user.id) {
            return;
        }

        // Don't display milestones if disabled on guild
        var guildAddsSetting = guildData && guildData.adds; // True or False or number of milliseconds to display milestone notifications
        if (guildAddsSetting === false) {
            return;
        }
        var displayTime = 60000;
        if (misc.isNum(guildAddsSetting)) {
            displayTime = misc.toNum(guildAddsSetting);
        }

        // Display milestone
        var authoruser = Bot.users.find(u => u.id === m.author.id);
        Bot.createMessage(m.channel.id, `${authoruser.username}#${authoruser.discriminator} reached ${authordata.adds} hoard adds.`)
            .then(function(m) {
                setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                }, displayTime);
            })
            .catch(function(err) {
                if (err.code === 50013) {
                    console.log(`${"WRN".black.bgYellow} ${"Missing Permissions for update".magenta.bold} ${"-".blue.bold} ${m.channel.guild.name.cyan.bold} ${">".blue.bold} #${m.channel.name.green.bold} (${`https://discordapp.com/channels/${m.channel.guild.id}/${m.channel.id}/${m.id}${m.id}`.bold.red})`);
                    return;
                }
                console.log(err);
            });
    }
    catch (err) {
        console.log(err);
    }
});

// Hoard adds
Bot.on("messageReactionRemove", async function(m, emoji, userID) {
    try {
        var guildsdata = await serversdb.load();
        var guildData = guildsdata[m.channel.guild.id];

        // If guild hoards are disabled and the emoji is not 😍, then skip removing from a hoard
        var hoardsDisabled = guildData && guildData.hoards === false;
        if (hoardsDisabled && emoji.name !== "😍") {
            return;
        }

        m = await Bot.getMessage(m.channel.id, m.id);
        
        var links = getLinks(m);
        if (links.length === 0) {
            return;
        }

        var peopledata = await peopledb.load();

        var hoard = peopledata.people[userID] && peopledata.people[userID].hoard && peopledata.people[userID].hoard[emoji.name];
        if (!hoard) {
            return;
        }

        var existingLinks = links.filter(link => hoard[link]);
        if (existingLinks.length === 0) {
            return;
        }

        existingLinks.forEach(function(link) {
            var authorId = hoard[link];
            var author = peopledata.people[authorId];
            if (!author.adds) {
                author.adds = 0;
            }
            author.adds = Math.max(0, author.adds - 1);
            delete hoard[link];
        });

        await peopledb.save(peopledata);
    }
    catch (err) {
        console.log(err);
    }
});

Bot.connect();
