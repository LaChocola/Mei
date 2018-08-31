const _ = require("../people.js");
var data = _.load();
module.exports = {
    main: function(Bot, m, args, prefix) {
        var name1 = m.cleanContent.replace(/!hoard /i, "")
        var isThisUsernameThatUsername = function(member) {
            var memberName = member.nick || member.username
            if (memberName.toLowerCase() == name1.toLowerCase()) {
                return true;
            }
        }
        var args = args.split(" | ")
        var member = m.guild.members.find(isThisUsernameThatUsername)
        var mentioned = m.mentions[0] || member || m.author
        var name = m.channel.guild.members.get(mentioned.id).nick || mentioned.username
        var artists = data.people
        var nameArray = []
        var id = mentioned.id
        var url = m.channel.guild.members.get(id).avatarURL
        if (args[0]) {
          if (args[0].toLowerCase().includes("add")) {
            args[0] = args[0].replace(/add/i, "").replace(/\s/g, "")
            args[0] = args[0].split(" ")
            if (args[0].length > 1) {
              Bot.createMessage(m.channel.id, "Sorry, you can only make a hoard by using 1 emoji");
              return;
            }
            args[0] = args[0].join("")
            if (/<:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])) {
              args[0] = /<:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])[1]
            }
            if (data.people[id].hoard) {
              var hoard = Object.keys(data.people[id].hoard)
              if (hoard[args[0]]) {
                Bot.createMessage(m.channel.id, args[0]+" is already one of your hoards");
                return;
              }
            }
            if (!data.people[id].hoard) {
              data.people[id].hoard = {}
              _.save(data)
              _.load()
            }
            if (!data.people[id].hoard[args[0]]) {
              data.people[id].hoard[args[0]] = {}
              _.save(data)
              _.load()
              Bot.createMessage(m.channel.id, "Successfully added hoard: "+args[0]);
              return;
            }
          }
          if (args[0].toLowerCase().includes("remove")) {
            args[0] = args[0].replace(/remove/i, "").replace(/\s/g, "")
            args[0] = args[0].split(" ")
            if (args[0].length > 1) {
              Bot.createMessage(m.channel.id, "Sorry, you can only 1 hoard at a time");
              return;
            }
            args[0] = args[0].join("")
            if (/<:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])) {
              args[0] = /<:([a-zA-Z0-9]+):[0-9]+>/.exec(args[0])[1]
            }
            if (data.people[id].hoard) {
              var hoard = Object.keys(data.people[id].hoard)
              if (hoard.indexOf(args[0]) > -1) {
                delete data.people[id].hoard[args[0]]
                _.save(data)
                _.load()
                Bot.createMessage(m.channel.id, args[0]+" Successfully deleted");
                return;
              }
            }
          }
        }
        if (!(data.people[id]) || !(data.people[id].hoard)) {
            Bot.createMessage(m.channel.id, `Could not find any hoard for **${name}**`);
            return;
        }
        var hoard = Object.keys(data.people[id].hoard)
        var rando = hoard[Math.floor(Math.random() * hoard.length)]

        if (hoard.indexOf(args[0]) > -1) {
          rando = hoard[hoard.indexOf(args[0])]
        }
        var origID = data.people[id].hoard[rando]
        var index = `Item ${hoard.indexOf(rando)+1} of ${hoard.length} from :heart_eyes: hoard`
        if (!origID.length) {
          var hoardInnder = Object.keys(origID)
          var hoardName = rando
          rando = hoardInnder[Math.floor(Math.random() * hoardInnder.length)]
          if (!isNaN(+args[1]) && 0 < +args[1] && +args[1] < hoardInnder.length+1) {
            var pass = true
            rando = hoardInnder[+args[1]-1]
          }
          index = `Item ${hoardInnder.indexOf(rando)+1} of ${hoardInnder.length} from the ${hoardName} hoard`
          origID = origID[rando]
        }
        var user = Bot.users.filter(m => m.id == origID)[0]
        if (!user) {
          user = m.author
          origID = user.id
        }
        var hash = user.avatar
        var og = `https://cdn.discordapp.com/avatars/${origID}/${hash}.jpg?size=128`
        if (!rando) {
          if (hoard[hoard.indexOf(args[0])]) {
            Bot.createMessage(m.channel.id, "Please react to messages with "+hoard[hoard.indexOf(args[0])]+" to pull them up in their own hoard");
            return;
          }
          else {
            Bot.createMessage(m.channel.id, "Please react to messages with your hoard emoji's to pull them up in their own hoard");
            return;
          }
        }
        var imgURL = /([a-z\-_0-9\/\:\.]*\.(?:png|jpg|gif|svg|jpeg)[:orig]*)/i.exec(rando)
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
            }
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
            }
          }
        } else {
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
            msg.content = `That is not a valid index number for that hoard\n\n`+msg.content
          }
          Bot.createMessage(m.channel.id, msg);
          return;
    },
    help: "View items in your hoard. React to things with :heart_eyes: to add items"
}
