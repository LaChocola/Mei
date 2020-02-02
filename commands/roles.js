"use strict";

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        var guild = m.channel.guild;
        var name1 = m.cleanContent.replace(`${prefix}roles `, "");
        if (m.content.length < 7) {
            name1 = m.author.username;
        }
        function isThisUsernameThatUsername(member) {
            var memberName = member.nick || member.username;
            if (memberName.toLowerCase() === name1.toLowerCase()) {
                return true;
            }
        }

        var mentioned;
        if (m.mentions.length === 0) {
            var member = m.guild.members.find(isThisUsernameThatUsername);
            mentioned = member || guild.members.get(m.author.id);
        }
        if (m.mentions.length > 0) {
            mentioned = guild.members.get(m.mentions[0].id);
        }
        var arrayOfRoleIDs = mentioned.roles;
        function getRoleNameFromRoleID(roleID) {
            return guild.roles.get(roleID).name;
        }
        var arrayOfRoleNames = arrayOfRoleIDs.map(getRoleNameFromRoleID);
        var msg = JSON.stringify(mentioned.permission.json).replace("{", "").replace("}", "");
        if (arrayOfRoleNames.length === 0) {
            Bot.createMessage(m.channel.id, "You do not currently have any assigned roles in this server.");
            return;
        }
        Bot.createMessage(m.channel.id, "Roles for: **" + mentioned.username + "#" + mentioned.discriminator + "**\n \n*" + arrayOfRoleNames.join("*, *") + "*\n \nPermissions: ```js\n" + msg + "```");
    },
    help: "Role info. Use [prefix]role to assign roles"
};
