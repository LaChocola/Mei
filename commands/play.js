const yt = require("ytdl-core");
const fs = require("fs");
module.exports = {
    main: function(Bot, m, args, prefix) {
        var code = args.replace(/<?(https?:\/\/)?(www\.)?(youtu(be\.com\/|.be\/))?(watch\?v=)?([^>]*)>?/, "$6");
        var args = m.cleanContent.replace(`${prefix}play `, "").toLowerCase()
        var hands = [":wave::skin-tone-1:", ":wave::skin-tone-2:", ":wave::skin-tone-3:", ":wave::skin-tone-4:", ":wave::skin-tone-5:", ":wave:"]
        var hand = hands[Math.floor(Math.random() * hands.length)]
        if (m.channel.nsfw == false) {
            Bot.createMessage(m.channel.id, "This command can only be used in NSFW channels");
            return
        }
        if (m.member.voiceState.channelID) { // User is in Voice Channel
            Bot.joinVoiceChannel(m.member.voiceState.channelID).then(function(voiceConnection) { // Join user voice channel
                var BotVoiceState = m.channel.guild.members.get(Bot.user.id).voiceState;
                if (BotVoiceState.channelID) { // Bot is in Voice Channel
                    var voiceConnection = Bot.voiceConnections.get(m.channel.guild.id);
                    if (BotVoiceState.channelID == m.member.voiceState.channelID) { // User is in same Voice Channel
                        if (voiceConnection.playing) {
                            if (args.includes("pause") || args.includes("stop") || args.includes("cancel")) {
                                Bot.createMessage(m.channel.id, "Stopping music.");
                                Bot.leaveVoiceChannel(m.member.voiceState.channelID)
                                return;
                            } else {
                                Bot.createMessage(m.channel.id, "Queue feature coming soon >.>");
                            }
                        } else {
                            var song = yt("https://www.youtube.com/watch?v=" + code, {
                                filter: "audioonly"
                            });
                            voiceConnection.play(song, {
                                inlineVolume: true
                            });
                            yt.getInfo("https://www.youtube.com/watch?v=" + code, function(error, info) {
                                Bot.createMessage(m.channel.id, "Now playing: `" + info.title + "` requested by **" + m.author.username + "#" + m.author.discriminator + "**");
                            });
                        }
                    } else { // User is in different Voice Channel
                        Bot.createMessage(m.channel.id, "You must be in the same Voice Channel as me to play a song");
                    }
                    voiceConnection.on("end", function() {
                        Bot.createMessage(m.channel.id, "Thanks for Listening " + hand);
                        if (BotVoiceState.channelID) {
                            Bot.leaveVoiceChannel(m.member.voiceState.channelID)
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
