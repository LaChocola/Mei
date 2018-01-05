const _ = require("../people.js");
var data = _.load();
module.exports = {
    main: function(Bot, m, args) {
        var name1 = m.cleanContent.replace(/!fetish /i, "")

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
        var likes = []
        var dislikes = []
        var commonLikes = []
        var commonDislikes = []
        var id = mentioned.id
        var hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"]
        var hand = hands[Math.floor(Math.random() * hands.length)]
        if (!(data.people[id])) {
            data.people[id] = {};
        }
        if (!(data.people[id].fetishes)) {
            data.people[id].fetishes = {}
        }
        if (args.toLowerCase().includes("search ")) {
            var incomingEntries = name1.replace(/search /i, "").replace(": ", " ").split(" | ")
            var incoming = [];
            var iterator = incomingEntries.entries()
            for (let e of iterator) {
                incoming.push(capFirstLetter(e[1]))
            }
            var matches = Object.keys(data.people).filter(k => data.people[k].fetishes && data.people[k].fetishes[`${incoming[0]}`] == "like")
            if (matches.length < 1) {
                Bot.createMessage(m.channel.id, "No matches found");
                return;
            } else {
                var usernames = []
                for (const match of matches) {
                    if (m.channel.guild.members.get(match)) {
                        var properName = m.channel.guild.members.get(match).nick || m.channel.guild.members.get(match).username
                        usernames.push("***" + properName + "***")
                    }
                }
                Bot.createMessage(m.channel.id, "Users that like `" + incoming[0] + "`:\n\n" + usernames.join("\n"));
                return;
            }
        }
        if (args.toLowerCase().includes("remove ")) {
            if (mentioned.id != m.author.id) {
                Bot.createMessage(m.channel.id, "Okay....but that isnt you");
                return;
            }
            var incoming = name1.replace(/remove /i, "").split(" | ")
            if (data.people[id].fetishes[capFirstLetter(incoming[0])]) {
                delete data.people[id].fetishes[capFirstLetter(incoming[0])]
                _.save(data)
                Bot.createMessage(m.channel.id, "Removed: **" + incoming[0] + "** from your fetish list" + hand);
                return;
            } else {
                Bot.createMessage(m.channel.id, "Sorry, I couldnt find **" + incoming[0] + "** in your fetish list");
                return;
            }
        }
        if (args.toLowerCase().includes("add ")) {
            if (mentioned.id != m.author.id) {
                Bot.createMessage(m.channel.id, "Okay....but that isnt you");
                return;
            }
            var incomingEntries = name1.replace(/add /i, "").split(" | ")
            var incoming = [];
            var iterator = incomingEntries.entries()
            for (let e of iterator) {
                incoming.push(capFirstLetter(e[1]))
            }
            if (data.people[id].fetishes[incoming[0]]) {
                Bot.createMessage(m.channel.id, "That's already been added, silly~");
                return;
            } else {
                if (incoming[0].toLowerCase().includes("dislike ")) {
                    incoming[0] = incoming[0].replace(/dislike /ig, "")
                    data.people[id].fetishes[incoming[0]] = "dislike"
                    _.save(data)
                    Bot.createMessage(m.channel.id, "Added Dislike: **" + incoming[0] + "** " + hand);
                    return;
                } else {
                    data.people[id].fetishes[incoming[0]] = "like"
                    _.save(data)
                    Bot.createMessage(m.channel.id, "Added **" + incoming[0] + "** " + hand);
                    return;
                }
            }
        }
        if (Object.keys(data.people[id].fetishes).length < 1) {
            Bot.createMessage(m.channel.id, "I could find any fetish list for **" + name + "** :(");
            return;
        } else {
            var fetishes = data.people[id].fetishes
            var fetishes2 = data.people[m.author.id].fetishes
            if (!fetishes2) {
              Bot.createMessage(m.channel.id, "You need to have a fetish list in order to compare lists with someone, silly bug");
              return;
            }
            if (mentioned.id != m.author.id) {
                let lowerOther = Object.entries(fetishes).map(v => [v[0].toLowerCase(), v[1]]).reduce((map, val) => {
                    map[val[0]] = val[1];
                    return map;
                }, {});
                let lowerMain = Object.entries(fetishes2).map(v => [v[0].toLowerCase(), v[1]]).reduce((map, val) => {
                    map[val[0]] = val[1];
                    return map;
                }, {});
                var commonDislikes = [];
                var commonLikes = [];
                for (let val in lowerMain) {
                    if (lowerOther[val] && lowerOther[val] === lowerMain[val]) {
                        if (lowerMain[val] == 'like') commonLikes.push(val);
                        if (lowerMain[val] == 'dislike') commonDislikes.push(val);
                    }
                }
            }

            for (const [key, value] of Object.entries(fetishes)) {
                if (value == "like") {
                    likes.push(`${key}`)
                }
                if (value == "dislike") {
                    dislikes.push(`${key}`)
                }
            }
            if (likes.length < 1) {
                likes.push("None")
            }
            if (dislikes.length < 1) {
                dislikes.push("None")
            }
            if (mentioned.id == m.author.id) {
                Bot.createMessage(m.channel.id, {
                    content: "",
                    embed: {
                        color: 0xA260F6,
                        title: Object.keys(data.people[id].fetishes).length + " fetishes for **" + name + "**",
                        fields: [{
                                name: ':green_heart: Likes: ' + likes.length,
                                value: likes.join("\n"),
                                inline: true
                            },
                            {
                                name: ':x: Dislikes: ' + dislikes.length,
                                value: dislikes.join("\n"),
                                inline: true
                            }
                        ],
                        author: {
                            name: name,
                            icon_url: mentioned.avatarURL
                        }
                    }
                });
                return;
            } else {
                if (commonLikes.length < 1) {
                    commonLikes.push("None")
                }
                if (commonDislikes.length < 1) {
                    commonDislikes.push("None")
                }
                Bot.createMessage(m.channel.id, {
                    content: "",
                    embed: {
                        color: 0xA260F6,
                        fields: [{
                                name: ':green_heart: Likes: ' + likes.length,
                                value: likes.join("\n") + " \n \u200b",
                                inline: true
                            },
                            {
                                name: "\u200b",
                                value: "\u200b",
                                inline: true
                            },
                            {
                                name: ':x: Dislikes: ' + dislikes.length,
                                value: dislikes.join("\n") + " \n \u200b",
                                inline: true
                            },
                            {
                                name: ':green_heart: Common Likes: ' + commonLikes.length,
                                value: commonLikes.join("\n"),
                                inline: true
                            },
                            {
                                name: "\u200b",
                                value: "\u200b",
                                inline: true
                            },
                            {
                                name: ':x: Common Dislikes: ' + commonDislikes.length,
                                value: commonDislikes.join("\n"),
                                inline: true
                            }
                        ],
                        author: {
                            name: name,
                            icon_url: mentioned.avatarURL
                        }
                    }
                });
                return;
            }
        }

    },
    help: "Add custom fetishes"
}
