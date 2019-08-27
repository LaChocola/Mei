"use strict";

const _ = require("../servers.js");

const data = _.load();
module.exports = {
    async main(Bot, m, args) {
        const isMod = function(member, guild) {
            if (data[guild.id]) {
                if (data[guild.id].owner !== guild.ownerID) {
                    Bot.createMessage(m.channel.id, "New server owner detected, updating database.").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    data[guild.id].owner = guild.ownerID;
                    _.save(data);
                    _.load();
                }
                if (data[guild.id].name !== guild.name) {
                    Bot.createMessage(m.channel.id, "New server name detected, updating database.").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    data[guild.id].name = guild.name;
                    _.save(data);
                    _.load();
                }
                if (data[guild.id].mods) {
                    if (data[guild.id].mods[member.id]) {
                        return true;
                    }
                }
                if (m.author.id === data[guild.id].owner || m.author.id === guild.ownerID) {
                    return true;
                }
                if (data[guild.id].modRoles) {
                    const memberRoles = member.roles;
                    let mod = false;
                    for (const role of memberRoles) {
                        if (data[guild.id].modRoles[role]) {
                            mod = true;
                        }
                    }
                    if (mod) {
                        return true;
                    }
                }
            } else {
                const perms = guild.members.get(member.id).permission.json;
                const pArray = ["banMembers", "administrator", "manageChannels", "manageGuild"];
                if (perms[pArray[0]] || perms[pArray[1]] || perms[pArray[2]] || perms[pArray[3]] || perms[pArray[4]]) {
                    return true;
                }
                return false;
            }
        };
        const roleSearch = function(role) {
            const roleName = role.name.toLowerCase();
            if (roleName !== "undefined") {
                return roleName;
            }
        };
        const findRole = function(role) {
            if (role.name !== "undefined" && args.toLowerCase().trim() === role.name.toLowerCase().trim()) {
                const role2 = role.id;
                return role2;
            }
        };
        const hasDuplicates = function(name) {
            let duplicate = false;
            const length = m.channel.guild.roles.filter(r => r.name.toLowerCase() === name.toLowerCase()).length;
            if (length > 1) {
                duplicate = true;
            }
            return duplicate;
        };
        const hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"];
        const hand = hands[Math.floor(Math.random() * hands.length)];
        const guild = m.channel.guild;
        if (!guild) {
            return;
        }
        const modCheck = isMod(m.channel.guild.members.get(m.author.id), guild);
        if (m.author.id !== guild.ownerID && m.author.id !== "161027274764713984" && modCheck !== true) {
            Bot.createMessage(m.channel.id, "You must be the server owner, or have moderator permissions to run this command. Have the server owner use `!edit mod add @you` or `!edit mod add @modRole`").then(msg => {
                return setTimeout(() => {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                }, 20000);
            });
            return;
        }
        if (!(data[guild.id])) {
            data[guild.id] = {};
            data[guild.id].name = guild.name;
            data[guild.id].owner = guild.ownerID;
            Bot.createMessage(m.channel.id, `Server: ${guild.name} added to database. Populating information ${hand}`).then(msg => {
                return setTimeout(() => {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                }, 5000);
            });
            _.save(data);
            _.load();
        }
        if (args.toLowerCase().includes("hoards")) {
            if (args.toLowerCase().includes("enable")) {
                if (!data[guild.id].hoards) {
                    data[guild.id].hoards = true;
                    _.save(data);
                    Bot.createMessage(m.channel.id, "Hoards enabled for all reactions").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }

                if (data[guild.id].hoards) {
                    Bot.createMessage(m.channel.id, "Hoards have already been enabled in this server").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
            } else {
                data[guild.id].hoards = false;
                _.save(data);
                Bot.createMessage(m.channel.id, "Hoards set to :heart_eyes: only").then(msg => {
                    return setTimeout(() => {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
        }
        if (args.toLowerCase().includes("notifications")) {
            if (args.toLowerCase().includes("banlog")) {
                if (args.toLowerCase().includes("disable")) {
                    if (data[guild.id].notifications.banLog) {
                        delete data[guild.id].notifications.banLog;
                        Bot.createMessage(m.channel.id, "Ban Logs disabled").then(msg => {
                            return setTimeout(() => {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        _.save(data);
                        return;
                    }

                    Bot.createMessage(m.channel.id, "No ban log is currently set, I cant disable what isnt there.").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                if (args.toLowerCase().includes("enable")) {
                    if (!m.channelMentions[0]) {
                        Bot.createMessage(m.channel.id, "Please mention which channel you want the ban log to appear in");
                        return;
                    }
                    const channel = Bot.getChannel(m.channelMentions[0]);
                    if (channel.permissionsOf("309220487957839872").json.sendMessages !== true) {
                        Bot.createMessage(m.channel.id, "I need permission to send messages and read messages in that channel. Please modify my permissions and try again.");
                        return;
                    }
                    if (!(data[guild.id].notifications)) {
                        data[guild.id].notifications = {};
                    }
                    data[guild.id].notifications.banLog = channel.id;
                    _.save(data);
                    Bot.createMessage(m.channel.id, "Added Ban Log to channel: " + channel.mention).then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }

                if (data[guild.id].notifications.banLog) {
                    Bot.createMessage(m.channel.id, `The current ban log is in:\n<#${data[guild.id].notifications.banLog}>`);
                    return;
                }

                Bot.createMessage(m.channel.id, "No ban log channel has been set yet. Use `!edit notifications banlog enable #channel` to add logs to that channel").then(msg => {
                    return setTimeout(() => {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
            if (args.toLowerCase().includes("updates")) {
                if (args.toLowerCase().includes("disable")) {
                    if (data[guild.id].notifications.updates) {
                        delete data[guild.id].notifications.updates;
                        Bot.createMessage(m.channel.id, "Update Messages disabled").then(msg => {
                            return setTimeout(() => {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        _.save(data);
                        return;
                    }

                    Bot.createMessage(m.channel.id, "Update messages are not currently enabled, I cant disable what isnt there.").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                if (args.toLowerCase().includes("enable")) {
                    if (!m.channelMentions[0]) {
                        Bot.createMessage(m.channel.id, "Please mention which channel you want the update messages to appear in");
                        return;
                    }
                    const channel = Bot.getChannel(m.channelMentions[0]);
                    if (channel.permissionsOf("309220487957839872").json.sendMessages !== true) {
                        Bot.createMessage(m.channel.id, "I need permission to send messages and read messages in that channel. Please modify my permissions and try again.");
                        return;
                    }
                    if (!(data[guild.id].notifications)) {
                        data[guild.id].notifications = {};
                    }
                    data[guild.id].notifications.updates = channel.id;
                    _.save(data);
                    Bot.createMessage(m.channel.id, "Added update messages to channel: " + channel.mention).then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }

                if (data[guild.id].notifications.updates) {
                    Bot.createMessage(m.channel.id, `The current update messages are set to go in:\n<#${data[guild.id].notifications.updates}>`);
                    return;
                }

                Bot.createMessage(m.channel.id, "No update message channel has been set yet. Use `!edit notifications updates enable <@channel>` to add update messages to that channel").then(msg => {
                    return setTimeout(() => {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
            if (args.toLowerCase().includes("welcome")) {
                if (args.toLowerCase().includes("remove")) {
                    if (data[guild.id].notifications.welcome) {
                        delete data[guild.id].notifications.welcome;
                        Bot.createMessage(m.channel.id, "Welcome message removed").then(msg => {
                            return setTimeout(() => {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        _.save(data);
                        return;
                    }

                    Bot.createMessage(m.channel.id, "No welcome message was found, I cant remove what isnt there.").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                if (args.toLowerCase().includes("add")) {
                    if (!(data[guild.id].notifications)) {
                        data[guild.id].notifications = {};
                    }
                    if (!m.channelMentions[0]) {
                        Bot.createMessage(m.channel.id, "Please mention which channel you want the welcome message to appear in, then type the welcome message");
                        return;
                    }
                    const channelID = m.channelMentions[0];
                    const channel = m.channel.guild.channels.get(channelID);
                    if (channel.permissionsOf("309220487957839872").json.sendMessages !== true) {
                        Bot.createMessage(m.channel.id, "I need permission to send messages and read messages in that channel. Please modify my permissions and try again.");
                        return;
                    }
                    let message = args.replace(/\bnotifications welcome add\b/ig, "").replace(`${channel.mention}`, "").trim();
                    if (message.startsWith(" ") || message.endsWith(" ")) {
                        message = message.trim();
                    }
                    if (message.length < 1) {
                        Bot.createMessage(m.channel.id, `Please type a welcome message to be added to ${channel.mention} at the end of this command`).then(msg => {
                            return setTimeout(() => {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 10000);
                        });
                        return;
                    }
                    Bot.createMessage(m.channel.id, "Adding Welcome message: '" + message + "'\nto channel: " + channel.mention).then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    data[guild.id].notifications.welcome = {};
                    data[guild.id].notifications.welcome[channel.id] = message;
                    _.save(data);
                    return;
                }

                if (data[guild.id].notifications.welcome) {
                    const msg = Object.values(data[guild.id].notifications.welcome)[0];
                    Bot.createMessage(m.channel.id, "The current welcome message is set as:\n\n" + msg);
                    return;
                }

                Bot.createMessage(m.channel.id, "No welcome message has been set yet.").then(msg => {
                    return setTimeout(() => {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
            if (args.toLowerCase().includes("leave")) {
                if (args.toLowerCase().includes("remove")) {
                    if (data[guild.id].notifications.welcome) {
                        delete data[guild.id].notifications.leave;
                        Bot.createMessage(m.channel.id, "Leave message removed").then(msg => {
                            return setTimeout(() => {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        _.save(data);
                        return;
                    }
                    Bot.createMessage(m.channel.id, "No leave message was found, I cant remove what isnt there.").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                if (args.toLowerCase().includes("add")) {
                    if (!(data[guild.id].notifications)) {
                        data[guild.id].notifications = {};
                    }
                    if (!m.channelMentions[0]) {
                        Bot.createMessage(m.channel.id, "Please mention which channel you want the leave message to appear in, then type the welcome message");
                        return;
                    }
                    const channelID = m.channelMentions[0];
                    const channel = m.channel.guild.channels.get(channelID);
                    if (channel.permissionsOf("309220487957839872").json.sendMessages !== true) {
                        Bot.createMessage(m.channel.id, "I need permission to send messages and read messages in that channel. Please modify my permissions and try again.");
                        return;
                    }
                    let message = args.replace(/\bnotifications leave add\b/ig, "").replace(`${channel.mention}`, "").trim();
                    if (message.startsWith(" ") || message.endsWith(" ")) {
                        message = message.trim();
                    }
                    if (message.length === 0) {
                        Bot.createMessage(m.channel.id, `Please type a leave message to be added to ${channel.mention}`).then(msg => {
                            return setTimeout(() => {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                    }
                    Bot.createMessage(m.channel.id, "Adding Leave message: '" + message + "'\nto channel: " + channel.mention).then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    data[guild.id].notifications.leave = {};
                    data[guild.id].notifications.leave[channel.id] = message;
                    _.save(data);
                    return;
                }

                if (data[guild.id].notifications.leave) {
                    const msg = Object.values(data[guild.id].notifications.welcome)[0];
                    Bot.createMessage(m.channel.id, "The current leave message is set as:\n\n" + msg);
                    return;
                }

                Bot.createMessage(m.channel.id, "No leave message has been set yet.").then(msg => {
                    return setTimeout(() => {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
        }
        if (args.toLowerCase().includes("prefix")) {
            let prefix = args.replace(/\bprefix\b/i, "");
            if (prefix.startsWith(" ")) {
                prefix = prefix.slice(1);
            }
            Bot.createMessage(m.channel.id, "Setting server prefix to: `" + prefix + "`").then(msg => {
                return setTimeout(() => {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                }, 5000);
            });
            data[guild.id].prefix = prefix;
            _.save(data);
            return;
        }
        if (args.toLowerCase().match(/\bart\b/i)) {
            if (args.toLowerCase().includes("remove")) {
                if (data[guild.id].art) {
                    delete data[guild.id].art;
                    Bot.createMessage(m.channel.id, "Art channel removed").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    _.save(data);
                    return;
                }

                Bot.createMessage(m.channel.id, "No art channel was found, I cant remove what isnt there.").then(msg => {
                    return setTimeout(() => {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
            if (args.toLowerCase().includes("add")) {
                const channelID = m.channelMentions[0] || m.content.replace("!edit ", "").replace("art", "").replace("add", "").replace("<#", "").replace(">", "").trim();
                const channel = Bot.getChannel(channelID);
                console.log(channel);
                if (channel === undefined || !channel.id) {
                    Bot.createMessage(m.channel.id, "I couldnt find the channel you were looking to add, please make sure it is somewhere I can see, and try again.").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                if (channel.permissionsOf("309220487957839872").json.sendMessages !== true) {
                    Bot.createMessage(m.channel.id, "I need permission to send messages and read messages in that channel. Please modify my permissions and try again.");
                    return;
                }
                Bot.createMessage(m.channel.id, "Setting art channel to: " + channel.mention).then(msg => {
                    return setTimeout(() => {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                data[guild.id].art = channel.id;
                _.save(data);
                return;
            }

            if (data[guild.id].art) {
                const channel = data[guild.id].art;
                Bot.createMessage(m.channel.id, `The current art channel is set to: <#${channel}>`).then(msg => {
                    return setTimeout(() => {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }

            Bot.createMessage(m.channel.id, "No art channel has been set yet. You can set the art channel using the command: `!edit art add #channel`").then(msg => {
                return setTimeout(() => {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                }, 5000);
            });
            return;
        }
        /*
        // soon tm
        if (args.toLowerCase().includes("ignore ")) {
            if (!m.channelMentions[0]) {
              Bot.createMessage(m.channel.id, "Please mention a channel to be ignored");
              return;
            }
            var channel = m.channelMentions[0]
            Bot.createMessage(m.channel.id, "Ignoring channel: `"+channel.name+"`");
            _.save(data)
            return;
        }
        */
        if (args.toLowerCase().includes("roles")) {
            if (!data[guild.id].roles) {
                data[guild.id].roles = {};
            }
            if (args.toLowerCase().includes("add")) {
                if (args.replace(/roles /i, "").replace(/add/i, "").toLowerCase().startsWith(" ")) {
                    args = args.replace(/roles /i, "").replace(/add/i, "").toLowerCase().slice(1);
                }
                const serverRoles = m.guild.roles.map(roleSearch);
                const selectedRole = args.toLowerCase();
                console.log("selectedRole: " + selectedRole);
                if (serverRoles.indexOf(selectedRole) > -1) {
                    var role = await m.guild.roles.filter(findRole);
                    console.log("length: " + role.length);
                    console.log("reults:");
                    console.log(role);
                    if (hasDuplicates(selectedRole) || role.length > 1) {
                        Bot.createMessage(m.channel.id, "There is more than one role with that name. I am not sure which you want me to add").then(msg => {
                            return setTimeout(() => {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        return;
                    }
                    role = role[0];
                    if (!role.id) {
                        Bot.createMessage(m.channel.id, "I couldnt find the role you were looking for").then(msg => {
                            return setTimeout(() => {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        return;
                    }
                    const perms = m.channel.guild.members.get("309220487957839872").permission.json;
                    if (!perms.manageRoles) {
                        Bot.createMessage(m.channel.id, "I need permissions to be able to add roles, please add the 'Manage Roles' permission to me");
                        return;
                    }
                    if (data[guild.id].roles[selectedRole]) {
                        Bot.createMessage(m.channel.id, "That role is already assignable").then(msg => {
                            return setTimeout(() => {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        return;
                    }
                    data[guild.id].roles[selectedRole] = role.id;
                    _.save(data);
                    Bot.createMessage(m.channel.id, selectedRole + " is now an assignable role").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                } else {
                    Bot.createMessage(m.channel.id, args + " is not a role that has been made in this server").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
                return;
            }
            if (args.toLowerCase().includes("remove")) {
                args = args.replace(/roles /i, "").replace(/remove/i, "").toLowerCase();
                if (args.startsWith(" ")) {
                    args = args.slice(1);
                }
                const selectedRole = args.toLowerCase();
                if (!data[guild.id].roles[selectedRole]) {
                    Bot.createMessage(m.channel.id, "That role has not been added yet").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                if (hasDuplicates(selectedRole)) {
                    Bot.createMessage(m.channel.id, "There is more than one role with that name. I am not sure which you want me to remove").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                delete data[guild.id].roles[selectedRole];
                _.save(data);
                Bot.createMessage(m.channel.id, selectedRole + " is no longer assignable").then(msg => {
                    return setTimeout(() => {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
            if (args.toLowerCase().includes("create")) {
                const perms = m.channel.guild.members.get("309220487957839872").permission.json;
                if (!perms.manageRoles) {
                    Bot.createMessage(m.channel.id, "I need permissions to be able to create roles, please add the 'Manage Roles' permission to me");
                    return;
                }
                args = args.replace(/roles /i, "").replace(/create/i, "").toLowerCase();
                if (args.startsWith(" ")) {
                    args = args.slice(1);
                }
                const selectedRole = args;
                const length = m.channel.guild.roles.filter(r => r.name.toLowerCase() === selectedRole.toLowerCase()).length;
                if (length > 0) {
                    Bot.createMessage(m.channel.id, "There is already a role with that name. Please either choose a different name, or add that role manually").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                if (data[guild.id]) {
                    if (data[guild.id].roles) {
                        if (data[guild.id].roles[selectedRole] && selectedRole !== undefined) {
                            Bot.createMessage(m.channel.id, "That role is already created, and assignable").then(msg => {
                                return setTimeout(() => {
                                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                                }, 5000);
                            });
                            return;
                        }
                    }
                }
                Bot.createRole(m.channel.guild.id, {
                    name: `${selectedRole}`,
                    permissions: 104188992,
                    reason: `Role created by ${m.author.username}`
                }).then(role => {
                    data[guild.id].roles[selectedRole] = role.id;
                    _.save(data);
                    Bot.createMessage(m.channel.id, `The role \`${role.name}\` has been created successfully, and is now assignable`).then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                });
                return;
            }
            if (args.toLowerCase().includes("delete")) {
                const perms = m.channel.guild.members.get("309220487957839872").permission.json;
                if (!perms.manageRoles) {
                    Bot.createMessage(m.channel.id, "I need permissions to be able to delete roles, please add the 'Manage Roles' permission to me").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                args = args.replace(/roles /i, "").replace(/delete/i, "").toLowerCase();
                if (args.startsWith(" ")) {
                    args = args.slice(1);
                }
                const serverRoles = m.guild.roles.map(roleSearch);
                const selectedRole = args.toLowerCase();
                if (hasDuplicates(selectedRole)) {
                    Bot.createMessage(m.channel.id, "There is more than one role with that name. Please either choose a different name, or delete that role manually").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                if (serverRoles.indexOf(selectedRole) > -1) {
                    const role = m.guild.roles.find(findRole);
                    if (!role.id) {
                        Bot.createMessage(m.channel.id, "I couldnt find the role you were looking for").then(msg => {
                            return setTimeout(() => {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        return;
                    }

                    const perms = m.channel.guild.members.get("309220487957839872").permission.json;
                    if (!perms.manageRoles) {
                        Bot.createMessage(m.channel.id, "I need permissions to be able to add roles, please add the 'Manage Roles' permission to me");
                        return;
                    }
                    if (data[guild.id].roles[selectedRole]) {
                        delete data[guild.id].roles[selectedRole];
                        _.save(data);
                    }
                    Bot.deleteRole(m.channel.guild.id, role.id, `Role deleted by ${m.channel.guild.members.get(m.author.id).name}`).then(() => {
                        Bot.createMessage(m.channel.id, `The role \`${selectedRole}\` has been deleted successfully`).then(msg => {
                            return setTimeout(() => {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                    });
                } else {
                    Bot.createMessage(m.channel.id, args + " is not a role that has been made in this server").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
                return;
            }
            if (args.toLowerCase().includes("update")) {
                var roles = Object.keys(data[m.channel.guild.id].roles);
                for (var role of roles) {
                    const exists = m.channel.guild.roles.find((r) => { if (r.id == data[m.channel.guild.id].roles[role]) { return true; } });
                    if (!exists) {
                        delete data[guild.id].roles[role];
                        _.save(data);
                        Bot.createMessage(m.channel.id, role + " updated successfully").then(msg => {
                            return setTimeout(() => {
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 1000);
                        });
                    }
                    else {
                        Bot.createMessage(m.channel.id, role + " is valid, no change needed").then(msg => {
                            return setTimeout(() => {
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 1000);
                        });
                    }
                }
                return;
            }
            Bot.createMessage(m.channel.id, "You can edit the roles, and do things like adding and removing roles that Mei can give to people, and creating and deleting roles.\n Simply say things like `!edit roles create tiny` to *create* a role called \"tiny\" or `!edit roles add giantess` to let users get the \"giantess\" role from Mei when they use the `!roles` command").then(msg => {
                return setTimeout(() => {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                }, 15000);
            });
            return;
        }
        if (args.toLowerCase().includes("mod")) {
            if (args.toLowerCase().includes("add")) {
                if (m.roleMentions[0]) {
                    if (!data[guild.id].modRoles) {
                        data[guild.id].modRoles = {};
                    }
                    data[guild.id].modRoles[m.roleMentions[0]] = true;
                    _.save(data);
                    Bot.createMessage(m.channel.id, "That role is now a registered moderator role").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                if (m.mentions[0]) {
                    if (!data[guild.id].mods) {
                        data[guild.id].mods = {};
                    }
                    data[guild.id].mods[m.mentions[0].id] = true;
                    _.save(data);
                    Bot.createMessage(m.channel.id, m.mentions[0].username + " is now a registered moderator").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
            }
            if (args.toLowerCase().includes("remove")) {
                if (m.roleMentions[0]) {
                    if (!data[guild.id].modRoles) {
                        data[guild.id].modRoles = {};
                    }
                    if (data[guild.id].modRoles[m.roleMentions[0]]) {
                        delete data[guild.id].modRoles[m.roleMentions[0]];
                        _.save(data);
                        Bot.createMessage(m.channel.id, "That role is no longer a registered moderator role").then(msg => {
                            return setTimeout(() => {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                    } else {
                        Bot.createMessage(m.channel.id, "That role is not currently a registered moderator role, and cant be removed");
                        return;
                    }
                    return;
                }
                if (m.mentions[0]) {
                    if (!data[guild.id].mods) {
                        data[guild.id].mods = {};
                    }
                    if (data[guild.id].mods[m.mentions[0].id]) {
                        delete data[guild.id].mods[m.mentions[0].id];
                        _.save(data);
                        Bot.createMessage(m.channel.id, m.mentions[0].username + " is no longer a registered moderator").then(msg => {
                            return setTimeout(() => {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        return;
                    }

                    Bot.createMessage(m.channel.id, "That currently is not currently a registered moderator, and cant be removed");
                }
            }
        } else {
            Bot.createMessage(m.channel.id, "These are the settings you can **edit** (Bold represents the default setting):\n\n\n`hoards`: **disable** | enable, Turn custom hoard reactions on or off in this server, defaults to off (heart eye emoji only)\n\n`prefix`: <prefix>, Change the prefix Mei sues in this server, Default prefix is **`!`**\n\n`mod`: add | remove, <@person> | <@role>. Add a moderator, or a role for moderators to use Mei's admin features, and edit settings\n\n`roles`: add <role> | remove <role> | create <role> | delete <role>, Add or remove the roles Mei can give to users, or create and delete roles in the server. (Roles created by Mei will have no power and no color, and will be at the bottom of the role list)\n\n`notifications`: banlog | updates | welcome, enable <@channel> | disable, Allows you to enable, disable, or change channels that certain notifications appear in. Currently supports a log channel for all bans, a log of all users joining and leaving, and editing the welcome message that Mei gives when users join, and what channel each appears in.\n\n`art`: remove | add <#channel>, Adds a channel for Mei to use in the `!art` command");
        }
    },
    help: "Modify Server Settings (Admin only)"
};
