"use strict";

const reload = require("require-reload")(require);
const ordinal = require("ordinal");

const misc = reload("../misc");
const use = require("../data");

var stats = use.load();

var time = new Date().toISOString();

module.exports = {
	main: function (Bot, m, args, prefix) {
		var args = args.toLowerCase();

		if (m.channel.guild.id == "187694240585744384") {
			prefix = "?"
		}
		if (m.channel.nsfw == false) {
			Bot.createMessage(m.channel.id, "This command can only be used in NSFW channels");
			return;
		}
		var mentioned = m.mentions[0] || m.author
		var id = mentioned.id
		var name1 = args
		var isThisUsernameThatUsername = function (member) {
			var memberName = member.nick || member.username
			if (memberName.toLowerCase() == name1.toLowerCase()) {
				return true;
			}
		}
		var member = m.guild.members.find(isThisUsernameThatUsername)
		var mentioned = m.mentions[0] || member || m.author
		var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username
		var commands = stats.commands["tf"].users
		var usage = 0
		if (commands[mentioned.id]) {
			usage = commands[mentioned.id]
		}
		if (args.indexOf("length") >= 0) {
			var names = misc.getCustomGTSNames(id)
			var resultstring = "";
			var cleanishNames = names.join(", ")
			for (var i = 0; i < names.length; i++) {
				if (i % 5 === 0) {
					cleanishNames.replace(names[i], `${names[i]}\n`)
				}
			}
			var cleanNames = cleanishNames
			resultstring += "**Names avaible: **" + names.length + "\n " + cleanishNames + "\n \n" + misc.getLewdCounts("tf");
			if (names.length < 1) {
				names = misc.getDefaultGTSNames(m.channel.guild.id)
				var resultstring = "";
				resultstring += "**Names avaible: **" + names.totalnames + "\n " + names.cleannames + "\n \n" + misc.getLewdCounts("tf");
			}

			Bot.createMessage(m.channel.id, {
				embed: {
					"color": 0xA260F6,
					"description": resultstring.replace(/tfs/ig, "TF's")
				}
			});
			return;
		}

		if (args.indexOf("someone") >= 0) {
			id = misc.getSomeone(m);
		}
		var smallid = id;
		var big = false;

		var names = misc.getDefaultGTSNames(m.channel.guild.id).names;
		var cname = misc.getCustomGTSNames(smallid);
		names = names.concat(cname);
		for (var i = 0; i < names.length; i++) {
			if (args.includes(names[i].toLowerCase())) {
				big = names[i];
			}
		}

		var maintype = "tf";
		var subtype = misc.searchForLewd(args);

		if (args.indexOf("invert") >= 0 || args.indexOf("inverse") >= 0) {
			big = misc.getTrueName(m.author.id, m);
		}
		var guildid = m.channel.guild.id;

		var lewdmessage = misc.generateLewdMessage(smallid, big, guildid, maintype, subtype)
		if (usage !== 0) {
			usage = ordinal(+usage)
		}
		var data = {
			embed: {
				color: 0x00FF8F,
				title: `${lewdmessage[1]} ${lewdmessage[2]}`,
				description: lewdmessage[0],
				timestamp: time,
				footer: {
					text: `${usage} response`,
					icon_url: mentioned.avatarURL
				}
			}
		}
		Bot.createMessage(m.channel.id, data);
		return;
	},
	help: "A TF responses"
};
