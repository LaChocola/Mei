"use strict";

const _ = require("../servers");

const data = _.load();

module.exports = {
    main(Bot, m, args, prefix) {
        const hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"];
        const hand = hands[Math.floor(Math.random() * hands.length)];
        const downs = [":thumbsdown::skin-tone-1:", ":thumbsdown::skin-tone-2:", ":thumbsdown::skin-tone-3:", ":thumbsdown::skin-tone-4:", ":thumbsdown::skin-tone-5:", ":thumbsdown:"];
        const down = downs[Math.floor(Math.random() * downs.length)];
        const guild = m.channel.guild;
        m.content = m.content.toLowerCase();
        if (m.content.trim() === `${prefix}role` || m.content.trim() === `${prefix}role `) {
            Bot.createMessage(m.channel.id, "What do you want to do? | `!role add <role name>` | `!role remove <role name>` | `!role list`");
            return;
        }
        if (m.content.includes(`${prefix}role  `)) {
            Bot.createMessage(m.channel.id, "One space Please");
            return;
        }
        if (m.content.includes(`${prefix}role   `)) {
            Bot.createMessage(m.channel.id, "***One*** space Please");
            return;
        }
        var roles;
        if (data[guild.id]) {
            if (data[guild.id].roles) {
                if (Object.keys(data[guild.id].roles)[0]) {
                    roles = data[guild.id].roles;
                }
            }
        }
        if (!roles) {
            Bot.createMessage(m.channel.id, "No roles have been set up yet. Use `!edit roles` to add and remove assignable roles. (Requires Moderator Permissions)");
            return;
        }

        if (m.mentions.length > 0 && m.mentions[0].id != m.author.id) {
            Bot.createMessage(m.channel.id, "You can only assign roles to yourself");
            return;
        }
        if (m.content.includes("list")) {
            if (!data[guild.id].roles) {
                Bot.createMessage(m.channel.id, "There are no roles set up in this server, to add roles, please use `!edit roles add <rolename>`");
                return;
            }
            roles = Object.keys(data[m.channel.guild.id].roles);
            for (var role of roles) {
                const exists = m.channel.guild.roles.find(r => r.id == data[m.channel.guild.id].roles[role]);
                if (!exists) {
                    delete data[guild.id].roles[role];
                    _.save(data);
                    Bot.createMessage(m.channel.id, role + " updated successfully").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 1000);
                    });
                }
            }
            roles = Object.keys(data[guild.id].roles);
            Bot.createMessage(m.channel.id, {
                content: "",
                embed: {
                    color: 0xA260F6,
                    title: roles.length + " roles are available:",
                    description: " \n" + roles.join("\n")
                }
            });
        }
        if (m.content.includes("add")) {
            if (!m.content.includes(" | ")) {
                var content = m.cleanContent.toLowerCase().replace(`${prefix}role add `, "").trim();
                if (roles[content]) {
                    var roleID = roles[content];
                    Bot.addGuildMemberRole(m.channel.guild.id, m.author.id, roleID, "They...asked for it?").then(() => {
                        return Bot.createMessage(m.channel.id, hand + " Successful added: " + content).then(msg => {
                            return setTimeout(() => {
                                Bot.deleteMessage(msg.channel.id, msg.id, "Timeout");
                            }, 7000) && setTimeout(() => {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            }, 7000);
                        });
                    }).catch((err) => {
                        if (err.code == 50013) {
                            Bot.createMessage(m.channel.id, "I dont have permission to give assign that role to you. Please make sure I have `Manage Roles` permissions, and that the role you are trying to assign is under my highest role").then(msg => {
                                return setTimeout(() => {
                                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                }, 10000);
                            });
                        }
                    });
                    return;
                }
                Bot.createMessage(m.channel.id, "'" + content + "' is not a role that as been set up in this server").then(msg => {
                    return setTimeout(() => {
                        Bot.deleteMessage(msg.channel.id, msg.id, "Timeout");
                    }, 7000) && setTimeout(() => {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    }, 7000);
                });
                return;
            }
            if (m.content.includes(" | ")) {
                content = m.cleanContent.toLowerCase().replace(`${prefix}role add `, "").split(" | ");
                var iterator = content.entries();
                var found = [];
                var notFound = [];
                for (const e of iterator) {
                    if (roles[e[1]]) {
                        roleID = roles[e[1]];
                        Bot.addGuildMemberRole(m.channel.guild.id, m.author.id, roleID, "They...asked for it?");
                        found.push(e[1]);
                    }
                    else if (!roles[e[1]]) {
                        notFound.push(e[1]);
                    }
                }
                if (found.length > 0) {
                    Bot.createMessage(m.channel.id, hand + " Successfuly added: " + found.join(", ")).then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(msg.channel.id, msg.id, "Timeout");
                        }, 5000) && setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                if (notFound.length > 0) {
                    Bot.createMessage(m.channel.id, down + " Unable to add: " + notFound.join(", ")).then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(msg.channel.id, msg.id, "Timeout");
                        }, 5000) && setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                }
                return;
            }
        }
        if (m.content.includes("remove")) {
            if (!m.content.includes(" | ")) {
                content = m.cleanContent.toLowerCase().replace(`${prefix}role remove `, "");
                if (roles[content]) {
                    roleID = roles[content];
                    Bot.removeGuildMemberRole(m.channel.guild.id, m.author.id, roleID, "They...asked for it?").then(() => {
                        return Bot.createMessage(m.channel.id, hand + " Successful removed: " + content).then(msg => {
                            return setTimeout(() => {
                                Bot.deleteMessage(msg.channel.id, msg.id, "Timeout");
                            }, 5000) && setTimeout(() => {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            }, 5000);
                        });
                    });
                }
                else {
                    Bot.createMessage(m.channel.id, content + ": Not found").then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(msg.channel.id, msg.id, "Timeout");
                        }, 5000) && setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                }
            }
            else if (m.content.includes(" | ")) {
                content = m.cleanContent.toLowerCase().replace(`${prefix}role remove `, "").split(" | ");
                iterator = content.entries();
                found = [];
                notFound = [];
                for (const e of iterator) {
                    if (roles[e[1]]) {
                        roleID = roles[e[1]];
                        Bot.removeGuildMemberRole(m.channel.guild.id, m.author.id, roleID, "They...asked for it?");
                        found.push(e[1]);
                    }
                    else if (!roles[e[1]]) {
                        notFound.push(e[1]);
                    }
                }
                if (found.length > 0) {
                    Bot.createMessage(m.channel.id, hand + " Successfuly removed: " + found.join(", ")).then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(msg.channel.id, msg.id, "Timeout");
                        }, 5000) && setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                }
                if (notFound.length > 0) {
                    Bot.createMessage(m.channel.id, down + " Unable to remove: " + notFound.join(", ")).then(msg => {
                        return setTimeout(() => {
                            Bot.deleteMessage(msg.channel.id, msg.id, "Timeout");
                        }, 5000) && setTimeout(() => {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                }
            }
        }
    },
    help: "Assign roles. `!role add XXX` seperate with `|` to add multiple"
};
