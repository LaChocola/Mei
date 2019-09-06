"use strict";

const dbs = require("../dbs");

// Map each user to a { userId, adds } object, sorted by adds
function sortByAdds(people) {
    var arr = Object.entries(people)
        .filter(([userId, person]) => person.adds)
        .map(function([userId, person]) {
            return { userId, adds: person.adds };
        });
    arr.sort((a, b) => a.add - b.adds).reverse();
    return arr;
}

function makeRankString(user, rankNum) {
    var rankString = `**${rankNum}.**  ${user.username}#${user.discriminator}: ${user.adds} add${user.adds === 1 ? "" : "s"}`;
    return rankString;
}

module.exports = {
    main: async function(bot, m, args, prefix) {
        var userDb = await dbs.user.load();

        var isGlobal = args.toLowerCase().includes("global");

        // Pull from all users, or just guild members, depending on isGlobal
        var userPool = isGlobal ? bot.users : m.channel.guild.members;

        var sortedUsers = sortByAdds(userDb.people)
            // Map to user objects
            .map(function(person) {
                var user = userPool.find(u => u.id === person.userId);
                if (user) {
                    user.adds = person.adds;
                }
                return user;
            })
            // Ignore any missing or bot users
            .filter(user => user && !user.bot);

        // Get the top userId
        var leaderAvatar = sortedUsers[0] && sortedUsers[0].avatar;

        // Make a list of rankStrings for the first 26 users
        var description = sortedUsers.slice(0, 26).map((user, i) => makeRankString(user, i + 1)).join("\n");

        // Get the message author's rank
        var userIndex = sortedUsers.findIndex(u => u.id === m.author.id);
        if (userIndex !== -1) {
            var user = sortedUsers[userIndex];
            var personalRank = makeRankString(user, userIndex + 1);
            description += `\n\nYour Current ${isGlobal ? "Global" : "Guild"} Rank:\n\n` + personalRank;
        }

        bot.createMessage(m.channel.id, {
            embed: {
                author: {
                    name: `Current ${isGlobal ? "*Global*" : "Guild"} Leaderboard:`,
                    icon_url: m.channel.guild.iconURL
                },
                thumbnail: {
                    url: leaderAvatar
                },
                color: 0xA260F6,
                description: description
            }
        });
    },
    help: "Shows hoard leaderboards"
};
