const fs = require('fs');

module.exports = {
	main(Bot, m, args, prefix) {
		function format(file, help) {
			const line = '`' + prefix + file.replace('.js', '') + '` ' + help + '.';
			return line;
		}
		const files = fs.readdirSync('./commands/');
		const lines = [];
		files.forEach(file => {
			if (lines.length < 1800) {
				const cmd = require('./' + file);
				if (!cmd.hidden) {
					lines.push(format(file, cmd.help));
				}
			}
		});
		const message = lines.join('\n');
		Bot.createMessage(m.channel.id, {
			content: 'Here are the **commands** you can use',
			embed: {
				color: 0x5A459C,
				description: message
			}
		});
	},
	help: 'List of commands'
};
