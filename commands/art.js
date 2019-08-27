"use strict";

const _ = require("../servers.js");
var data = _.load();
const hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"];
const hand = hands[Math.floor(Math.random() * hands.length)];

module.exports = {
    main: function(Bot, m, args, prefix) {
        var guild = m.channel.guild
        if (!data[guild.id]) {
            data[guild.id] = {}
            data[guild.id].name = guild.name
            data[guild.id].owner = guild.ownerID
            Bot.createMessage(m.channel.id, `Server: ${guild.name} added to database. Populating information ${hand}`).then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                }, 5000)
            })
            _.save(data)
            _.load()
        }
        if (!data[guild.id].art) {
            Bot.createMessage(m.channel.id, `An art channel has not been set up for this server. Please have a mod add one using the command: \`${prefix}edit art add #channel\``).then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                }, 10000)
            })
            return;
        }
        var index = 5000
        if (args) {
            if (!isNaN(+args)) {
                index = args
            }
        }
        var channel = data[guild.id].art
        channel = Bot.getChannel(channel)
        console.log(channel.nsfw);
        console.log(m.channel.nsfw);
        var cName = channel.name
        var gName = channel.guild.name
        var icon = channel.guild.iconURL || null
        if (channel.nsfw && !m.channel.nsfw) {
            Bot.createMessage(m.channel.id, `The selected art channel, <#${channel.id}>, is an nsfw channel, and this channel is not. Please either use this command in an nsfw channel, or set the art channel to a non-nsfw channel`).then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                }, 10000)
            })
            return;
        }
        channel = channel.id
        if (index > 7000) {
            Bot.createMessage(m.channel.id, "I can't grab more than 7000 messages in any channel. Setting limit to 7000").then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                }, 5000)
            })
            index = 7000
        }
        Bot.sendChannelTyping(m.channel.id).then(async () => {
            Bot.getMessages(channel, parseInt(index)).then(function(msgs) {
                var art = {}
                for (var msg of msgs) {
                    if (msg.content.includes("pastebin.com")) {
                        art[msg.content] = [msg.author.id, msg.timestamp]
                    }
                    if (msg.attachments[0]) {
                        art[msg.attachments[0].url] = [msg.author.id, msg.timestamp]
                    }
                    if (msg.embeds[0]) {
                        if (msg.embeds[0].image) {
                            art[msg.embeds[0].image.url] = [msg.author.id, msg.timestamp]
                        }
                        if (!msg.embeds[0].image) {
                            art[msg.embeds[0].url] = [msg.author.id, msg.timestamp]
                        }
                    }
                }
                var number = Math.floor(Math.random() * Object.entries(art).length);
                var list = Object.entries(art)
                var chosen = list[number]
                console.log(chosen);
                if (!chosen) {
                    Bot.createMessage(m.channel.id, `No art was found within the last \`${index}\` messages. Please try again using more messages`).then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        }, 5000)
                    })
                    return;
                }
                var author = m.channel.guild.members.get(chosen[1][0]) || m.channel.guild.members.get(chosen[1][0]) || Bot.users.get(chosen[1][0])
                var url = author.avatarURL || undefined
                author = author.nick || author.username
                var time = new Date(chosen[1][1]).toISOString()
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
                    Bot.createMessage(m.channel.id, data);
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
                    Bot.createMessage(m.channel.id, data);
                }
            });
        });
        return;
    },
    help: "Show art from the set art channel" // add description
}
