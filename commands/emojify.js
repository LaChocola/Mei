module.exports = {
	main: function(Bot, m, args) {
		args = args.replace(/(\w|\d|\*|\?|!| )/g, "$1");
		args = args.toLowerCase();
		args = args.split("");
		var emojis = [];
		var numbers = {
			"1": "one",
			"2": "two",
			"3": "three",
			"4": "four",
			"5": "five",
			"6": "six",
			"7": "seven",
			"8": "eight",
			"9": "nine",
			"0": "zero"
		}
		args.forEach(char=> {
			if ("qwertyuiopasdfghjklzxcvbnm".indexOf(char) > -1) {
				emojis.push(":regional_indicator_"+char+":");
			} else if ("1234567890".indexOf(char) > -1) {
				emojis.push(":"+numbers[char]+":");
			} else if (char == "?") {
				emojis.push(":question:");
			} else if (char == "!") {
				emojis.push(":exclamation:");
			} else if (char == "*") {
				emojis.push(":asterisk:");
			} else {
				emojis.push("  ");
			}
		});
		emojis = emojis.join("");
		emojis = emojis.replace(/:regional_indicator_u::regional_indicator_p::exclamation:/g, ":up:")
		emojis = emojis.replace(/:regional_indicator_n::regional_indicator_e::regional_indicator_w:/g, ":new:")
		emojis = emojis.replace(/:regional_indicator_f::regional_indicator_r::regional_indicator_e::regional_indicator_e:/g, ":free:")
		emojis = emojis.replace(/:regional_indicator_c::regional_indicator_o::regional_indicator_o::regional_indicator_l:/g, ":cool:")
		emojis = emojis.replace(/:regional_indicator_t::regional_indicator_i::regional_indicator_m::regional_indicator_e:/g, ":clock10:")
		emojis = emojis.replace(/:regional_indicator_f::regional_indicator_i::regional_indicator_r::regional_indicator_e:/g, ":fire:")
		emojis = emojis.replace(/:exclamation::exclamation:/g, ":bangbang:")
		emojis = emojis.replace(/:exclamation::question:/g, ":interrobang:")
		Bot.createMessage(m.channel.id, emojis);
	},
	help: "Emoji Letters"
}
