module.exports = {
    main: function(Bot, m, args, prefix) {
        var guild = m.channel.guild
        var name1 = m.cleanContent.replace(`${prefix}roles `, "")
        if (m.content.length < 7) {
            name1 = m.author.username
        }
        var isThisUsernameThatUsername = function(member) {
            var memberName = member.nick || member.username
            if (memberName.toLowerCase() == name1.toLowerCase()) {
                return true;
            }
        }

        var member = m.guild.members.find(isThisUsernameThatUsername)
        if (m.mentions.length < 1) {
            var mentioned = member || guild.members.get(m.author.id)
        }
        if (m.mentions.length > 0) {
            var mentioned = guild.members.get(m.mentions[0].id)
        }
        var arrayOfRoleIDs = mentioned.roles;
        var getRoleObjectFromRoleID = function(roleID) {
            return guild.roles.get(roleID);
        }
        var arrayOfRoleObjects = arrayOfRoleIDs.map(getRoleObjectFromRoleID);
        var getRoleNameFromRoleID = function(roleID) {
            return guild.roles.get(roleID).name;
        }
        var arrayOfRoleNames = arrayOfRoleIDs.map(getRoleNameFromRoleID);
        console.log(arrayOfRoleObjects);
        for (let role of arrayOfRoleObjects) {
            console.log("\n" + role.name + " (" + role.id + ")");
        }

        var msg = JSON.stringify(mentioned.permission.json).replace("{", "").replace("}", "")
        Bot.createMessage(m.channel.id, "Roles for: **" + mentioned.username + "#" + mentioned.discriminator + "**\n \n*" + arrayOfRoleNames.join("*, *") + "*\n \nPermissions: ```js\n" + msg + "```")
    },
    help: "Shows role info on mentioned person"
}
