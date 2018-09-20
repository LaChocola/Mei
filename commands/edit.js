const _ = require("../servers.js");
var data = _.load();
module.exports = {
      main: async function(Bot, m, args, prefix) {
        var isMod = function(member, guild) {
          if (data[guild.id]) {
            if (data[guild.id].owner != guild.ownerID) {
                Bot.createMessage(m.channel.id, "New server owner detected, updating database.").then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                    }, 5000)
                });
                data[guild.id].owner = guild.ownerID
                _.save(data)
                _.load()
              if (data[guild.id].mods) {
                if (data[guild.id].mods[member.id]) {
                  return true;
                }
              }
              if (m.author.id == data[guild.id].owner || m.author.id == guild.ownerID) {
                return true;
              }
              if (data[guild.id].modRoles) {
                var memberRoles = member.roles
                var mod = false
                for (let role of memberRoles) {
                  if (data[guild.id].modRoles[role]) {
                    mod = true
                  }
                }
                if (mod) {
                  return true;
                }
              }
            }
          }
          else {
            return false;
          }
        }
        var roleSearch = function(role) {
            var roleName = role.name.toLowerCase()
            if (roleName != "undefined") {
                return roleName;
            }
        }
        var findRole = function(role) {
          if (role.name != "undefined" && addedRole.toLowerCase() == role.name.toLowerCase()) {
              var role = role.id
              return role
          }
        }

        var hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"]
        var hand = hands[Math.floor(Math.random() * hands.length)]
        var guild = m.channel.guild

        if (!guild) {
            return;
        }
        var modCheck = !isMod(m.channel.guild.members.get(m.author.id), guild)
        if (m.author.id != guild.ownerID && m.author.id != "161027274764713984" && modCheck == false) {
            Bot.createMessage(m.channel.id, "You must be the server owner, or have moderator permissions to run this command. Have the server owner use `!edit mod add @you` or `!edit mod add @modRole`").then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                }, 20000)
            })
            return;
        }
        if (!(data[guild.id])) {
            data[guild.id] = {}
            data[guild.id].name = guild.name
            data[guild.id].owner = guild.ownerID
            Bot.createMessage(m.channel.id, `Server: ${guild.name} added to database. Populating information ${hand}`).then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                }, 5000)
            })
            _.save(data)
            _.load()
        }
        if (args.toLowerCase().includes("hoards")) {
          if (args.toLowerCase().includes("enable")) {
            if (!data[guild.id].hoards) {
              data[guild.id].hoards = true
              _.save(data)
              Bot.createMessage(m.channel.id, "Hoards enabled for all reactions").then((msg) => {
                  return setTimeout(function() {
                      Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                      Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                  }, 5000)
              })
              return;
            }
            else {
              if (data[guild.id].hoards) {
                Bot.createMessage(m.channel.id, "Hoards have already been enabled in this server").then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                    }, 5000)
                })
                return;
              }
            }
          }
          else {
            data[guild.id].hoards = false
            _.save(data)
            Bot.createMessage(m.channel.id, "Hoards set to :heart_eyes: only").then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                }, 5000)
            })
            return;
          }
        }
        if (args.toLowerCase().includes("notifications")) {
          if (args.toLowerCase().includes("banlog")) {
              if (args.toLowerCase().includes("disable")) {
                  if (data[guild.id].notifications.notifications.banLog) {
                      delete data[guild.id].notifications.notifications.banLog
                      Bot.createMessage(m.channel.id, "Ban Logs disabled").then((msg) => {
                          return setTimeout(function() {
                              Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                              Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                          }, 5000)
                      })
                      _.save(data)
                      return;
                  }
                  else {
                      Bot.createMessage(m.channel.id, "No ban log is currently set, I cant disable what isnt there.").then((msg) => {
                          return setTimeout(function() {
                              Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                              Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                          }, 5000)
                      })
                      return;
                  }
              }
              if (args.toLowerCase().includes("enable")) {
                if (!m.channelMentions[0]) {
                  Bot.createMessage(m.channel.id, "Please mention which channel you want the ban log to appear in");
                  return;
                }
                var channelID = m.channelMentions[0]
                var channel = Bot.getChannel(channelID)
                if (channel.permissionsOf("309220487957839872").json.sendMessages != true) {
                    Bot.createMessage(m.channel.id, "I need permission to send messages and read messages in that channel. Please modify my permissions and try again.")
                    return;
                }
                if (!(data[guild.id].notifications)) {
                  data[guild.id].notifications = {}
                }
                data[guild.id].notifications.banLog = channel.id
                _.save(data)
                Bot.createMessage(m.channel.id, "Added Ban Log to channel: "+channel.mention).then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                    }, 5000)
                })
                return;
            }
            else {
              if (data[guild.id].notifications.notifications.banLog) {
                var banLog = data[guild.id].notifications.notifications.banLog
                Bot.createMessage(m.channel.id, `The current ban log is in:\n${data[guild.id].notifications.notifications.banLog}`);
                return;
              }
              else {
                Bot.createMessage(m.channel.id, "No ban log channel has been set yet. Use `!edit notifications banlog enable <@channel>` to add logs to that channel").then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                    }, 5000)
                })
                return;
              }
            }
          }
          if (args.toLowerCase().includes("welcome")) {
              if (args.toLowerCase().includes("remove")) {
                  if (data[guild.id].notifications.welcome) {
                      delete data[guild.id].notifications.welcome
                      Bot.createMessage(m.channel.id, "Welcome message removed").then((msg) => {
                          return setTimeout(function() {
                              Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                              Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                          }, 5000)
                      })
                      _.save(data)
                      return;
                  }
                  else {
                      Bot.createMessage(m.channel.id, "No welcome message found, I cant remove what isnt there.").then((msg) => {
                          return setTimeout(function() {
                              Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                              Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                          }, 5000)
                      })
                      return;
                  }
              }
              if (args.toLowerCase().includes("add")) {
                if (!m.channelMentions[0]) {
                  Bot.createMessage(m.channel.id, "Please mention which channel you want the welcome message to appear in, then type the welcome message");
                  return;
                }
                var channelID = m.channelMentions[0]
                var channel = m.channel.guild.channels.get(channelID)
                var message = args.replace(/\bnotifications\b/ig, "").replace(/\bwelcome\b/ig, "").replace(/\badd\b/ig, "").replace(`${channel.mention}`, "")
                Bot.createMessage(m.channel.id, "Adding Welcome message: '"+message+"'\nto channel: "+channel.mention).then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                    }, 5000)
                })
                data[guild.id].notifications.welcome = {}
                data[guild.id].notifications.welcome[channel.id] = message
                _.save(data)
                return;
            }
            else {
              if (data[guild.id].notifications.welcome) {
                var msg = Object.values(data[guild.id].notifications.welcome)[0]
                Bot.createMessage(m.channel.id, "The current welcome message is set as:\n\n"+msg);
                return;
              }
              else {
                Bot.createMessage(m.channel.id, "No welcome message has been set yet.").then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                    }, 5000)
                })
                return;
              }
            }
          }
        }
        if (args.toLowerCase().includes("prefix")) {
            var prefix = args.replace(/\bprefix\b/i, "")
            if (prefix.startsWith(" ")) {
              prefix = prefix.slice(1)
            }
            Bot.createMessage(m.channel.id, "Adding prefix: `"+prefix+"`").then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                }, 5000)
            })
            data[guild.id].prefix = prefix
            _.save(data)
            return;
        }

        /*
        // soon tm
        if (args.toLowerCase().includes("ignore ")) {
            if (!m.channelMentions[0]) {
              Bot.createMessage(m.channel.id, "Please mention a channel to be ignored");
              return;
            }
            var channel = m.channelMentions[0]
            Bot.createMessage(m.channel.id, "Ignoring channel: `"+channel.name+"`");
            _.save(data)
            return;
        }
        */
        if (args.toLowerCase().includes("roles")) {
          if (args.toLowerCase().includes("add")) {
            if (!data[guild.id].roles) {
              data[guild.id].roles = {}
            }
            var args = args.replace(/roles /i, "").replace(/add/i, "").toLowerCase()
            if (args.startsWith(" ")) {
              args = args.slice(1)
            }
            var serverRoles = m.guild.roles.map(roleSearch)
            var addedRole = args.toLowerCase()
            if (serverRoles.indexOf(addedRole) > -1) {
              var role = m.guild.roles.find(findRole)
              if (!role.id) {
                Bot.createMessage(m.channel.id, "I couldnt find the role you were looking for").then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                    }, 5000)
                })
                return;
              }
              else {
                var perms = m.channel.guild.members.get("309220487957839872").permission.json
                if (!perms.manageRoles) {
                  Bot.createMessage(m.channel.id, "I need permissions to be able to add roles, please add the 'Manage Roles' permission to me");
                  return;
                }
                if (data[guild.id].roles[addedRole]) {
                  Bot.createMessage(m.channel.id, "That role is already assignable").then((msg) => {
                      return setTimeout(function() {
                          Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                          Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                      }, 5000)
                  })
                  return;
                }
                data[guild.id].roles[addedRole] = role.id
                _.save(data)
                Bot.createMessage(m.channel.id, addedRole+" is now an assignable role").then((msg) => {
                    return setTimeout(function() {
                        Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                    }, 5000)
                })
              }
            }
            else {
              Bot.createMessage(m.channel.id, args+" is not a role that has been made in this server").then((msg) => {
                  return setTimeout(function() {
                      Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                      Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                  }, 5000)
              })
            }
          }
          if (args.toLowerCase().includes("remove")) {
            if (!data[guild.id].roles) {
              data[guild.id].roles = {}
            }
            var args = args.replace(/roles /i, "").replace(/remove/i, "").toLowerCase()
            if (args.startsWith(" ")) {
              args = args.slice(1)
            }
            var addedRole = args.toLowerCase()
            if (!data[guild.id].roles[addedRole]) {
              Bot.createMessage(m.channel.id, "That role has not been added yet").then((msg) => {
                  return setTimeout(function() {
                      Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                      Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                  }, 5000)
              })
              return;
            }
            delete data[guild.id].roles[addedRole]
            _.save(data)
            Bot.createMessage(m.channel.id, addedRole+" is no longer assignable").then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                }, 5000)
            })
          }
        }
        if (args.toLowerCase().includes("mod")) {
            if (args.toLowerCase().includes("add")) {
                if (m.roleMentions[0]) {
                    if (!data[guild.id].modRoles) {
                      data[guild.id].modRoles = {}
                    }
                    data[guild.id].modRoles[m.roleMentions[0]] = true
                    _.save(data)
                    Bot.createMessage(m.channel.id, "That role is now a registered moderator role").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                        }, 5000)
                    })
                    return;
                }
                if (m.mentions[0]) {
                    if (!data[guild.id].mods) {
                      data[guild.id].mods = {}
                    }
                    data[guild.id].mods[m.mentions[0].id] = true
                    _.save(data)
                    Bot.createMessage(m.channel.id, m.mentions[0].username+" is now a registered moderator").then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                        }, 5000)
                    })
                    return;
                }
            }
        }
    },
    help: "Modify Server Settings (Server Owner only)"
}
