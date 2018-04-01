const _ = require("../people.js");
var data = _.load();
module.exports = {
    main: function(Bot, m, args, prefix) {
        var name1 = m.cleanContent.replace(/!names /i, "")

        function capFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        var isThisUsernameThatUsername = function(member) {
            var memberName = member.nick || member.username
            if (memberName.toLowerCase() == name1.toLowerCase()) {
                return true;
            }
        }
        var member = m.guild.members.find(isThisUsernameThatUsername)
        var mentioned = m.mentions[0] || member || m.author
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username
        var nameArray = []
        var id = mentioned.id
        var hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"]
        var hand = hands[Math.floor(Math.random() * hands.length)]
        if (!(data.people[id])) {
            data.people[id] = {};
        }
        if (!(data.people[id].names)) {
            data.people[id].names = {}
        }
        if (args.search(/remove /i) !== -1) {
            if (mentioned.id != m.author.id) {
                Bot.createMessage(m.channel.id, "Okay....but that isnt you");
                return;
            }
            var incomingEntries = name1.replace(/remove /i, "").replace(": ", " ").split(" | ")
            var incoming = [];
            var iterator = incomingEntries.entries()
            for (let e of iterator) {
            e[1] = capFirstLetter(e[1])
            if (data.people[id].names[e[1]]) {
                delete data.people[id].names[e[1]]
                _.save(data)
                Bot.createMessage(m.channel.id, "Removed: **" + e[1] + "** from your names list" + hand).then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                    }, 5000)
                })
            } else {
                Bot.createMessage(m.channel.id, "Sorry, I couldnt find **" + e[1] + "** in your names list");
            }
          }
          return;
        }
        if (args.search(/add /i) !== -1) {
            if (mentioned.id != m.author.id) {
                Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                Bot.createMessage(m.channel.id, "Okay....but that isnt you");
                return;
            }
            var incomingEntries = name1.replace(/add /i, "").replace(": ", " ").split(" | ")
            var incoming = [];
            var iterator = incomingEntries.entries()
            for (let e of iterator) {
                e[1] = capFirstLetter(e[1])
                if (data.people[id].names[e[1]]) {
                    Bot.createMessage(m.channel.id, e[1] + "'s already been added, silly~").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                        }, 5000)
                    })
                    continue;
                } else {
                    if (e[1].search(/ male/i) !== -1) {
                        var cleanName = e[1].replace(/ male/i, "")
                        data.people[id].names[cleanName] = "male"
                        _.save(data)
                        Bot.createMessage(m.channel.id, "Added **" + cleanName + "** " + hand).then((msgsg) => {
                            return setTimeout(function() {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                            }, 5000)
                        })
                        continue;
                    }
                    if (e[1].search(/ futa/i) !== -1 || e[1].search(/ futanari/i) !== -1) {
                        var cleanName = e[1].replace(/ futa/i, "").replace(/ futanari/i, "")
                        data.people[id].names[cleanName] = "futa"
                        _.save(data)
                        Bot.createMessage(m.channel.id, "Added **" + cleanName + "** " + hand).then((msg) => {
                            return setTimeout(function() {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                            }, 5000)
                        })
                        continue;
                    } else {
                        data.people[id].names[e[1]] = "female"
                        _.save(data)
                        Bot.createMessage(m.channel.id, "Added **" + e[1] + "** " + hand).then((msg) => {
                            return setTimeout(function() {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                                Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                            }, 5000)
                        })
                    }
                }
            }
            return;
        }
        if (Object.keys(data.people[id].names).length < 1) {
            Bot.createMessage(m.channel.id, "I could find any names list for **" + name + "** :(");
            return;
        } else {
            var names = data.people[id].names
            Object.entries(names).forEach(function(key) {
                nameArray.push(`${key[0]}: ${key[1]}`);
            });
            Bot.createMessage(m.channel.id, {
                content: "",
                embed: {
                    color: 0xA260F6,
                    title: Object.keys(data.people[id].names).length + " names used by **" + name + "**",
                    description: " \n" + nameArray.join("\n"),
                    author: {
                        name: name,
                        icon_url: mentioned.avatarURL
                    }
                }
            });
        }

    },
    help: "Add custom names for !v and !g"
}
