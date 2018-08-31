const yt = require("ytdl-core");
const fs = require("fs");
const _ = require("../servers.js");
const progress = require('progress-string')
const ytsr = require('ytsr');
var data = _.load();
module.exports = {
    main: async function(Bot, m, args, prefix) {
        // this is so fucking long. Basically take the video code out of any form of youtube link
        if (/(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/.exec(args)) {
          if (/(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/.exec(args)[1]) {
            var code = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/.exec(args)[1]
          }
        }
        var args = m.cleanContent.replace(`${prefix}play `, "")
        var hands = [":wave::skin-tone-1:", ":wave::skin-tone-2:", ":wave::skin-tone-3:", ":wave::skin-tone-4:", ":wave::skin-tone-5:", ":wave:"]
        var hand = hands[Math.floor(Math.random() * hands.length)]
        function msToHMS( ms ) {
            // 1- Convert to seconds:
            var seconds = ms / 1000;
            // 2- Extract hours:
            var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
            seconds = seconds % 3600; // seconds remaining after extracting hours
            // 3- Extract minutes:
            var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
            // 4- Keep only seconds not extracted to minutes:
            seconds = seconds % 60;
            if (hours>0) {
              return(Math.round(hours)+":"+Math.round(minutes)+":"+Math.round(seconds));
            }
            else {
              return(Math.round(minutes)+":"+Math.round(seconds));
            }
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
        // I am bad with storage, I know
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
            Bot.joinVoiceChannel(m.member.voiceState.channelID).then(async function(voiceConnection) { // Join user voice channel
                var BotVoiceState = m.channel.guild.members.get(Bot.user.id).voiceState;
                if (BotVoiceState.channelID) { // Bot is in Voice Channel
                    var voiceConnection = Bot.voiceConnections.get(m.channel.guild.id);
                    if (BotVoiceState.channelID == m.member.voiceState.channelID) { // User is in the same Voice Channel
                        if (args.toLowerCase().includes("resume")) {
                          Bot.createMessage(m.channel.id, "Resuming music.");
                          voiceConnection.resume()
                          return;
                        }
                        if (voiceConnection.playing) { // Bot is actively playing something
                            if (args.toLowerCase().includes("stop") || args.toLowerCase().includes("cancel")) {
                                Bot.createMessage(m.channel.id, "Stopping song.");
                                voiceConnection.stopPlaying()
                                return;
                            }
                            if (args.toLowerCase().includes("current")) { // someone asks for current song info
                              var playTime = voiceConnection.current.playTime
                              var endTime = yt.getInfo("https://www.youtube.com/watch?v=" + data[guild.id].music.current.code).then(info => {
                                var start = playTime
                                var end = info.length_seconds*1000
                                var bar = progress({
                                  total: end,
                                  style: function (complete, incomplete) {
                                    return '+'.repeat(complete.length) + '**|' + incomplete
                                  }
                                })
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
                                var msg = {
                                  "embed": {
                                    "title": `:musical_note:  ${info.title} :musical_note:`,
                                    "url": `https://youtu.be/${code3}?t=${msToHMS(start).replace(":", "m")}s`,
                                    "color": 0xA260F6,
                                    "footer": {
                                      "text": `Requested by: ${player}`
                                    },
                                    "thumbnail": {
                                      "url": `https://i.ytimg.com/vi/${code3}/hqdefault.jpg`
                                    },
                                    "author": {
                                      "name": "Currently Playing"
                                    },
                                    "fields": [
                                      {
                                        "name": `${msToHMS(start)}/${msToHMS(end)}`,
                                        "value": `[**${bar(start)}]`,
                                        "inline": true
                                      }
                                    ]
                                  }
                                };
                                Bot.createMessage(m.channel.id, msg);
                                return;
                              }).catch(err => {
                                console.log(err);
                                return;
                              })
                              return;
                            }
                            if (args.toLowerCase().includes("pause")) { // someone asks to pause the song
                              Bot.createMessage(m.channel.id, "Pausing music.");
                              voiceConnection.pause()
                              return;
                            }
                            if (args.toLowerCase().includes("queue") || args.toLowerCase().includes("list")) { // display queue of songs if it exists
                              let index = 1;
                              const songs = [];

                              // Display queue of songs if it exists
                              await Bot.sendChannelTyping(m.channel.id);

                              try {
                                console.log(data[guild.id].music.queue);
                                for (const [id, queuer] of Object.entries(data[guild.id].music.queue)) {
                                  var info = await yt.getInfo(`https://www.youtube.com/watch?v=${id}`);
                                  var title = info.title
                                  console.log(title);
                                  songs.push(`${index++}. ${title} [${msToHMS(info.length_seconds*1000)}]  |  Requested by: ${queuer}`);
                                }
                                console.log(songs);
                                if (!songs.length) { Bot.createMessage(m.channel.id, 'The queue is empty right now'); } else {
                                  Bot.createMessage(m.channel.id, {
                                    embed: {
                                      color: 0xA260F6,
                                      title: `${songs.length} songs currently queued`,
                                      description: " \n\n" + songs.join('\n'),
                                    },
                                  });
                                }
                              } catch (e) { console.log(e); }
                              return;
                            }
                            if (args.toLowerCase().includes("volume") || args.toLowerCase().includes("turn it") || args.toLowerCase().includes("turn")) { // someone asks to change the volume to a specific percentage
                              if (/\b[0-9]+\b/.exec(args)) {
                                  var volume = /\b[0-9]+\b/.exec(args)[0]
                                  volume = +volume/100
                                  if (volume > 1.5) { // no ear rape
                                    Bot.createMessage(m.channel.id, `Sorry, but I can not set the volume to ${(volume*100).toFixed(0)}%`);
                                    return;
                                  }
                                  Bot.createMessage(m.channel.id, `Setting Volume to ${(volume*100).toFixed(0)}%`);
                                  voiceConnection.setVolume(volume)
                                  return;
                              }
                              if (args.toLowerCase().includes("down")) { // someone asks to turn volume down 10%
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
                              if (args.toLowerCase().includes("up")) { // someone asks to turn volume up 10%
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
                              else { // show current volume level
                                Bot.createMessage(m.channel.id, `Volume is set to ${voiceConnection.volume*100}%`);
                                return;
                              }
                            }
                            else { // add the song to the queue since there is currently something playing
                                if (/(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/.exec(args)) {
                                  if (/(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/.exec(args)[1]) {
                                    var code = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/.exec(args)[1]
                                  }
                                }
                                if (!code) {
                                  if (yt.validateURL(args)) {
                                    var code = yt.getURLVideoID(args)
                                  }
                                }
                                var valid = await yt.validateURL(args)
                                console.log("code:",code);
                                console.log("valid code:",yt.validateID(code));
                                if (!code && !yt.validateID(code)) {
                                  var valid = undefined
                                }
                                if (!valid) {
                                  Bot.sendChannelTyping(m.channel.id)
                                  Bot.createMessage(m.channel.id, "Searching youtube for: `"+args+"`").then((msg) => {
                                      return setTimeout(function() {
                                          Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                                      }, 5000)
                                  })
                                  var search = await ytsr(args)
                                  try {
                                    var target = search.items[Object.keys(search.items)[0]]
                                    if (!target.type == "video") {
                                      target = search.items[Object.keys(search.items)[1]]
                                    }
                                    if (yt.validateURL(target.link)) {
                                      var code = await yt.getURLVideoID(target.link)
                                      valid = true
                                    }
                                  } catch (e) { console.log(e); }
                                }
                                if (!valid) {
                                  Bot.createMessage(m.channel.id, `Sorry, I wasnt able to play a video with the code: ${code}`).then((msg) => {
                                      return setTimeout(function() {
                                          Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                                          Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                                      }, 5000)
                                  })
                                }
                                if (data[guild.id].music.queue) {
                                  if (data[guild.id].music.queue[code]) {
                                    var queue = Object.keys(data[guild.id].music.queue)
                                    var position = queue.indexOf(code)
                                    position++
                                    Bot.createMessage(m.channel.id, "That song has already been requested by: **"+data[guild.id].music.queue[code]+"**. It is at queue position: `"+ position +"`").then((msg) => {
                                        return setTimeout(function() {
                                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                                        }, 7000)
                                    })
                                    return;
                                  }

                                  var queue = Object.keys(data[guild.id].music.queue)
                                  queue = queue.length
                                  if (queue >  14) {
                                    Bot.createMessage(m.channel.id, "Sorry, only 10 songs are allowed in the queue at a time").then((msg) => {
                                        return setTimeout(function() {
                                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                                            Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                                        }, 5000)
                                    })
                                  }
                                  if (code) {
                                    var queue = data[guild.id].music.queue
                                    queue[code] = `${m.author.username + "#" + m.author.discriminator}`
                                    _.save(data)
                                    _.load()
                                  }
                                }
                                console.log("final code:",code);
                                yt.getInfo("https://www.youtube.com/watch?v=" + code, function(error, info) {
                                  if (error) {
                                    console.log("Error: "+error);
                                    return;
                                  }
                                  Bot.createMessage(m.channel.id, "Added: `" + info.title + "` ["+msToHMS(info.length_seconds*1000)+"m] to queue. Requested by **" + m.author.username + "#" + m.author.discriminator + "**").then((msg) => {
                                      return setTimeout(function() {
                                          Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                                          Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                                      }, 10000)
                                  })
                                  return;
                                })
                            }
                        }
                        else { // start a song since the bot is not currently playing anything, and the voice connection should be ready
                            var valid = yt.validateID(code)
                            if (!valid) {
                              var search = await ytsr(args)
                              Bot.sendChannelTyping(m.channel.id)
                              try {
                                var target = search.items[Object.keys(search.items)[0]]
                                if (!target.type == "video") {
                                  target = search.items[Object.keys(search.items)[1]]
                                }
                                if (yt.validateURL(target.link)) {
                                  var code = await yt.getURLVideoID(target.link)
                                  valid = true
                                }
                              } catch (e) { console.log(e); }
                            }
                            if (!valid || code == undefined) {
                              Bot.createMessage(m.channel.id, `Sorry, I wasnt able to play a video with the code: ${code}`).then((msg) => {
                                  return setTimeout(function() {
                                      Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                                      Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                                  }, 5000)
                              })
                              return;
                            }
                            _.load()
                            var song = yt("https://www.youtube.com/watch?v=" + code, {
                                filter: "audioonly"
                            });
                            voiceConnection.play(song, {
                                inlineVolume: true
                            });
                            voiceConnection.setVolume(0.3)
                            data[guild.id].music.current = {}
                            data[guild.id].music.current.code = code
                            data[guild.id].music.current.player = `${m.author.username + "#" + m.author.discriminator}`
                            _.save(data)
                            _.load()
                            yt.getInfo("https://www.youtube.com/watch?v=" + code, function(error, info) {
                                if (error) {
                                    console.log("Erorr: "+error);
                                }
                                Bot.createMessage(m.channel.id, "Now playing: `" + info.title + "` ["+msToHMS(info.length_seconds*1000)+"m] requested by **" + m.author.username + "#" + m.author.discriminator + "**").then((msg) => {
                                    return setTimeout(function() {
                                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                                        Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                                    }, 15000)
                                })
                            })
                          }
                        }
                        else { // User is in different Voice Channel and shouldnt be doing anything
                            Bot.createMessage(m.channel.id, "You must be in the same Voice Channel as me to play a song").then((msg) => {
                                return setTimeout(function() {
                                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                                    Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                                }, 7000)
                            })
                        }
                        // pls ignore all the extra console logs, they are for debugging this
                        voiceConnection.on('end', () => { // when the song ends
                          var data = _.load()
                          var queue = Object.keys(data[guild.id].music.queue)
                          var close = false
                          if (queue.length > 0 && !voiceConnection.playing) { // if there is another song in the queue, try to play that song
                              var code = queue[0]
                              var leave = false
                              voiceConnection.playing = true
                              console.log(code);
                              var valid = yt.validateID(code)
                              if (!valid || code == undefined) {
                                delete data[guild.id].music.queue[queue[0]]
                                _.save(data)
                                _.load()
                                return;
                              }
                              var requester = data[guild.id].music.queue[code]
                              var song = yt("https://www.youtube.com/watch?v=" + code, {
                                  filter: "audioonly"
                              });
                              voiceConnection.play(song, {
                                  inlineVolume: true
                              });
                              voiceConnection.setVolume(0.3)
                              yt.getInfo("https://www.youtube.com/watch?v=" + code, function(error, info) {
                                if (error) {
                                  console.log("Error: "+error);
                                }
                                Bot.createMessage(m.channel.id, "Now playing: `" + info.title + "` ["+msToHMS(info.length_seconds*1000)+"m] requested by **" + requester +"**").then((msg) => {
                                    return setTimeout(function() {
                                        Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                                    }, 5000)
                                })
                              })
                              data[guild.id].music.current = {}
                              data[guild.id].music.current.code = code
                              data[guild.id].music.current.player = `${m.author.username + "#" + m.author.discriminator}`
                              delete data[guild.id].music.queue[queue[0]]
                              _.save(data)
                              _.load()
                              return;
                          }
                          else if (queue.length < 1 && !voiceConnection.playing) {
                            close = true
                            setTimeout(function() {
                              if (queue.length == 0 && !voiceConnection.playing) { // if there is no other song in the queue, leave the voice channel and have a wonderful day
                                if (BotVoiceState.channelID) {
                                    Bot.leaveVoiceChannel(m.member.voiceState.channelID)
                                    data[guild.id].music.current = {}
                                    _.save(data)
                                    _.load()
                                    return Bot.createMessage(m.channel.id, "Thanks for Listening " + hand);;
                                }
                              }
                            }, 5000);
                          }
                          else if (close) {
                            return;
                          }
                        })
                    }
                })
        } else { // User isn't in a Voice Channel
            Bot.createMessage(m.channel.id, "You must be in a Voice Channel to play a song");
        }
    },
    help: "Plays music"
}
