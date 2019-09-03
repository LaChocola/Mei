"use strict";

const utils = require("../utils");
const dbs = require("../dbs");

var userDb = await dbs.user.load();

module.exports = {
    main: function(bot, m, args, prefix) {
        var name1 = m.cleanContent.replace(/!hoard /i, "");
        args = args.split(" | ");
        var member = m.guild.members.find(m => utils.isSameMember(m, name1));
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        var id = mentioned.id;
        var url = m.channel.guild.members.get(id).avatarURL;
        if (args[0]) {
            if (args[0].toLowerCase().includes("add")) {
                args[0] = args[0].replace(/add/i, "").replace(/\s/g, "");
                args[0] = args[0].split(" ");
                if (args[0].length > 1) {
                    m.reply("Sorry, you can only make a hoard by using 1 emoji", 5000);
                    m.deleteIn(5000);
                    return;
                }
                args[0] = args[0].join("");
                if (/<:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])) {
                    args[0] = /<:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])[1];
                }
                if (/<a:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])) {
                    args[0] = /<a:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])[1];
                }
                if (userDb.people[id].hoard) {
                    var hoard = Object.keys(userDb.people[id].hoard);
                    if (hoard[args[0]]) {
                        m.reply(args[0] + " is already one of your hoards", 5000);
                        m.deleteIn(5000);
                        return;
                    }
                }
                if (!userDb.people[id].hoard) {
                    userDb.people[id].hoard = {};
                    await dbs.user.save(userDb);
                    userDb = await dbs.user.load();
                }
                if (!userDb.people[id].hoard[args[0]]) {
                    userDb.people[id].hoard[args[0]] = {};
                    await dbs.user.save(userDb);
                    m.reply("Successfully added hoard: " + args[0], 5000);
                    m.deleteIn(5000);
                    return;
                }
            }
            if (args[0].toLowerCase().includes("remove")) {
                args[0] = args[0].replace(/remove/i, "").replace(/\s/g, "");
                args[0] = args[0].split(" ");
                if (args[0].length > 1) {
                    m.reply("Sorry, you can only remove 1 hoard at a time", 5000);
                    m.deleteIn(5000);
                    return;
                }
                args[0] = args[0].join("");
                if (/<:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])) {
                    args[0] = /<:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])[1];
                }
                if (utils.isNum(args[1]) && 0 < utils.toNum(args[1])) {
                    if (userDb.people[id].hoard) {
                        hoard = Object.keys(userDb.people[id].hoard);
                        args[1] = utils.toNum(args[1]);
                        --args[1];
                        if (hoard.indexOf(args[0]) > -1) {
                            var index = hoard.indexOf(args[0]);
                            if (userDb.people[id].hoard[args[0]]) {
                                var item = Object.keys(userDb.people[id].hoard[args[0]])[args[1]];
                                delete userDb.people[id].hoard[args[0]][item];
                                await dbs.user.save(userDb);
                                m.reply(`Successfully deleted item ${args[1] + 1} from ${args[0]}`, 5000);
                                m.deleteIn(5000);
                                return;
                            }
                            m.reply("Could not find that item in that hoard", 5000);
                            m.deleteIn(5000);
                            return;
                        }
                    }
                }
                if (userDb.people[id].hoard) {
                    hoard = Object.keys(userDb.people[id].hoard);
                    if (hoard.indexOf(args[0]) > -1) {
                        delete userDb.people[id].hoard[args[0]];
                        await dbs.user.save(userDb);
                        m.reply(args[0] + " Successfully deleted", 5000);
                        m.deleteIn(5000);
                        return;
                    }
                }
            }
        }
        if (!(userDb.people[id] && userDb.people[id].hoard)) {
            m.reply(`Could not find any hoard for **${name}**`, 5000);
            m.deleteIn(5000);
            return;
        }
        hoard = Object.keys(userDb.people[id].hoard);
        var rando = hoard[Math.floor(Math.random() * hoard.length)];
        if (hoard.indexOf(args[0]) > -1) {
            rando = hoard[hoard.indexOf(args[0])];
        }
        var origID = userDb.people[id].hoard[rando];
        index = `Item ${hoard.indexOf(rando) + 1} of ${hoard.length} from :heart_eyes: hoard`;
        if (!origID || !origID.length) {
            var hoardInnder = Object.keys(origID);
            var hoardName = rando;
            var randomNum = Math.floor(Math.random() * hoardInnder.length);
            rando = hoardInnder[randomNum];
            if (utils.isNum(args[1]) && utils.toNum(args[1]) > 0 && utils.toNum(args[1]) < hoardInnder.length + 1) {
                var pass = true;
                rando = hoardInnder[utils.toNum(args[1]) - 1];
            }
            index = `Item ${hoardInnder.indexOf(rando) + 1} of ${hoardInnder.length} from the ${hoardName} hoard`;
            origID = origID[rando];
        }
        var user = bot.users.filter(m => m.id == origID)[0];
        if (!user) {
            user = m.author;
            origID = user.id;
        }
        var hash = user.avatar;
        var og = `https://cdn.discordapp.com/avatars/${origID}/${hash}.jpg?size=128`;
        if (!args) {
            if (rando == undefined) {
                var i = 0;
                var newNumber = 0;
                while (!rando.length && i < 4 && randomNum == newNumber) {
                    newNumber = Math.floor(Math.random() * hoard.length);
                    rando = hoard[newNumber];
                    i++;
                }
            }
        }
        if (!rando) {
            if (hoard[hoard.indexOf(args[0])]) {
                m.reply("Please react to messages with " + hoard[hoard.indexOf(args[0])] + " to pull them up in their own hoard", 5000);
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
                "content": `A Random piece, from **${name}**'s hoard`,
                "embed": {
                    "description": index,
                    "color": 0xA260F6,
                    "image": {
                        "url": rando
                    },
                    "author": {
                        "name": name,
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
                    "content": `A Random piece, from **${name}**'s hoard`,
                    "embed": {
                        "description": index,
                        "color": 0xA260F6,
                        "image": {
                            "url": imgURL[0]
                        },
                        "author": {
                            "name": name,
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
                "content": `A Random piece, from **${name}**'s hoard`,
                "embed": {
                    "description": rando,
                    "color": 0xA260F6,
                    "title": index,
                    "author": {
                        "name": name,
                        "icon_url": url
                    },
                    "footer": {
                        "icon_url": og,
                        "text": `Original post by ${user.username}`
                    }
                }
            };
        }
        if (utils.isNum(args[1]) && !pass) {
            msg.content = "That is not a valid index number for that hoard\n\n" + msg.content;
        }
        m.reply(msg);
        return;
    },
    help: "View hoards. React with :heart_eyes: to add"
};
