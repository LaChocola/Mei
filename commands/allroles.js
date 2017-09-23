module.exports = {
	main: function(Bot, m, args) {
  var guild = m.channel.guild
  var roleSearch = function(role) {
    var roleName = role.name
    if (roleName != "undefined") {
      return roleName;
      }
    }


  var roles = m.guild.roles.map(roleSearch)

  Bot.createMessage(m.channel.id, "**" + roles.join("** | **") + "**");
	},
	help: "Get Role Info"
}
