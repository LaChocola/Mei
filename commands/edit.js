"use strict";

const conf = require("../conf");
const serversdb = require("../servers");
const misc = require("../misc");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var guildsdata = await serversdb.load();

        var lowerargs = args.toLowerCase();

        function roleSearch(role) {
            const roleName = role.name.toLowerCase();
            if (roleName !== "undefined") {
                return roleName;
            }
        }

        function findRole(role) {
            if (role.name !== "undefined" && lowerargs.trim() === role.name.toLowerCase().trim()) {
                const role2 = role.id;
                return role2;
            }
        }

        function hasDuplicates(name) {
            let duplicate = false;
            const length = m.channel.guild.roles.filter(r => r.name.toLowerCase() === name.toLowerCase()).length;
            if (length > 1) {
                duplicate = true;
            }
            return duplicate;
        }

        const guild = m.channel.guild;
        if (!guild) {
            return;
        }

        // Determine which subcommand was run
        var subcommands = ["hoards", "notifications", "prefix", "art", "adds", "roles", "mod"];
        var subcommand = subcommands.find(function(s) {
            var re = new RegExp(`\\b${s}\\b`);
            return re.test(lowerargs);
        });

        // Update guild data
        await misc.updateGuild(m.channel, m.guild, guildsdata);

        // Check is user is a mod
        var memberIsMod = misc.isMod(m.member, m.guild, guildsdata[guild.id]);
        // Check if user has permissions for basic commands ("hoards", "notifications", "prefix", "art", "adds", "roles")
        var hasBasicPerms = misc.hasSomePerms(m.member, ["administrator", "banMembers", "kickMembers", "manageChannels", "manageGuild", "manageRoles"]);
        // Check if user has permissions for admin commands ("mod")
        var hasAdminPerms = misc.hasSomePerms(m.member, ["administrator", "manageRoles"]);
        if (!(memberIsMod || hasAdminPerms || (subcommand !== "mod" && hasBasicPerms))) {
            await m.reply("You must be the server owner, or have moderator permissions to run this command. Have the server owner use `" + prefix + "edit mod add @you` or `" + prefix + "edit mod add @modRole`", 20000);
            await m.deleteIn(20000);
            return;
        }

        // User didn't provide an appropriate subcommand
        if (!subcommand) {
            await m.reply("These are the settings you can **edit** (Bold represents the default setting):\n\n`prefix`: <prefix>, Change the prefix Mei uses in this server, Default prefix is **`" + conf.prefix + "`**\n\n`mod`: add | remove, <@person> | <@role>. Add a moderator, or a role for moderators to use Mei's admin features, and edit settings\n\n`roles`: add <role> | remove <role> | create <role> | delete <role>, Add or remove the roles Mei can give to users, or create and delete roles in the server. (Roles created by Mei will have no power and no color, and will be at the bottom of the role list)\n\n`notifications`: banlog | updates | welcome, enable <@channel> | disable, Allows you to enable, disable, or change channels that certain notifications appear in. Currently supports a log channel for all bans, a log of all users joining and leaving, and editing the welcome message that Mei gives when users join, and what channel each appears in.\n\n`art`: remove | add <#channel>, Adds a channel for Mei to use in the `" + prefix + "art` command");
            return;
        }

        if (subcommand === "hoards") {
            if (lowerargs.includes("enable")) {
                if (!guildsdata[guild.id].hoards) {
                    guildsdata[guild.id].hoards = true;
                    await serversdb.save(guildsdata);
                    bot.createMessage(m.channel.id, "Hoards enabled for all reactions").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
                else if (guildsdata[guild.id].hoards) {
                    bot.createMessage(m.channel.id, "Hoards have already been enabled in this server").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
            }
            else {
                guildsdata[guild.id].hoards = false;
                await serversdb.save(guildsdata);
                bot.createMessage(m.channel.id, "Hoards set to :heart_eyes: only").then(function(msg) {
                    setTimeout(function() {
                        bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
            }
        }
        else if (subcommand === "notifications") {
            if (lowerargs.includes("banlog")) {
                if (lowerargs.includes("disable")) {
                    if (guildsdata[guild.id].notifications.banLog) {
                        delete guildsdata[guild.id].notifications.banLog;
                        await serversdb.save(guildsdata);
                        bot.createMessage(m.channel.id, "Ban Logs disabled").then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                    }
                    else {
                        bot.createMessage(m.channel.id, "No ban log is currently set, I can't disable what isn't there.").then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                    }
                }
                else if (lowerargs.includes("enable")) {
                    if (!m.channelMentions[0]) {
                        bot.createMessage(m.channel.id, "Please mention which channel you want the ban log to appear in");
                        return;
                    }

                    const channel = bot.getChannel(m.channelMentions[0]);
                    if (channel.permissionsOf(bot.user.id).json.sendMessages !== true) {
                        bot.createMessage(m.channel.id, "I need permission to send messages and read messages in that channel. Please modify my permissions and try again.");
                        return;
                    }

                    if (!guildsdata[guild.id].notifications) {
                        guildsdata[guild.id].notifications = {};
                    }
                    guildsdata[guild.id].notifications.banLog = channel.id;
                    await serversdb.save(guildsdata);
                    bot.createMessage(m.channel.id, "Added Ban Log to channel: " + channel.mention).then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
                else if (guildsdata[guild.id].notifications.banLog) {
                    bot.createMessage(m.channel.id, `The current ban log is in:\n<#${guildsdata[guild.id].notifications.banLog}>`);
                }
                else {
                    bot.createMessage(m.channel.id, "No ban log channel has been set yet. Use `" + prefix + "edit notifications banlog enable #channel` to add logs to that channel").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
            }
            else if (lowerargs.includes("updates")) {
                if (lowerargs.includes("disable")) {
                    if (guildsdata[guild.id].notifications.updates) {
                        delete guildsdata[guild.id].notifications.updates;
                        bot.createMessage(m.channel.id, "Update Messages disabled").then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        await serversdb.save(guildsdata);
                    }
                    else {
                        bot.createMessage(m.channel.id, "Update messages are not currently enabled, I can't disable what isn't there.").then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                    }
                }
                else if (lowerargs.includes("enable")) {
                    if (!m.channelMentions[0]) {
                        bot.createMessage(m.channel.id, "Please mention which channel you want the update messages to appear in");
                        return;
                    }

                    const channel = bot.getChannel(m.channelMentions[0]);
                    if (channel.permissionsOf(bot.user.id).json.sendMessages !== true) {
                        bot.createMessage(m.channel.id, "I need permission to send messages and read messages in that channel. Please modify my permissions and try again.");
                        return;
                    }

                    if (!guildsdata[guild.id].notifications) {
                        guildsdata[guild.id].notifications = {};
                    }
                    guildsdata[guild.id].notifications.updates = channel.id;
                    await serversdb.save(guildsdata);
                    bot.createMessage(m.channel.id, "Added update messages to channel: " + channel.mention).then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
                else if (guildsdata[guild.id].notifications.updates) {
                    bot.createMessage(m.channel.id, `The current update messages are set to go in:\n<#${guildsdata[guild.id].notifications.updates}>`);
                }
                else {
                    bot.createMessage(m.channel.id, "No update message channel has been set yet. Use `" + prefix + "edit notifications updates enable <@channel>` to add update messages to that channel").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
            }
            else if (lowerargs.includes("welcome")) {
                if (lowerargs.includes("remove")) {
                    if (guildsdata[guild.id].notifications.welcome) {
                        delete guildsdata[guild.id].notifications.welcome;
                        await serversdb.save(guildsdata);
                        bot.createMessage(m.channel.id, "Welcome message removed").then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                    }
                    else {
                        bot.createMessage(m.channel.id, "No welcome message was found, I can't remove what isn't there.").then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                    }
                }
                else if (lowerargs.includes("add")) {
                    if (!guildsdata[guild.id].notifications) {
                        guildsdata[guild.id].notifications = {};
                    }

                    if (!m.channelMentions[0]) {
                        bot.createMessage(m.channel.id, "Please mention which channel you want the welcome message to appear in, then type the welcome message");
                        return;
                    }

                    const channelID = m.channelMentions[0];
                    const channel = m.channel.guild.channels.get(channelID);
                    if (channel.permissionsOf(bot.user.id).json.sendMessages !== true) {
                        bot.createMessage(m.channel.id, "I need permission to send messages and read messages in that channel. Please modify my permissions and try again.");
                        return;
                    }

                    let message = args.replace(/\bnotifications welcome add\b/ig, "").replace(`${channel.mention}`, "").trim();
                    if (message.startsWith(" ") || message.endsWith(" ")) {
                        message = message.trim();
                    }
                    if (message.length < 1) {
                        bot.createMessage(m.channel.id, `Please type a welcome message to be added to ${channel.mention} at the end of this command`).then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 10000);
                        });
                        return;
                    }

                    bot.createMessage(m.channel.id, "Adding Welcome message: \"" + message + "\"\nto channel: " + channel.mention).then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    guildsdata[guild.id].notifications.welcome = {};
                    guildsdata[guild.id].notifications.welcome[channel.id] = message;
                    await serversdb.save(guildsdata);
                }
                else if (guildsdata[guild.id].notifications.welcome) {
                    const msg = Object.values(guildsdata[guild.id].notifications.welcome)[0];
                    bot.createMessage(m.channel.id, "The current welcome message is set as:\n\n" + msg);
                }
                else {
                    bot.createMessage(m.channel.id, "No welcome message has been set yet.").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
            }
            else if (lowerargs.includes("leave")) {
                if (lowerargs.includes("remove")) {
                    if (guildsdata[guild.id].notifications.welcome) {
                        delete guildsdata[guild.id].notifications.leave;
                        bot.createMessage(m.channel.id, "Leave message removed").then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        await serversdb.save(guildsdata);
                    }
                    else {
                        bot.createMessage(m.channel.id, "No leave message was found, I can't remove what isn't there.").then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                    }
                }
                else if (lowerargs.includes("add")) {
                    if (!guildsdata[guild.id].notifications) {
                        guildsdata[guild.id].notifications = {};
                    }

                    if (!m.channelMentions[0]) {
                        bot.createMessage(m.channel.id, "Please mention which channel you want the leave message to appear in, then type the welcome message");
                        return;
                    }

                    const channelID = m.channelMentions[0];
                    const channel = m.channel.guild.channels.get(channelID);
                    if (channel.permissionsOf(bot.user.id).json.sendMessages !== true) {
                        bot.createMessage(m.channel.id, "I need permission to send messages and read messages in that channel. Please modify my permissions and try again.");
                        return;
                    }

                    let message = args.replace(/\bnotifications leave add\b/ig, "").replace(`${channel.mention}`, "").trim();
                    if (message.startsWith(" ") || message.endsWith(" ")) {
                        message = message.trim();
                    }
                    if (message.length === 0) {
                        bot.createMessage(m.channel.id, `Please type a leave message to be added to ${channel.mention}`).then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                    }
                    bot.createMessage(m.channel.id, "Adding Leave message: \"" + message + "\"\nto channel: " + channel.mention).then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    guildsdata[guild.id].notifications.leave = {};
                    guildsdata[guild.id].notifications.leave[channel.id] = message;
                    await serversdb.save(guildsdata);
                }
                else if (guildsdata[guild.id].notifications.leave) {
                    const msg = Object.values(guildsdata[guild.id].notifications.welcome)[0];
                    bot.createMessage(m.channel.id, "The current leave message is set as:\n\n" + msg);
                }
                else {
                    bot.createMessage(m.channel.id, "No leave message has been set yet.").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
            }
        }
        else if (subcommand === "prefix") {
            var newPrefix = args.replace(/\bprefix\b/i, "");
            newPrefix = newPrefix.trim();
            if (newPrefix.length === 0) {
                await m.reply("`prefix`: <prefix>, Change the prefix Mei uses in this server, Default prefix is **`" + conf.prefix + "`**");
                return;
            }

            guildsdata[guild.id].prefix = newPrefix;
            await serversdb.save(guildsdata);
            await m.reply("Setting server prefix to: `" + newPrefix + "`", 5000);
            await m.deleteIn(5000);
        }
        else if (subcommand === "art") {
            if (lowerargs.includes("remove")) {
                if (guildsdata[guild.id].art) {
                    delete guildsdata[guild.id].art;
                    await serversdb.save(guildsdata);
                    bot.createMessage(m.channel.id, "Art channel removed").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
                else {
                    bot.createMessage(m.channel.id, "No art channel was found, I can't remove what isn't there.").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
            }
            else if (lowerargs.includes("add")) {
                const channelID = m.channelMentions[0] || m.content.replace(prefix + "edit ", "").replace("art", "").replace("add", "").replace("<#", "").replace(">", "").trim();
                const channel = bot.getChannel(channelID);
                if (channel === undefined || !channel.id) {
                    bot.createMessage(m.channel.id, "I couldn't find the channel you were looking to add, please make sure it is somewhere I can see, and try again.").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
                else if (channel.permissionsOf(bot.user.id).json.sendMessages !== true) {
                    bot.createMessage(m.channel.id, "I need permission to send messages and read messages in that channel. Please modify my permissions and try again.");
                }
                else {
                    guildsdata[guild.id].art = channel.id;
                    await serversdb.save(guildsdata);
                    bot.createMessage(m.channel.id, "Setting art channel to: " + channel.mention).then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
            }
            else {
                if (guildsdata[guild.id].art) {
                    const channel = guildsdata[guild.id].art;
                    bot.createMessage(m.channel.id, `The current art channel is set to: <#${channel}>`).then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
                else {
                    bot.createMessage(m.channel.id, "No art channel has been set yet. You can set the art channel using the command: `" + prefix + "edit art add #channel`").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
            }
        }
        else if (subcommand === "adds") {
            if (lowerargs.includes("enable")) {
                guildsdata[guild.id].adds = true;
                await serversdb.save(guildsdata);
                var number = null;
                args = m.cleanContent.toLowerCase()
                    .replace(`${prefix}edit`, "")
                    .replace("adds", "")
                    .replace("enable", "")
                    .trim().split(" ");
                console.log(args);

                args.filter(function(arg) {
                    if (arg && !isNaN(Number(arg))) {
                        number = Math.floor(Number(arg));
                        return true;
                    }
                });
                console.log(number);

                if (!isNaN(Number(number)) && number > 0 && number < 31) {
                    guildsdata[guild.id].adds = number * 60000;
                    await serversdb.save(guildsdata);
                    bot.createMessage(m.channel.id, `Hoard add counter enabled. Setting timeout to ${number} minutes.`).then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
                else {
                    bot.createMessage(m.channel.id, "Hoard add counter enabled").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
            }
            else if (lowerargs.includes("disable")) {
                guildsdata[guild.id].adds = false;
                await serversdb.save(guildsdata);
                bot.createMessage(m.channel.id, "Hoard add counter disabled").then(function(msg) {
                    setTimeout(function() {
                        bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
            }
        }
        else if (subcommand === "roles") {
            if (!guildsdata[guild.id].roles) {
                guildsdata[guild.id].roles = {};
            }

            if (lowerargs.includes("add")) {
                if (args.replace(/roles /i, "").replace(/add/i, "").toLowerCase().startsWith(" ")) {
                    args = args.replace(/roles /i, "").replace(/add/i, "").toLowerCase().slice(1);
                }
                const serverRoles = m.guild.roles.map(roleSearch);
                if (serverRoles.indexOf(lowerargs) > -1) {
                    var foundRoles = await m.guild.roles.filter(findRole);
                    if (hasDuplicates(lowerargs) || foundRoles.length > 1) {
                        bot.createMessage(m.channel.id, "There is more than one role with that name. I am not sure which you want me to add").then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        return;
                    }

                    var role = foundRoles[0];
                    if (!role.id) {
                        bot.createMessage(m.channel.id, "I couldn't find the role you were looking for").then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        return;
                    }

                    const perms = m.channel.guild.members.get(bot.user.id).permission.json;
                    if (!perms.manageRoles) {
                        bot.createMessage(m.channel.id, "I need permissions to be able to add roles, please add the \"Manage Roles\" permission to me");
                        return;
                    }

                    if (guildsdata[guild.id].roles[lowerargs]) {
                        bot.createMessage(m.channel.id, "That role is already assignable").then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        return;
                    }

                    guildsdata[guild.id].roles[lowerargs] = role.id;
                    await serversdb.save(guildsdata);
                    bot.createMessage(m.channel.id, lowerargs + " is now an assignable role").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
                else {
                    bot.createMessage(m.channel.id, args + " is not a role that has been made in this server").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
            }
            else if (lowerargs.includes("remove")) {
                args = args.replace(/roles /i, "").replace(/remove/i, "").toLowerCase();
                if (args.startsWith(" ")) {
                    args = args.slice(1);
                }

                if (!guildsdata[guild.id].roles[lowerargs]) {
                    bot.createMessage(m.channel.id, "That role has not been added yet").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }

                if (hasDuplicates(lowerargs)) {
                    bot.createMessage(m.channel.id, "There is more than one role with that name. I am not sure which you want me to remove").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }

                delete guildsdata[guild.id].roles[lowerargs];
                await serversdb.save(guildsdata);
                bot.createMessage(m.channel.id, lowerargs + " is no longer assignable").then(function(msg) {
                    setTimeout(function() {
                        bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
            }
            else if (lowerargs.includes("create")) {
                const perms = m.channel.guild.members.get(bot.user.id).permission.json;
                if (!perms.manageRoles) {
                    bot.createMessage(m.channel.id, "I need permissions to be able to create roles, please add the \"Manage Roles\" permission to me");
                    return;
                }

                args = args.replace(/roles /i, "").replace(/create/i, "").toLowerCase();
                if (args.startsWith(" ")) {
                    args = args.slice(1);
                }

                const selectedRole = args;
                const length = m.channel.guild.roles.filter(r => r.name.toLowerCase() === selectedRole.toLowerCase()).length;
                if (length > 0) {
                    bot.createMessage(m.channel.id, "There is already a role with that name. Please either choose a different name, or add that role manually").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }

                if (guildsdata[guild.id] && guildsdata[guild.id].roles && guildsdata[guild.id].roles[selectedRole] && selectedRole !== undefined) {
                    bot.createMessage(m.channel.id, "That role is already created, and assignable").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }

                var newRole = await bot.createRole(m.channel.guild.id, {
                    name: `${selectedRole}`,
                    permissions: 104188992,
                    reason: `Role created by ${m.author.username}`
                });
                guildsdata[guild.id].roles[selectedRole] = newRole.id;
                await serversdb.save(guildsdata);
                bot.createMessage(m.channel.id, `The role \`${newRole.name}\` has been created successfully, and is now assignable`).then(function(msg) {
                    setTimeout(function() {
                        bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
            }
            else if (lowerargs.includes("delete")) {
                const perms = m.channel.guild.members.get(bot.user.id).permission.json;
                if (!perms.manageRoles) {
                    bot.createMessage(m.channel.id, "I need permissions to be able to delete roles, please add the \"Manage Roles\" permission to me").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }

                args = args.replace(/roles /i, "").replace(/delete/i, "").toLowerCase();
                if (args.startsWith(" ")) {
                    args = args.slice(1);
                }
                const serverRoles = m.guild.roles.map(roleSearch);
                if (hasDuplicates(lowerargs)) {
                    bot.createMessage(m.channel.id, "There is more than one role with that name. Please either choose a different name, or delete that role manually").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }

                if (serverRoles.indexOf(lowerargs) > -1) {
                    const role = m.guild.roles.find(findRole);
                    if (!role.id) {
                        bot.createMessage(m.channel.id, "I couldn't find the role you were looking for").then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        return;
                    }

                    const perms = m.channel.guild.members.get(bot.user.id).permission.json;
                    if (!perms.manageRoles) {
                        bot.createMessage(m.channel.id, "I need permissions to be able to add roles, please add the \"Manage Roles\" permission to me");
                        return;
                    }

                    if (guildsdata[guild.id].roles[lowerargs]) {
                        delete guildsdata[guild.id].roles[lowerargs];
                        await serversdb.save(guildsdata);
                    }
                    bot.deleteRole(m.channel.guild.id, role.id, `Role deleted by ${m.member.name}`).then(function() {
                        bot.createMessage(m.channel.id, `The role \`${lowerargs}\` has been deleted successfully`).then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                    });
                }
                else {
                    bot.createMessage(m.channel.id, args + " is not a role that has been made in this server").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
            }
            else if (lowerargs.includes("update")) {
                var roles = Object.keys(guildsdata[m.channel.guild.id].roles);
                for (let role of roles) {
                    const exists = m.channel.guild.roles.find(r => r.id === guildsdata[m.channel.guild.id].roles[role]);
                    if (!exists) {
                        delete guildsdata[guild.id].roles[role];
                        await serversdb.save(guildsdata);
                        bot.createMessage(m.channel.id, role + " updated successfully").then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 1000);
                        });
                    }
                    else {
                        bot.createMessage(m.channel.id, role + " is valid, no change needed").then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 1000);
                        });
                    }
                }
            }
            else {
                bot.createMessage(m.channel.id, `You can edit the roles, and do things like adding and removing roles that Mei can give to people, and creating and deleting roles.\nSimply say things like \`${prefix}edit roles create tiny\` to *create* a role called "tiny" or \`${prefix}edit roles add giantess\` to let users get the "giantess" role from Mei when they use the \`${prefix}role\` command`).then(function(msg) {
                    setTimeout(function() {
                        bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 25000);
                });
            }
        }
        else if (subcommand === "mod") {
            if (lowerargs.includes("add")) {
                if (m.roleMentions[0]) {
                    if (!guildsdata[guild.id].modRoles) {
                        guildsdata[guild.id].modRoles = {};
                    }

                    guildsdata[guild.id].modRoles[m.roleMentions[0]] = true;
                    await serversdb.save(guildsdata);
                    bot.createMessage(m.channel.id, "That role is now a registered moderator role").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
                else if (m.mentions[0]) {
                    if (!guildsdata[guild.id].mods) {
                        guildsdata[guild.id].mods = {};
                    }

                    guildsdata[guild.id].mods[m.mentions[0].id] = true;
                    await serversdb.save(guildsdata);
                    bot.createMessage(m.channel.id, m.mentions[0].fullname + " is now a registered moderator").then(function(msg) {
                        setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
            }
            else if (lowerargs.includes("remove")) {
                if (m.roleMentions[0]) {
                    if (!guildsdata[guild.id].modRoles) {
                        guildsdata[guild.id].modRoles = {};
                    }

                    if (guildsdata[guild.id].modRoles[m.roleMentions[0]]) {
                        delete guildsdata[guild.id].modRoles[m.roleMentions[0]];
                        await serversdb.save(guildsdata);
                        bot.createMessage(m.channel.id, "That role is no longer a registered moderator role").then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                    }
                    else {
                        bot.createMessage(m.channel.id, "That role is not currently a registered moderator role, and can't be removed");
                    }
                }
                else if (m.mentions[0]) {
                    if (!guildsdata[guild.id].mods) {
                        guildsdata[guild.id].mods = {};
                    }

                    if (guildsdata[guild.id].mods[m.mentions[0].id]) {
                        delete guildsdata[guild.id].mods[m.mentions[0].id];
                        await serversdb.save(guildsdata);
                        bot.createMessage(m.channel.id, m.mentions[0].fullname + " is no longer a registered moderator").then(function(msg) {
                            setTimeout(function() {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                    }
                    else {
                        bot.createMessage(m.channel.id, "That currently is not currently a registered moderator, and can't be removed");
                    }
                }
            }
        }
    },
    help: "Modify Server Settings (Admin only)"
};
