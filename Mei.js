'use strict';

process.on('unhandledRejection', (err, promise) => {
    console.error("== Node detected an unhandled rejection! ==");
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
var timediff = require('timediff');
var config = reload('./etc/config.json');
var colors = require('colors');
var _ = require('./data.js');
var ppl = require('./people.js');
var servers = reload('./servers.js');
var Bot = bot(config.tokens.mei);
var hands = [':ok_hand::skin-tone-1:', ':ok_hand::skin-tone-2:', ':ok_hand::skin-tone-3:', ':ok_hand::skin-tone-4:', ':ok_hand::skin-tone-5:', ':ok_hand:']
var hand = hands[Math.floor(Math.random() * hands.length)]
var commandContentsMap = {}

function send(channel, text, timeout) {
    Bot.createMessage(channel, text).then((msg) => {
        return setTimeout(function() {
            Bot.deleteMessage(m.channel.id, m.id, 'Timeout')
            Bot.deleteMessage(m.channel.id, msg.id, 'Timeout')
        }, timeout)
    })
        .catch((err) => {
            console.log(`\nError Occured while sending message\n`)
            console.log(err)
        })
}

Bot.on('guildBanAdd', async function(guild, user) {
    var server = servers.load()
    if (server[guild.id]) {
        if (server[guild.id].notifications) {
            if (server[guild.id].notifications.banLog) {
                var banned = await Bot.getGuildBan(guild.id, user.id)
                var userFull = await Bot.users.filter(m => m.id === user.id)[0]
                var origID = userFull.id || null
                var hash = userFull.avatar || null
                var avy = `https://cdn.discordapp.com/avatars/${origID}/${hash}.jpg?size=128`
                var name = userFull.nick || user.username
                var msg = {
                    'embed': {
                        'color': 13632027,
                        'timestamp': new Date().toISOString(),
                        'thumbnail': {
                            'url': avy
                        },
                        'author': {
                            'name': 'User Banned'
                        },
                        "fields": [
                            {
                                "name": "User:",
                                "value": `${name}#${user.discriminator}`,
                                "inline": true
                            },
                            {
                                "name": "ID:",
                                "value": banned.user.id,
                                "inline": true
                            },
                            {
                                "name": "\nBot:",
                                "value": banned.user.bot,
                                "inline": true
                            },
                            {
                                "name": "\nRemaining:",
                                "value": `${await Bot.guilds.get(guild.id).memberCount} members`,
                                "inline": true
                            }
                        ]
                    }
                };
                if (banned.reason) {
                    if (banned.reason.toLowerCase().startsWith("banned by: ")) {
                        banned.reason = banned.reason + " (Automated ban through Mei)"
                    }
                    msg.embed.fields.push({
                        "name": "\nReason:",
                        "value": banned.reason,
                        "inline": true
                    })
                }
                var channel = server[guild.id].notifications.banLog
                Bot.createMessage(channel, msg);
            }
        }
    }
});

Bot.on('guildBanRemove', async function(guild, user) {
    var server = servers.load()
    if (server[guild.id]) {
        if (server[guild.id].notifications) {
            if (server[guild.id].notifications.banLog) {
                var userFull = await Bot.users.filter(m => m.id === user.id)[0]
                var origID = userFull.id || null
                var hash = userFull.avatar || null
                var avy = `https://cdn.discordapp.com/avatars/${origID}/${hash}.jpg?size=128`
                var name = userFull.nick || user.username
                var msg = {
                    'embed': {
                        'color': 8311585,
                        'timestamp': new Date().toISOString(),
                        'thumbnail': {
                            'url': avy
                        },
                        'author': {
                            'name': 'User UnBanned'
                        },
                        "fields": [
                            {
                                "name": "User:",
                                "value": `${name}#${user.discriminator}`,
                                "inline": true
                            },
                            {
                                "name": "ID:",
                                "value": user.id,
                                "inline": true
                            },
                            {
                                "name": "\nBot:",
                                "value": user.bot,
                                "inline": true
                            },
                            {
                                "name": "\nRemaining:",
                                "value": `${await Bot.guilds.get(guild.id).memberCount} members`,
                                "inline": true
                            }
                        ]
                    }
                };
                var channel = server[guild.id].notifications.banLog
                Bot.createMessage(channel, msg);
            }
        }
    }
});

Bot.on('messageCreate', async function(m) {
    const timestamps = [Date.now()]
    function updateTimestamps() {
        const latest = timestamps[timestamps.length - 1]
        const now = Date.now()
        timestamps[timestamps.length - 1] = now - latest
        timestamps.push(now)
    }
    var data = _.load();
    if (data.banned.global[m.author.id]) {
        return;
    }
    updateTimestamps()
    if (!m.channel.guild) {
        console.log(`${m.author.username}#${m.author.discriminator} (${m.author.id}): ${m.content}`);
        Bot.getDMChannel(m.author.id).then(function(DMchannel) {
            Bot.createMessage(DMchannel.id, 'Your messages do not serve me here, bug.');
            return;
        }).catch((err) => {
            if (err.code == 50007) {
                return;
            }
            console.log(err)
        })
        if (m.author.id !== "161027274764713984") {
            console.log("Guild 1:", m.channel.guild)
            var roles = new Collection(bot.Role)
            var members = new Collection(bot.User)
            var channels = new Collection(bot.Channel)
            members.add(m.author, bot.User, true)
            channels.add(m.channel, bot.Channel, true)
            roles.add({ "name": "fakeRole", "id": "00001" }, bot.Role, true)
            var fakeGuild = {
                name: m.author.username,
                ownerid: m.author.id,
                id: m.channel.id,
                iconURL: m.author.iconURL,
                roles: roles,
                members: members,
                channels: channels
            }
            console.log(`Guild 2: ${m.channel.guild}`)
        };
        return;
    }
    updateTimestamps()
    var config = reload('./etc/config.json')
    var server = servers.load()
    var prefix = config.prefix
    if (server[m.channel.guild.id] && server[m.channel.guild.id].game && server[m.channel.guild.id].game.channel == m.channel.id && server[m.channel.guild.id].game.player == m.author.id) {
        if (server[m.channel.guild.id].game.active && server[m.channel.guild.id].game.choices.includes(m.content)) {
            m.content = prefix + 't ' + m.content
        }
    }

    if (m.content.toLowerCase().match(/\bchocola\b/i) || m.content.toLowerCase().match(/\bchoco\b/i) || m.content.toLowerCase().match(/\bchoc\b/i)) {
        var member = m.channel.guild.members.get('161027274764713984');
        var present = member.id || false;
        if (present !== '161027274764713984') {
            return;
        }
        if (m.author.id === '161027274764713984' || m.author.id === '309220487957839872') {
            return;
        }
        Bot.getDMChannel('161027274764713984').then(function(DMchannel) {
            Bot.createMessage(DMchannel.id, `You were mentioned in <#${m.channel.id}> by <@${m.author.id}>. Message: <https://discordapp.com/channels/${m.channel.guild.id}/${m.channel.id}/${m.id}>`).then((msg) => {
                Bot.createMessage(DMchannel.id, m.content);
            }).catch((err) => {
                if (err.code == 50007) {
                    return;
                }
                console.log(err)
            })
        });
    }
    if (m.author.id === '161027274764713984' && m.content.includes('pls')) {
        if (m.content.includes('stop')) {
            Bot.createMessage(m.channel.id, `Let me rest my eyes for a moment`).then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, m.id, 'Timeout')
                    Bot.deleteMessage(m.channel.id, msg.id, 'Timeout').then(() => {
                        process.exit(0)
                    })
                }, 1500)
            })
        }
        if (m.content.includes('override')) {
            send(m.channel.id, 'Chocola Recognized. Permission overrides engaged. I am at your service~', 2000)
        }
    }
    updateTimestamps()
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
                            return setTimeout(function() { Bot.deleteMessage(m.channel.id, m.id, 'Timeout') }, 5000)
                        })
                    })
                }
                return;
            }
            Bot.addGuildMemberRole(m.channel.guild.id, m.mentions[0].id, '363854631035469825', 'Daddy said shush').then(() => {
                return Bot.createMessage(m.channel.id, hand).then((m) => {
                    return setTimeout(function() { Bot.deleteMessage(m.channel.id, m.id, 'Timeout') }, 5000)
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
                            return setTimeout(function() { Bot.deleteMessage(m.channel.id, m.id, 'Timeout') }, 5000)
                        })
                    })
                }
                return;
            }
            Bot.removeGuildMemberRole(m.channel.guild.id, m.mentions[0].id, '363854631035469825', 'Daddy said speak').then(() => {
                return Bot.createMessage(m.channel.id, hand).then((m) => {
                    return setTimeout(function() { Bot.deleteMessage(m.channel.id, m.id, 'Timeout') }, 5000)
                })
            })
        }
    }
    if (m.channel.guild.id === '196027622944145408' && m.content.startsWith(`${prefix}play`)) {
        return;
    }
    updateTimestamps()
    var loguser = `${m.author.username}#${m.author.discriminator}`.magenta.bold;
    var logserver = `${m.channel.guild.name}`.cyan.bold || 'Direct Message'.cyan.bold
    var logchannel = `#${m.channel.name}`.green.bold;
    var logdivs = [' > '.blue.bold, ' - '.blue.bold];
    var commands = fs.readdirSync('./commands/');
    updateTimestamps()
    if (m.content.startsWith(prefix)) {
        var command = m.content.split(' ')[0].replace(prefix, '').toLowerCase();
        if (commands.indexOf(command + '.js') > -1) {
            var data = _.load(); // Track command usage in ../db/data.json
            updateTimestamps()
            data.commands.totalRuns++
            if (!(data.commands[command])) {
                data.commands[command] = {};
                data.commands[command].totalUses = 0
                data.commands[command].users = {}
            }
            if (!(data.commands[command].users[m.author.id])) {
                data.commands[command].users[m.author.id] = 0
            }
            data.commands[command].users[m.author.id]++
            data.commands[command].totalUses++
            updateTimestamps()
            _.save(data);
            updateTimestamps()
            const commandContents = fs.readFileSync('./commands/' + command + '.js')
            if (commandContentsMap[command] !== commandContents) {
                var cmd = reload('./commands/' + command + '.js');
                commandContentsMap[command] = commandContents
            } else {
                var cmd = require('./commands/' + command + '.js')
            }
            updateTimestamps()
            var args = m.content.replace(/\[\?\]/ig, '').split(' ');
            args.splice(0, 1);
            args = args.join(' ');
            var logcmd = `${prefix}${command}`.bold;
            var logargs = `${args}`.bold;
            try {
                updateTimestamps()
                timestamps.pop()
                fs.appendFileSync('db/timestamps.txt', timestamps.reduce((a, b) => a + b) + 'ms | ' + timestamps.join(', ') + '\n');
                console.log('CMD'.black.bgGreen + ' ' + loguser + logdivs[1] + logserver + logdivs[0] + logchannel + ' ' + logcmd.blue);
                if (args) {
                    console.log('ARG'.black.bgCyan + ' ' + logargs.blue.bold);
                }
                cmd.main(Bot, m, args, prefix);
            } catch (err) {
                console.log(err);
                Bot.createMessage(m.channel.id, 'An error has occured.');
                console.log('CMD'.black.bgRed + ' ' + loguser + logdivs[1] + logserver + logdivs[0] + logchannel + ' ' + logcmd.red);
                if (args) {
                    console.log('ARG'.black.bgCyan + ' ' + logargs.red.bold);
                }
                console.log('');
            }
        }
    }
});

Bot.on('guildMemberAdd', async function(guild, member) {
    var server = servers.load();
    var prefix = config[prefix];
    if (server[guild.id] && server[guild.id].prefix) {
        prefix = server[guild.id];
    }
    var name = guild[name];
    var count = guild.memberCount - guild.members.filter(m => m.bot).length;
    var date = member.joinedAt;
    var date2 = member.createdAt;
    var name = member.nick || member.username;
    var diff = timediff(date2, date, 'D');
    if (server[guild.id]) {
        if (server[guild.id].notifications) {
            if (server[guild.id].notifications.updates) {
                var channel = server[guild.id].notifications.updates;
                Bot.createMessage(channel, {
                    embed: {
                        color: 0xA260F6,
                        title: `${member.username} (${member.id}) joined ${guild.name}\nWe now have: ${count} people! :smiley:`,
                        timestamp: new Date().toISOString(),
                        author: {
                            name: member.username,
                            icon_url: member.avatarURL
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                });
                if (diff.days < 2) {
                    Bot.createMessage(channel, `:warning: **${name}** Joined less than 24 hours after creating their account`).catch((err) => {
                        console.log(err)
                    });
                }
            }
            if (server[guild.id].notifications.welcome) {
                var channel = Object.keys(server[guild.id].notifications.welcome)[0];
                var message = server[guild.id].notifications.welcome[channel];
                message = message.replace('[name]', `${member.username}`).replace('[user]', `${member.username}#${member.discriminator}`).replace('[server]', `${guild.name}`).replace('[mention]', `${member.mention}`).replace('[count]', `${guild.memberCount - guild.members.filter(m => m.bot).length}`);
                if (channel && message) {
                    Bot.createMessage(channel, message).catch((err) => {
                        console.log(err)
                    });
                }
            }
        }
    }
});

Bot.on('guildMemberRemove', async function(guild, member) {
    var server = servers.load();
    var count = guild.memberCount - guild.members.filter(m => m.bot).length
    if (server[guild.id]) {
        if (server[guild.id].notifications) {
            if (server[guild.id].notifications.updates) {
                var channel = server[guild.id].notifications.updates
                Bot.createMessage(channel, {
                    embed: {
                        color: 0xA260F6,
                        title: `${member.username} (${member.id}) left ${guild.name}\nWe now have: ${count} people! :frowning2:`,
                        timestamp: new Date().toISOString(),
                        author: {
                            name: member.username,
                            icon_url: member.avatarURL
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                });
            }
            if (server[guild.id].notifications.leave) {
                var channel = Object.keys(server[guild.id].notifications.leave)[0];
                var message = server[guild.id].notifications.leave[channel];
                message = message.replace('[name]', `${member.username}`).replace('[user]', `${member.username}#${member.discriminator}`).replace('[server]', `${guild.name}`).replace('[mention]', `${member.mention}`).replace('[count]', `${guild.memberCount - guild.members.filter(m => m.bot).length}`);
                Bot.createMessage(channel, message).catch((err) => {
                    console.log(err)
                });
            }
        }
    }
});

Bot.on('guildCreate', async function(guild) {
    Bot.getDMChannel('161027274764713984').then(function(DMchannel) {
        Bot.createMessage(DMchannel.id, {
            embed: {
                color: 0xA260F6,
                title: 'I was invited to the guild: ' + guild.name + '(' + guild.id + ')\nI am now in ' + Bot.guilds.size + ' guilds',
                timestamp: new Date().toISOString(),
                author: {
                    name: guild.name,
                    icon_url: guild.iconURL
                }
            }
        });
    }).catch((err) => {
        if (err.code == 50007) {
            return;
        }
        console.log(err)
    });
});

Bot.on('guildDelete', async function(guild) {
    Bot.getDMChannel('161027274764713984').then(function(DMchannel) {
        Bot.createMessage(DMchannel.id, {
            embed: {
                color: 0xA260F6,
                title: 'I was removed from the guild: ' + guild.name + '(' + guild.id + ')\nI am now in ' + Bot.guilds.size + ' guilds',
                timestamp: new Date().toISOString(),
                author: {
                    name: guild.name,
                    icon_url: guild.iconURL
                }
            }
        });
    }).catch((err) => {
        if (err.code == 50007) {
            return;
        }
        console.log(err)
    });
});

Bot.on('messageReactionAdd', async function(m, emoji, userID) {
    var server = servers.load();
    var id = userID;
    var m = await Bot.getMessage(m.channel.id, m.id).then(async (m) => {
        if (emoji.name === '😍') {
            if (m.attachments.length === 0 && m.embeds.length === 0) {
                var link = m.cleanContent;
            }
            else if (m.attachments[0] && m.attachments.length !== 0) {
                if (m.attachments.length === 1) {
                    var link = m.attachments[0].url
                }
                else if (m.attachments.length > 1) {
                    var i = 0
                    var links = [];
                    for (var attachment of m.attachments) {
                        if (attachment.url) {
                            links.push(attachment.url);
                        }
                    }
                }
            }
            else if (m.embeds[0]) {
                if (m.embeds[0].image) {
                    var link = m.embeds[0].image.url
                }
            }
            if (link || (links && links[0])) {
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
                    if (links && links[0]) {
                        for (var link of links) {
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
                                        Bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${Number(people.people[m.author.id].adds)} hoard adds.`).then((m) => {
                                            return setTimeout(function() { Bot.deleteMessage(m.channel.id, m.id, 'Timeout') }, 60000);
                                        }).catch((err) => {
                                            console.log(err)
                                        });
                                    }
                                }
                            }
                        }
                        return;
                    }
                    if (!hoard[link] && !(links && links[0])) {
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
                                Bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${Number(people.people[m.author.id].adds)} hoard adds.`).then((m) => {
                                    return setTimeout(function() { Bot.deleteMessage(m.channel.id, m.id, 'Timeout') }, 60000)
                                }).catch((err) => {
                                    console.log(err)
                                });
                            }
                        }
                        return;
                    }
                }
            }
        }
        if (server[m.channel.guild.id]) {
            if (server[m.channel.guild.id].giveaways) {
                if (server[m.channel.guild.id].giveaways.running && emoji.id === '367892951780818946' && userID !== '309220487957839872' && userID !== server[m.channel.guild.id].giveaways.creator) {
                    if (m.id === server[guild.id].giveaways.mID) {
                        server[m.channel.guild.id].giveaways.current.contestants[userID] = 'entered'
                        servers.save(server);
                        return;
                    }
                }
            }
            var people = ppl.load();
            if (server[m.channel.guild.id].hoards !== false && emoji.name !== '😍') {
                if (people.people[id] && people.people[id].hoard && people.people[id].hoard[emoji.name]) {
                    var m = await Bot.getMessage(m.channel.id, m.id).then((m) => {
                        if (m.attachments.length === 0 && m.embeds.length === 0) {
                            var link = m.cleanContent
                        }
                        else if (m.attachments[0] && m.attachments.length !== 0) {
                            if (m.attachments.length === 1) {
                                var link = m.attachments[0].url
                            }
                            else if (m.attachments.length > 1) {
                                var i = 0
                                var links = [];
                                for (var attachment of m.attachments) {
                                    if (attachment.url) {
                                        links.push(attachment.url);
                                    }
                                }
                            }
                        }
                        else if (m.embeds[0] && m.embeds[0].image) {
                            var link = m.embeds[0].image.url
                        }
                        if (link || (links && links[0])) {
                            var people = ppl.load();
                            var hoard = people.people[id].hoard[emoji.name]
                            if (hoard) {
                                if (links && links[0]) {
                                    for (var link of links) {
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
                                                    Bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${Number(people.people[m.author.id].adds)} hoard adds.`).then((m) => {
                                                        return setTimeout(function() { Bot.deleteMessage(m.channel.id, m.id, 'Timeout') }, 60000);
                                                    }).catch((err) => {
                                                        console.log(err)
                                                    });
                                                }
                                            }
                                        }
                                    }
                                    return;
                                }
                                if (!hoard[link] && !(links && links[0])) {
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
                                            Bot.createMessage(m.channel.id, `${user.username} #${user.discriminator} reached ${Number(people.people[m.author.id].adds)} hoard adds.`).then((m) => {
                                                return setTimeout(function() { Bot.deleteMessage(m.channel.id, m.id, 'Timeout') }, 60000)
                                            }).catch((err) => {
                                                console.log(err)
                                            });
                                        }
                                    }
                                    return;
                                }
                            }
                        }
                    })
                }
            }
        }
    }).catch((err) => {
        console.log(err)
    });
});

Bot.on('messageReactionRemove', async function(m, emoji, userID) {
    var server = servers.load();
    var m = await Bot.getMessage(m.channel.id, m.id).then(async (m) => {
        var id = userID
        var data = _.load();
        var people = ppl.load();
        if (emoji.name === '😍') {
            if (m.attachments.length === 0 && m.embeds.length === 0) {
                var link = m.cleanContent;
            }
            else if (m.attachments[0] && m.attachments.length !== 0) {
                if (m.attachments.length === 1) {
                    var link = m.attachments[0].url
                }
                else if (m.attachments.length > 1) {
                    var i = 0
                    var links = [];
                    for (var attachment of m.attachments) {
                        if (attachment.url) {
                            links.push(attachment.url);
                        }
                    }
                }
            }
            else if (m.embeds[0]) {
                if (m.embeds[0].image) {
                    var link = m.embeds[0].image.url;
                }
            }
            if (people.people[id]) {
                if (people.people[id].hoard) {
                    var hoard = people.people[id].hoard['😍'];
                }
            }
            if (hoard) {
                if (links && links[0]) {
                    for (var link of links) {
                        hoard = people.people[id].hoard[emoji.name]
                        if (hoard[link]) {
                            delete hoard[link];
                            ppl.save(people);
                            people = ppl.load();
                            if (people.people[m.author.id]) {
                                if (!people.people[m.author.id].adds) {
                                    people.people[m.author.id].adds = 0;
                                }
                                ppl.save(people);
                                people = ppl.load();
                            }
                            if (m.author.id !== id) {
                                people.people[m.author.id].adds--;
                                ppl.save(people);
                            }
                        }
                    }
                    return;
                }
                if (hoard[link] && !(links && links[0])) {
                    delete hoard[link];
                    ppl.save(people);
                    people = ppl.load();
                    if (people.people[m.author.id]) {
                        if (!people.people[m.author.id].adds) {
                            people.people[m.author.id].adds = 0;
                        }
                        ppl.save(people);
                        people = ppl.load();
                    }
                    if (m.author.id !== id) {
                        people.people[m.author.id].adds--;
                        ppl.save(people);
                    }
                }
                return;
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
            var people = ppl.load();
            if (server[m.channel.guild.id].hoards !== false && emoji.name !== '😍') {
                if (!people.people[id]) {
                    return;
                }
                if (!people.people[id].hoard) {
                    return;
                }
                if (people.people[id].hoard[emoji.name]) {
                    var m = await Bot.getMessage(m.channel.id, m.id).then(async (m) => {
                        if (m.attachments.length === 0 && m.embeds.length === 0) {
                            var link = m.cleanContent
                        }
                        else if (m.attachments[0] && m.attachments.length !== 0) {
                            if (m.attachments.length === 1) {
                                var link = m.attachments[0].url
                            }
                            else if (m.attachments.length > 1) {
                                var i = 0
                                var links = [];
                                for (var attachment of m.attachments) {
                                    if (attachment.url) {
                                        links.push(attachment.url);
                                    }
                                }
                            }
                        }
                        else if (m.embeds[0]) {
                            var link = m.embeds[0].image.url
                        }
                        var hoard = people.people[id].hoard[emoji.name]
                        if (hoard) {
                            if (links && links[0]) {
                                for (var link of links) {
                                    hoard = people.people[id].hoard[emoji.name]
                                    if (hoard[link]) {
                                        delete hoard[link];
                                        ppl.save(people);
                                        if (people.people[m.author.id]) {
                                            if (!people.people[m.author.id].adds) {
                                                people.people[m.author.id].adds = 0;
                                            }
                                            ppl.save(people);
                                            people = ppl.load();
                                        }
                                        if (m.author.id !== id) {
                                            people.people[m.author.id].adds--;
                                            ppl.save(people);
                                        }
                                    }
                                }
                                return;
                            }
                            if (hoard[link] && !(links && links[0])) {
                                delete hoard[link];
                                ppl.save(people);
                                people = ppl.load();
                                if (people.people[m.author.id]) {
                                    if (!people.people[m.author.id].adds) {
                                        people.people[m.author.id].adds = 0;
                                    }
                                    ppl.save(people);
                                    people = ppl.load();
                                }
                                if (m.author.id !== id) {
                                    people.people[m.author.id].adds--;
                                    ppl.save(people);
                                }
                            }
                            return;
                        }
                    })
                }
            }
        }
    }).catch((err) => {
        console.log(err)
    });
});

Bot.connect();
