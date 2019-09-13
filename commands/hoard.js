"use strict";

const utils = require("../utils");
const dbs = require("../dbs");

// Find all the emoji ids in a string
function parseEmojis(s) {
    var re = /<a?:([a-zA-Z0-9]+):[0-9]+>/g;
    var emojiIds = [];
    var match = re.exec(s);
    while (match) {
        emojiIds.push(match[1]);
        match = re.exec(s);
    }
    return emojiIds;
}

module.exports = {
    main: async function(bot, m, args, prefix) {
        utils.parseNameMentions();

        var member = m.guild.members.get(m.mentions[0] || m.author);

        var splitArgs = m.fullArgs.split(" | ");
        // Ignore an empty string from split ("".split(" | ") === [""])
        if (splitArgs.length === 1 && splitArgs[0] === "") {
            splitArgs = [];
        }

        var userDb = await dbs.user.load();
        if (userDb[member.id]) {
            userDb[member.id] = {};
        }
        var userData = userDb[member.id];
        if (!userData.hoard) {
            userData.hoard = {};
        }
        var hoard = userData.hoard;

        var emojiIds = parseEmojis(m.fullArgs);
        var emojiId = emojiIds[0];
        var subcommandArgs = splitArgs[0] && splitArgs[0].trim().split(" ");
        var subcommand = subcommandArgs && subcommandArgs.shift().trim();
        //var subcommandFullArgs = splitArgs[0] && splitArgs[0].substring(m.prefix.length + subcommand.length).trim();

        var url = member.avatarURL;

        // TODO: These commands should NOT be allowed if you've mentioned someone other than yourself
        if (subcommand === "add") {
            if (!emojiIds.length === 0) {
                m.reply("Please provide an emoji to add", 5000);
                m.deleteIn(5000);
                return;
            }

            if (emojiIds.length > 1) {
                m.reply("Sorry, you can only make a hoard by using 1 emoji", 5000);
                m.deleteIn(5000);
                return;
            }

            if (hoard[emojiId]) {
                m.reply(emojiId + " is already one of your hoards", 5000);
                m.deleteIn(5000);
                return;
            }

            hoard[emojiId] = {};
            await dbs.user.save(userDb);
            m.reply("Successfully added hoard: " + emojiId, 5000);
            m.deleteIn(5000);
            return;
        }
        else if (subcommand === "remove") {
            if (!emojiIds.length === 0) {
                m.reply("Please provide an emoji to delete", 5000);
                m.deleteIn(5000);
                return;
            }

            if (emojiIds.length > 1) {
                m.reply("Sorry, you can delete a hoard by using 1 emoji", 5000);
                m.deleteIn(5000);
                return;
            }

            var hoardItemNum = utils.toNum(subcommandArgs[1]);
            if (!(hoardItemNum > 0)) {
                hoardItemNum = null;
            }

            if (hoard[emojiId]) {
                if (!hoardItemNum) {
                    delete hoard[emojiId];
                    await dbs.user.save(userDb);
                    m.reply(emojiId + " Successfully deleted", 5000);
                    m.deleteIn(5000);
                }
                else {
                    if (!hoard[emojiId]) {
                        m.reply("Could not find that hoard", 5000);
                        m.deleteIn(5000);
                        return;
                    }
                    var hoardLinks = Object.keys(hoard[emojiId]);
                    if (!hoardItemNum > hoardLinks.length) {
                        m.reply("Could not find that item in that hoard", 5000);
                        m.deleteIn(5000);
                        return;
                    }

                    // TODO: If you want to refer items by index, then hoard should be a list, not an object
                    var link = hoardLinks[hoardItemNum - 1];
                    delete hoard[emojiId][link];
                    await dbs.user.save(userDb);
                    m.reply(`Successfully deleted item ${hoardItemNum} from ${emojiId}`, 5000);
                    m.deleteIn(5000);
                }
            }
        }

        var hoardEmojis = Object.keys(hoard);

        if (hoardEmojis.length === 0) {
            m.reply(`Could not find any hoard for **${member.name}**`, 5000);
            m.deleteIn(5000);
            return;
        }

        if (!hoardEmojis.includes(emojiId)) {
            emojiId = utils.choose(hoardEmojis);
        }

        var emojiHoard = hoard[emojiId];
        var indexLine = `Item ${emojiHoard.indexOf(rando) + 1} of ${hoard.length} from :heart_eyes: hoard`;
        if (!origID || !origID.length) {
            var hoardInnder = Object.keys(origID);
            var hoardName = rando;
            var randomNum = Math.floor(Math.random() * hoardInnder.length);
            rando = hoardInnder[randomNum];
            if (utils.isNum(splitArgs[1]) && utils.toNum(splitArgs[1]) > 0 && utils.toNum(splitArgs[1]) < hoardInnder.length + 1) {
                var pass = true;
                rando = hoardInnder[utils.toNum(splitArgs[1]) - 1];
            }
            indexLine = `Item ${hoardInnder.indexOf(rando) + 1} of ${hoardInnder.length} from the ${hoardName} hoard`;
            origID = origID[rando];
        }
        var user = m.bot.users.filter(m => m.id === origID)[0];
        if (!user) {
            user = m.author;
            origID = user.id;
        }
        var hash = user.avatar;
        var og = `https://cdn.discordapp.com/avatars/${origID}/${hash}.jpg?size=128`;
        if (!splitArgs) {
            if (rando === undefined) {
                var i = 0;
                var newNumber = 0;
                while (!rando.length && i < 4 && randomNum === newNumber) {
                    newNumber = Math.floor(Math.random() * hoard.length);
                    rando = hoard[newNumber];
                    i++;
                }
            }
        }
        if (!rando) {
            if (hoard[hoard.indexOf(splitArgs[0])]) {
                m.reply("Please react to messages with " + hoard[hoard.indexOf(splitArgs[0])] + " to pull them up in their own hoard", 5000);
                m.deleteIn(5000);
                return;
            }
            else {
                m.reply("Please react to messages with your hoard emoji's to pull them up in their own hoard", 5000);
                m.deleteIn(5000);
                return;
            }
        }
        var imgURL = /([a-z\-_0-9/:.]*\.(?:png|jpg|gif|svg|jpeg)[:orig]*)/i.exec(rando);
        if (rando.includes("https://cdn.discordapp.com")) {
            var msg = {
                "content": `A Random piece, from **${member.name}**'s hoard`,
                "embed": {
                    "description": indexLine,
                    "color": 0xA260F6,
                    "image": {
                        "url": rando
                    },
                    "author": {
                        "name": member.name,
                        "icon_url": url
                    },
                    "footer": {
                        "icon_url": og,
                        "text": `Original post by ${user.username}`
                    }
                }
            };
        }
        if (imgURL) {
            if (imgURL[0]) {
                msg = {
                    "content": `A Random piece, from **${member.name}**'s hoard`,
                    "embed": {
                        "description": indexLine,
                        "color": 0xA260F6,
                        "image": {
                            "url": imgURL[0]
                        },
                        "author": {
                            "name": member.name,
                            "icon_url": url
                        },
                        "footer": {
                            "icon_url": og,
                            "text": `Original post by ${user.username}`
                        }
                    }
                };
            }
        }
        else {
            msg = {
                "content": `A Random piece, from **${member.name}**'s hoard`,
                "embed": {
                    "description": rando,
                    "color": 0xA260F6,
                    "title": indexLine,
                    "author": {
                        "name": member.name,
                        "icon_url": url
                    },
                    "footer": {
                        "icon_url": og,
                        "text": `Original post by ${user.username}`
                    }
                }
            };
        }
        if (utils.isNum(splitArgs[1]) && !pass) {
            msg.content = "That is not a valid index number for that hoard\n\n" + msg.content;
        }
        m.reply(msg);
        return;
    },
    help: "View hoards. React with :heart_eyes: to add"
};
