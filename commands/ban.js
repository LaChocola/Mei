const _ = require("../servers.js");
var data = _.load();
var reload = require("require-reload")(require);
var miscl = reload('../misc.js');
module.exports = {
      main: function(Bot, m, args, prefix) {
        var name1 = m.cleanContent.replace(/!names /i, "")
        var args = args.split(" ")
        var responses = ["Are you a real villan?", "Have you ever caught a good guy? \nLike a real super hero?", "Have you ever tried a disguise?", "What are you doing?!?!?!", "*NO!*, Don't touch that!", "Fuck Off", "Roses are red\nfuck me ;) "]
        var response = responses[Math.floor(Math.random() * responses.length)]
        var authorRoles = m.channel.guild.members.get(m.author.id).roles
        var modCheck = miscl.isMod(Bot, m, m.channel.guild.members.get(m.author.id), m.channel.guild)
        if (modCheck == false && m.author.id != "161027274764713984") {
            Bot.createMessage(m.channel.id, response);
            return;
        }
        var hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"]
        var hand = hands[Math.floor(Math.random() * hands.length)]
        var isThisUsernameThatUsername = function(member) {
            var memberName = member.nick || member.username
            if (memberName.toLowerCase() == name1.toLowerCase()) {
                return true;
            }
        }
        var member = m.guild.members.find(isThisUsernameThatUsername)
        var mentioned = m.mentions[0] || member
        var id = undefined
        var name = undefined
        if (mentioned) {
          id = mentioned.id
          name = mentioned.username
        }
        if (!id) {
          var args2 = m.cleanContent.replace("!ban ","").replace(/\bundo\b/,"").replace("<@", "").replace(">", "").trim()
          if (!isNaN(+args2)) {
            var id = args2
          }
        }
        var guardian = m.channel.guild.members.get(m.author.id).nick || m.author.username
        if (!name) {
          var user = Bot.users.get(id)
          if (!user || !user.username) {
            var name = "Unknown User"
          }
        }
        if (args.indexOf("undo") > -1) {
            args.splice(args.indexOf("undo"), 1)
            var arg = args[0]
            Bot.unbanGuildMember(m.channel.guild.id, id, "Unbanned by: " + guardian).then(() => {
                Bot.createMessage(m.channel.id, hand + " Successful Unbanned").then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                    }, 5000)
                })
            })
        } else if (id || name != guardian) {
            Bot.banGuildMember(m.channel.guild.id, id, 0, "Banned by: " + guardian).then(() => {
                Bot.createMessage(m.channel.id, hand + " Successful banned: " + name + " (" + id + ")").then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                    }, 5000)
                })
            })
            return;
        } else {
            Bot.createMessage(m.channel.id, "I tried...");
        }
    },
    help: "Get Role Info"
}
