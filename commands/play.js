const yt = require("ytdl-core");
const fs = require("fs");
const _ = require("../servers.js");
var data = _.load();
module.exports = {
    main: function(Bot, m, args, prefix) {
        if (/(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/.exec(args)) {
          if (/(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/.exec(args)[1]) {
            var code = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/.exec(args)[1]
          }
        }
        var args = m.cleanContent.replace(`${prefix}play `, "").toLowerCase()
        var hands = [":wave::skin-tone-1:", ":wave::skin-tone-2:", ":wave::skin-tone-3:", ":wave::skin-tone-4:", ":wave::skin-tone-5:", ":wave:"]
        var hand = hands[Math.floor(Math.random() * hands.length)]
        if (m.channel.nsfw == false) {
            Bot.createMessage(m.channel.id, "Please use this command in NSFW channels");
            return;
        }
        var guild = m.channel.guild
        if (!(data[guild.id])) {
            data[guild.id] = {}
            data[guild.id].name = guild.name
            data[guild.id].owner = guild.ownerID
            Bot.createMessage(m.channel.id, `Server: ${guild.name} added to database. Populating information ${hand}`).then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                }, 5000)
            })
            _.save(data)
            _.load()
        }
        if (!data[guild.id].music) {
           data[guild.id].music = {}
           _.save(data)
           _.load()
        }
        if (!data[guild.id].music.queue) {
           data[guild.id].music.queue = {}
           _.save(data)
           _.load()
        }
        if (!data[guild.id].music.current) {
           data[guild.id].music.current = {}
           _.save(data)
           _.load()
        }
        if (m.member.voiceState.channelID) { // User is in Voice Channel
            Bot.joinVoiceChannel(m.member.voiceState.channelID).then(function(voiceConnection) { // Join user voice channel
                var BotVoiceState = m.channel.guild.members.get(Bot.user.id).voiceState;
                if (BotVoiceState.channelID) { // Bot is in Voice Channel
                    var voiceConnection = Bot.voiceConnections.get(m.channel.guild.id);
                    if (BotVoiceState.channelID == m.member.voiceState.channelID) { // User is in same Voice Channel
                        if (args.includes("resume")) {
                          Bot.createMessage(m.channel.id, "Resuming music.");
                          voiceConnection.resume()
                          return;
                        }
                        if (voiceConnection.playing) {
                            if (args.includes("stop") || args.includes("cancel")) {
                                Bot.createMessage(m.channel.id, "Stopping song.");
                                voiceConnection.stopPlaying()
                                return;
                            }
                            if (args.includes("current")) {
                              if (data[guild.id].music.current.code) {
                                var code3 = data[guild.id].music.current.code
                              }
                              if (data[guild.id].music.current.player) {
                                var player = data[guild.id].music.current.player
                              }
                              if (!player || !code3) {
                                Bot.createMessage(m.channel.id, "Nothing is currently playing");
                                return;
                              }
                              yt.getInfo("https://www.youtube.com/watch?v=" + code3, function(error, info) {
                                  Bot.createMessage(m.channel.id, "Now playing: `" + info.title + "` requested by **" + player + "** <https://www.youtube.com/watch?v="+code3+">");
                              });
                              return;
                            }
                            if (args.includes("pause")) {
                              Bot.createMessage(m.channel.id, "Pausing music.");
                              voiceConnection.pause()
                              return;
                            }
                            if (args.includes("volume")) {
                              if (/\b[0-9]+\b/.exec(args)) {
                                var volume = /\b[0-9]+\b/.exec(args)[0]
                                volume = +volume/100
                                if (volume > 1.5) {
                                  Bot.createMessage(m.channel.id, `Sorry, but I can not set the volume to ${(volume*100).toFixed(0)}%`);
                                  return;
                                }
                                Bot.createMessage(m.channel.id, `Setting Volume to ${(volume*100).toFixed(0)}%`);
                                voiceConnection.setVolume(volume)
                                return;
                              }
                              if (args.includes("down")) {
                                var volume = voiceConnection.volume
                                volume = +voiceConnection.volume-0.1
                                volume = Math.round(volume*100)/100
                                if (volume < 0) {
                                  Bot.createMessage(m.channel.id, `Sorry, but I can not set the volume to ${(volume*100).toFixed(0)}%`);
                                  return;
                                }
                                Bot.createMessage(m.channel.id, `Setting Volume to ${(volume*100).toFixed(0)}%`);
                                voiceConnection.setVolume(volume)
                                return;
                              }
                              if (args.includes("up")) {
                                var volume = voiceConnection.volume
                                volume = +voiceConnection.volume+0.1
                                volume = Math.round(volume*100)/100
                                if (volume > 1.5) {
                                  Bot.createMessage(m.channel.id, `Sorry, but I can not set the volume to ${(volume*100).toFixed(0)}%`);
                                  return;
                                }
                                Bot.createMessage(m.channel.id, `Setting Volume to ${(volume*100).toFixed(0)}%`);
                                voiceConnection.setVolume(volume)
                                return;
                              }
                              else {
                                Bot.createMessage(m.channel.id, `Volume is set to ${voiceConnection.volume*100}%`);
                                return;
                              }
                            } else {
                                if (data[guild.id].music.queue) {
                                  if (data[guild.id].music.queue[code]) {
                                    Bot.createMessage(m.channel.id, "That song has already been requested by: **"+data[guild.id].music.queue[code]+"**");
                                    return;
                                  }
                                  var queue = data[guild.id].music.queue
                                  queue[code] = `${m.author.username + "#" + m.author.discriminator}`
                                  _.save(data)
                                  _.load()
                                }
                                yt.getInfo("https://www.youtube.com/watch?v=" + code, function(error, info) {
                                    Bot.createMessage(m.channel.id, "Added: `" + info.title + "` to queue. Requested by **" + m.author.username + "#" + m.author.discriminator + "**");
                                    return;
                                });
                            }
                        } else {
                            _.load()
                            var song = yt("https://www.youtube.com/watch?v=" + code, {
                                filter: "audioonly"
                            });
                            voiceConnection.play(song, {
                                inlineVolume: true
                            });
                            voiceConnection.setVolume(0.5)
                            if (!data[guild.id].music.current.code == code) {
                              data[guild.id].music.current = {}
                              data[guild.id].music.current.code = code
                              data[guild.id].music.current.player = `${m.author.username + "#" + m.author.discriminator}`
                              _.save(data)
                              _.load()
                            }
                            yt.getInfo("https://www.youtube.com/watch?v=" + code, function(error, info) {
                                Bot.createMessage(m.channel.id, "Now playing: `" + info.title + "` requested by **" + m.author.username + "#" + m.author.discriminator + "**");
                            });
                        }
                    } else { // User is in different Voice Channel
                        Bot.createMessage(m.channel.id, "You must be in the same Voice Channel as me to play a song");
                    }
                    voiceConnection.on("end", function() {
                        _.load()
                        var queue = Object.keys(data[guild.id].music.queue)
                        if (queue.length > 0) {
                          var code = queue[0]
                          data[guild.id].music.current.code = code
                          data[guild.id].music.current.player = data[guild.id].music.queue[queue[0]]
                          var song = yt("https://www.youtube.com/watch?v=" + code, {
                              filter: "audioonly"
                          });
                          voiceConnection.play(song, {
                              inlineVolume: true
                          });
                          voiceConnection.setVolume(0.5)
                          yt.getInfo("https://www.youtube.com/watch?v=" + code, function(error, info) {
                              Bot.createMessage(m.channel.id, "Now playing: `" + info.title + "` requested by **" + data[guild.id].music.queue[queue[0]] +"**");
                          });
                          delete data[guild.id].music.queue[queue[0]]
                          _.save(data)
                          _.load()
                          return;
                        }
                        else {
                          Bot.createMessage(m.channel.id, "Thanks for Listening " + hand);
                          if (BotVoiceState.channelID) {
                              Bot.leaveVoiceChannel(m.member.voiceState.channelID)
                              data[guild.id].music.current = {}
                              _.save(data)
                              _.load()
                          }
                        }
                        return;
                    });
                }
            })
        } else { // User isn't in Voice Channel
            Bot.createMessage(m.channel.id, "You must be in a Voice Channel to play a song");
        }
    },
    help: "Plays music"
}
