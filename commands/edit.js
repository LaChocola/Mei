"use strict";

const conf = require("../conf");
const utils = require("../utils");
const dbs = require("../dbs");

var guildDb = dbs.guild.load();

function checkIsMod(m, member, guild) {
    var guildData = guildDb[guild.id];
    if (!guildData) {
        const perms = guild.members.get(member.id).permission.json;
        return perms.banMembers || perms.administrator || perms.manageChannels || perms.manageGuild;
    }

    if (guildData.owner !== guild.ownerID) {
        //m.reply("New server owner detected, updating database.", 5000);
        guildData.owner = guild.ownerID;
        dbs.guild.save(guildDb);
    }
    if (guildData.name !== guild.name) {
        //m.reply("New server name detected, updating database.", 5000);
        guildData.name = guild.name;
        dbs.guild.save(guildDb);
    }
    if (guildData.mods) {
        if (guildData.mods[member.id]) {
            return true;
        }
    }
    if (m.author.id === guildData.owner || m.author.id === guild.ownerID) {
        return true;
    }
    if (guildData.modRoles) {
        const memberRoles = member.roles;
        let mod = false;
        for (const role of memberRoles) {
            if (guildData.modRoles[role]) {
                mod = true;
            }
        }
        if (mod) {
            return true;
        }
    }
}

function getRoleName(role) {
    var name;
    if (typeof role === "string") {
        name = role;
    }
    else {
        name = role.name;
    }
    name = name.trim().toLowerCase();
    return name;
}

// roles = m.channel.guild.roles
function checkHasDuplicates(role, roles) {
    var hasDuplicates = roles.filter(r => utils.isSameRole(role, r)).length > 1;
    return hasDuplicates;
}

module.exports = {
    main: async function(bot, m, args, prefix) {
        var commandArgs = args.split(/\s+/g);
        if (!commandArgs) {
            return;
        }

        var guild = m.channel.guild;
        if (!guild) {
            return;
        }

        const modCheck = checkIsMod(m, m.channel.guild.members.get(m.author.id), guild);
        if (m.author.id !== guild.ownerID && m.author.id !== conf.users.owner && modCheck !== true) {
            m.reply("You must be the server owner, or have moderator permissions to run this command. Have the server owner use `!edit mod add @you` or `!edit mod add @modRole`", 20000);
            m.deleteIn(20000);
            return;
        }

        if (!guildDb[guild.id]) {
            guildDb[guild.id] = {
                name: guild.name,
                owner: guild.ownerID
            };
            m.reply(`Server: ${guild.name} added to database. Populating information ${utils.hands.ok()}`, 5000);
            m.deleteIn(5000);
            dbs.guild.save(guildDb);
        }
        var guildData = guildDb[guild.id];

        if (args.toLowerCase().includes("hoards")) {
            if (args.toLowerCase().includes("enable")) {
                if (!guildDb[guild.id].hoards) {
                    guildDb[guild.id].hoards = true;
                    dbs.guild.save(guildDb);
                    m.reply("Hoards enabled for all reactions", 5000);
                    m.deleteIn(5000);
                    return;
                }

                if (guildDb[guild.id].hoards) {
                    m.reply("Hoards have already been enabled in this server", 5000);
                    m.deleteIn(5000);
                    return;
                }
            }
            else {
                guildDb[guild.id].hoards = false;
                dbs.guild.save(guildDb);
                m.reply("Hoards set to :heart_eyes: only", 5000);
                m.deleteIn(5000);
                return;
            }
        }
        if (args.toLowerCase().includes("notifications")) {
            if (args.toLowerCase().includes("banlog")) {
                if (args.toLowerCase().includes("disable")) {
                    if (guildDb[guild.id].notifications.banLog) {
                        delete guildDb[guild.id].notifications.banLog;
                        m.reply("Ban Logs disabled", 5000);
                        m.deleteIn(5000);
                        dbs.guild.save(guildDb);
                        return;
                    }

                    m.reply("No ban log is currently set, I can't disable what isn't there.", 5000);
                    m.deleteIn(5000);
                    return;
                }
                if (args.toLowerCase().includes("enable")) {
                    if (!m.channelMentions[0]) {
                        m.reply("Please mention which channel you want the ban log to appear in");
                        return;
                    }
                    const channel = bot.getChannel(m.channelMentions[0]);
                    if (channel.permissionsOf(conf.users.bot).json.sendMessages !== true) {
                        m.reply("I need permission to send messages and read messages in that channel. Please modify my permissions and try again.");
                        return;
                    }
                    if (!guildDb[guild.id].notifications) {
                        guildDb[guild.id].notifications = {};
                    }
                    guildDb[guild.id].notifications.banLog = channel.id;
                    dbs.guild.save(guildDb);
                    m.reply("Added Ban Log to channel: " + channel.mention, 5000);
                    m.deleteIn(5000);
                    return;
                }

                if (guildDb[guild.id].notifications.banLog) {
                    m.reply(`The current ban log is in:\n<#${guildDb[guild.id].notifications.banLog}>`);
                    return;
                }

                m.reply("No ban log channel has been set yet. Use `!edit notifications banlog enable #channel` to add logs to that channel", 5000);
                m.deleteIn(5000);
                return;
            }
            if (args.toLowerCase().includes("updates")) {
                if (args.toLowerCase().includes("disable")) {
                    if (guildDb[guild.id].notifications.updates) {
                        delete guildDb[guild.id].notifications.updates;
                        m.reply("Update Messages disabled", 5000);
                        m.deleteIn(5000);
                        dbs.guild.save(guildDb);
                        return;
                    }

                    m.reply("Update messages are not currently enabled, I can't disable what isn't there.", 5000);
                    m.deleteIn(5000);
                    return;
                }
                if (args.toLowerCase().includes("enable")) {
                    if (!m.channelMentions[0]) {
                        m.reply("Please mention which channel you want the update messages to appear in");
                        return;
                    }
                    const channel = bot.getChannel(m.channelMentions[0]);
                    if (channel.permissionsOf(conf.users.bot).json.sendMessages !== true) {
                        m.reply("I need permission to send messages and read messages in that channel. Please modify my permissions and try again.");
                        return;
                    }
                    if (!guildDb[guild.id].notifications) {
                        guildDb[guild.id].notifications = {};
                    }
                    guildDb[guild.id].notifications.updates = channel.id;
                    dbs.guild.save(guildDb);
                    m.reply("Added update messages to channel: " + channel.mention, 5000);
                    m.deleteIn(5000);
                    return;
                }

                if (guildDb[guild.id].notifications.updates) {
                    m.reply(`The current update messages are set to go in:\n<#${guildDb[guild.id].notifications.updates}>`);
                    return;
                }

                m.reply("No update message channel has been set yet. Use `!edit notifications updates enable <@channel>` to add update messages to that channel", 5000);
                m.deleteIn(5000);
                return;
            }
            if (args.toLowerCase().includes("welcome")) {
                if (args.toLowerCase().includes("remove")) {
                    if (guildDb[guild.id].notifications.welcome) {
                        delete guildDb[guild.id].notifications.welcome;
                        m.reply("Welcome message removed", 5000);
                        m.deleteIn(5000);
                        dbs.guild.save(guildDb);
                        return;
                    }

                    m.reply("No welcome message was found, I can't remove what isn't there.", 5000);
                    m.deleteIn(5000);
                    return;
                }
                if (args.toLowerCase().includes("add")) {
                    if (!guildDb[guild.id].notifications) {
                        guildDb[guild.id].notifications = {};
                    }
                    if (!m.channelMentions[0]) {
                        m.reply("Please mention which channel you want the welcome message to appear in, then type the welcome message");
                        return;
                    }
                    const channelID = m.channelMentions[0];
                    const channel = m.channel.guild.channels.get(channelID);
                    if (channel.permissionsOf(conf.users.bot).json.sendMessages !== true) {
                        m.reply("I need permission to send messages and read messages in that channel. Please modify my permissions and try again.");
                        return;
                    }
                    let message = args.replace(/\bnotifications welcome add\b/ig, "").replace(`${channel.mention}`, "").trim();
                    if (message.startsWith(" ") || message.endsWith(" ")) {
                        message = message.trim();
                    }
                    if (message.length < 1) {
                        m.reply(`Please type a welcome message to be added to ${channel.mention} at the end of this command`, 10000);
                        m.deleteIn(10000);
                        return;
                    }
                    m.reply("Adding Welcome message: '" + message + "'\nto channel: " + channel.mention, 5000);
                    m.deleteIn(5000);
                    guildDb[guild.id].notifications.welcome = {};
                    guildDb[guild.id].notifications.welcome[channel.id] = message;
                    dbs.guild.save(guildDb);
                    return;
                }

                if (guildDb[guild.id].notifications.welcome) {
                    const msg = Object.values(guildDb[guild.id].notifications.welcome)[0];
                    m.reply("The current welcome message is set as:\n\n" + msg);
                    return;
                }

                m.reply("No welcome message has been set yet.", 5000);
                m.deleteIn(5000);
                return;
            }
            if (args.toLowerCase().includes("leave")) {
                if (args.toLowerCase().includes("remove")) {
                    if (guildDb[guild.id].notifications.welcome) {
                        delete guildDb[guild.id].notifications.leave;
                        m.reply("Leave message removed", 5000);
                        m.deleteIn(5000);
                        dbs.guild.save(guildDb);
                        return;
                    }
                    m.reply("No leave message was found, I can't remove what isn't there.", 5000);
                    m.deleteIn(5000);
                    return;
                }
                if (args.toLowerCase().includes("add")) {
                    if (!guildDb[guild.id].notifications) {
                        guildDb[guild.id].notifications = {};
                    }
                    if (!m.channelMentions[0]) {
                        m.reply("Please mention which channel you want the leave message to appear in, then type the welcome message");
                        return;
                    }
                    const channelID = m.channelMentions[0];
                    const channel = m.channel.guild.channels.get(channelID);
                    if (channel.permissionsOf(conf.users.bot).json.sendMessages !== true) {
                        m.reply("I need permission to send messages and read messages in that channel. Please modify my permissions and try again.");
                        return;
                    }
                    let message = args.replace(/\bnotifications leave add\b/ig, "").replace(`${channel.mention}`, "").trim();
                    if (message.startsWith(" ") || message.endsWith(" ")) {
                        message = message.trim();
                    }
                    if (message.length === 0) {
                        m.reply(`Please type a leave message to be added to ${channel.mention}`, 5000);
                        m.deleteIn(5000);
                    }
                    m.reply("Adding Leave message: '" + message + "'\nto channel: " + channel.mention, 5000);
                    m.deleteIn(5000);
                    guildDb[guild.id].notifications.leave = {};
                    guildDb[guild.id].notifications.leave[channel.id] = message;
                    dbs.guild.save(guildDb);
                    return;
                }

                if (guildDb[guild.id].notifications.leave) {
                    const msg = Object.values(guildDb[guild.id].notifications.welcome)[0];
                    m.reply("The current leave message is set as:\n\n" + msg);
                    return;
                }

                m.reply("No leave message has been set yet.", 5000);
                m.deleteIn(5000);
                return;
            }
        }
        if (args.toLowerCase().includes("prefix")) {
            let prefix = args.replace(/\bprefix\b/i, "");
            if (prefix.startsWith(" ")) {
                prefix = prefix.slice(1);
            }
            m.reply("Setting server prefix to: `" + prefix + "`", 5000);
            m.deleteIn(5000);
            guildDb[guild.id].prefix = prefix;
            dbs.guild.save(guildDb);
            return;
        }
        if (args.toLowerCase().match(/\bart\b/i)) {
            if (args.toLowerCase().includes("remove")) {
                if (guildDb[guild.id].art) {
                    delete guildDb[guild.id].art;
                    m.reply("Art channel removed", 5000);
                    m.deleteIn(5000);
                    dbs.guild.save(guildDb);
                    return;
                }

                m.reply("No art channel was found, I can't remove what isn't there.", 5000);
                m.deleteIn(5000);
                return;
            }
            if (args.toLowerCase().includes("add")) {
                const channelID = m.channelMentions[0] || m.content.replace("!edit ", "").replace("art", "").replace("add", "").replace("<#", "").replace(">", "").trim();
                const channel = bot.getChannel(channelID);
                console.log(channel);
                if (channel === undefined || !channel.id) {
                    m.reply("I couldn't find the channel you were looking to add, please make sure it is somewhere I can see, and try again.", 5000);
                    m.deleteIn(5000);
                    return;
                }
                if (channel.permissionsOf(conf.users.bot).json.sendMessages !== true) {
                    m.reply("I need permission to send messages and read messages in that channel. Please modify my permissions and try again.");
                    return;
                }
                m.reply("Setting art channel to: " + channel.mention, 5000);
                m.deleteIn(5000);
                guildDb[guild.id].art = channel.id;
                dbs.guild.save(guildDb);
                return;
            }

            if (guildDb[guild.id].art) {
                const channel = guildDb[guild.id].art;
                m.reply(`The current art channel is set to: <#${channel}>`, 5000);
                m.deleteIn(5000);
                return;
            }

            m.reply("No art channel has been set yet. You can set the art channel using the command: `!edit art add #channel`", 5000);
            m.deleteIn(5000);
            return;
        }
        /*
        // soon tm
        if (args.toLowerCase().includes("ignore ")) {
            if (!m.channelMentions[0]) {
              m.reply("Please mention a channel to be ignored");
              return;
            }
            var channel = m.channelMentions[0]
            m.reply("Ignoring channel: `" + channel.name + "`");
            _.save(data)
            return;
        }
        */
        if (args.toLowerCase().includes("roles")) {
            if (!guildDb[guild.id].roles) {
                guildDb[guild.id].roles = {};
            }
            if (args.toLowerCase().includes("add")) {
                if (args.replace(/roles /i, "").replace(/add/i, "").toLowerCase().startsWith(" ")) {
                    args = args.replace(/roles /i, "").replace(/add/i, "").toLowerCase().slice(1);
                }
                const serverRoleNames = m.guild.roles.map(getRoleName);
                const serverRoleName = args.toLowerCase().trim();
                console.log("selectedRole: " + serverRoleName);
                if (serverRoleNames.includes(serverRoleName)) {
                    var role = m.guild.roles.filter(r => r.name.toLowerCase().trim() === serverRoleName);
                    console.log("length: " + role.length);
                    console.log("reults:");
                    console.log(role);
                    if (checkHasDuplicates(serverRoleName, serverRoleNames) || role.length > 1) {
                        m.reply("There is more than one role with that name. I am not sure which you want me to add", 5000);
                        m.deleteIn(5000);
                        return;
                    }
                    role = role[0];
                    if (!role.id) {
                        m.reply("I couldn't find the role you were looking for", 5000);
                        m.deleteIn(5000);
                        return;
                    }
                    const perms = m.channel.guild.members.get(conf.users.bot).permission.json;
                    if (!perms.manageRoles) {
                        m.reply("I need permissions to be able to add roles, please add the 'Manage Roles' permission to me");
                        return;
                    }
                    if (guildDb[guild.id].roles[serverRoleName]) {
                        m.reply("That role is already assignable", 5000);
                        m.deleteIn(5000);
                        return;
                    }
                    guildDb[guild.id].roles[serverRoleName] = role.id;
                    dbs.guild.save(guildDb);
                    m.reply(serverRoleName + " is now an assignable role", 5000);
                    m.deleteIn(5000);
                }
                else {
                    m.reply(args + " is not a role that has been made in this server", 5000);
                    m.deleteIn(5000);
                }
                return;
            }
            if (args.toLowerCase().includes("remove")) {
                args = args.replace(/roles /i, "").replace(/remove/i, "").toLowerCase();
                if (args.startsWith(" ")) {
                    args = args.slice(1);
                }
                const selectedRole = args.toLowerCase();
                if (!guildDb[guild.id].roles[selectedRole]) {
                    m.reply("That role has not been added yet", 5000);
                    m.deleteIn(5000);
                    return;
                }
                if (checkHasDuplicates(selectedRole, m.channel.guild.roles)) {
                    m.reply("There is more than one role with that name. I am not sure which you want me to remove", 5000);
                    m.deleteIn(5000);
                    return;
                }
                delete guildDb[guild.id].roles[selectedRole];
                dbs.guild.save(guildDb);
                m.reply(selectedRole + " is no longer assignable", 5000);
                m.deleteIn(5000);
                return;
            }
            if (args.toLowerCase().includes("create")) {
                const perms = m.channel.guild.members.get(conf.users.bot).permission.json;
                if (!perms.manageRoles) {
                    m.reply("I need permissions to be able to create roles, please add the 'Manage Roles' permission to me");
                    return;
                }
                args = args.replace(/roles /i, "").replace(/create/i, "").toLowerCase();
                if (args.startsWith(" ")) {
                    args = args.slice(1);
                }
                const selectedRole = args;
                const length = m.channel.guild.roles.filter(r => r.name.toLowerCase() === selectedRole.toLowerCase()).length;
                if (length > 0) {
                    m.reply("There is already a role with that name. Please either choose a different name, or add that role manually", 5000);
                    m.deleteIn(5000);
                    return;
                }
                if (guildDb[guild.id]) {
                    if (guildDb[guild.id].roles) {
                        if (guildDb[guild.id].roles[selectedRole] && selectedRole !== undefined) {
                            m.reply("That role is already created, and assignable", 5000);
                            m.deleteIn(5000);
                            return;
                        }
                    }
                }
                bot.createRole(m.channel.guild.id, {
                    name: `${selectedRole}`,
                    permissions: 104188992,
                    reason: `Role created by ${m.author.username}`
                }).then(role => {
                    guildDb[guild.id].roles[selectedRole] = role.id;
                    dbs.guild.save(guildDb);
                    m.reply(`The role \`${role.name}\` has been created successfully, and is now assignable`, 5000);
                    m.deleteIn(5000);
                });
                return;
            }
            if (args.toLowerCase().includes("delete")) {
                const perms = m.channel.guild.members.get(conf.users.bot).permission.json;
                if (!perms.manageRoles) {
                    m.reply("I need permissions to be able to delete roles, please add the 'Manage Roles' permission to me", 5000);
                    m.deleteIn(5000);
                    return;
                }
                args = args.replace(/roles /i, "").replace(/delete/i, "").toLowerCase();
                if (args.startsWith(" ")) {
                    args = args.slice(1);
                }
                const serverRoleNames = m.guild.roles.map(getRoleName);
                const serverRoleName = args.toLowerCase().trim();
                if (checkHasDuplicates(serverRoleName, m.channel.guild.roles)) {
                    m.reply("There is more than one role with that name. Please either choose a different name, or delete that role manually", 5000);
                    m.deleteIn(5000);
                    return;
                }
                if (serverRoleNames.includes(serverRoleName)) {
                    const role = m.guild.roles.find(r => r.name.toLowerCase().trim() === serverRoleName);
                    if (!role.id) {
                        m.reply("I couldn't find the role you were looking for", 5000);
                        m.deleteIn(5000);
                        return;
                    }

                    const perms = m.channel.guild.members.get(conf.users.bot).permission.json;
                    if (!perms.manageRoles) {
                        m.reply("I need permissions to be able to add roles, please add the 'Manage Roles' permission to me");
                        return;
                    }
                    if (guildDb[guild.id].roles[serverRoleName]) {
                        delete guildDb[guild.id].roles[serverRoleName];
                        dbs.guild.save(guildDb);
                    }
                    bot.deleteRole(m.channel.guild.id, role.id, `Role deleted by ${m.channel.guild.members.get(m.author.id).name}`).then(() => {
                        m.reply(`The role \`${serverRoleName}\` has been deleted successfully`, 5000);
                        m.deleteIn(5000);
                    });
                }
                else {
                    m.reply(args + " is not a role that has been made in this server", 5000);
                    m.deleteIn(5000);
                }
                return;
            }
            if (args.toLowerCase().includes("update")) {
                var roles = Object.keys(guildDb[m.channel.guild.id].roles);
                for (let role of roles) {
                    const exists = m.channel.guild.roles.find((r) => {
                        if (r.id == guildDb[m.channel.guild.id].roles[role]) {
                            return true;
                        }
                    });
                    if (!exists) {
                        delete guildDb[guild.id].roles[role];
                        dbs.guild.save(guildDb);
                        m.reply(role + " updated successfully", 1000);
                        m.deleteIn(1000);
                    }
                    else {
                        m.reply(role + " is valid, no change needed", 1000);
                        m.deleteIn(1000);
                    }
                }
                return;
            }
            m.reply("You can edit the roles, and do things like adding and removing roles that Mei can give to people, and creating and deleting roles.\n"
                + " Simply say things like `!edit roles create tiny` to *create* a role called \"tiny\" or `!edit roles add giantess` to let users get the \"giantess\" role from Mei when they use the `!roles` command", 15000);
            m.deleteIn(15000);
            return;
        }
        if (args.toLowerCase().includes("mod")) {
            if (args.toLowerCase().includes("add")) {
                if (m.roleMentions[0]) {
                    if (!guildDb[guild.id].modRoles) {
                        guildDb[guild.id].modRoles = {};
                    }
                    guildDb[guild.id].modRoles[m.roleMentions[0]] = true;
                    dbs.guild.save(guildDb);
                    m.reply("That role is now a registered moderator role", 5000);
                    m.deleteIn(5000);
                    return;
                }
                if (m.mentions[0]) {
                    if (!guildDb[guild.id].mods) {
                        guildDb[guild.id].mods = {};
                    }
                    guildDb[guild.id].mods[m.mentions[0].id] = true;
                    dbs.guild.save(guildDb);
                    m.reply(m.mentions[0].username + " is now a registered moderator", 5000);
                    m.deleteIn(5000);
                    return;
                }
            }
            if (args.toLowerCase().includes("remove")) {
                if (m.roleMentions[0]) {
                    if (!guildDb[guild.id].modRoles) {
                        guildDb[guild.id].modRoles = {};
                    }
                    if (guildDb[guild.id].modRoles[m.roleMentions[0]]) {
                        delete guildDb[guild.id].modRoles[m.roleMentions[0]];
                        dbs.guild.save(guildDb);
                        m.reply("That role is no longer a registered moderator role", 5000);
                        m.deleteIn(5000);
                    }
                    else {
                        m.reply("That role is not currently a registered moderator role, and can't be removed");
                        return;
                    }
                    return;
                }
                if (m.mentions[0]) {
                    if (!guildDb[guild.id].mods) {
                        guildDb[guild.id].mods = {};
                    }
                    if (guildDb[guild.id].mods[m.mentions[0].id]) {
                        delete guildDb[guild.id].mods[m.mentions[0].id];
                        dbs.guild.save(guildDb);
                        m.reply(m.mentions[0].username + " is no longer a registered moderator", 5000);
                        m.deleteIn(5000);
                        return;
                    }

                    m.reply("That currently is not currently a registered moderator, and can't be removed");
                }
            }
        }
        else {
            m.reply("These are the settings you can **edit** (Bold represents the default setting):\n\n\n"
                + "`hoards`: **disable** | enable, Turn custom hoard reactions on or off in this server, defaults to off (heart eye emoji only)\n\n"
                + "`prefix`: <prefix>, Change the prefix Mei sues in this server, Default prefix is **`!`**\n\n"
                + "`mod`: add | remove, <@person> | <@role>. Add a moderator, or a role for moderators to use Mei's admin features, and edit settings\n\n"
                + "`roles`: add <role> | remove <role> | create <role> | delete <role>, Add or remove the roles Mei can give to users, or create and delete roles in the server. (Roles created by Mei will have no power and no color, and will be at the bottom of the role list)\n\n"
                + "`notifications`: banlog | updates | welcome, enable <@channel> | disable, Allows you to enable, disable, or change channels that certain notifications appear in. Currently supports a log channel for all bans, a log of all users joining and leaving, and editing the welcome message that Mei gives when users join, and what channel each appears in.\n\n"
                + "`art`: remove | add <#channel>, Adds a channel for Mei to use in the `!art` command");
        }
    },
    help: "Modify Server Settings (Admin only)"
};
