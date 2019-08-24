const _ = require("../people.js");
var data = _.load();
var unidecode = require("unidecode")
module.exports = {
    main: function(Bot, m, args, prefix) {
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
          if (args.toLowerCase().includes("dislike")) {
            var incomingEntries = name1.replace(/\bsearch\b/i, "").replace(/\bdislike\b/i, "").replace(": ", " ").split(" | ")
            var incoming = [];
            var iterator = incomingEntries.entries()
            for (let e of iterator) {
                incoming.push(capFirstLetter(e[1].trim()))
            }
            var matches = Object.keys(data.people).filter(k => data.people[k].fetishes && data.people[k].fetishes[`${incoming[0]}`] == "dislike")
            if (matches.length < 1) {
                Bot.createMessage(m.channel.id, "No matches found");
                return;
            } else {
                var usernames = []
                for (const match of matches) {
                    if (m.channel.guild.members.get(match)) {
                        var properName = m.channel.guild.members.get(match).nick || m.channel.guild.members.get(match).username
                        usernames.push("***" + unidecode(properName) + "***")
                    }
                }
                if (usernames.length < 1) {
                  Bot.createMessage(m.channel.id, "No matches found");
                  return;
                }
                Bot.createMessage(m.channel.id, "Users that dislike `" + incoming[0] + "`:\n\n" + usernames.join("\n"));
                return;
            }
          }
          else {
            var incomingEntries = name1.replace(/\bsearch\b\s/i, "").replace(": ", " ").split("|")
            var incoming = [];
            var iterator = incomingEntries.entries()
            for (let e of iterator) {
                incoming.push(capFirstLetter(e[1].trim()))
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
                        usernames.push("***" + unidecode(properName) + "***")
                    }
                }
                Bot.createMessage(m.channel.id, "Users that like `" + incoming[0] + "`:\n\n" + usernames.join("\n"));
                return;
            }
          }
        }
        if (args.toLowerCase().includes("remove ")) {
            if (mentioned.id != m.author.id) {
                Bot.createMessage(m.channel.id, "Okay....but that isnt you");
                return;
            }
            var incoming = name1.replace(/\bremove\b/i, "").replace(" ", "").split("|")
            if (data.people[id].fetishes[capFirstLetter(incoming[0])]) {
                delete data.people[id].fetishes[capFirstLetter(incoming[0])]
                _.save(data)
                Bot.createMessage(m.channel.id, "Removed: **" + incoming[0] + "** from your fetish list" + hand).then((msg) => {
                  setTimeout(function() {
                      Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                      Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                  }, 5000)
                })
                return;
            } else {
                Bot.createMessage(m.channel.id, "Sorry, I couldnt find **" + incoming[0] + "** in your fetish list").then((msg) => {
                  setTimeout(function() {
                      Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                      Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                  }, 5000)
                })
                return;
            }
        }
        if (args.toLowerCase().includes("add")) {
            if (mentioned.id != m.author.id) {
                Bot.createMessage(m.channel.id, "Okay....but that isnt you");
                return;
            }
            var incomingEntries = name1.replace(/\badd\b/i, "").replace(/^[ \t]+/,"").replace(/[ \t]+$/,"").split("|")
            var incoming = [];
            var iterator = incomingEntries.entries()
            for (let e of iterator) {
                if (!e[1]) {
                  break;
                }
                incoming.push(capFirstLetter(e[1]))
            }
            if (incoming.length == 0) {
              Bot.createMessage(m.channel.id, 'Please say which fetish you would like to add, for example `!fetish add Butts`').then((msg) => {
                setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                }, 5000)
              });
              return;
            }
            if (data.people[id].fetishes[incoming[0]]) {
                Bot.createMessage(m.channel.id, "That's already been added, silly~").then((msg) => {
                  return setTimeout(function() {
                      Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                      Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                  }, 5000)
                })
                return;
            }
            else if (incoming[0].toLowerCase().includes("dislike")) {
              incoming[0] = incoming[0].replace(/\bdislike\b/ig, "")
              incoming[0] = capFirstLetter(incoming[0].trim())
              if (!incoming[0]) {
                Bot.createMessage(m.channel.id, 'Please say which fetish you would like to dislike, for example `!fetish add Death dislike`').then((msg) => {
                  setTimeout(function () {
                      Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                      Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                  }, 5000)
                });
                return;
              }
              data.people[id].fetishes[incoming[0]] = "dislike"
              _.save(data)
              Bot.createMessage(m.channel.id, "Added Dislike: **" + incoming[0] + "** " + hand).then((msg) => {
                setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                }, 5000)
              })
              return;
          } else {
              data.people[id].fetishes[incoming[0]] = "like"
              _.save(data)
              Bot.createMessage(m.channel.id, "Added **" + incoming[0] + "** " + hand).then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                }, 5000)
              })
              return;
          }
        }
        if (Object.keys(data.people[id].fetishes).length < 1) {
            Bot.createMessage(m.channel.id, "I could find any fetish list for **" + unidecode(name) + "** :(");
            return;
        } else {
            var fetishes = data.people[id].fetishes
            var fetishes2 = data.people[m.author.id]            
            if (!fetishes2.fetishes || !fetishes2) {
              Bot.createMessage(m.channel.id, "You need to have a fetish list in order to compare lists with someone, silly bug");
              return;
            }
            fetishes2 = fetishes2.fetishes
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
            var limit = false
            if (likes.join("\n").length > 1020) {
              Bot.createMessage(m.channel.id, `You have reached the character limit for Likes, please remove ${likes.join("\n").length-1020} characters from your list to display the fetish list`);
              var limit = true
            }
            if (dislikes.join("\n").length > 1020) {
              Bot.createMessage(m.channel.id, `You have reached the character limit for Dislikes, please remove ${dislikes.join("\n").length-1020} characters from your list to display the fetish list`);
              var limit = true
            }
            if (commonLikes.join("\n").length > 1020) {
              Bot.createMessage(m.channel.id, `You have reached the character limit for CommonLikes, please remove ${CommonLikes.join("\n").length-1020} characters from your list to display the fetish list`);
              var limit = true
            }
            if (commonDislikes.join("\n").length > 1020) {
              Bot.createMessage(m.channel.id, `You have reached the character limit for CommonDislikes, please remove ${commonDislikes.join("\n").length-1020} characters from your list to display the fetish list`);
              var limit = true
            }
            if (limit) {
              return;
            }
            if (mentioned.id == m.author.id) {
                Bot.createMessage(m.channel.id, {
                    content: "",
                    embed: {
                        color: 0xA260F6,
                        title: Object.keys(data.people[id].fetishes).length + " fetishes for **" + unidecode(name) + "**",
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
                            name: unidecode(name),
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
}
