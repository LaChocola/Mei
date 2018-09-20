const _ = require("../servers.js");
var data = _.load();
module.exports = {
    main: function(Bot, m, args, prefix) {
        var hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"]
        var hand = hands[Math.floor(Math.random() * hands.length)]
        var downs = [":thumbsdown::skin-tone-1:", ":thumbsdown::skin-tone-2:", ":thumbsdown::skin-tone-3:", ":thumbsdown::skin-tone-4:", ":thumbsdown::skin-tone-5:", ":thumbsdown:"]
        var down = downs[Math.floor(Math.random() * downs.length)]
        var guild = m.channel.guild
        m.content = m.content.toLowerCase()
        if (m.content == `${prefix}role` || m.content == `${prefix}role `) {
            Bot.createMessage(m.channel.id, "What do you want to do? | `!role add <role name>` | `!role remove <role name>` | `!role list`");
            return;
        }
        if (m.content.includes(`${prefix}role  `)) {
            Bot.createMessage(m.channel.id, "One space Please");
            return;
        }
        if (m.content.includes(`${prefix}role   `)) {
            Bot.createMessage(m.channel.id, "***One*** space Please");
            return;
        }
        var roles = undefined
        if (data[guild.id]) {
          if (data[guild.id].roles) {
            if (Object.keys(data[guild.id].roles)[0]) {
              var roles = data[guild.id].roles
            }
          }
        }
        if (!roles) {
          Bot.createMessage(m.channel.id, "No roles have been set up yet. Use `!edit roles` to add and remove assignable roles. (Requires Moderator Permissions)");
          return;
        }

        if (m.mentions.length > 0 && m.mentions[0].id != m.author.id) {
            Bot.createMessage(m.channel.id, "You can only assign roles to yourself");
            return;
        }
        if (m.content.includes("list")) {
          if (!data[guild.id].roles) {
            Bot.createMessage(m.channel.id, "There are no roles set up in this server, to add roles, please use `!edit roles add <rolename>`");
            return;
          }
          var roles = Object.keys(data[guild.id].roles)
          Bot.createMessage(m.channel.id, {
              content: "",
              embed: {
                  color: 0xA260F6,
                  title: roles.length + " roles are available:",
                  description: " \n" + roles.join("\n")
              }
          });
        }
        if (m.content.includes("add")) {
            if (!m.content.includes(" | ")) {
                var content = m.cleanContent.toLowerCase().replace(`${prefix}role add `, "")
                if (roles[content]) {
                    var roleID = roles[content]
                    Bot.addGuildMemberRole(m.channel.guild.id, m.author.id, roleID, "They...asked for it?").then(() => {
                        return Bot.createMessage(m.channel.id, hand + " Successful added: " + content).then((msg) => {
                            return setTimeout(function() {
                                Bot.deleteMessage(msg.channel.id, msg.id, "Timeout")
                            }, 7000) && setTimeout(function() {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                            }, 7000)
                        })
                    })
                    return;
                } else {
                    Bot.createMessage(m.channel.id, "'" + content + "' is not a role that as been set up in this server").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(msg.channel.id, msg.id, "Timeout")
                        }, 7000) && setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        }, 7000)
                    })
                    return;
                }
            } else if (m.content.includes(" | ")) {
                var content = m.cleanContent.toLowerCase().replace(`${prefix}role add `, "").split(" | ")
                var iterator = content.entries()
                var found = []
                var notFound = []
                for (let e of iterator) {
                    if (roles[e[1]]) {
                        var roleID = roles[e[1]]
                        Bot.addGuildMemberRole(m.channel.guild.id, m.author.id, roleID, "They...asked for it?");
                        found.push(e[1]);
                    } else if (!roles[e[1]]) {
                        notFound.push(e[1])
                    }
                }
                if (found.length > 0) {
                    Bot.createMessage(m.channel.id, hand + " Successfuly added: " + found.join(", ")).then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(msg.channel.id, msg.id, "Timeout")
                        }, 5000) && setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        }, 5000)
                    })
                    return;
                }
                if (notFound.length > 0) {
                    Bot.createMessage(m.channel.id, down + " Unable to add: " + notFound.join(", ")).then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(msg.channel.id, msg.id, "Timeout")
                        }, 5000) && setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        }, 5000)
                    })
                }
                return;
            }
        }
        if (m.content.includes("remove")) {
            if (!m.content.includes(" | ")) {
                var content = m.cleanContent.toLowerCase().replace(`${prefix}role remove `, "")
                if (roles[content]) {
                    var roleID = roles[content]
                    Bot.removeGuildMemberRole(m.channel.guild.id, m.author.id, roleID, "They...asked for it?").then(() => {
                        return Bot.createMessage(m.channel.id, hand + " Successful removed: " + content).then((msg) => {
                            return setTimeout(function() {
                                Bot.deleteMessage(msg.channel.id, msg.id, "Timeout")
                            }, 5000) && setTimeout(function() {
                                Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                            }, 5000)
                        })
                    })
                    return;
                } else {
                    Bot.createMessage(m.channel.id, content + ": Not found").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(msg.channel.id, msg.id, "Timeout")
                        }, 5000) && setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        }, 5000)
                    })
                    return;
                }
            } else if (m.content.includes(" | ")) {
                var content = m.cleanContent.toLowerCase().replace(`${prefix}role remove `, "").split(" | ")
                var iterator = content.entries()
                var found = []
                var notFound = []
                for (let e of iterator) {
                    if (roles[e[1]]) {
                        var roleID = roles[e[1]]
                        Bot.removeGuildMemberRole(m.channel.guild.id, m.author.id, roleID, "They...asked for it?");
                        found.push(e[1]);
                    } else if (!roles[e[1]]) {
                        notFound.push(e[1])
                    }
                }
                if (found.length > 0) {
                    Bot.createMessage(m.channel.id, hand + " Successfuly removed: " + found.join(", ")).then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(msg.channel.id, msg.id, "Timeout")
                        }, 5000) && setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        }, 5000)
                    })
                }
                if (notFound.length > 0) {
                    Bot.createMessage(m.channel.id, down + " Unable to remove: " + notFound.join(", ")).then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(msg.channel.id, msg.id, "Timeout")
                        }, 5000) && setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        }, 5000)
                    })
                }
                return;
            }
        }

    },
    help: "Assign your role. `!role add rolename`"
}
