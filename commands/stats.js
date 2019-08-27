"use strict";

const _ = require("../data.js");
var data = _.load();

const isSameMember = require("./utils/isSameMember");

module.exports = {
    main: function(Bot, m, args, prefix) {
        var name1 = m.cleanContent.replace(`${prefix}stats `, "");
        var member = m.guild.members.find(m => isSameMember(m, name1));
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        var commands = data.commands;
        var userUses = 0;
        var stats = [];
        for (let command in commands) {
            if (data.commands[command].totalUses && data.commands[command].users[mentioned.id]) {
                if (data.commands[command].totalUses && data.commands[command].users[mentioned.id] == 1) {
                    stats.push("**!" + command + ":** " + data.commands[command].users[mentioned.id] + " run");
                }
                else {
                    stats.push("**!" + command + ":** " + data.commands[command].users[mentioned.id] + " runs");
                }
                var userUses = userUses + data.commands[command].users[mentioned.id];
            }
        }
        var percent = ((userUses / commands.totalRuns) * 100).toFixed(2);
        var userStats = "**`" + userUses + "`**/" + commands.totalRuns + " commands (" + percent + "%)\n\n";
        var statList = stats.join("\n");
        Bot.createMessage(m.channel.id, {
            content: "Stats for: " + name + "\n",
            embed: {
                color: 0x5A459C,
                description: userStats + statList
            }
        });
    },
    help: "Stats"
};
