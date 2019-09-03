"use strict";

const utils = require("../utils");
const dbs = require("../dbs");

const guildDb = await dbs.guild.load();

module.exports = {
    main(bot, m, args, prefix) {
        const downs = [":thumbsdown::skin-tone-1:", ":thumbsdown::skin-tone-2:", ":thumbsdown::skin-tone-3:", ":thumbsdown::skin-tone-4:", ":thumbsdown::skin-tone-5:", ":thumbsdown:"];
        const down = downs[Math.floor(Math.random() * downs.length)];
        const guild = m.channel.guild;
        m.content = m.content.toLowerCase();
        if (m.content.trim() === `${prefix}role` || m.content.trim() === `${prefix}role `) {
            m.reply("What do you want to do? | `!role add <role name>` | `!role remove <role name>` | `!role list`");
            return;
        }
        if (m.content.includes(`${prefix}role  `)) {
            m.reply("One space Please");
            return;
        }
        if (m.content.includes(`${prefix}role   `)) {
            m.reply("***One*** space Please");
            return;
        }
        var roles;
        if (guildDb[guild.id]) {
            if (guildDb[guild.id].roles) {
                if (Object.keys(guildDb[guild.id].roles)[0]) {
                    roles = guildDb[guild.id].roles;
                }
            }
        }
        if (!roles) {
            m.reply("No roles have been set up yet. Use `!edit roles` to add and remove assignable roles. (Requires Moderator Permissions)");
            return;
        }

        if (m.mentions.length > 0 && m.mentions[0].id != m.author.id) {
            m.reply("You can only assign roles to yourself");
            return;
        }
        if (m.content.includes("list")) {
            if (!guildDb[guild.id].roles) {
                m.reply("There are no roles set up in this server, to add roles, please use `!edit roles add <rolename>`");
                return;
            }
            roles = Object.keys(guildDb[m.channel.guild.id].roles);
            for (var role of roles) {
                const exists = m.channel.guild.roles.find(r => r.id == guildDb[m.channel.guild.id].roles[role]);
                if (!exists) {
                    delete guildDb[guild.id].roles[role];
                    await dbs.guild.save(guildDb);
                    m.reply(role + " updated successfully", 1000);
                }
            }
            roles = Object.keys(guildDb[guild.id].roles);
            m.reply({
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
                    m.channel.guild.addMemberRole(m.author.id, roleID, "They...asked for it?")
                        .then(() => {
                            m.reply(utils.hands.ok() + " Successful added: " + content, 7000);
                            m.deleteIn(7000);
                        })
                        .catch((err) => {
                            if (err.code === 50013) {
                                m.reply("I dont have permission to give assign that role to you. Please make sure I have `Manage Roles` permissions, and that the role you are trying to assign is under my highest role", 10000);
                                m.deleteIn(10000);
                            }
                        });
                    return;
                }
                m.reply("'" + content + "' is not a role that as been set up in this server", 7000);
                m.deleteIn(7000);
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
                        m.channel.guild.addMemberRole(m.author.id, roleID, "They...asked for it?");
                        found.push(e[1]);
                    }
                    else if (!roles[e[1]]) {
                        notFound.push(e[1]);
                    }
                }
                if (found.length > 0) {
                    m.reply(utils.hands.ok() + " Successfuly added: " + found.join(", "), 5000);
                    m.deleteIn(5000);
                    return;
                }
                if (notFound.length > 0) {
                    m.reply(down + " Unable to add: " + notFound.join(", "), 5000);
                    m.deleteIn(5000);
                }
                return;
            }
        }
        if (m.content.includes("remove")) {
            if (!m.content.includes(" | ")) {
                content = m.cleanContent.toLowerCase().replace(`${prefix}role remove `, "");
                if (roles[content]) {
                    roleID = roles[content];
                    m.channel.guild.addMemberRole(m.author.id, roleID, "They...asked for it?").then(() => {
                        m.reply(utils.hands.ok() + " Successful removed: " + content, 5000);
                        m.deleteIn(5000);
                    });
                }
                else {
                    m.reply(content + ": Not found", 5000);
                    m.deleteIn(5000);
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
                        m.channel.guild.removeMemberRole(m.author.id, roleID, "They...asked for it?");
                        found.push(e[1]);
                    }
                    else if (!roles[e[1]]) {
                        notFound.push(e[1]);
                    }
                }
                if (found.length > 0) {
                    m.reply(utils.hands.ok() + " Successfuly removed: " + found.join(", "), 5000);
                    m.deleteIn(5000);
                }
                if (notFound.length > 0) {
                    m.reply(down + " Unable to remove: " + notFound.join(", "), 5000);
                    m.deleteIn(5000);
                }
            }
        }
    },
    help: "Assign roles. `!role add XXX` seperate with `|` to add multiple"
};
