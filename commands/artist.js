"use strict";

const utils = require("../utils");
const dbs = require("../dbs");

module.exports = {
    main: function(bot, m, args) {
        var userDb = dbs.user.load();

        var name1 = m.cleanContent.replace(/!artist /i, "");
        var member = m.guild.members.find(m => utils.isSameMember(m, name1));
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        var linkArray = [];
        var id = mentioned.id;
        if (!userDb.people[id]) {
            userDb.people[id] = {};
            userDb.people[id].links = {};
        }
        if (!userDb.people[id].links) {
            userDb.people[id].links = {};
        }

        if (args.toLowerCase().includes("add ")) {
            if (mentioned.id !== m.author.id) {
                m.reply("Okay....but that isn't you");
                return;
            }
            let incoming = name1.replace(/add /i, "").replace(": ", " ").split(" ");
            if (userDb.people[id].links[incoming[0]]) {
                m.reply("That's already been added, silly~");
                return;
            }
            else {
                if (incoming.length > 2) {
                    m.reply("You should only be adding the name and the like, any other format is not supported. \n\nValid Example:\n`!artist add Patreon <https://patreon.com/Chocola>`");
                    return;
                }
                userDb.people[id].links[incoming[0]] = incoming[1];
                dbs.user.save(userDb);
                m.reply("Added **" + incoming[0] + "** " + utils.hands.ok());
                return;
            }
        }

        if (args.includes("remove")) {
            if (mentioned.id !== m.author.id) {
                m.reply("Okay....but that isnt you");
                return;
            }
            let incoming = name1.replace("remove ", "").replace(": ", " ").split(" ");
            if (userDb.people[id].links[incoming[0]]) {
                delete userDb.people[id].links[incoming[0]];
                dbs.user.save(userDb);
                m.reply("Removed: **" + incoming[0] + ":** from your links " + utils.hands.ok());
                return;
            }
            else {
                m.reply("Sorry, I couldnt find**" + incoming[0] + ":** `" + incoming[1] + " in your links");
                return;
            }
        }

        if (Object.keys(userDb.people[id].links).length === 0) {
            m.reply("I could find any links for **" + name + "** :(");
            return;
        }
        else {
            var links = userDb.people[id].links;
            Object.keys(links).forEach(function(key) {
                linkArray.push(key + ": " + links[key] + "\n");
            });
            m.reply({
                content: "",
                embed: {
                    color: 0xA260F6,
                    title: Object.keys(userDb.people[id].links).length + " links found for: **" + name + "**",
                    description: " \n" + linkArray.join("\n"),
                    author: {
                        name: name,
                        icon_url: mentioned.avatarURL
                    }
                }
            });
        }
    },
    help: "Show artist links. `!artist | !artist <mention> | !artist add <name of link> <actual link> | !artist remove <name of link>`"
};
