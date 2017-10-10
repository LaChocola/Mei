module.exports = {
	main: function(Bot, m, args) {
	var args = args.split(" ")
	var responses = ["Are you a real villan?", "Have you ever caught a good guy? \nLike a real super hero?", "Have you ever tried a disguise?", "What are you doing?!?!?!", "*NO!*, Don't touch that!", "Fuck Off", "Roses are red\nfuck me ;) "]
	var response = responses[Math.floor(Math.random() * responses.length)]
	var authorRoles = m.channel.guild.members.get(m.author.id).roles
	if (authorRoles.indexOf("356134081093828608") == -1 && m.author.id != "161027274764713984") {
    Bot.createMessage(m.channel.id, response);
		return;
  }
  var hands = [ ":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"]
  var hand = hands[Math.floor(Math.random() * hands.length)]
  var isThisUsernameThatUsername = function(member) {
      var memberName = member.nick || member.username
      if (memberName.toLowerCase() == name.toLowerCase()) {
        return true;
        }
      }
			function isNumeric(num){
	        return !isNaN(num)
	    }
  var mentioned = m.mentions[0] || member
  if (mentioned) {
	var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username
  var member = m.guild.members.find(isThisUsernameThatUsername)
	}
  var guardian = m.channel.guild.members.get(m.author.id).nick || m.author.username

	if (args.indexOf("undo") > -1) {
		args.splice(args.indexOf("undo"), 1)
		var arg = args[0]
				Bot.unbanGuildMember(m.channel.guild.id, arg, "Unbanned by: " + guardian).then(() => {
				    return Bot.createMessage(m.channel.id, hand + " Successful Unbanned");
				})
  	}
		else if (m.mentions || name != guardian) {
		Bot.banGuildMember(m.channel.guild.id, mentioned.id, 0, "Banned by: " + guardian).then(() => {
				return Bot.createMessage(m.channel.id, hand + " Successful banned: " + name + " (" + mentioned.id + ")");
		})
		return;
	}
		else {
			Bot.createMessage(m.channel.id, "I tried...");
		}
	},
	help: "Get Role Info"
}
