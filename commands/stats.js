"use strict";

const utils = require("../utils");
const dbs = require("../dbs");

var globalData = dbs.global.load();

module.exports = {
    main: function(bot, m, args, prefix) {
        var name1 = m.cleanContent.replace(`${prefix}stats `, "");
        var member = m.guild.members.find(m => utils.isSameMember(m, name1));
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        var commands = globalData.commands;
        var userUses = 0;
        var stats = [];
        for (let command in commands) {
            if (globalData.commands[command].totalUses && globalData.commands[command].users[mentioned.id]) {
                if (globalData.commands[command].totalUses && globalData.commands[command].users[mentioned.id] == 1) {
                    stats.push("**!" + command + ":** " + globalData.commands[command].users[mentioned.id] + " run");
                }
                else {
                    stats.push("**!" + command + ":** " + globalData.commands[command].users[mentioned.id] + " runs");
                }
                userUses = userUses + globalData.commands[command].users[mentioned.id];
            }
        }
        var percent = ((userUses / commands.totalRuns) * 100).toFixed(2);
        var userStats = "**`" + userUses + "`**/" + commands.totalRuns + " commands (" + percent + "%)\n\n";
        var statList = stats.join("\n");
        m.reply({
            content: "Stats for: " + name + "\n",
            embed: {
                color: 0x5A459C,
                description: userStats + statList
            }
        });
    },
    help: "Stats"
};
