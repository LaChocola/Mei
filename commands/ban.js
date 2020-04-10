"use strict";

const escapeStringRegexp = require("escape-string-regexp");

const serversdb = require("../servers");
const misc = require("../misc");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        var guildsdata = await serversdb.load();

        var name1 = m.cleanContent.replace(new RegExp(escapeStringRegexp(prefix) + "names ", "i"), "");
        var argsArray = args.split(" ");

        var memberIsMod = misc.isMod(m.member, m.guild, guildsdata[m.guild.id]);
        var hasPerms = misc.hasSomePerms(m.member, ["administrator", "manageRoles"]);
        if (!(memberIsMod || hasPerms)) {
            var responses = [
                "Are you a real villan?",
                "Have you ever caught a good guy?\nLike a real super hero?",
                "Have you ever tried a disguise?",
                "What are you doing?!?!?!",
                "*NO!*, Don't touch that!",
                "Fuck Off",
                "Roses are red\nfuck me ;) "
            ];
            var response = misc.choose(responses);
            m.reply(response, 5000);
            m.deleteIn(5000);
            return;
        }

        var member = m.guild.members.find(function(member) {
            var memberName = member.nick || member.username;
            if (memberName.toLowerCase() === name1.toLowerCase()) {
                return true;
            }
        });
        var mentioned = m.mentions[0] || member;
        var name;
        var undo = false;
        var guardian = m.channel.guild.members.get(m.author.id).nick || m.author.username;
        if (m.mentions[0] && m.mentions.length < 2) {
            name = mentioned.username;
        }
        if (argsArray.indexOf("undo") > -1) {
            undo = true;
        }
        var args2 = m.content.replace(prefix + "ban ", "").replace(/\bundo\b/, "").split(" | ");
        var reason = args2[1] || `Banned by: ${guardian}`;
        console.log(args2);

        if (m.mentions.length > 1) {
            var ments = [];
            for (var mention of m.mentions) {
                ments.push(mention.id);
            }
        }
        var args3 = ments || args2;
        // TODO: This probably shouldn't be forEach(async)
        args3.forEach(async function(id) {
            id = id.replace("<@", "").replace(">", "").trim();
            if (!name || m.mentions.length < 2) {
                var user = await Bot.users.get(id);
                if (!user || !user.username) {
                    name = "Unknown User";
                    return;
                }
                name = user.username;
            }
            if (undo) {
                Bot.unbanGuildMember(m.channel.guild.id, id, "Unbanned by: " + guardian)
                    .then(() => {
                        Bot.createMessage(m.channel.id, misc.chooseHand() + " Successful Unbanned: " + name + " (" + id + ")").then((msg) => {
                            return setTimeout(function() {
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            }, 5000);
                        });
                    })
                    .catch((err) => {
                        if (err.code === 50013) {
                            if (id === m.channel.guild.ownerID) {
                                Bot.createMessage(m.channel.id, "Uhm, think about what you just tried to do...").then((msg) => {
                                    return setTimeout(function() {
                                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                    }, 5000);
                                });
                                return;
                            }
                            Bot.createMessage(m.channel.id, "I do not have permisson to unban that user. Please make sure I have the `Ban Member` permission").then((msg) => {
                                return setTimeout(function() {
                                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                }, 5000);
                            });
                            return;
                        }
                        console.log(err);
                        Bot.createMessage(m.channel.id, "Something went wrong while trying to unban that member").then((msg) => {
                            return setTimeout(function() {
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            }, 5000);
                        });
                        return;
                    });
            }
            else if (id || name !== guardian) {
                Bot.banGuildMember(m.channel.guild.id, id, 0, reason)
                    .then(() => {
                        Bot.createMessage(m.channel.id, misc.chooseHand() + " Successful banned: " + name + " (" + id + ")").then((msg) => {
                            return setTimeout(function() {
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                    })
                    .catch((err) => {
                        if (err.code === 50013) {
                            if (id === m.channel.guild.ownerID) {
                                Bot.createMessage(m.channel.id, "I can not ban the owner of the server, sorry.").then((msg) => {
                                    return setTimeout(function() {
                                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                                    }, 5000);
                                });
                                return;
                            }
                            Bot.createMessage(m.channel.id, "I do not have permisson to ban that user. Please make sure I have the `Ban Member` permission, and that my highest role is above theirs").then((msg) => {
                                return setTimeout(function() {
                                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                                }, 5000);
                            });
                            return;
                        }
                        console.log(err);
                        Bot.createMessage(m.channel.id, "Something went wrong while trying to ban that member").then((msg) => {
                            return setTimeout(function() {
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        return;
                    });
            }
            else {
                Bot.createMessage(m.channel.id, "I tried...").then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
            }
        });
        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
    },
    help: "Ban someone..."
};
