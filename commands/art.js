"use strict";

const serversdb = require("../servers");

const { isNum, toNum, chooseHand } = require("../misc");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var guildsdata = await serversdb.load();

        var guild = m.channel.guild;
        if (!guildsdata[guild.id]) {
            guildsdata[guild.id] = {};
            guildsdata[guild.id].name = guild.name;
            guildsdata[guild.id].owner = guild.ownerID;
            bot.createMessage(m.channel.id, `Server: ${guild.name} added to database. Populating information ${chooseHand()}`).then(function(msg) {
                return setTimeout(function() {
                    bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                }, 5000);
            });
            await serversdb.save(guildsdata);
        }
        if (!guildsdata[guild.id].art) {
            bot.createMessage(m.channel.id, `An art channel has not been set up for this server. Please have a mod add one using the command: \`${prefix}edit art add #channel\``).then(function(msg) {
                return setTimeout(function() {
                    bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    bot.deleteMessage(m.channel.id, m.id, "Timeout");
                }, 10000);
            });
            return;
        }
        var index = 5000;
        if (isNum(args)) {
            index = toNum(args);
        }
        var channel = guildsdata[guild.id].art;
        channel = bot.getChannel(channel);
        if (guildsdata[guild.id].art && !channel) {
            bot.createMessage(m.channel.id, `The selected art channel, <#${guildsdata[guild.id].art}>, has either been deleted, or I no longer have access to it. Please set the art channel to an existing channel that I have access to.`).then(function(msg) {
                return setTimeout(function() {
                    bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    bot.deleteMessage(m.channel.id, m.id, "Timeout");
                }, 15000);
            });
            return;
        }
        var cName = channel.name;
        var gName = channel.guild.name;
        var icon = channel.guild.iconURL || null;
        if (channel.nsfw && !m.channel.nsfw) {
            bot.createMessage(m.channel.id, `The selected art channel, <#${channel.id}>, is an nsfw channel, and this channel is not. Please either use this command in an nsfw channel, or set the art channel to a non-nsfw channel`).then(function(msg) {
                return setTimeout(function() {
                    bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    bot.deleteMessage(m.channel.id, m.id, "Timeout");
                }, 10000);
            });
            return;
        }
        channel = channel.id;
        if (index > 7000) {
            bot.createMessage(m.channel.id, "I can't grab more than 7000 messages in any channel. Setting limit to 7000").then(function(msg) {
                return setTimeout(function() {
                    bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                }, 5000);
            });
            index = 7000;
        }
        await bot.sendChannelTyping(m.channel.id);
        var msgs = await bot.getMessages(channel, parseInt(index, 10));
        var art = {};
        for (var msg of msgs) {
            if (msg.content.includes("pastebin.com")) {
                art[msg.content] = [msg.author.id, msg.timestamp];
            }
            if (msg.attachments[0]) {
                art[msg.attachments[0].url] = [msg.author.id, msg.timestamp];
            }
            if (msg.embeds[0]) {
                if (msg.embeds[0].image) {
                    art[msg.embeds[0].image.url] = [msg.author.id, msg.timestamp];
                }
                if (!msg.embeds[0].image) {
                    art[msg.embeds[0].url] = [msg.author.id, msg.timestamp];
                }
            }
        }
        var number = Math.floor(Math.random() * Object.entries(art).length);
        var list = Object.entries(art);
        var chosen = list[number];
        console.log(chosen);
        if (!chosen) {
            bot.createMessage(m.channel.id, `No art was found within the last \`${index}\` messages. Please try again using more messages`).then(function(msg) {
                return setTimeout(function() {
                    bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    bot.deleteMessage(m.channel.id, m.id, "Timeout");
                }, 5000);
            });
            return;
        }
        var author = m.channel.guild.members.get(chosen[1][0]) || m.channel.guild.members.get(chosen[1][0]) || bot.users.get(chosen[1][0]);
        var url = author.avatarURL || undefined;
        author = author.nick || author.username;
        var time = new Date(chosen[1][1]).toISOString();
        if (chosen[0].includes("pastebin.com")) {
            const data = {
                "embed": {
                    "color": 0xA260F6,
                    "title": chosen[0],
                    "description": `A random piece from <#${channel}>~`,
                    "url": chosen[0],
                    "timestamp": time,
                    "author": {
                        "name": author,
                        "icon_url": url
                    },
                    "footer": {
                        "icon_url": icon,
                        "text": `${cName} | ${gName}`
                    }
                }
            };
            bot.createMessage(m.channel.id, data);
            return;
        }
        else {
            const data = {
                "embed": {
                    "color": 0xA260F6,
                    "timestamp": time,
                    "description": `A random piece from <#${channel}>~`,
                    "image": {
                        "url": chosen[0]
                    },
                    "author": {
                        "name": author,
                        "icon_url": url
                    },
                    "footer": {
                        "icon_url": icon,
                        "text": `${cName} | ${gName}`
                    }
                }
            };
            bot.createMessage(m.channel.id, data);
        }
        return;
    },
    help: "Show art from the set art channel" // add description
};
