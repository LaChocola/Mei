"use strict";

const unidecode = require("unidecode");

const utils = require("../utils");
const dbs = require("../dbs");

module.exports = {
    main: async function(bot, m, args, prefix) {
        var userDb = await dbs.user.load();

        var name1 = m.cleanContent.replace(/!fetish /i, "");

        function capFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        var member = m.guild.members.find(m => utils.isSameMember(m, name1));
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        var likes = [];
        var dislikes = [];
        let commonLikes = [];
        let commonDislikes = [];
        var id = mentioned.id;
        if (!userDb.people[id]) {
            userDb.people[id] = {};
        }
        if (!userDb.people[id].fetishes) {
            userDb.people[id].fetishes = {};
        }
        if (args.toLowerCase().includes("search ")) {
            if (args.toLowerCase().includes("dislike")) {
                let incomingEntries = name1.replace(/\bsearch\b/i, "").replace(/\bdislike\b/i, "").replace(": ", " ").split(" | ");
                let incoming = [];
                let iterator = incomingEntries.entries();
                for (let e of iterator) {
                    incoming.push(capFirstLetter(e[1].trim()));
                }
                let matches = Object.keys(userDb.people).filter(k => userDb.people[k].fetishes && userDb.people[k].fetishes[`${incoming[0]}`] === "dislike");
                if (matches.length < 1) {
                    m.reply("No matches found");
                    return;
                }
                else {
                    let usernames = [];
                    for (const match of matches) {
                        if (m.channel.guild.members.get(match)) {
                            let properName = m.channel.guild.members.get(match).nick || m.channel.guild.members.get(match).username;
                            usernames.push("***" + unidecode(properName) + "***");
                        }
                    }
                    if (usernames.length < 1) {
                        m.reply("No matches found");
                        return;
                    }
                    m.reply("Users that dislike `" + incoming[0] + "`:\n\n" + usernames.join("\n"));
                    return;
                }
            }
            else {
                let incomingEntries = name1.replace(/\bsearch\b\s/i, "").replace(": ", " ").split("|");
                let incoming = [];
                let iterator = incomingEntries.entries();
                for (let e of iterator) {
                    incoming.push(capFirstLetter(e[1].trim()));
                }
                let matches = Object.keys(userDb.people).filter(k => userDb.people[k].fetishes && userDb.people[k].fetishes[`${incoming[0]}`] === "like");
                if (matches.length < 1) {
                    m.reply("No matches found");
                    return;
                }
                else {
                    let usernames = [];
                    for (const match of matches) {
                        if (m.channel.guild.members.get(match)) {
                            let properName = m.channel.guild.members.get(match).nick || m.channel.guild.members.get(match).username;
                            usernames.push("***" + unidecode(properName) + "***");
                        }
                    }
                    m.reply("Users that like `" + incoming[0] + "`:\n\n" + usernames.join("\n"));
                    return;
                }
            }
        }
        if (args.toLowerCase().includes("remove ")) {
            if (mentioned.id !== m.author.id) {
                m.reply("Okay....but that isnt you");
                return;
            }
            let incoming = name1.replace(/\bremove\b/i, "").replace(" ", "").split("|");
            if (userDb.people[id].fetishes[capFirstLetter(incoming[0])]) {
                delete userDb.people[id].fetishes[capFirstLetter(incoming[0])];
                await dbs.user.save(userDb);
                m.reply("Removed: **" + incoming[0] + "** from your fetish list" + utils.hands.ok(), 5000);
                m.deleteIn(5000);
                return;
            }
            else {
                m.reply("Sorry, I couldnt find **" + incoming[0] + "** in your fetish list", 5000);
                m.deleteIn(5000);
                return;
            }
        }
        if (args.toLowerCase().includes("add")) {
            if (mentioned.id !== m.author.id) {
                m.reply("Okay....but that isnt you");
                return;
            }
            var incomingEntries = name1.replace(/\badd\b/i, "").replace(/^[ \t]+/, "").replace(/[ \t]+$/, "").split("|");
            let incoming = [];
            let iterator = incomingEntries.entries();
            for (let e of iterator) {
                if (!e[1]) {
                    break;
                }
                incoming.push(capFirstLetter(e[1]));
            }
            if (incoming.length === 0) {
                m.reply("Please say which fetish you would like to add, for example `!fetish add Butts`", 5000);
                m.deleteIn(5000);
                return;
            }
            if (userDb.people[id].fetishes[incoming[0]]) {
                m.reply("That's already been added, silly~", 5000);
                m.deleteIn(5000);
                return;
            }
            else if (incoming[0].toLowerCase().includes("dislike")) {
                incoming[0] = incoming[0].replace(/\bdislike\b/ig, "");
                incoming[0] = capFirstLetter(incoming[0].trim());
                if (!incoming[0]) {
                    m.reply("Please say which fetish you would like to dislike, for example `!fetish add Death dislike`", 5000);
                    m.deleteIn(5000);
                    return;
                }
                userDb.people[id].fetishes[incoming[0]] = "dislike";
                await dbs.user.save(userDb);
                m.reply("Added Dislike: **" + incoming[0] + "** " + utils.hands.ok(), 5000);
                m.deleteIn(5000);
                return;
            }
            else {
                userDb.people[id].fetishes[incoming[0]] = "like";
                await dbs.user.save(userDb);
                m.reply("Added **" + incoming[0] + "** " + utils.hands.ok(), 5000);
                m.deleteIn(5000);
                return;
            }
        }
        if (Object.keys(userDb.people[id].fetishes).length < 1) {
            m.reply("I could find any fetish list for **" + unidecode(name) + "** :(");
            return;
        }
        else {
            var fetishes = userDb.people[id].fetishes;
            var fetishes2 = userDb.people[m.author.id];
            if (!fetishes2.fetishes || !fetishes2) {
                m.reply("You need to have a fetish list in order to compare lists with someone, silly bug");
                return;
            }
            fetishes2 = fetishes2.fetishes;
            if (mentioned.id !== m.author.id) {
                let lowerOther = Object.entries(fetishes).map(v => [v[0].toLowerCase(), v[1]]).reduce((map, val) => {
                    map[val[0]] = val[1];
                    return map;
                }, {});
                let lowerMain = Object.entries(fetishes2).map(v => [v[0].toLowerCase(), v[1]]).reduce((map, val) => {
                    map[val[0]] = val[1];
                    return map;
                }, {});
                let commonDislikes = [];
                let commonLikes = [];
                for (let val in lowerMain) {
                    if (lowerOther[val] && lowerOther[val] === lowerMain[val]) {
                        if (lowerMain[val] === "like") {
                            commonLikes.push(val);
                        }
                        if (lowerMain[val] === "dislike") {
                            commonDislikes.push(val);
                        }
                    }
                }
            }

            for (const [key, value] of Object.entries(fetishes)) {
                if (value === "like") {
                    likes.push(`${key}`);
                }
                if (value === "dislike") {
                    dislikes.push(`${key}`);
                }
            }
            if (likes.length < 1) {
                likes.push("None");
            }
            if (dislikes.length < 1) {
                dislikes.push("None");
            }
            var limit = false;
            if (likes.join("\n").length > 1020) {
                m.reply(`You have reached the character limit for Likes, please remove ${likes.join("\n").length - 1020} characters from your list to display the fetish list`);
                limit = true;
            }
            if (dislikes.join("\n").length > 1020) {
                m.reply(`You have reached the character limit for Dislikes, please remove ${dislikes.join("\n").length - 1020} characters from your list to display the fetish list`);
                limit = true;
            }
            if (commonLikes.join("\n").length > 1020) {
                m.reply(`You have reached the character limit for CommonLikes, please remove ${commonLikes.join("\n").length - 1020} characters from your list to display the fetish list`);
                limit = true;
            }
            if (commonDislikes.join("\n").length > 1020) {
                m.reply(`You have reached the character limit for CommonDislikes, please remove ${commonDislikes.join("\n").length - 1020} characters from your list to display the fetish list`);
                limit = true;
            }
            if (limit) {
                return;
            }
            if (mentioned.id === m.author.id) {
                m.reply({
                    content: "",
                    embed: {
                        color: 0xA260F6,
                        title: Object.keys(userDb.people[id].fetishes).length + " fetishes for **" + unidecode(name) + "**",
                        fields: [{
                            name: ":green_heart: Likes: " + likes.length,
                            value: likes.join("\n"),
                            inline: true
                        },
                        {
                            name: ":x: Dislikes: " + dislikes.length,
                            value: dislikes.join("\n"),
                            inline: true
                        }
                        ],
                        author: {
                            name: unidecode(name),
                            icon_url: mentioned.avatarURL
                        }
                    }
                });
                return;
            }
            else {
                if (commonLikes.length < 1) {
                    commonLikes.push("None");
                }
                if (commonDislikes.length < 1) {
                    commonDislikes.push("None");
                }
                m.reply({
                    content: "",
                    embed: {
                        color: 0xA260F6,
                        fields: [{
                            name: ":green_heart: Likes: " + likes.length,
                            value: likes.join("\n") + " \n \u200b",
                            inline: true
                        },
                        {
                            name: "\u200b",
                            value: "\u200b",
                            inline: true
                        },
                        {
                            name: ":x: Dislikes: " + dislikes.length,
                            value: dislikes.join("\n") + " \n \u200b",
                            inline: true
                        },
                        {
                            name: ":green_heart: Common Likes: " + commonLikes.length,
                            value: commonLikes.join("\n"),
                            inline: true
                        },
                        {
                            name: "\u200b",
                            value: "\u200b",
                            inline: true
                        },
                        {
                            name: ":x: Common Dislikes: " + commonDislikes.length,
                            value: commonDislikes.join("\n"),
                            inline: true
                        }
                        ],
                        author: {
                            name: unidecode(name),
                            icon_url: mentioned.avatarURL
                        }
                    }
                });
                return;
            }
        }
    },
    help: "Add custom fetishes"
};
