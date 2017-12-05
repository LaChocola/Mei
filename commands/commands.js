const fs = require("fs");

module.exports = {
	main: function(Bot, m, args) {
		function format(file, help) {
			var line = "`!"+file.replace(".js", "")+"` "+help+".";
			return line;
		}
		var files = fs.readdirSync("./commands/");
		var lines = [];
		files.forEach(function(file) {
			if (lines.length < 1800) {
			var cmd = require("./"+file)
			lines.push(format(file, cmd.help));
		}
		});
		var message = lines.join("\n");
			Bot.createMessage(m.channel.id, { content: `Here are the **commands** you can use`,
				embed: {
						color: 0x5A459C,
						description: message
				}
		});
	},
	help: "List of commands"
}
