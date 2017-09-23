'use strict';
process.on('unhandledRejection', (err, promise) => {
  console.error(err ? err.stack : promise);
});
var bot = require("eris");
Object.defineProperty(bot.Message.prototype, "guild", {
    get: function guild() {
        return this.channel.guild;
    }
});
var fs = require("fs");
var config = require("./etc/config.json");
var Bot = bot(config.tokens.mei);
var reload = require("require-reload")(require);
var events = fs.readdirSync("./events/");
var colors = require("colors");
var aesthetics = require('aesthetics');
const _ = require("./data.js");
var prefix = config.prefix

Bot.on("messageCreate", (m)=>{
	if (m.channel.isPrivate) return;
  if (!m.guild) {
    Bot.getDMChannel(m.author.id).then(function(DMchannel) {
			Bot.createMessage(DMchannel.id, "Cease, you heathen!");
      console.log(m.author.nick || m.author.username + " was a bad kid, and tried to dm me")
    });
    return;
  }
  if (m.channel.guild.id == '196027622944145408' && m.content.startsWith("!play")) {
    return;
  }
	var loguser = `${m.author.username}#${m.author.discriminator}`.magenta.bold;
	var logserver = `${m.channel.guild.name}`.cyan.bold || "Direct Message".cyan.bold
	var logchannel = `#${m.channel.name}`.green.bold;
	var logdivs = [" > ".blue.bold, " - ".blue.bold];

	var commands = fs.readdirSync("./commands/");
	if (m.content.startsWith(prefix)) {
		var command = m.content.split(" ")[0].replace(prefix, "").toLowerCase();
		if (commands.indexOf(command+".js") > -1) {
  		var data = _.load(); // Track command usage in ../db/data.json
      data.commands.totalRuns++
  		if (!(data.commands[command])) {
  			data.commands[command]= {};
        data.commands[command].totalUses = 0
        data.commands[command].users = {}
  		}
      if (!(data.commands[command].users[m.author.id])) {
  			data.commands[command].users[m.author.id] = 0
  		}
      data.commands[command].users[m.author.id]++
      data.commands[command].totalUses++
      _.save(data);
			var cmd = reload("./commands/"+command+".js");
			var args = m.content.split(" ");
			args.splice(0, 1);
			args = args.join(" ");
			var logcmd = `${prefix}${command}`.bold;
			var logargs = `${args}`.bold;
			try {
				cmd.main(Bot, m, args);
				console.log("CMD".black.bgGreen+" "+loguser+logdivs[1]+logserver+logdivs[0]+logchannel+" "+logcmd.blue);
				if (args) console.log("ARG".black.bgCyan+" "+logargs.blue.bold);
				console.log('');
			} catch (err) {
				console.log(err);
				Bot.createMessage(m.channel.id, "An error has occured.");
				console.log("CMD".black.bgRed+" "+loguser+logdivs[1]+logserver+logdivs[0]+logchannel+" "+logcmd.red);
				if (args) console.log("ARG".black.bgCyan+" "+logargs.red.bold);
				console.log('');
			}
		}
	}

	  var ignoredChannels = ['220059213441794050', '220079557644910592', '267443100119597058', '306680956566110208', '285366295040622593', '249099205342134273']
		var roll = Math.floor(Math.random() * 20) + 1
		var words = m.content.split("\s+")

		for (let word of words) {

		if (roll > 0 && roll < 15) {

		if (ignoredChannels.indexOf(m.channel.id) == -1 && word.toLowerCase() == "ochiko" || word.toLowerCase() == "poo" || word.toLowerCase() == "poop" || word.toLowerCase() == "shit") {
			Bot.addMessageReaction(m.channel.id, m.id, "ochiko:244704620650299393")
		}

		if (ignoredChannels.indexOf(m.channel.id) == -1 && word.toLowerCase() == ":kreygasm:") {
			Bot.createMessage(m.channel.id, "<:kreygasm:267838274276425728> Do ya like jazz? <:kreygasm:267838274276425728>").then(a => {
			 setTimeout(function() {
				a.delete();
			}, 1000);
			});
		}

		if (ignoredChannels.indexOf(m.channel.id) == -1 && word.toLowerCase() == "vore" || word.toLowerCase() == "mouth") {
			Bot.addMessageReaction(m.channel.id, m.id, "vore:249044969933766656")
			Bot.addMessageReaction(m.channel.id, m.id, "swallow:249044981455650826")
		}

		if (ignoredChannels.indexOf(m.channel.id) == -1 && word.toLowerCase() == "boob" || word.toLowerCase() == "boobs") {
			Bot.addMessageReaction(m.channel.id, m.id, "beefers:237630085534973963")
		}

		if (ignoredChannels.indexOf(m.channel.id) == -1 && word.toLowerCase() == "feet" || word.toLowerCase() == "foot" || word.toLowerCase() == "stomp") {
			Bot.addMessageReaction(m.channel.id, m.id, "reddot:248615497212493827")
			Bot.addMessageReaction(m.channel.id, m.id, "foote:239789836121145344")
			Bot.addMessageReaction(m.channel.id, m.id, "%F0%9F%91%A3")
		}

		if (ignoredChannels.indexOf(m.channel.id) == -1 && word.toLowerCase() == "butt" || word.toLowerCase() == "ass" || word.toLowerCase() == "booty") {
			Bot.addMessageReaction(m.channel.id, m.id, "booty:246514197423325184")
		}

		if (ignoredChannels.indexOf(m.channel.id) == -1 && word.toLowerCase() == "bibby") {
			Bot.addMessageReaction(m.channel.id, m.id, "ochiko:244704620650299393")
			setTimeout(function () {
			}, 300);
			Bot.removeMessageReaction(m.channel.id, m.id, "ochiko:244704620650299393")
		}

		if (ignoredChannels.indexOf(m.channel.id) == -1 && word.toLowerCase() == "peen" || word.toLowerCase() == "dicc" || word.toLowerCase() == "dick" || word.toLowerCase() == "penis") {
			Bot.addMessageReaction(m.channel.id, m.id, "dicc:267769403318337537")
			}
		}
	}
});

Bot.on("guildMemberAdd",function(guild, member) {
  if (guild.id == "354709664509853708") {
          Bot.createMessage("358797182876385280", {
            embed: {
                color: 0xA260F6,
                title:  member.username + " (" + member.id + ") joined Small World \nWe now have: "+ guild.memberCount + " people! :smiley:",
                timestamp: new Date().toISOString(),
                author: {
                  name: member.username,
                  icon_url: member.avatarURL
                }
            }
          });
  }
});

Bot.on("guildMemberRemove",function(guild, member) {
  if (guild.id == "354709664509853708") {
          Bot.createMessage("358797182876385280", {
            embed: {
                color: 0xA260F6,
                title:  member.username + " (" + member.id + ") left Small World \nWe now have: "+ guild.memberCount + " people! :frowning2:",
                timestamp: new Date().toISOString(),
                author: {
                  name: member.username,
                  icon_url: member.avatarURL
                }
            }
          });
  }
});

Bot.on("guildCreate",function(guild) {
    Bot.getDMChannel('161027274764713984').then(function(DMchannel) {
          Bot.createMessage(DMchannel.id, {
            embed: {
                color: 0xA260F6,
                title:  "I was invited to the guild: " + guild.name + "(" + guild.id + ")",
                timestamp: new Date().toISOString(),
                author: {
                  name: guild.name,
                  icon_url: guild.iconURL
                }
            }
          });
      });
});

Bot.on("guildDelete",function(guild) {
    Bot.getDMChannel('161027274764713984').then(function(DMchannel) {
          Bot.createMessage(DMchannel.id, {
            embed: {
                color: 0xA260F6,
                title:  "I was removed from the guild: " + guild.name + "(" + guild.id + ")",
                timestamp: new Date().toISOString(),
                author: {
                  name: guild.name,
                  icon_url: guild.iconURL
                }
            }
          });
      });
});

events.forEach(function(event) {
	Bot.on(event, function(m) {
		var eventjs = reload("./events/"+event+"/main.js");
		try {
			eventjs.main(Bot, m, config);
		} catch (err) {
			console.log(err);
		}
	});
});

Bot.connect();
