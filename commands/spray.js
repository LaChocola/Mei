module.exports = {
	main: function(Bot, m, args) {
		if (m.content == "!spray") {
			Bot.createMessage(m.channel.id, "Please add someone to spray. i.e. ``!spray @Chocola``")
		}
		else {
			var message1 = [", and only made them wetter.", ", causing them to melt.", ", and only managed to iritate them.", ", it wasnt very effective.", ", I dont know why tho."]
			var message = message1[Math.floor(Math.random() * message1.length)]
			if (m.author.id == m.mentions[0].id) {
				var message2 = [", thats kinda weird.", ", maybe thats a fetish thing?", ", what a weirdo.", ", I guess everyone likes something.", ", I dont know why tho."]
				var messagefinal = message2[Math.floor(Math.random() * message1.length)]
				Bot.createMessage(m.channel.id, ":sweat_drops: " + m.author.username + " sprayed " + m.mentions[0].username + messagefinal);
			} else {
				Bot.createMessage(m.channel.id, ":sweat_drops: " + m.author.username + " sprayed " + m.mentions[0].username + message);
			}
		}
	},
	help: "Makes me spray people"
}
