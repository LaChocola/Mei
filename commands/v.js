'use strict';
const _ = require("../people.js");
const miscl = require('./../misc');
var data = _.load();
module.exports = {
	main: function(Bot, m, args, prefix) {
		var args = args.toLowerCase()
		var mentioned = m.mentions[0] || m.author
		var id = mentioned.id
		if(args.indexOf("someone") >= 0)
		{
			id = miscl.getSomeone(m);
		}
		var smallid = id;
		var big = false;
		var maintype = "violent";
		var subtype = miscl.searchForLewd(args);
		if(args.indexOf("invert") >= 0){
			big = miscl.getTrueName(m.author.id,m);
		}
		var guildid = m.channel.guild.id;

		var lewdmessage = miscl.generateLewdMessage(smallid,big,guildid,maintype,subtype)

		Bot.createMessage(m.channel.id,lewdmessage);
		return;
	},
	help: "A Violent Smush"
}
