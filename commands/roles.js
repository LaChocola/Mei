"use strict";

const utils = require("../utils");

module.exports = {
    main: function(bot, m, args, prefix) {
        var guild = m.channel.guild;
        var name1 = m.cleanContent.replace(`${prefix}roles `, "");
        if (m.content.length < 7) {
            name1 = m.author.username;
        }

        var member = m.guild.members.find(m => utils.isSameMember(m, name1));
        var mentioned;
        if (m.mentions.length === 0) {
            mentioned = member || guild.members.get(m.author.id);
        }
        if (m.mentions.length > 0) {
            mentioned = guild.members.get(m.mentions[0].id);
        }
        var arrayOfRoleIDs = mentioned.roles;
        var getRoleNameFromRoleID = function(roleID) {
            return guild.roles.get(roleID).name;
        };
        var arrayOfRoleNames = arrayOfRoleIDs.map(getRoleNameFromRoleID);
        var msg = JSON.stringify(mentioned.permission.json).replace("{", "").replace("}", "");
        if (arrayOfRoleNames.length === 0) {
            m.reply("You do not currently have any assigned roles in this server.");
            return;
        }
        m.reply("Roles for: **" + mentioned.username + "#" + mentioned.discriminator + "**\n \n*" + arrayOfRoleNames.join("*, *") + "*\n \nPermissions: ```js\n" + msg + "```");
    },
    help: "Role info. Use !role to assign roles"
};
