'use strict';
const _ = require("../people.js");
var reload = require("require-reload")(require);
var miscl = reload('../misc.js');
var data = _.load();

module.exports = {
	main: function(Bot, m, args, prefix) {
		var args = args.toLowerCase()
		var mentioned = m.mentions[0] || m.author
		var id = mentioned.id
		if (m.channel.guild.id == "187694240585744384") {
			prefix = "?"
		}
		if (m.channel.nsfw == false) {
				Bot.createMessage(m.channel.id, "This command can only be used in NSFW channels");
				return;
		}
		if (args.indexOf("length") >= 0){
			var names = miscl.getcustomGTSNames(id)
			var resultstring = "";
			var cleanishNames = names.join(", ")
			for (var i=0; i < names.length; i++) {
			    if (i%5 === 0) {
						cleanishNames.replace(names[i], `${names[i]}\n`)
					}
			}
			var cleanNames = cleanishNames
			resultstring+= "**Names avaible: **"+names.length+"\n "+cleanishNames+"\n \n"+miscl.getLewdCounts("violent");
			if (names.length < 1) {
				names = miscl.getDefaultGTSNames(m.channel.guild.id)
				var resultstring = "";
				resultstring+= "**Names avaible: **"+names.totalnames+"\n "+names.cleannames+"\n \n"+miscl.getLewdCounts("violent");
			}
			Bot.createMessage(m.channel.id, {
				embed: {
						"color": 0xA260F6,
						"description": resultstring.replace(/Violents/g,"Smushes")
				}
			});
			return;
		}

		if(args.indexOf("someone") >= 0)
		{
			id = miscl.getSomeone(m);
		}
		var smallid = id;
		var big = false;


		var names = miscl.getDefaultGTSNames(m.channel.guild.id).names;
		var cname = miscl.getcustomGTSNames(smallid);
		names = names.concat(cname);
		for(var i = 0;i<names.length;i++){
			if(args.includes(names[i].toLowerCase()))
			big = names[i];
		}



		var maintype = "violent";
		var subtype = miscl.searchForLewd(args);
		if(args.indexOf("invert") >= 0 || args.indexOf("inverse") >=0){
			big = miscl.getTrueName(m.author.id,m);
		}
		var guildid = m.channel.guild.id;



		var lewdmessage = miscl.generateLewdMessage(smallid,big,guildid,maintype,subtype)

		Bot.createMessage(m.channel.id,lewdmessage);
		return;
	},
	help: "A Violent Smush"
}
