"use strict";

const conf = require("../conf");
const _ = require("../people");

var data = _.load();

module.exports = {
    main: function(Bot, m, args, prefix) {
        function rank(obj) {
            var arr = [];
            var entries = Object.entries(obj);
            for (var entry of entries) {
                if (entry[1].adds) {
                    arr.push({
                        "key": entry[0],
                        "value": entry[1].adds
                    });
                }
            }
            arr.sort(function(a, b) {
                return a.value - b.value;
            });
            return arr.reverse();
        }
        var sorted = rank(data.people);
        if (args.toLowerCase().includes("global")) {
            var i = 1;
            var leaders = [];
            var leader = [];
            var y = 0;
            var personalRank = [];
            for (let person of sorted) {
                var user = Bot.users.filter(m => m.id == person["key"])[0];
                if (user && user.id != conf.users.bot && user.id != "444791634966740993") {
                    y++;
                    if (i == 1) {
                        leader.push(user.id);
                    }
                    if (person.value > 1 && i < 26) {
                        leaders.push(`**${i}.**  ${user.username}#${user.discriminator}: ${person.value} adds`);
                        i++;
                    }
                    if (person.value == 1 && i < 26) {
                        leaders.push(`**${i}.**  ${user.username}#${user.discriminator}: ${person.value} add`);
                        i++;
                    }
                    if (user.id == m.author.id) {
                        if (person.value > 1) {
                            personalRank.push(`**${y}.**  ${user.username}#${user.discriminator}: ${person.value} adds`);
                        }
                        if (person.value == 1) {
                            personalRank.push(`**${y}.**  ${user.username}#${user.discriminator}: ${person.value} add`);
                        }
                    }
                }
            }
            if (personalRank[0]) {
                Bot.createMessage(m.channel.id, {
                    embed: {
                        author: {
                            name: "Current *Global* Leaderboard:",
                            icon_url: m.channel.guild.iconURL
                        },
                        thumbnail: {
                            url: Bot.users.filter(m => m.id == leader[0])[0].avatarURL
                        },
                        color: 0xA260F6,
                        description: leaders.join("\n") + "\n\nYour Current Global Rank:\n\n" + personalRank[0]
                    }
                });
                return;
            }
            else {
                Bot.createMessage(m.channel.id, {
                    embed: {
                        author: {
                            name: "Current *Global* Leaderboard:",
                            icon_url: m.channel.guild.iconURL
                        },
                        thumbnail: {
                            url: Bot.users.filter(m => m.id == leader[0])[0].avatarURL
                        },
                        color: 0xA260F6,
                        description: leaders.join("\n")
                    }
                });
                return;
            }
        }
        leaders = [];
        leader = [];
        i = 1;
        y = 0;
        personalRank = [];
        for (let person of sorted) {
            user = m.channel.guild.members.filter(m => m.id == person["key"])[0];
            if (user && user.id != conf.users.bot && user.id != "444791634966740993") {
                y++;
                if (i == 1) {
                    leader.push(user.id);
                }
                if (person.value > 1 && i < 11) {
                    leaders.push(`**${i}.**  ${user.username}#${user.discriminator}: ${person.value} adds`);
                    i++;
                }
                if (person.value == 1 && i < 11) {
                    leaders.push(`**${i}.**  ${user.username}#${user.discriminator}: ${person.value} add`);
                    i++;
                }
                if (user.id == m.author.id) {
                    if (person.value > 1) {
                        personalRank.push(`**${y}.**  ${user.username}#${user.discriminator}: ${person.value} adds`);
                    }
                    if (person.value == 1) {
                        personalRank.push(`**${y}.**  ${user.username}#${user.discriminator}: ${person.value} add`);
                    }
                }
            }
        }
        if (personalRank[0]) {
            Bot.createMessage(m.channel.id, {
                embed: {
                    author: {
                        name: "Current Guild Leaderboard:",
                        icon_url: m.channel.guild.iconURL
                    },
                    thumbnail: {
                        url: m.channel.guild.members.filter(m => m.id == leader[0])[0].avatarURL
                    },
                    color: 0xA260F6,
                    description: leaders.join("\n") + "\n\nYour Current Guild Rank:\n\n" + personalRank[0]
                }
            });
            return;
        }
        else {
            Bot.createMessage(m.channel.id, {
                embed: {
                    author: {
                        name: "Current Guild Leaderboard:",
                        icon_url: m.channel.guild.iconURL
                    },
                    thumbnail: {
                        url: m.channel.guild.members.filter(m => m.id == leader[0])[0].avatarURL
                    },
                    color: 0xA260F6,
                    description: leaders.join("\n")
                }
            });
        }
    },
    help: "Shows hoard leaderboards"
};
