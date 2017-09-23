module.exports = {
	main: function(Bot, m, args) {
  var guild = m.channel.guild
	if (m.content == "!role" || m.content == "!role ") {
		Bot.createMessage(m.channel.id, "What do you want to do? | `!role add <role name>` | `!role remove <role name>`");
		return;
	}
	var roles = m.cleanContent.replace("!role ", "").split(", ")

	var member = m.guild.members.get(m.author.id)
	if (m.mentions.length > 0 && m.mentions[0].id != m.author.id) {
		Bot.createMessage(m.channel.id, "You can only assign roles to yourself");
		return;
	}

  var arrayOfRoleIDs = mentioned.roles;
  var getRoleObjectFromRoleID = function(roleID) { return guild.roles.get(roleID); }
  var arrayOfRoleObjects = arrayOfRoleIDs.map(getRoleObjectFromRoleID);
	var getRoleNameFromRoleID = function(roleID) { return guild.roles.get(roleID).name; }
  var arrayOfRoleNames = arrayOfRoleIDs.map(getRoleNameFromRoleID);

	for (let role of arrayOfRoleObjects) {
		console.log("\n" + role.name + " (" + role.id + ")");
	}

	var msg = JSON.stringify(mentioned.permission.json).replace("{", "").replace("}", "")
	Bot.createMessage(m.channel.id, "Roles for: **" + mentioned.username + "#" + mentioned.discriminator + "**\n \n*" + arrayOfRoleNames.join("*, *") + "*\n \nPermissions: ```js\n" + msg + "```")
	},
	help: "WIP"
}
