"use strict";

const conf = require("../conf");
const utils = require("../utils");
const dbs = require("../dbs");

var guildDb = await dbs.guild.load();

module.exports = {
    main: async function(bot, m, args, prefix) {
        var number = 102;
        args = m.cleanContent.replace(`${prefix}clean `, "").split(" ");
        var argsIterator = args.entries();
        for (let e of argsIterator) {
            if (utils.isNum(e[1])) {
                var int = utils.toInt(e[1]);
            }
        }
        if (!int) {
            int = 10;
        }
        var isMod = function(member, guild) {
            if (guildDb[guild.id]) {
                if (guildDb[guild.id].owner != guild.ownerID) {
                    m.reply("New server owner detected, updating database.", 5000);
                    guildDb[guild.id].owner = guild.ownerID;
                    await dbs.guild.save(guildDb);
                }
                if (guildDb[guild.id].mods) {
                    if (guildDb[guild.id].mods[member.id]) {
                        return true;
                    }
                }
                if (m.author.id === guildDb[guild.id].owner || m.author.id === guild.ownerID) {
                    return true;
                }
                if (guildDb[guild.id].modRoles) {
                    var memberRoles = member.roles;
                    var mod = false;
                    for (let role of memberRoles) {
                        if (guildDb[guild.id].modRoles[role]) {
                            mod = true;
                        }
                    }
                    if (mod) {
                        return true;
                    }
                }
            }
            else {
                var perms = guild.members.get(member.id).permission.json;
                var pArray = ["banMembers", "administrator", "manageChannels", "manageGuild", "manageMessages"];
                if (perms[pArray[0]] || perms[pArray[1]] || perms[pArray[2]] || perms[pArray[3]] || perms[pArray[4]]) {
                    return true;
                }
                return false;
            }
        };
        var modCheck = isMod(m.channel.guild.members.get(m.author.id), m.channel.guild);
        var responses = ["Are you a real villan?", "Have you ever caught a good guy? \nLike a real super hero?", "Have you ever tried a disguise?", "What are you doing?!?!?!", "*NO!*, Don't touch that!", "Fuck Off", "Roses are red\nfuck me ;) "];
        var response = responses[Math.floor(Math.random() * responses.length)];
        if (!modCheck && m.author.id !== conf.users.owner) {
            m.reply(response);
            return;
        }
        if (!m.mentions[0] && !m.cleanContent.includes(" all")) {
            m.reply("Please mention who you want to clean or say 'all', and optionally, a number of messages to delete from them");
            return;
        }
        var perms = m.channel.guild.members.get(m.author.id).permission.json;
        var pArray = ["kickMembers", "banMembers", "administrator", "manageChannels", "manageGuild", "manageMessages"];
        var mod;
        if (perms[pArray[0]] || perms[pArray[1]] || perms[pArray[2]] || perms[pArray[3]] || perms[pArray[4]] || perms[pArray[5]]) {
            mod = true;
        }
        if (m.cleanContent.includes(" all")) {
            if (m.author.id === conf.users.owner || m.author.id === m.channel.guild.ownerID || mod) {
                m.delete();
                var ids = [];
                bot.getMessages(m.channel.id, parseInt(int)).then(async function(msgs) {
                    var method = 1;
                    var oldestAllowed = (Date.now() - 1421280000000) * 4194304;
                    for (let msg of msgs) {
                        ids.push(msg.id);
                    }
                    var invalid = ids.find((messageID) => messageID < oldestAllowed);
                    if (invalid) {
                        method = 2;
                    }
                    if (method == 1) {
                        m.reply(`Cleaning ${ids.length} messages`).then(a => {
                            bot.deleteMessages(m.channel.id, ids, `${ids.length} messages cleaned. Approved by ${m.author.username}#${m.author.discriminator}`).then(() => {
                                a.delete();
                                m.reply(`Cleaned ${ids.length} messages`).then(b => {
                                    return setTimeout(function() {
                                        b.delete();
                                    }, 3000);
                                });
                            });
                        });
                        return;
                    }

                    if (method == 2) {
                        for (let id of ids) {
                            bot.deleteMessage(m.channel.id, id, `${ids.length} messages cleaned. Approved by ${m.author.username}#${m.author.discriminator}`);
                        }
                        m.reply(`Cleaning ${ids.length} messages`).then(a => {
                            return setTimeout(function() {
                                a.delete();
                            }, 3000);
                        });
                    }
                });
                return;
            }
        }
        if (m.mentions[0]) {
            if (guildDb[m.channel.guild.id]) {
                if (guildDb[m.channel.guild.id].mods) {
                    if (guildDb[m.channel.guild.id].mods[m.author.id]) {
                        mod = true;
                    }
                }
            }
            if (m.author.id === conf.users.owner || m.author.id === m.channel.guild.ownerID || mod) {
                m.delete();
                m.reply("Time to clean up").then(a => {
                    return setTimeout(function() {
                        a.delete();
                    }, 5000);
                });
                bot.getMessages(m.channel.id, parseInt(number)).then(async function(msgs) {
                    var i = 0;
                    var count = 0;
                    while (i < int) {
                        if (msgs[count] !== undefined && msgs[count].author.id === m.mentions[0].id) {
                            bot.deleteMessage(msgs[count].channel.id, msgs[count].id);
                            i++;
                        }
                        if (i == int || count == msgs.length) {
                            m.reply("All Done~").then(die => {
                                return setTimeout(function() {
                                    die.delete();
                                }, 5000);
                            });
                            return;
                        }
                        count++;
                    }
                });
                return;
            }
        }
        else {
            m.reply(response);
        }
    },
    help: "Clean stuff. `!clean @Chocola X` to delete the last X messages. Defaults to 100"
};
