"use strict";

const escapeStringRegexp = require("escape-string-regexp");

const peopledb = require("../people");

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var peopledata = await peopledb.load();

        var name1 = m.cleanContent.replace(new RegExp(escapeStringRegexp(prefix) + "hoard", "i"), "");
        function isThisUsernameThatUsername(member) {
            var memberName = member.nick || member.username;
            if (memberName.toLowerCase() === name1.toLowerCase()) {
                return true;
            }
        }
        args = args.split(" | ");
        var member = m.guild.members.find(isThisUsernameThatUsername);
        var mentioned = m.mentions[0] || member || m.author;
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username;
        var id = mentioned.id;
        var url = m.channel.guild.members.get(id).avatarURL;
        if (args[0]) {
            if (args[0].toLowerCase().includes("list")) {
                args[0] = args[0].replace(/list/i, "").replace(/\s/g, "");
                args[0] = args[0].split(" ");
                if (id !== m.author.id) {
                    m.reply("You can only modify your own hoards", 5000, true);
                    return;
                }
                if (peopledata.people[id].hoard) {
                    let hoard = Object.keys(peopledata.people[id].hoard);
                    var counter = [];
                    var total = 0;
                    for (let item of hoard) {
                        if (peopledata.people[id].hoard[item]) {
                            var count = Object.keys(peopledata.people[id].hoard[item]).length;
                        }
                        total = total + count;
                        counter.push(`${item}: ${count} items`);
                    }
                    m.reply({
                        embed: {
                            color: 0xA260F6,
                            title: `${hoard.length} hoards with ${total} items used by **${name}**`,
                            description: " \n" + counter.join("\n"),
                            author: {
                                name: name,
                                icon_url: mentioned.avatarURL
                            }
                        }
                    });
                }
                else if (!peopledata.people[id].hoard) {
                    m.reply("You do not currently have a hoard. Please react to messages with your hoard emoji's in order to create a hoard", 5000, true);
                }
                return;
            }
            if (args[0].toLowerCase().includes("add")) {
                args[0] = args[0].replace(/add/i, "").replace(/\s/g, "");
                args[0] = args[0].split(" ");
                if (id !== m.author.id) {
                    m.reply("You can only modify your own hoards", 5000, true);
                    return;
                }
                if (args[0].length > 1) {
                    m.reply("Sorry, you can only make a hoard by using 1 emoji", 5000, true);
                    return;
                }
                args[0] = args[0].join("");
                if (/<:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])) {
                    args[0] = /<:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])[1];
                }
                if (/<a:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])) {
                    args[0] = /<a:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])[1];
                }
                if (peopledata.people[id].hoard) {
                    let hoard = Object.keys(peopledata.people[id].hoard);
                    if (hoard[args[0]]) {
                        m.reply(args[0] + " is already one of your hoards", 5000, true);
                        return;
                    }
                }
                if (!peopledata.people[id].hoard) {
                    peopledata.people[id].hoard = {};
                    await peopledb.save(peopledata);
                }
                if (!peopledata.people[id].hoard[args[0]]) {
                    peopledata.people[id].hoard[args[0]] = {};
                    await peopledb.save(peopledata);
                    m.reply("Successfully added hoard: " + args[0], 5000, true);
                    return;
                }
                return;
            }
            if (args[0].toLowerCase().includes("remove")) {
                args[0] = args[0].replace(/remove/i, "").replace(/\s/g, "");
                args[0] = args[0].split(" ");
                if (id !== m.author.id) {
                    m.reply("You can only modify your own hoards", 5000, true);
                    return;
                }
                if (args[0].length > 1) {
                    m.reply("Sorry, you can only remove 1 hoard at a time", 5000, true);
                    return;
                }
                args[0] = args[0].join("");
                if (/<:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])) {
                    args[0] = /<:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])[1];
                }
                if (!isNaN(+args[1]) && 0 < +args[1]) {
                    if (peopledata.people[id].hoard) {
                        let hoard = Object.keys(peopledata.people[id].hoard);
                        args[1] = +args[1];
                        --args[1];
                        if (hoard.indexOf(args[0]) > -1) {
                            if (peopledata.people[id].hoard[args[0]]) {
                                let item = Object.keys(peopledata.people[id].hoard[args[0]])[args[1]];
                                delete peopledata.people[id].hoard[args[0]][item];
                                await peopledb.save(peopledata);
                                m.reply(`Successfully deleted item ${args[1] + 1} from ${args[0]}`, 5000, true);
                                return;
                            }
                            m.reply("Could not find that item in that hoard", 5000, true);
                            return;
                        }
                    }
                }
                if (peopledata.people[id].hoard) {
                    let hoard = Object.keys(peopledata.people[id].hoard);
                    if (hoard.indexOf(args[0]) > -1) {
                        delete peopledata.people[id].hoard[args[0]];
                        await peopledb.save(peopledata);
                        m.reply(args[0] + " Successfully deleted", 5000, true);
                        return;
                    }
                }
                return;
            }
            if (args[0].toLowerCase().includes("export")) {
                if (id !== m.author.id) {
                    m.reply("You can only export your own hoards", 5000, true);
                    return;
                }
                if (!peopledata.people[id].hoard) {
                    m.reply("You do not currently have a hoard. Please react to messages with your hoard emoji's in order to create a hoard", 5000, true);
                    return;
                }
                var time = Date.now();
                var placeHolder =
                    `<!DOCTYPE html>
            <html>
            <style>
              body {
                background-color: black;
                color: white;
              }
              p {
                font-family: "Trebuchet MS", Helvetica, sans-serif;
                font-size: 1.5vh;
              }
              body {
                background-color: black;
                color: white;
              }
              footer{
                display: table;
                text-align: center;
                margin-left: auto;
                margin-right: auto;
                margin-top:2em;
              }
              .hover_img a { }
              .hover_img a span { position:fixed; right: 0; top: 0; height: 100vh; max-width: 70vw; display:none; z-index:99; }
              .hover_img a span img { height: 100%; max-width: 100%; }
              .hover_img a:hover span { display:block; }
            </style>
            <head>
              <title>Hoard Export</title>
            </head>
            <body>
              <h2>Hoard Items:</h2>
              XXX
              <footer>
                <p text-align="center"; font-size=0.5vh>
                This site was automatically generated with the contents of your hoard by Mei#4980 on <script type="text/javascript">document.write(new Date(${time}).toDateString());</script>. Links are all hosted by Discord, and as such may not be available after they are deleted from their servers, if you find any dead links, that is likely the cause. If you enjoy this bot and her features, feel free to check out the links below to join my discord, see Mei's source code, become a patreon, or send a tip through paypal. Any help is much appreciated, and thanks for using my bot. Hope you Enjoy~
                </p>
                <p text-align="center"; font-size=0.5vh>
                  ©Chocola <script type="text/javascript">document.write(new Date().getFullYear());</script> | <a href="https://github.com/LaChocola/Mei">Github</a> <a href="https://discord.gg/HmatPXj">Discord</a> <a href="https://www.patreon.com/Chocola">Patreon</a> <a href="https://www.paypal.me/ChocolaCodes">Paypal</a>
                </p>
              </footer>
            </body>
            </html>`;
                var exports = [];
                let hoard = peopledata.people[id].hoard;
                var keys = Object.keys(peopledata.people[id].hoard);
                var y = 0;
                for (let i = 0; i < keys.length; i++) {
                    var category = keys[i];
                    if (Object.keys(hoard[category]).length > 0) {
                        y++;
                        console.log(category);
                        var items = Object.keys(hoard[category]);
                        var n = 1;
                        for (let item of items) {
                            if (!item.startsWith("http")) {
                                exports.push(`<div class="hover_img"><p>${category} | ${n}: <a>"${item}"</a> posted by &lt;@${hoard[category][item]}&gt;</p></div>`);
                            }
                            if (item.startsWith("http")) {
                                exports.push(`<div class="hover_img"><p>${category} | ${n}: <a href="${item}">${item}<span><img src="${item}" alt="image" height: 100vh; max-width: 70vw; span=""></span></a> posted by &lt;@${hoard[category][item]}&gt;</p></div>`);
                            }
                            n++;
                        }
                    }
                }
                var eLength = exports.length;
                exports = placeHolder.replace("XXX", exports.join("\n"));
                console.log(exports);
                if (exports.length < 1) {
                    m.reply("You do not currently have any items in your hoard. Please react to messages with your hoard emoji's in order to create a hoard", 5000, true);
                    return;
                }

                try {
                    await m.reply({
                        content: `Here is your hoard file as of right now. You have **${y}** active hoards, with **${eLength}** items total. (This message will self destruct in 60 seconds)`,
                        file: {
                            file: exports,
                            name: `${id} Hoard Export (${new Date().toLocaleString().split(",")[0]}).html`
                        }
                    }, 60000, true);
                }
                catch(err) {
                    console.log(err);
                    m.reply("Something went wrong while trying to export your hoard, please try again later.", 5000, true);
                }
                return;
            }
        }
        if (!peopledata.people[id] || !peopledata.people[id].hoard) {
            m.reply(`Could not find any hoard for **${name}**`, 5000, true);
            return;
        }
        let hoard = Object.keys(peopledata.people[id].hoard);
        var rando = hoard[Math.floor(Math.random() * hoard.length)];
        if (hoard.indexOf(args[0]) > -1) {
            rando = hoard[hoard.indexOf(args[0])];
        }
        var origID = peopledata.people[id].hoard[rando];
        let index = `Item ${hoard.indexOf(rando) + 1} of ${hoard.length} from :heart_eyes: hoard`;
        if (!origID || !origID.length) {
            var hoardInnder = Object.keys(origID);
            var hoardName = rando;
            var randomNum = Math.floor(Math.random() * hoardInnder.length);
            rando = hoardInnder[randomNum];
            if (!isNaN(+args[1]) && 0 < +args[1] && +args[1] < hoardInnder.length + 1) {
                var pass = true;
                rando = hoardInnder[+args[1] - 1];
            }
            index = `Item ${hoardInnder.indexOf(rando) + 1} of ${hoardInnder.length} from the ${hoardName} hoard`;
            origID = origID[rando];
        }
        var user = bot.users.filter(m => m.id === origID)[0];
        if (!user) {
            user = m.author;
            origID = user.id;
        }
        var hash = user.avatar;
        var og = `https://cdn.discordapp.com/avatars/${origID}/${hash}.jpg?size=128`;
        if (!args) {
            if (rando === undefined) {
                let i = 0;
                var newNumber = 0;
                while (!rando.length && i < 4 && randomNum === newNumber) {
                    newNumber = Math.floor(Math.random() * hoard.length);
                    rando = hoard[newNumber];
                    i++;
                }
            }
        }
        if (!rando) {
            if (hoard[hoard.indexOf(args[0])]) {
                m.reply(`No items found in the ${hoard[hoard.indexOf(args[0])]} hoard. Please react to messages with ${hoard[hoard.indexOf(args[0])]} to pull them up in their own hoard`, 5000, true);
                return;
            }
            else {
                m.reply("Please react to messages with your hoard emoji's to pull them up in their own hoard", 5000, true);
                return;
            }
        }
        var imgURL = /([a-z\-_0-9/:.]*\.(?:png|jpg|gif|svg|jpeg)[:orig]*)/i.exec(rando);
        var msg;
        if (rando.includes("https://cdn.discordapp.com")) {
            msg = {
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
        if (!isNaN(+args[1]) && !pass) {
            msg.content = "That is not a valid index number for that hoard\n\n" + msg.content;
        }
        m.reply(msg);
        return;
    },
    help: "View hoards. React with :heart_eyes: to add"
};
