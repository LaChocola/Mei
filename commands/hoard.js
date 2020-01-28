"use strict";

const peopledb = require("../people");

module.exports = {
    main: async function(Bot, m, args, prefix) {
        var data = await peopledb.load();

        var name1 = m.cleanContent.replace(/!hoard /i, "");
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
                    Bot.createMessage(m.channel.id, "You can only modify your own hoards").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                if (data.people[id].hoard) {
                    var hoard = Object.keys(data.people[id].hoard);
                    var counter = [];
                    var total = 0;
                    for (let item of hoard) {
                        if (data.people[id].hoard[item]) {
                            var count = Object.keys(data.people[id].hoard[item]).length;
                        }
                        total = total + count;
                        counter.push(`${item}: ${count} items`);
                    }
                    Bot.createMessage(m.channel.id, {
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
                else if (!data.people[id].hoard) {
                    Bot.createMessage(m.channel.id, "You do not currently have a hoard. Please react to messages with your hoard emoji's in order to create a hoard").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                }
                return;
            }
            if (args[0].toLowerCase().includes("add")) {
                args[0] = args[0].replace(/add/i, "").replace(/\s/g, "");
                args[0] = args[0].split(" ");
                if (id !== m.author.id) {
                    Bot.createMessage(m.channel.id, "You can only modify your own hoards").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                if (args[0].length > 1) {
                    Bot.createMessage(m.channel.id, "Sorry, you can only make a hoard by using 1 emoji").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                args[0] = args[0].join("");
                if (/<:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])) {
                    args[0] = /<:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])[1];
                }
                if (/<a:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])) {
                    args[0] = /<a:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])[1];
                }
                if (data.people[id].hoard) {
                    var hoard = Object.keys(data.people[id].hoard);
                    if (hoard[args[0]]) {
                        Bot.createMessage(m.channel.id, args[0] + " is already one of your hoards").then((msg) => {
                            return setTimeout(function() {
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            }, 5000);
                        });
                        return;
                    }
                }
                if (!data.people[id].hoard) {
                    data.people[id].hoard = {};
                    await peopledb.save(data);
                }
                if (!data.people[id].hoard[args[0]]) {
                    data.people[id].hoard[args[0]] = {};
                    await peopledb.save(data);
                    Bot.createMessage(m.channel.id, "Successfully added hoard: " + args[0]).then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                return;
            }
            if (args[0].toLowerCase().includes("remove")) {
                args[0] = args[0].replace(/remove/i, "").replace(/\s/g, "");
                args[0] = args[0].split(" ");
                if (id !== m.author.id) {
                    Bot.createMessage(m.channel.id, "You can only modify your own hoards").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                if (args[0].length > 1) {
                    Bot.createMessage(m.channel.id, "Sorry, you can only remove 1 hoard at a time").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                args[0] = args[0].join("");
                if (/<:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])) {
                    args[0] = /<:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])[1];
                }
                if (!isNaN(+args[1]) && 0 < +args[1]) {
                    if (data.people[id].hoard) {
                        var hoard = Object.keys(data.people[id].hoard);
                        args[1] = +args[1];
                        --args[1];
                        if (hoard.indexOf(args[0]) > -1) {
                            var index = hoard.indexOf(args[0]);
                            if (data.people[id].hoard[args[0]]) {
                                var item = Object.keys(data.people[id].hoard[args[0]])[args[1]];
                                delete data.people[id].hoard[args[0]][item];
                                await peopledb.save(data);
                                Bot.createMessage(m.channel.id, `Successfully deleted item ${args[1] + 1} from ${args[0]}`).then((msg) => {
                                    return setTimeout(function() {
                                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                    }, 5000);
                                });
                                return;
                            }
                            Bot.createMessage(m.channel.id, "Could not find that item in that hoard").then((msg) => {
                                return setTimeout(function() {
                                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                                }, 5000);
                            });
                            return;
                        }
                    }
                }
                if (data.people[id].hoard) {
                    var hoard = Object.keys(data.people[id].hoard);
                    if (hoard.indexOf(args[0]) > -1) {
                        delete data.people[id].hoard[args[0]];
                        await peopledb.save(data);
                        Bot.createMessage(m.channel.id, args[0] + " Successfully deleted").then((msg) => {
                            return setTimeout(function() {
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            }, 5000);
                        });
                        return;
                    }
                }
                return;
            }
            if (args[0].toLowerCase().includes("export")) {
                if (id !== m.author.id) {
                    Bot.createMessage(m.channel.id, "You can only export your own hoards").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }
                if (!data.people[id].hoard) {
                    Bot.createMessage(m.channel.id, "You do not currently have a hoard. Please react to messages with your hoard emoji's in order to create a hoard").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
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
                var hoard = data.people[id].hoard;
                var keys = Object.keys(data.people[id].hoard);
                var y = 0;
                for (var i = 0; i < keys.length; i++) {
                    var category = keys[i];
                    if (Object.keys(hoard[category]).length > 0) {
                        y++;
                        console.log(category);
                        var items = Object.keys(hoard[category]);
                        var n = 1;
                        for (var item of items) {
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
                    Bot.createMessage(m.channel.id, "You do not currently have any items in your hoard. Please react to messages with your hoard emoji's in order to create a hoard").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                        }, 5000);
                    });
                    return;
                }

                await Bot.createMessage(m.channel.id, `Here is your hoard file as of right now. You have **${y}** active hoards, with **${eLength}** items total. (This message will self destruct in 60 seconds)`, {
                    "file": exports,
                    "name": `${id} Hoard Export (${new Date().toLocaleString().split(",")[0]}).html`
                })
                    .then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 60000);
                    })
                    .catch((err) => {
                        console.log(err);
                        Bot.createMessage(m.channel.id, "Something went wrong while trying to export your hoard, please try again later.").then((msg) => {
                            return setTimeout(function() {
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            }, 5000);
                        });
                    });
                return;
            }
        }
        if (!data.people[id] || !data.people[id].hoard) {
            Bot.createMessage(m.channel.id, `Could not find any hoard for **${name}**`).then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                }, 5000);
            });
            return;
        }
        var hoard = Object.keys(data.people[id].hoard);
        var rando = hoard[Math.floor(Math.random() * hoard.length)];
        if (hoard.indexOf(args[0]) > -1) {
            rando = hoard[hoard.indexOf(args[0])];
        }
        var origID = data.people[id].hoard[rando];
        var index = `Item ${hoard.indexOf(rando) + 1} of ${hoard.length} from :heart_eyes: hoard`;
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
        var user = Bot.users.filter(m => m.id === origID)[0];
        if (!user) {
            user = m.author;
            origID = user.id;
        }
        var hash = user.avatar;
        var og = `https://cdn.discordapp.com/avatars/${origID}/${hash}.jpg?size=128`;
        if (!args) {
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
            if (hoard[hoard.indexOf(args[0])]) {
                Bot.createMessage(m.channel.id, `No items found in the ${hoard[hoard.indexOf(args[0])]} hoard. Please react to messages with ${hoard[hoard.indexOf(args[0])]} to pull them up in their own hoard`).then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    }, 5000);
                });
                return;
            }
            else {
                Bot.createMessage(m.channel.id, "Please react to messages with your hoard emoji's to pull them up in their own hoard").then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    }, 5000);
                });
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
                var msg = {
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
            var msg = {
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
        Bot.createMessage(m.channel.id, msg);
        return;
    },
    help: "View hoards. React with :heart_eyes: to add"
};
