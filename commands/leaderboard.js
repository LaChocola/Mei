"use strict";

const peopledb = require("../people");

function getLeaderboard(m, sorted, users, userCount, title) {
    var leaders = [];
    var leader;
    var i = 1;
    var y = 0;
    var personalRank = "";

    for (let person of sorted) {
        var user = users.find(m => m.id === person.key);
        if (user && !user.bot) {
            y++;
            if (i === 1) {
                leader = user.id;
            }
            if (person.value > 0 && i < userCount) {
                leaders.push(`**${i}.**  ${user.username}#${user.discriminator}: ${person.value} ${person.value === 1 ? "add" : "adds"}`);
                i++;
            }
            if (user.id === m.author.id && person.value > 0) {
                personalRank = `\n\nYour Current ${title} Rank:\n\n**${y}.**  ${user.username}#${user.discriminator}: ${person.value} ${person.value === 1 ? "add" : "adds"}`;
            }
        }
    }

    return {
        embed: {
            author: {
                name: `Current *${title}* Leaderboard:`,
                icon_url: m.channel.guild.iconURL
            },
            thumbnail: {
                url: leader && users.find(m => m.id === leader).avatarURL || null
            },
            color: 0xA260F6,
            description: leaders.join("\n") + personalRank
        }
    };
}

module.exports = {
    main: async function (Bot, m, args, prefix) {
        var data = await peopledb.load();

        function rank(obj) {
            var arr = [];
            var entries = Object.entries(obj);
            for (var entry of entries) {
                if (entry[1].adds) {
                    arr.push({
                        key: entry[0],
                        value: entry[1].adds
                    });
                }
            }
            arr.sort((a, b) => a.value - b.value);
            return arr.reverse();
        }
        var sorted = rank(data.people);

        var embed;
        if (args.toLowerCase().includes("global")) {
            embed = getLeaderboard(m, sorted, Bot.users, 26, "Global");
        }
        else {
            embed = getLeaderboard(m, sorted, m.channel.guild.members, 11, "Guild");
        }

        Bot.createMessage(m.channel.id, embed);

    },
    help: "Shows hoard leaderboards"
};
