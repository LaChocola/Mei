"use strict";

const MarkovGen = require("markov-generator");

const conf = require("../conf");
const utils = require("../utils");

module.exports = {
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
        var member = m.guild.members.find(m => utils.isSameMember(m, name1));
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        var channel = m.channelMentions[0] || m.channel.id;
        var channelFull = bot.getChannel(channel);
        if (channelFull.permissionsOf(m.author.id).json.readMessages != true) {
            m.reply("You do not have permission to read that channel, please try a different one.", 5000);
            return;
        }
        if (channelFull.permissionsOf(m.bot.user.id).json.readMessages != true) {
            m.reply("I do not have permission to read that channel, please try a different one.", 5000);
            return;
        }
        var amount = 7000;
        m.reply("Indexing " + amount + " messages from **" + name + "** in *" + m.channel.guild.channels.get(channel).name + "*, Please wait.").then(a => {
            setTimeout(function() {
                a.delete();
            }, 10000);
        });
        m.channel.sendTyping().then(async () => {
            let messages = await bot.getMessages(channel, amount);
            messages = messages.filter(msg => msg.author.id === mentioned.id && !msg.content.startsWith(prefix) && !msg.content.includes("<@") && !msg.content.includes("http")).map(msg => msg.content);
            if (messages.length < 5) {
                m.reply("That user does not have enough messages to make a markov", 5000);
                return;
            }
            let markov = new MarkovGen({
                input: messages,
                minLength: 6
            });
            var sentence = markov.makeChain();
            if (!messages || !sentence) {
                m.reply("Sorry, I couldn't find any messages from **" + mentioned.username + "** in `" + m.channel.name + "`", 5000);
                return;
            }
            if (m.channel.guild.id === conf.guilds.guild1 && m.mentions[0].id === conf.users.catclancer) {
                m.reply(`"${sentence}"\n    -${name} 2018`);
                return;
            }
            m.reply({
                embed: {
                    color: 0xA260F6,
                    title: "\n \"" + sentence + "\"",
                    timestamp: time,
                    author: {
                        name: name,
                        icon_url: mentioned.avatarURL
                    },
                    footer: {
                        text: "-" + name + " 2018"
                    }
                }
            });
        });
    },
    help: "Markov maker"
};
