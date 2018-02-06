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
var timeago = require("timeago.js");
var timediff = require('timediff');
var config = require("./etc/config.json");
var Bot = bot(config.tokens.mei);
var reload = require("require-reload")(require);
var events = fs.readdirSync("./events/");
var colors = require("colors");
const _ = require("./data.js");
const ppl = require("./people.js");
const servers = require("./servers.js");
var people = ppl.load();
var server = servers.load();
var data = _.load();
var aesthetics = require('aesthetics');
var hands = [ ":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"]
var hand = hands[Math.floor(Math.random() * hands.length)]

Bot.on("messageCreate", (m)=>{
  var prefix = config.prefix
  if (server[m.channel.guild.id]) {
    if (server[m.channel.guild.id].prefix) {
      var prefix = server[m.channel.guild.id].prefix
    }
  }
  if (m.author.id == "309220487957839872") return;
	if (m.channel.isPrivate) return;
  if (!m.guild) {
    console.log(m);
  }
  if (m.guild.id == "373589430448947200") {
    if (m.content.includes("you joined") == true && m.author.id == "155149108183695360") { // If shit bot says "you joined" in #welcome
      Bot.removeGuildMemberRole(m.channel.guild.id, m.mentions[0].id, "375633311449481218", "Removed from role assign") // remove the No channel access role
    }
  }
  if (m.author.id == "161027274764713984" && m.content.includes("pls")) {
    if (m.content.includes("stop")) {
      Bot.createMessage(m.channel.id, "give me just a second").then((m) => {
        data.reboot.mID == m.id
        data.reboot.cID == m.channel.id
      })
      process.exit(0)
    }
    if (m.content.includes(" mute") && m.mentions.length > 0) {
      if (m.mentions.length > 1) {
        var muteArray = []
        var mentions = m.mentions
        for (const mention of mentions) {
          Bot.addGuildMemberRole(m.channel.guild.id, mention.id, "363854631035469825", "Daddy said shush").then(() => {
              return Bot.createMessage(m.channel.id, hand).then((m) => {
                  return setTimeout(function() {Bot.deleteMessage(m.channel.id, m.id, "Timeout")}, 5000)
              })
          })
        }
        return;
      }
      Bot.addGuildMemberRole(m.channel.guild.id, m.mentions[0].id, "363854631035469825", "Daddy said shush").then(() => {
          return Bot.createMessage(m.channel.id, hand).then((m) => {
              return setTimeout(function() {Bot.deleteMessage(m.channel.id, m.id, "Timeout")}, 5000)
          })
      })
    }
    if (m.content.includes(" unmute") && m.mentions.length > 0) {
      if (m.mentions.length > 1) {
        var unmuteArray = []
        var mentions = m.mentions
        for (const mention of mention) {
          Bot.removeGuildMemberRole(m.channel.guild.id, mention.id, "363854631035469825", "Daddy said speak").then(() => {
              return Bot.createMessage(m.channel.id, hand).then((m) => {
                  return setTimeout(function() {Bot.deleteMessage(m.channel.id, m.id, "Timeout")}, 5000)
              })
          })
        }
        return;
      }
      Bot.removeGuildMemberRole(m.channel.guild.id, m.mentions[0].id, "363854631035469825", "Daddy said speak").then(() => {
          return Bot.createMessage(m.channel.id, hand).then((m) => {
              return setTimeout(function() {Bot.deleteMessage(m.channel.id, m.id, "Timeout")}, 5000)
          })
      })
    }
  }
  if (m.channel.guild.id == '196027622944145408' && m.content.startsWith(`${prefix}play`)) {
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
				cmd.main(Bot, m, args, prefix);
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
});

Bot.on("guildMemberAdd",function(guild, member) {
  var prefix = server[guild.id].prefix || config.prefix
  if (guild.id == "373589430448947200") {
    Bot.addGuildMemberRole(guild.id, member.id, "375633311449481218", "Assined on join")
    var number = member.id
    var date = member.joinedAt;
    var date2 = member.createdAt;
    var name = member.nick || member.username
    var length = new Date(date).toDateString();
    var length2 = new Date(date2).toDateString();
    var ago = timeago().format(date);
    var ago2 = timeago().format(date2);
    var diff = timediff(date2, date, "D")
    Bot.createMessage("393839796822343681", "**" +name+"**\nJoined: "+length+" | "+ago+"\nCreated: "+length2+" | "+ago2)
    if (diff.days < 2) {
      Bot.createMessage("393839796822343681", ":warning: **"+name+"** Joined less than 24 hours after creating account");
    }
  }
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
          if (guild.memberCount % 50 === 0) {
            const msgEmbed = {
        			"content": "We have just reached "+guild.memberCount+" members! :tada: :tada: :tada: :tada: :tada: :tada:",
        			"embed": {
        				"title": "To celebrate, Snippy drew this for us: https://buttsare.sexy/6d853b.png",
        				"color": 0xA260F6,
        				"image": {
        					"url": "https://buttsare.sexy/8ccdb9.png"
        				}
        			}
        		};
        		Bot.createMessage("354709664509853712", msgEmbed);
        }
        setTimeout(function() {
          Bot.createMessage("354709664509853712", "Welcome "+ member.mention+"~\nThere are a list of roles in <#355823130637500417>, use `"+prefix+"role add rolename` in <#363895860276232193> to give yourself roles. You will be unable to send messages in any other channels until you do this. Let a Guardian know if you have any questions.").then((m) => {
              return setTimeout(function() {Bot.deleteMessage(m.channel.id, m.id, "Timeout")}, 3600000)
          })
          return;}, 4000)
  }
  if (guild.id == "326172270370488320") {
          Bot.createMessage("326172270370488320", "Welcome to Size Haven, "+ member.mention+"!\nWe now have: "+ guild.memberCount + " people!\nThere are a list of roles in <#389949413042290689>, please use `"+prefix+"role add rolename` to give yourself roles, and let a Mod know if you have any questions~").then((m) => {
              return setTimeout(function() {Bot.deleteMessage(m.channel.id, m.id, "Timeout")}, 3600000)
          })
  }
  if (guild.id == "396122792531197952") {
          Bot.createMessage("396122792531197954", "Hi and welcome to Size Politics "+member.mention+"~\n Before you begin, first read <#397120033907802112> as it contains the server rules. Once you're done, tag an <@251629183552323584> so he can assign you the citizen role. Once you've gotten the citizen role, check <#397239213147422721> and <#397123029345501188> for all the current active roles. Thank you for joining and I hope you enjoy your stay!\nWe now have "+guild.memberCount+" members").then((m) => {
              return setTimeout(function() {Bot.deleteMessage(m.channel.id, m.id, "Timeout")}, 3600000)
          })
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
  if (guild.id == "326172270370488320") {
          Bot.createMessage("326172270370488320", member.username + " left Size Haven. \nWe now have: "+ guild.members.filter(m => !m.bot).length + " people :frowning2:").then((m) => {
              return setTimeout(function() {Bot.deleteMessage(m.channel.id, m.id, "Timeout")}, 3600000)
          })
  }
});

Bot.on("guildCreate",function(guild) {
    Bot.getDMChannel('161027274764713984').then(function(DMchannel) {
          Bot.createMessage(DMchannel.id, {
            embed: {
                color: 0xA260F6,
                title:  "I was invited to the guild: " + guild.name + "(" + guild.id + ")\nI am now in "+Bot.guilds.size+" guilds",
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
                title:  "I was removed from the guild: " + guild.name + "(" + guild.id + ")\nI am now in "+Bot.guilds.size+" guilds",
                timestamp: new Date().toISOString(),
                author: {
                  name: guild.name,
                  icon_url: guild.iconURL
                }
            }
          });
      });
});

Bot.on("messageReactionAdd",function(m, emoji, userID) {
  if (emoji.name == "😍") {
    var m = Bot.getMessage(m.channel.id, m.id).then((m) => {
      if (m.attachments.length == 0) {
        var link = m.cleanContent
      }
      else if (m.attachments[0]) {
        var link = m.attachments[0].url
      }
      var id = userID
      if (link) {
        var people = ppl.load();
        if (!(people.people[id])) {
    			people.people[id]= {};
          ppl.save(people);
    		}
        if (!(people.people[id].hoard)) {
    			people.people[id].hoard = {}
          ppl.save(people);
        }
        var people = ppl.load();
        var hoard = people.people[id].hoard
        if (!hoard[link]) {
          hoard[link] = m.author.id
          ppl.save(people);
        }
      }
    })
  }
  if (data.giveaways.running && emoji.id == "367892951780818946" && userID != "309220487957839872" && userID != data.giveaways.creator) {
    if (m.id == data.giveaways.mID) {
      data.giveaways.current.contestants[userID] = "entered"
      _.save(data);
      return;
    }
  }
});

Bot.on("messageReactionRemove",function(m, emoji, userID)  {
  var data = _.load();
  var people = ppl.load();
  var m = Bot.getMessage(m.channel.id, m.id).then((m) => {
    if (emoji.name == "😍") {
      if (m.attachments.length == 0) {
        var link = m.cleanContent
      }
      else if (m.attachments[0]) {
        var link = m.attachments[0].url
      }
      var id = userID
      var hoard = people.people[id].hoard
      if (hoard[link]) {
        delete hoard[link]
        ppl.save(people);
        return;
      }
  }
    if (data.giveaways.running && emoji.id == "367892951780818946" && userID != "309220487957839872" && userID != data.giveaways.creator) {
      if (m.id == data.giveaways.mID) {
        if (data.giveaways.current.contestants[userID]) {
          delete data.giveaways.current.contestants[userID]
          _.save(data);
          return;
        }
      }
    }
  })
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
