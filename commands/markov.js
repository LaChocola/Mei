"use strict";

const MarkovGen = require("markov-generator");
const ids = require("../ids");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var time = new Date().toISOString();
        var name1 = m.cleanContent.replace(`${prefix}markov `, "");
        if (m.content.length < 8) {
            name1 = m.author.username;
        }
        if (m.channelMentions.length > 0) {
            var channelName = " #" + m.channel.guild.channels.get(m.channelMentions[0]).name;
            name1 = name1.replace(channelName, "");
        }
        function isThisUsernameThatUsername(member) {
            var memberName = member.nick || member.username;
            if (memberName.toLowerCase() === name1.toLowerCase()) {
                return true;
            }
        }
        var member = m.guild.members.find(isThisUsernameThatUsername);
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        var channel = m.channelMentions[0] || m.channel.id;
        var channelFull = bot.getChannel(channel);
        if (channelFull.permissionsOf(m.author.id).json.readMessages !== true) {
            bot.createMessage(m.channel.id, "You do not have permission to read that channel, please try a different one.").then(function(msg) {
                return setTimeout(function() {
                    bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                }, 5000);
            });
            return;
        }
        if (channelFull.permissionsOf(bot.user.id).json.readMessages !== true) {
            bot.createMessage(m.channel.id, "I do not have permission to read that channel, please try a different one.").then(function(msg) {
                return setTimeout(function() {
                    bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                }, 5000);
            });
            return;
        }
        var amount = 7000;
        bot.createMessage(m.channel.id, "Indexing " + amount + " messages from **" + name + "** in *" + m.channel.guild.channels.get(channel).name + "*, Please wait.").then(function(msg) {
            setTimeout(function() {
                msg.delete();
            }, 10000);
        });
        await bot.sendChannelTyping(m.channel.id);
        let messages = await bot.getMessages(channel, amount);
        messages = messages.filter(msg => msg.author.id === mentioned.id && !msg.content.startsWith(prefix) && !msg.content.includes("<@") && !msg.content.includes("http")).map(msg => msg.content);
        if (messages.length < 5) {
            bot.createMessage(m.channel.id, "That user does not have enough messages to make a markov").then(function(msg) {
                return setTimeout(function() {
                    bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                }, 5000);
            });
            return;
        }
        let markov = new MarkovGen({
            input: messages,
            minLength: 6
        });
        var sentence = await markov.makeChain(); 
        if (!messages || !sentence) {
            bot.createMessage(m.channel.id, "Sorry, I couldn't find any messages from **" + mentioned.username + "** in `" + m.channel.name + "`").then(function(msg) {
                return setTimeout(function() {
                    bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                }, 5000);
            });
            return;
        }
        if (sentence.length > 256) {
            bot.createMessage(m.channel.id, `Your markov is \`${sentence.length - 256}\` characters too long to send, please try running ${prefix} markov again.`).then(function(msg) {
                return setTimeout(function() {
                    bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    bot.deleteMessage(m.channel.id, m.id, "Timeout");
                }, 10000);
            });
        }
        if (m.channel.guild.id === ids.guilds.guild1 && m.mentions[0].id === ids.users.catclancer) {
            bot.createMessage(m.channel.id, `"${sentence}"\n    -${name} ${new Date().getFullYear()}`);
            return;
        }
        bot.createMessage(m.channel.id, {
            embed: {
                color: 0xA260F6,
                description: "\n \"" + sentence + "\"",
                timestamp: time,
                author: {
                    name: name,
                    icon_url: mentioned.avatarURL
                },
                footer: {
                    text: `-${name} ${new Date().getFullYear()}`
                }
            }
        });
    },
    help: "Markov maker"
};
