"use strict";

const escapeStringRegexp = require("escape-string-regexp");

const peopledb = require("../people");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        var data = await peopledb.load();

        var name1 = m.cleanContent.replace(new RegExp(escapeStringRegexp(prefix) + "artist ", "i"), "");
        function isThisUsernameThatUsername(member) {
            var memberName = member.nick || member.username;
            if (memberName.toLowerCase() === name1.toLowerCase()) {
                return true;
            }
        }
        var member = m.guild.members.find(isThisUsernameThatUsername);
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        var linkArray = [];
        var id = mentioned.id;
        var hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"];
        var hand = hands[Math.floor(Math.random() * hands.length)];
        if (!data.people[id]) {
            data.people[id] = {};
            data.people[id].links = {};
        }
        if (!data.people[id].links) {
            data.people[id].links = {};
        }

        if (args.toLowerCase().includes("add ")) {
            if (mentioned.id !== m.author.id) {
                Bot.createMessage(m.channel.id, "Okay....but that isn't you").then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
            let split1 = name1.replace(/add /i, "").replace(": ", " ").split(" ");
            let split2 = name1.replace(/add /i, "").replace(": ", " ").split(" | ");
            let incoming = split1;
            if (split2.length > 1 && (split1.length > split2.length)) {
                incoming = split2;
            }
            if (data.people[id].links[incoming[0]]) {
                Bot.createMessage(m.channel.id, incoming[0] + " has already been added, silly~").then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 10000);
                });
                return;
            }
            else {
                if (incoming.length > 2) {
                    Bot.createMessage(m.channel.id, "You should only be adding the name and the like, any other format is not supported. \n\nValid Example:\n`" + prefix + "artist add Patreon <https://patreon.com/Chocola>`").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 15000);
                    });
                    return;
                }
                data.people[id].links[incoming[0]] = incoming[1];
                await peopledb.save(data);
                Bot.createMessage(m.channel.id, "Added **" + incoming[0] + "** " + hand).then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
        }

        if (args.includes("remove")) {
            if (mentioned.id !== m.author.id) {
                Bot.createMessage(m.channel.id, "Okay....but that isn't you").then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
            let split1 = name1.replace(/remove /i, "").replace(": ", " ").split(" ");
            let split2 = name1.replace(/remove /i, "").replace(": ", " ").split(" | ");
            let incoming = split1;
            if (data.people[id].links[split2[0]]) {
                incoming = split2;
            }

            if (data.people[id].links[incoming[0]]) {
                delete data.people[id].links[incoming[0]];
                await peopledb.save(data);
                Bot.createMessage(m.channel.id, "Removed: **" + incoming[0] + ":** from your links " + hand).then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 5000);
                });
                return;
            }
            else {
                Bot.createMessage(m.channel.id, "Sorry, I couldn't find** " + incoming[0] + "** in your links").then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    }, 10000);
                });
                return;
            }
        }

        if (Object.keys(data.people[id].links).length === 0) {
            Bot.createMessage(m.channel.id, "I could find any links for **" + name + "** :(").then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                }, 10000);
            });
            return;
        }
        else {
            var links = data.people[id].links;
            Object.keys(links).forEach(function(key) {
                linkArray.push(key + ": " + links[key] + "\n");
            });
            Bot.createMessage(m.channel.id, {
                content: "",
                embed: {
                    color: 0xA260F6,
                    title: Object.keys(data.people[id].links).length + " links found for: **" + name + "**",
                    description: " \n" + linkArray.join("\n"),
                    author: {
                        name: name,
                        icon_url: mentioned.avatarURL
                    }
                }
            });
        }
    },
    help: "Show artist links. `[prefix]artist | [prefix]artist <mention> | [prefix]artist add <name of link> <actual link> | [prefix]artist remove <name of link>`"
};
