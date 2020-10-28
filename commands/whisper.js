"use strict";
const whispersdb = require("../whispers");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var data = await whispersdb.load();

        var name1 = m.cleanContent.replace(prefix, "").replace(/whispers /i, "");
        var hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"];
        var hand = hands[Math.floor(Math.random() * hands.length)];
        if (args.search(/remove /i) !== -1) {
            let incomingEntries = name1.replace(/remove /i, "").replace(": ", " ").split(" | ");
            let iterator = incomingEntries.entries();
            for (let e of iterator) {
                if (!data[e[1]]) {
                    data[e[1]] = {};
                }
                if (!data[e[1]][m.guild.id]) {
                    data[e[1]][m.guild.id] = [];
                }
                if (data[e[1]][m.guild.id][m.author.id]) {
                    delete data[e[1]][m.guild.id][m.author.id];
                    await whispersdb.save(data);
                    bot.createMessage(m.channel.id, "Removed: **" + e[1] + "** from your whispers" + hand).then(function(msg) {
                        return setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
                else {
                    bot.createMessage(m.channel.id, "Sorry, I couldn't find **" + e[1] + "** in your whispers").then(function(msg) {
                        return setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
            }
            return;
        }
        if (args.search(/add /i) !== -1) {
            let incomingEntries = name1.replace(/add /i, "").replace(": ", " ").split(" | ");
            let iterator = incomingEntries.entries();
            for (let e of iterator) {
                if (!data[e[1]]) {
                    data[e[1]] = {};
                }
                if (!data[e[1]][m.guild.id]) {
                    data[e[1]][m.guild.id] = [];
                }
                if (data[e[1]][m.guild.id][m.author.id]) {
                    bot.createMessage(m.channel.id, e[1] + "'s already been added, silly~").then(function(msg) {
                        return setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    continue;
                }
                else {
                    data[e[1]][m.guild.id].push(m.author.id)
                    await whispersdb.save(data);
                    bot.createMessage(m.channel.id, "Added **" + e[1] + "** " + hand).then(function(msg) {
                        return setTimeout(function() {
                            bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
            }
            return;
        }
        for (var whisper in whispers) {
            if (data[e[1]][m.guild.id][m.author.id]) {
                bot.createMessage(m.channel.id, "I could find any whispers for **" + name + "** :(");
                return;
            }
            else {
                var whispers = data.people[id].whispers;
                Object.entries(whispers).forEach(function(key) {
                    nameArray.push(`${key[0]}: ${key[1]}`);
                });
                bot.createMessage(m.channel.id, {
                    embed: {
                        color: 0xA260F6,
                        title: Object.keys(data.people[id].whispers).length + " whispers used by **" + name + "**",
                        description: " \n" + nameArray.join("\n"),
                        author: {
                            name: name,
                            icon_url: mentioned.avatarURL
                        }
                    }
                });
            }
        }

    },
    help: "Create whispers to be notified when they are said"
};
