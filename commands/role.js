"use strict";

const serversdb = require("../servers");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        const data = await serversdb.load();

        const hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"];
        const hand = hands[Math.floor(Math.random() * hands.length)];
        const downs = [":thumbsdown::skin-tone-1:", ":thumbsdown::skin-tone-2:", ":thumbsdown::skin-tone-3:", ":thumbsdown::skin-tone-4:", ":thumbsdown::skin-tone-5:", ":thumbsdown:"];
        const down = downs[Math.floor(Math.random() * downs.length)];
        const guild = m.guild;
        m.content = m.content.toLowerCase();
        if (m.content.trim() === `${prefix}role` || m.content.trim() === `${prefix}role `) {
            bot.createMessage(m.channel.id, "What do you want to do? | `" + prefix + "role add <role name>` | `" + prefix + "role remove <role name>` | `" + prefix + "role list`");
            return;
        }
        if (m.content.includes(`${prefix}role  `)) {
            bot.createMessage(m.channel.id, "One space Please");
            return;
        }
        if (m.content.includes(`${prefix}role   `)) {
            bot.createMessage(m.channel.id, "***One*** space Please");
            return;
        }
        var roles = data[guild.id] && data[guild.id].roles && Object.keys(data[guild.id].roles)[0] && data[guild.id].roles || undefined;

        if (!roles) {
            bot.createMessage(m.channel.id, "No roles have been set up yet. Use `" + prefix + "edit roles` to add and remove assignable roles. (Requires Moderator Permissions)").then(msg => {
                return setTimeout(() => {
                    bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                }, 10000);
            });
            return;
        }

        if (m.mentions.length > 0 && m.mentions[0].id !== m.author.id) {
            bot.createMessage(m.channel.id, "You can only assign roles to yourself").then(msg => {
                return setTimeout(() => {
                    bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                }, 1000);
            });
            return;
        }

        if (m.content.includes("list")) {
            if (!data[guild.id].roles) {
                bot.createMessage(m.channel.id, "No roles have been set up yet. Use `" + prefix + "edit roles` to add and remove assignable roles. (Requires Moderator Permissions)").then(msg => {
                    return setTimeout(() => {
                        bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 10000);
                });
                return;
            }

            var rolesKeys = Object.keys(data[guild.id].roles);
            for (var role of rolesKeys) {
                const exists = guild.roles.find(r => r.id === data[guild.id].roles[role]);
                if (!exists) {
                    delete data[guild.id].roles[role];
                    await serversdb.save(data);
                    bot.createMessage(m.channel.id, role + " updated successfully").then(msg => {
                        return setTimeout(() => {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 1000);
                    });
                }
            }
            bot.createMessage(m.channel.id, {
                content: "",
                embed: {
                    color: 0xA260F6,
                    title: rolesKeys.length + " roles are available:",
                    description: " \n" + rolesKeys.join("\n")
                }
            });
        }

        if (m.content.includes("add")) {
            if (!m.content.includes(" | ")) {
                let content = m.cleanContent.toLowerCase().replace(`${prefix}role add `, "").trim();
                if (roles[content]) {
                    let roleID = roles[content];
                    bot.addGuildMemberRole(guild.id, m.author.id, roleID, "They...asked for it?").then(() => {
                        return bot.createMessage(m.channel.id, hand + " Successfully added: " + content).then(msg => {
                            return setTimeout(() => {
                                bot.deleteMessage(msg.channel.id, msg.id, "Timeout");
                            }, 7000) && setTimeout(() => {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            }, 7000);
                        });
                    }).catch((err) => {
                        if (err.code === 50013) {
                            bot.createMessage(m.channel.id, "I don't have permission to give assign that role to you. Please make sure I have `Manage Roles` permissions, and that the role you are trying to assign is under my highest role").then(msg => {
                                return setTimeout(() => {
                                    bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                                    bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                }, 10000);
                            });
                        }
                    });
                    return;
                }
                bot.createMessage(m.channel.id, "\"" + content + "\" is not a role that as been set up in this server").then(msg => {
                    return setTimeout(() => {
                        bot.deleteMessage(msg.channel.id, msg.id, "Timeout");
                    }, 7000) && setTimeout(() => {
                        bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    }, 7000);
                });
                return;
            }
            if (m.content.includes(" | ")) {
                let content = m.cleanContent.toLowerCase().replace(`${prefix}role add `, "").split(" | ");
                let iterator = content.entries();
                let found = [];
                let notFound = [];
                for (const e of iterator) {
                    if (roles[e[1]]) {
                        let roleID = roles[e[1]];
                        bot.addGuildMemberRole(guild.id, m.author.id, roleID, "They...asked for it?");
                        found.push(e[1]);
                    }
                    else if (!roles[e[1]]) {
                        notFound.push(e[1]);
                    }
                }
                if (found.length > 0) {
                    bot.createMessage(m.channel.id, hand + " Successfully added: " + found.join(", ")).then(msg => {
                        return setTimeout(() => {
                            bot.deleteMessage(msg.channel.id, msg.id, "Timeout");
                        }, 5000) && setTimeout(() => {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                if (notFound.length > 0) {
                    bot.createMessage(m.channel.id, down + " Unable to add: " + notFound.join(", ")).then(msg => {
                        return setTimeout(() => {
                            bot.deleteMessage(msg.channel.id, msg.id, "Timeout");
                        }, 5000) && setTimeout(() => {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                }
                return;
            }
        }

        if (m.content.includes("remove")) {
            if (!m.content.includes(" | ")) {
                let content = m.cleanContent.toLowerCase().replace(`${prefix}role remove `, "");
                if (roles[content]) {
                    let roleID = roles[content];
                    bot.removeGuildMemberRole(guild.id, m.author.id, roleID, "They...asked for it?").then(() => {
                        return bot.createMessage(m.channel.id, hand + " Successfully removed: " + content).then(msg => {
                            return setTimeout(() => {
                                bot.deleteMessage(msg.channel.id, msg.id, "Timeout");
                            }, 5000) && setTimeout(() => {
                                bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            }, 5000);
                        });
                    });
                }
                else {
                    bot.createMessage(m.channel.id, content + ": Not found").then(msg => {
                        return setTimeout(() => {
                            bot.deleteMessage(msg.channel.id, msg.id, "Timeout");
                        }, 5000) && setTimeout(() => {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                }
            }
            else if (m.content.includes(" | ")) {
                let content = m.cleanContent.toLowerCase().replace(`${prefix}role remove `, "").split(" | ");
                let iterator = content.entries();
                let found = [];
                let notFound = [];
                for (const e of iterator) {
                    if (roles[e[1]]) {
                        let roleID = roles[e[1]];
                        bot.removeGuildMemberRole(guild.id, m.author.id, roleID, "They...asked for it?");
                        found.push(e[1]);
                    }
                    else if (!roles[e[1]]) {
                        notFound.push(e[1]);
                    }
                }
                if (found.length > 0) {
                    bot.createMessage(m.channel.id, hand + " Successfully removed: " + found.join(", ")).then(msg => {
                        return setTimeout(() => {
                            bot.deleteMessage(msg.channel.id, msg.id, "Timeout");
                        }, 5000) && setTimeout(() => {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                }
                if (notFound.length > 0) {
                    bot.createMessage(m.channel.id, down + " Unable to remove: " + notFound.join(", ")).then(msg => {
                        return setTimeout(() => {
                            bot.deleteMessage(msg.channel.id, msg.id, "Timeout");
                        }, 5000) && setTimeout(() => {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                }
            }
        }
    },
    help: "Assign roles. `[prefix]role add XXX` seperate with `|` to add multiple"
};
