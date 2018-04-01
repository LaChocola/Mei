'use strict';
const _ = require("../people.js");
var reload = require("require-reload")(require);
var miscl = reload('../misc.js');
var data = _.load();

module.exports = {
	main: function(Bot, m, args, prefix) {
		var args = args.toLowerCase()

		if (m.channel.guild.id == "187694240585744384") {
			prefix = "?"
		}
		if(args.indexOf("length") >= 0){
			var names = miscl.getDefaultGTSNames(m.channel.guild.id);
			var resultstring = "";
			resultstring+= "**Names avaible: **"+names.totalnames+"\n "+names.cleannames+"\n \n"+miscl.getLewdCounts("tf");
      Bot.createMessage(m.channel.id, {
				embed: {
						"color": 0xA260F6,
						"description": resultstring.replace(/tfs/ig,"TF's")
				}
			});
			return;
		}

		var mentioned = m.mentions[0] || m.author
		var id = mentioned.id
		if(args.indexOf("someone") >= 0) {
			id = miscl.getSomeone(m);
		}
		var smallid = id;
		var big = false;

		var names = miscl.getDefaultGTSNames(m.channel.guild.id).names;
		var cname = miscl.getcustomGTSNames(smallid);
		names = names.concat(cname);
		for(var i = 0;i<names.length;i++) {
			if(args.includes(names[i].toLowerCase()))
			big = names[i];
		}

		var maintype = "tf";
		var subtype = miscl.searchForLewd(args);

		if(args.indexOf("invert") >= 0 || args.indexOf("inverse") >=0){
			big = miscl.getTrueName(m.author.id,m);
		}
		var guildid = m.channel.guild.id;

		var lewdmessage = miscl.generateLewdMessage(smallid,big,guildid,maintype,subtype)
		Bot.createMessage(m.channel.id,lewdmessage);
		return;
	},
	help: "A TF responses"
}
