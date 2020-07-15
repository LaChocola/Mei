"use strict";

const escapeStringRegexp = require("escape-string-regexp");

const { chooseHand } = require("../misc");
const peopledb = require("../people");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var peopledata = await peopledb.load();

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
        if (!peopledata.people[id]) {
            peopledata.people[id] = {};
            peopledata.people[id].links = {};
        }
        if (!peopledata.people[id].links) {
            peopledata.people[id].links = {};
        }

        if (args.toLowerCase().includes("add ")) {
            if (mentioned.id !== m.author.id) {
                bot.createMessage(m.channel.id, "Okay....but that isn't you").then((msg) => {
                    return setTimeout(function() {
                        bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        bot.deleteMessage(m.channel.id, msg.id, "Timeout");
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
            if (peopledata.people[id].links[incoming[0]]) {
                m.reply(incoming[0] + " has already been added, silly~", 10000, true);
                return;
            }
            else {
                if (incoming.length > 2) {
                    m.reply("You should only be adding the name and the like, any other format is not supported. \n\nValid Example:\n`" + prefix + "artist add Patreon <https://patreon.com/Chocola>`", 15000, true);
                    return;
                }
                peopledata.people[id].links[incoming[0]] = incoming[1];
                await peopledb.save(peopledata);
                m.reply("Added **" + incoming[0] + "** " + chooseHand(), 5000, true);
                return;
            }
        }

        if (args.includes("remove")) {
            if (mentioned.id !== m.author.id) {
                m.reply("Okay....but that isn't you", 5000, true);
                return;
            }
            let split1 = name1.replace(/remove /i, "").replace(": ", " ").split(" ");
            let split2 = name1.replace(/remove /i, "").replace(": ", " ").split(" | ");
            let incoming = split1;
            if (peopledata.people[id].links[split2[0]]) {
                incoming = split2;
            }

            if (peopledata.people[id].links[incoming[0]]) {
                delete peopledata.people[id].links[incoming[0]];
                await peopledb.save(peopledata);
                m.reply("Removed: **" + incoming[0] + ":** from your links " + chooseHand(), 5000, true);
                return;
            }
            else {
                m.reply("Sorry, I couldn't find** " + incoming[0] + "** in your links", 10000, true);
                return;
            }
        }

        if (Object.keys(peopledata.people[id].links).length === 0) {
            m.reply("I could find any links for **" + name + "** :(", 10000, true);
            return;
        }
        else {
            var links = peopledata.people[id].links;
            Object.keys(links).forEach(function(key) {
                linkArray.push(key + ": " + links[key] + "\n");
            });
            m.reply({
                content: "",
                embed: {
                    color: 0xA260F6,
                    title: Object.keys(peopledata.people[id].links).length + " links found for: **" + name + "**",
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
