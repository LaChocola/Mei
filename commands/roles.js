module.exports = {
    main: function(Bot, m, args, prefix) {
        var guild = m.channel.guild;
        var name1 = m.cleanContent.replace(`${prefix}roles `, '');
        if (m.content.length < 7) {
            name1 = m.author.username;
        }
        var isThisUsernameThatUsername = function(member) {
            var memberName = member.nick || member.username;
            if (memberName.toLowerCase() === name1.toLowerCase()) {
                return true;
            }
        };

        var member = m.guild.members.find(isThisUsernameThatUsername);
        if (m.mentions.length === 0) {
            var mentioned = member || guild.members.get(m.author.id);
        }
        if (m.mentions.length > 0) {
            var mentioned = guild.members.get(m.mentions[0].id);
        }
        var arrayOfRoleIDs = mentioned.roles;
        var getRoleNameFromRoleID = function(roleID) {
            return guild.roles.get(roleID).name;
        };
        var arrayOfRoleNames = arrayOfRoleIDs.map(getRoleNameFromRoleID);
        var msg = JSON.stringify(mentioned.permission.json).replace('{', '').replace('}', '');
        if (arrayOfRoleNames.length === 0) {
            Bot.createMessage(m.channel.id, 'You do not currently have any assigned roles in this server.');
            return;
        }
        Bot.createMessage(m.channel.id, 'Roles for: **' + mentioned.username + '#' + mentioned.discriminator + '**\n \n*' + arrayOfRoleNames.join('*, *') + '*\n \nPermissions: ```js\n' + msg + '```');
    },
    help: 'Role info. Use !role to assign roles'
};
