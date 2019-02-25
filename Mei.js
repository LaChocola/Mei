'use strict';
process.on('unhandledRejection', (err, promise) => {
  console.error(err ? err.stack : promise);
});
var bot = require('eris');
Object.defineProperty(bot.Message.prototype, 'guild', {
    get: function guild() {
        return this.channel.guild;
    }
});
var fs = require('fs');

var reload = require('require-reload')(require);
var timeago = require('timeago.js');
var timediff = require('timediff');
var config = reload('./etc/config.json');
var colors = require('colors');
var _ = require('./data.js');
var ppl = require('./people.js');
var servers = reload('./servers.js');
var people = ppl.load();
var server = servers.load();
var data = _.load();
var aesthetics = require('aesthetics');
var Bot = bot(config.tokens.mei);
var unidecode = require('unidecode')
var hands = [ ':ok_hand::skin-tone-1:', ':ok_hand::skin-tone-2:', ':ok_hand::skin-tone-3:', ':ok_hand::skin-tone-4:', ':ok_hand::skin-tone-5:', ':ok_hand:']
var hand = hands[Math.floor(Math.random() * hands.length)]

Bot.on('guildBanAdd', function (guild, user) {
  var server = servers.load()
  if (server[guild.id]) {
    if (server[guild.id].notifications) {
      if (server[guild.id].notifications.banLog) {
        var userFull = Bot.users.filter(m => m.id === user.id)[0]
        var origID = userFull.id || null
        var hash = userFull.avatar || null
        var avy = `https://cdn.discordapp.com/avatars/${origID}/${hash}.jpg?size=128`
        var name = userFull.nick || user.username
        var msg = {
          'embed': {
            'description': `${name}#${user.discriminator} (${user.id}) was banned from ${Bot.guilds.get(guild.id).name}\n\nWe are now at ${Bot.guilds.get(guild.id).memberCount} users`,
            'color': 13632027,
            'timestamp': new Date().toISOString(),
            'thumbnail': {
              'url': avy
            },
            'author': {
              'name': 'User Banned'
            }
          }
        };
        var channel = server[guild.id].notifications.banLog
        Bot.createMessage(channel, msg);
      }
    }
  }
});

Bot.on('guildBanRemove', function (guild, user) {
  var server = servers.load()
  if (server[guild.id]) {
    if (server[guild.id].notifications) {
      if (server[guild.id].notifications.banLog) {
        var userFull = Bot.users.filter(m => m.id === user.id)[0]
        var origID = userFull.id || null
        var hash = userFull.avatar || null
        var avy = `https://cdn.discordapp.com/avatars/${origID}/${hash}.jpg?size=128`
        var name = userFull.nick || user.username
        var msg = {
          'embed': {
            'description': `${name}#${user.discriminator} (${user.id}) was unbanned from ${Bot.guilds.get(guild.id).name}\n\nWe are now at ${Bot.guilds.get(guild.id).memberCount} users`,
            'color': 8311585,
            'timestamp': new Date().toISOString(),
            'thumbnail': {
              'url': avy
            },
            'author': {
              'name': 'User UnBanned'
            }
          }
        };
        var channel = server[guild.id].notifications.banLog
        Bot.createMessage(channel, msg);
      }
    }
  }
});

Bot.on('messageCreate', (m)=>{
  if (m.author.id === '309220487957839872') return;
  var data = _.load();
  if (data.banned.global[m.author.id]) {
    return;
  }
  if (!m.channel.guild) {
      console.log(m);
      Bot.getDMChannel(m.author.id).then(function (DMchannel) {
          Bot.createMessage(DMchannel.id, 'Your messages do not serve me here, bug.');
          return;
      });
      return;
  }
  if (m.content.toLowerCase().match(/\bchocola\b/i) || m.content.toLowerCase().match(/\bchoco\b/i) || m.content.toLowerCase().match(/\bchoc\b/i)) {
    var member = m.channel.guild.members.get('161027274764713984');
    var present = member.id || false;
    if (present !== '161027274764713984') {
      return;
    }
    if (m.author.id === '161027274764713984') {
      return;
    }
    Bot.getDMChannel('161027274764713984').then(function (DMchannel) {
        Bot.createMessage(DMchannel.id, `You were mentioned in <#${m.channel.id}> by <@${m.author.id}>. Message: <https://discordapp.com/channels/${m.channel.guild.id}/${m.channel.id}/${m.id}>`).then((msg) => {
          Bot.createMessage(DMchannel.id, m.content);
        })
    });
  }
  if (m.author.id === '161027274764713984' && m.content.includes('pls')) {
    if (m.content.includes('stop')) {
      Bot.createMessage(m.channel.id, `Let me rest my eyes for a moment`).then((msg) => {
          return setTimeout(function () {
              Bot.deleteMessage(m.channel.id, m.id, 'Timeout')
              Bot.deleteMessage(m.channel.id, msg.id, 'Timeout').then(() => {
                  process.exit(0)
              })
          }, 1500)
      })
    }
    if (m.content.includes('override')) {
      Bot.createMessage(m.channel.id, `Chocola Recognized. Permission overrides engaged. I am at your service~`).then((msg) => {
          return setTimeout(function () {
              Bot.deleteMessage(m.channel.id, m.id, 'Timeout')
              Bot.deleteMessage(m.channel.id, msg.id, 'Timeout').then(() => {
                  process.exit(0)
              })
          }, 2000)
      })
    }
  }
  var config = reload('./etc/config.json')
  var server = servers.load()
  var prefix = config.prefix
  if (server[m.channel.guild.id]) {
    if (server[m.channel.guild.id].prefix) {
      var prefix = server[m.channel.guild.id].prefix
    }
  }
  if (m.guild.id === '373589430448947200') {
    if (m.content.includes('you joined') === true && m.author.id === '155149108183695360') { // If shit bot says 'you joined' in #welcome
      Bot.removeGuildMemberRole(m.channel.guild.id, m.mentions[0].id, '375633311449481218', 'Removed from role assign') // remove the No channel access role
    }
  }
  if (m.author.id === '161027274764713984' && m.content.includes('pls')) {
    if (m.content.includes(' mute') && m.mentions.length > 0) {
      if (m.mentions.length > 1) {
        var muteArray = []
        var mentions = m.mentions
        for (const mention of mentions) {
          Bot.addGuildMemberRole(m.channel.guild.id, mention.id, '363854631035469825', 'Daddy said shush').then(() => {
              return Bot.createMessage(m.channel.id, hand).then((m) => {
                  return setTimeout(function () {Bot.deleteMessage(m.channel.id, m.id, 'Timeout')}, 5000)
              })
          })
        }
        return;
      }
      Bot.addGuildMemberRole(m.channel.guild.id, m.mentions[0].id, '363854631035469825', 'Daddy said shush').then(() => {
          return Bot.createMessage(m.channel.id, hand).then((m) => {
              return setTimeout(function () {Bot.deleteMessage(m.channel.id, m.id, 'Timeout')}, 5000)
          })
      })
    }
    if (m.content.includes(' unmute') && m.mentions.length > 0) {
      if (m.mentions.length > 1) {
        var unmuteArray = []
        var mentions = m.mentions
        for (const mention of mention) {
          Bot.removeGuildMemberRole(m.channel.guild.id, mention.id, '363854631035469825', 'Daddy said speak').then(() => {
              return Bot.createMessage(m.channel.id, hand).then((m) => {
                  return setTimeout(function () {Bot.deleteMessage(m.channel.id, m.id, 'Timeout')}, 5000)
              })
          })
        }
        return;
      }
      Bot.removeGuildMemberRole(m.channel.guild.id, m.mentions[0].id, '363854631035469825', 'Daddy said speak').then(() => {
          return Bot.createMessage(m.channel.id, hand).then((m) => {
              return setTimeout(function () {Bot.deleteMessage(m.channel.id, m.id, 'Timeout')}, 5000)
          })
      })
    }
  }
  if (m.channel.guild.id === '196027622944145408' && m.content.startsWith(`${prefix}play`)) {
    return;
  }
	var loguser = `${m.author.username}#${m.author.discriminator}`.magenta.bold;
	var logserver = `${m.channel.guild.name}`.cyan.bold || 'Direct Message'.cyan.bold
	var logchannel = `#${m.channel.name}`.green.bold;
	var logdivs = [' > '.blue.bold, ' - '.blue.bold];
	var commands = fs.readdirSync('./commands/');
	if (m.content.startsWith(prefix)) {
		var command = m.content.split(' ')[0].replace(prefix, '').toLowerCase();
		if (commands.indexOf(command+'.js') > -1) {
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
			var cmd = reload('./commands/'+command+'.js');
			var args = m.content.replace(/\[\?\]/ig,'').split(' ');
			args.splice(0, 1);
			args = args.join(' ');
			var logcmd = `${prefix}${command}`.bold;
			var logargs = `${args}`.bold;
			try {
				console.log('CMD'.black.bgGreen+' '+loguser+logdivs[1]+logserver+logdivs[0]+logchannel+' '+logcmd.blue);
				if (args) console.log('ARG'.black.bgCyan+' '+logargs.blue.bold);
				console.log('');
				cmd.main(Bot, m, args, prefix);
			} catch (err) {
				console.log(err);
				Bot.createMessage(m.channel.id, 'An error has occured.');
				console.log('CMD'.black.bgRed+' '+loguser+logdivs[1]+logserver+logdivs[0]+logchannel+' '+logcmd.red);
				if (args) console.log('ARG'.black.bgCyan+' '+logargs.red.bold);
				console.log('');
			}
		}
	}
});

Bot.on('guildMemberAdd',async function (guild, member) {
  var server = servers.load();
  var prefix = server[guild.id].prefix || config.prefix
  var name = guild.name
  var count = guild.memberCount-guild.members.filter(m => m.bot).length
  var number = member.id
  var date = member.joinedAt;
  var date2 = member.createdAt;
  var name = member.nick || member.username
  var length = new Date(date).toDateString();
  var length2 = new Date(date2).toDateString();
  var ago = timeago().format(date);
  var ago2 = timeago().format(date2);
  var diff = timediff(date2, date, 'D')
  if (server[guild.id]) {
    if (server[guild.id].notifications) {
      if (server[guild.id].notifications.updates) {
        var channel = server[guild.id].notifications.updates
        Bot.createMessage(channel, {
          embed: {
              color: 0xA260F6,
              title:  `${member.username} (${member.id}) joined ${guild.name}\nWe now have: ${count} people! :smiley:`,
              timestamp: new Date().toISOString(),
              author: {
                name: member.username,
                icon_url: member.avatarURL
              }
          }
        });
        if (diff.days < 2) {
          Bot.createMessage(channel, `:warning: **${name}** Joined less than 24 hours after creating their account`);
        }
      }
      if (server[guild.id].notifications.welcome) {
        var channel = Object.keys(server[guild.id].notifications.welcome)[0]
        var message = server[guild.id].notifications.welcome[channel]
        message = message.replace('[name]', `${member.username}`).replace('[user]', `${member.username}#${member.discriminator}`).replace('[server]', `${guild.name}`).replace('[mention]', `${member.mention}`)
        Bot.createMessage(channel, message)
      }
    }
  }
});

Bot.on('guildMemberRemove',async function (guild, member) {
  var server = servers.load();
  var prefix = server[guild.id].prefix || config.prefix
  var name = guild.name
  var count = guild.memberCount-guild.members.filter(m => m.bot).length
  if (server[guild.id]) {
    if (server[guild.id].notifications) {
      if (server[guild.id].notifications.updates) {
        var channel = server[guild.id].notifications.updates
        Bot.createMessage(channel, {
          embed: {
              color: 0xA260F6,
              title:  `${member.username} (${member.id}) left ${guild.name}\nWe now have: ${count} people! :frowning2:`,
              timestamp: new Date().toISOString(),
              author: {
                name: member.username,
                icon_url: member.avatarURL
              }
          }
        });
      }
    }
  }
});

Bot.on('guildCreate',async function (guild) {
    Bot.getDMChannel('161027274764713984').then(function (DMchannel) {
          Bot.createMessage(DMchannel.id, {
            embed: {
                color: 0xA260F6,
                title:  'I was invited to the guild: ' + guild.name + '(' + guild.id + ')\nI am now in '+Bot.guilds.size+' guilds',
                timestamp: new Date().toISOString(),
                author: {
                  name: guild.name,
                  icon_url: guild.iconURL
                }
            }
          });
      });
});

Bot.on('guildDelete',async function (guild) {
    Bot.getDMChannel('161027274764713984').then(function (DMchannel) {
          Bot.createMessage(DMchannel.id, {
            embed: {
                color: 0xA260F6,
                title:  'I was removed from the guild: ' + guild.name + '(' + guild.id + ')\nI am now in '+Bot.guilds.size+' guilds',
                timestamp: new Date().toISOString(),
                author: {
                  name: guild.name,
                  icon_url: guild.iconURL
                }
            }
          });
      });
});

Bot.on('messageReactionAdd',async function (m, emoji, userID) {
  var server = servers.load();
  var id = userID;
  var m = await Bot.getMessage(m.channel.id, m.id).then(async (m) => {
    if (emoji.name === '😍') {
      if (m.attachments.length === 0 && m.embeds.length === 0) {
        var link = m.cleanContent
      }
      else if (m.attachments[0]) {
        var link = m.attachments[0].url
      }
      else if (m.embeds[0]) {
        if (m.embeds[0].image) {
          var link = m.embeds[0].image.url
        }
      }
      if (link) {
        var people = ppl.load();
        if (!(people.people[id])) {
          people.people[id] = {};
          ppl.save(people);
        }
        if (!(people.people[id].hoard)) {
          people.people[id].hoard = {};
          people.people[id].hoard['😍'] = {};
          ppl.save(people);
        }
        var people = ppl.load();
        var hoard = people.people[id].hoard['😍'];
        if (hoard) {
          if (!hoard[link]) {
              hoard[link] = m.author.id;
              ppl.save(people);
              if (!people.people[m.author.id]) {
                  people.people[m.author.id] = {};
                  ppl.save(people);
                  people = ppl.load();
              }
              if (!people.people[m.author.id].adds) {
                  people.people[m.author.id].adds = 0;
                  ppl.save(people);
                  people = ppl.load();
              }
              if (m.author.id !== id) {
                people.people[m.author.id].adds++;
                ppl.save(people);
                if (Number(people.people[m.author.id].adds) % 10 === 0 && m.author.id !== '309220487957839872') {
                  var user = Bot.users.filter(u => u.id === m.author.id)[0];
                  Bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${Number(people.people[m.author.id].adds)} hoard adds (since the counter was added).`).then((m) => {
                      return setTimeout(function () {Bot.deleteMessage(m.channel.id, m.id, 'Timeout')}, 60000)
                  });
                }
              }
              return;
          }
        }
      }
    }
    if (server[m.channel.guild.id]) {
      var people = ppl.load();
      if (server[m.channel.guild.id].hoards && emoji.name !== '😍') {
        if (people.people[id] && people.people[id].hoard && people.people[id].hoard[emoji.name]) {
          var m = await Bot.getMessage(m.channel.id, m.id).then((m) => {
            if (m.attachments.length === 0 && m.embeds.length === 0) {
              var link = m.cleanContent
            }
            else if (m.attachments[0]) {
              var link = m.attachments[0].url
            }
            else if (m.embeds[0]) {
              var link = m.embeds[0].image.url
            }
            if (link) {
              var people = ppl.load();
              var hoard = people.people[id].hoard[emoji.name]
              if (!hoard[link]) {
                hoard[link] = m.author.id
                ppl.save(people);
                if (!people.people[m.author.id]) {
                    people.people[m.author.id] = {}
                    ppl.save(people);
                    people = ppl.load();
                }
                if (!people.people[m.author.id].adds) {
                    people.people[m.author.id].adds = 0
                    ppl.save(people);
                    people = ppl.load();
                }
                if (m.author.id !== id) {
                  people.people[m.author.id].adds++
                  ppl.save(people);
                  if (+people.people[m.author.id].adds % 10 === 0 && m.author.id !== '309220487957839872') {
                    var user = Bot.users.filter(u => u.id === m.author.id)[0]
                    Bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${+people.people[m.author.id].adds} hoard adds (since the counter was added).`).then((m) => {
                        return setTimeout(function () {Bot.deleteMessage(m.channel.id, m.id, 'Timeout')}, 60000)
                    })
                  }
                }
                return;
              }
            }
          })
        }
      }
    }
    var guild = m.channel.guild
    if (server[m.channel.guild.id]) {
      if (server[m.channel.guild.id].giveaways) {
        if (server[guild.id].giveaways.running && emoji.id === '367892951780818946' && userID !== '309220487957839872' && userID !== server[guild.id].giveaways.creator) {
          if (m.id === server[guild.id].giveaways.mID) {
            server[guild.id].giveaways.current.contestants[userID] = 'entered'
            servers.save(server);
            return;
          }
        }
      }
    }
  });
});

Bot.on('messageReactionRemove',async function (m, emoji, userID)  {
  var server = servers.load();
  var m = await Bot.getMessage(m.channel.id, m.id).then(async (m) => {
    var id = userID
    var data = _.load();
    var people = ppl.load();
    if (emoji.name === '😍') {
      if (m.attachments.length === 0 && m.embeds.length === 0) {
        var link = m.cleanContent
      }
      else if (m.attachments[0]) {
        var link = m.attachments[0].url
      }
      else if (m.embeds[0]) {
        if (m.embeds[0].image) {
          var link = m.embeds[0].image.url
        }
      }
      if (people.people[id]) {
        if (people.people[id].hoard) {
          var hoard = people.people[id].hoard['😍']
        }
      }
      if (hoard[link]) {
        delete hoard[link]
        ppl.save(people);
        people = ppl.load();
        if (people.people[m.author.id]) {
          if (!people.people[m.author.id].adds) {
            people.people[m.author.id].adds = 0
          }
          ppl.save(people);
          people = ppl.load();
        }
        if (m.author.id !== id) {
          people.people[m.author.id].adds--
          ppl.save(people);
        }
      }
      return;
    }
    if (server[m.channel.guild.id]) {
      var people = ppl.load();
      if (server[m.channel.guild.id].hoards && emoji.name !== '😍') {
        if (!people.people[id]) {
          return;
        }
        if (!people.people[id].hoard) {
          return;
        }
        if (people.people[id].hoard[emoji.name]) {
          var m = await Bot.getMessage(m.channel.id, m.id).then((m) => {
            if (m.attachments.length === 0 && m.embeds.length === 0) {
              var link = m.cleanContent
            }
            else if (m.attachments[0]) {
              var link = m.attachments[0].url
            }
            else if (m.embeds[0]) {
              var link = m.embeds[0].image.url
            }
            if (link) {
              var people = ppl.load();
              var hoard = people.people[id].hoard[emoji.name]
              if (hoard[link]) {
                delete hoard[link]
                ppl.save(people);
                people = ppl.load();
                if (people.people[m.author.id]) {
                  if (!people.people[m.author.id].adds) {
                    people.people[m.author.id].adds = 0
                  }
                  ppl.save(people);
                  people = ppl.load();
                }
                if (m.author.id !== id) {
                  people.people[m.author.id].adds--
                  ppl.save(people);
                  return;
                }
              }
            }
          })
        }
      }
    }
    if (server[m.channel.guild.id]) {
      if (server[m.channel.guild.id].giveaways) {
        if (server[m.channel.guild.id].giveaways.running && emoji.id === '367892951780818946' && userID !== '309220487957839872' && userID !== server[m.channel.guild.id].giveaways.creator) {
          if (m.id === server[m.channel.guild.id].giveaways.mID) {
            if (server[m.channel.guild.id].giveaways.current.contestants[userID]) {
              delete server[m.channel.guild.id].giveaways.current.contestants[userID]
              servers.save(server);
              return;
            }
          }
        }
      }
    }
  })
});

Bot.connect();
