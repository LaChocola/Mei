"use strict";

const utils = require("../utils");
const dbs = require("../dbs");

var userDb = dbs.user.load();

module.exports = {
    main: function(Bot, m, args, prefix) {
        var name1 = m.cleanContent.replace(prefix, "").replace(/names /i, "");

        function capFirstLetter(string) {
            return string.trim().charAt(0).toUpperCase() + string.slice(1);
        }
        var member = m.guild.members.find(m => utils.isSameMember(m, name1));
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        var nameArray = [];
        var id = mentioned.id;
        if (!userDb.people[id]) {
            userDb.people[id] = {};
        }
        if (!userDb.people[id].names) {
            userDb.people[id].names = {};
        }
        if (args.search(/remove /i) !== -1) {
            if (mentioned.id != m.author.id) {
                Bot.createMessage(m.channel.id, "Okay....but that isnt you");
                return;
            }
            var incomingEntries = name1.replace(/remove /i, "").replace(": ", " ").split(" | ");
            var iterator = incomingEntries.entries();
            for (let e of iterator) {
                e[1] = capFirstLetter(e[1]);
                if (userDb.people[id].names[e[1]]) {
                    delete userDb.people[id].names[e[1]];
                    dbs.user.save(userDb);
                    Bot.createMessage(m.channel.id, "Removed: **" + e[1] + "** from your names list" + utils.hands.ok()).then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                }
                else {
                    Bot.createMessage(m.channel.id, "Sorry, I couldnt find **" + e[1] + "** in your names list");
                }
            }
            return;
        }
        if (args.search(/add /i) !== -1) {
            if (mentioned.id != m.author.id) {
                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                Bot.createMessage(m.channel.id, "Okay....but that isnt you");
                return;
            }
            incomingEntries = name1.replace(/add /i, "").replace(": ", " ").split(" | ");
            iterator = incomingEntries.entries();
            for (let e of iterator) {
                e[1] = capFirstLetter(e[1]);
                if (userDb.people[id].names[e[1]]) {
                    Bot.createMessage(m.channel.id, e[1] + "'s already been added, silly~").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    continue;
                }
                else {
                    if (e[1].search(/ male/i) !== -1) {
                        var cleanName = e[1].replace(/ male/i, "");
                        userDb.people[id].names[cleanName] = "male";
                        dbs.user.save(userDb);
                        Bot.createMessage(m.channel.id, "Added **" + cleanName + "** " + utils.hands.ok()).then((msg) => {
                            return setTimeout(function() {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        continue;
                    }
                    if (e[1].search(/ futa/i) !== -1 || e[1].search(/ futanari/i) !== -1) {
                        cleanName = e[1].replace(/ futa/i, "").replace(/ futanari/i, "");
                        userDb.people[id].names[cleanName] = "futa";
                        dbs.user.save(userDb);
                        Bot.createMessage(m.channel.id, "Added **" + cleanName + "** " + utils.hands.ok()).then((msg) => {
                            return setTimeout(function() {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                        continue;
                    }
                    else {
                        userDb.people[id].names[e[1]] = "female";
                        dbs.user.save(userDb);
                        Bot.createMessage(m.channel.id, "Added **" + e[1] + "** " + utils.hands.ok()).then((msg) => {
                            return setTimeout(function() {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            }, 5000);
                        });
                    }
                }
            }
            return;
        }
        if (Object.keys(userDb.people[id].names).length < 1) {
            Bot.createMessage(m.channel.id, "I could find any names list for **" + name + "** :(");
            return;
        }
        else {
            var names = userDb.people[id].names;
            Object.entries(names).forEach(function(key) {
                nameArray.push(`${key[0]}: ${key[1]}`);
            });
            Bot.createMessage(m.channel.id, {
                embed: {
                    color: 0xA260F6,
                    title: Object.keys(userDb.people[id].names).length + " names used by **" + name + "**",
                    description: " \n" + nameArray.join("\n"),
                    author: {
                        name: name,
                        icon_url: mentioned.avatarURL
                    }
                }
            });
        }

    },
    help: "Add custom names for !v, !g and !tf"
};
