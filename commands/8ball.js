const eightball = require('8ball')()

module.exports = {
	main: function(Bot, m, args) {
		var msg = m.cleanContent.replace("!8ball ", "");
		if (m.content == "!8ball") {
			Bot.createMessage(m.channel.id, "Please add something")
		}
		else {
		Bot.createMessage(m.channel.id, `***` + msg + `***\n:8ball: ${eightball}`);
	}
	},
	help: "8ball"
}
