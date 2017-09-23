const aesthetics = require('aesthetics');

module.exports = {

	main: function(Bot, m, args) {
		var msg = m.cleanContent.replace("!aesthetics ", "");
		var text = aesthetics(msg);
		var embed = "**" + text + "**"
	Bot.createMessage(m.channel.id, {
        embed: {
            color: 0xA260F6,
            description: embed
        }
    });
	},
	help: "Vaporwave Text"
}
