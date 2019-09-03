"use strict";

const yt = require("ytdl-core");
const progress = require("progress-string");
const ytsr = require("ytsr");

const utils = require("../utils");
const conf = require("../conf");
const dbs = require("../dbs");

var guildDb = dbs.guild.load();

module.exports = {
    main: async function(bot, m, args, prefix) {
        // Disable play command for this guild?
        if (m.guild.id === conf.guilds.guild2) {
            return;
        }

        // this is so fucking long. Basically take the video code out of any form of youtube link
        var code = undefined;
        if (/(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/.exec(args)) {
            if (/(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/.exec(args)[1]) {
                code = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/.exec(args)[1];
            }
        }
        args = m.cleanContent.replace(`${prefix}play `, "");
        console.log(args);
        if (m.content == `${prefix}play`) {
            m.reply(`Please say what you want to do. e.g. \`${prefix}play <youtube link>\`, \`${prefix}play queue\`, \`${prefix}play current\`, or \`${prefix}play stop\``);
            return;
        }
        var isNewQueue = false;
        function msToHMS(ms) {
            // Get hours
            let h = Math.floor(ms / (1000 * 60 * 60));
            // Get minutes
            let m = Math.floor(ms / (1000 * 60)) - h * 60;
            // Get seconds
            let s = Math.floor(ms / 1000) - m * 60 - h * 60 * 60;
            let time = [m, s];
            // Use hours if there are hours
            if (h) {
                time.unshift(h);
            }
            return time.map(n => n.toString().padStart(2, "0")).join(":");
        }
        var guild = m.channel.guild;
        if (!guildDb[guild.id]) {
            guildDb[guild.id] = {};
            guildDb[guild.id].name = guild.name;
            guildDb[guild.id].owner = guild.ownerID;
            m.reply(`Server: ${guild.name} added to database. Populating information ${utils.hands.wave()}`, 5000);
            dbs.guild.save(guildDb);
        }
        // I am bad with storage, I know
        if (!guildDb[guild.id].music) {
            guildDb[guild.id].music = {};
            dbs.guild.save(guildDb);
        }
        if (!guildDb[guild.id].music.queue) {
            guildDb[guild.id].music.queue = {};
            dbs.guild.save(guildDb);
        }
        if (!guildDb[guild.id].music.current) {
            guildDb[guild.id].music.current = {};
            dbs.guild.save(guildDb);
        }
        if (m.member.voiceState.channelID) { // User is in Voice Channel
            bot.joinVoiceChannel(m.member.voiceState.channelID).then(async function(voiceConnection) { // Join user voice channel
                var BotVoiceState = m.channel.guild.members.get(bot.user.id).voiceState;
                if (BotVoiceState.channelID) { // Bot is in Voice Channel
                    voiceConnection = bot.voiceConnections.get(m.channel.guild.id);
                    if (BotVoiceState.channelID == m.member.voiceState.channelID) { // User is in the same Voice Channel
                        if (args.toLowerCase().includes("resume")) {
                            m.reply("Resuming music.");
                            voiceConnection.resume();
                            return;
                        }
                        if (voiceConnection.playing) { // Bot is actively playing something
                            if (args.toLowerCase().includes("stop") || args.toLowerCase().includes("cancel")) {
                                m.reply("Stopping song.", 5000);
                                m.deleteIn(5000);
                                voiceConnection.stopPlaying();
                                return;
                            }
                            if (args.toLowerCase().includes("current") || ((args.toLowerCase().includes("queue") || args.toLowerCase().includes("list") && !args.toLowerCase().includes("&list=")) && Object.entries(guildDb[guild.id].music.queue).length < 1)) { // someone asks for current song info
                                var playTime = voiceConnection.current.playTime;
                                yt.getInfo("https://www.youtube.com/watch?v=" + guildDb[guild.id].music.current.code).then(async function(info) {
                                    info = await info; // TODO: WTF?
                                    var start = playTime;
                                    var end = +info.length_seconds * 1000;
                                    console.log(await info.length_seconds); // TODO: WTF?
                                    console.log(end);
                                    var bar = progress({
                                        total: end,
                                        style: function(complete, incomplete) {
                                            return "+".repeat(complete.length) + "" + incomplete;
                                        }
                                    });
                                    if (guildDb[guild.id].music.current.code) {
                                        var code3 = guildDb[guild.id].music.current.code;
                                    }
                                    if (guildDb[guild.id].music.current.player) {
                                        var player = guildDb[guild.id].music.current.player;
                                    }
                                    if (!player || !code3) {
                                        m.reply("Nothing is currently playing");
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
                                                    "value": `[${bar(start)}]`,
                                                    "inline": true
                                                }
                                            ]
                                        }
                                    };
                                    if ((args.toLowerCase().includes("queue") || (args.toLowerCase().includes("list") && !args.toLowerCase().includes("&list="))) && (Object.entries(guildDb[guild.id].music.queue).length < 1)) {
                                        console.log(msg.embed.author.name);
                                        msg.embed.author.name = "Nothing Else is Queued.\nCurrently Playing:";
                                        console.log(msg.embed.author.name);
                                    }
                                    m.reply(msg, end - start);
                                    m.deleteIn(end - start);
                                    return;
                                }).catch(err => {
                                    console.log(err);
                                    return;
                                });
                                return;
                            }
                            if (args.toLowerCase().includes("pause")) { // someone asks to pause the song
                                m.reply("Pausing music.", 5000);
                                m.deleteIn(5000);
                                voiceConnection.pause();
                                return;
                            }
                            if (args.toLowerCase().includes("queue") || args.toLowerCase().includes("list") && !args.toLowerCase().includes("&list=")) { // display queue of songs if it exists
                                let index = 1;
                                const songs = [];

                                // Display queue of songs if it exists
                                await m.channel.sendTyping();
                                try {
                                    console.log(guildDb[guild.id].music.queue);
                                    if (!Object.entries(guildDb[guild.id].music.queue)) {
                                        m.reply("The queue is empty right now");
                                    }
                                    else {
                                        for (const [id, queuer] of Object.entries(guildDb[guild.id].music.queue)) {
                                            var info = await yt.getInfo(`https://www.youtube.com/watch?v=${id}`);
                                            var title = info.title;
                                            songs.push(`${index++}. [${title}](https://www.youtube.com/watch?v=${id}) [${msToHMS(utils.toNum(info.length_seconds) * 1000)}]  |  Requested by: ${queuer}`);
                                        }
                                        m.reply({
                                            embed: {
                                                color: 0xA260F6,
                                                title: `${songs.length} songs currently queued`,
                                                description: " \n\n" + songs.join("\n")
                                            }
                                        }).catch((err) => {
                                            if (err.code == 50013) {
                                                m.reply("I do not have permisson to embed links in this channel. Please make sure I have the `embed links` permission on my highest role, and that the channel permissions are not overriding it.", 5000);
                                                m.deleteIn(5000);
                                                return;
                                            }
                                        });
                                    }
                                }
                                catch (e) {
                                    console.log(e);
                                    m.reply("An error has occured.");
                                }
                                return;
                            }
                            if (args.toLowerCase().includes("volume") || args.toLowerCase().includes("turn it") || args.toLowerCase().includes("turn")) { // someone asks to change the volume to a specific percentage
                                if (/\b[0-9]+\b/.exec(args)) {
                                    var volume = /\b[0-9]+\b/.exec(args)[0];
                                    volume = utils.toNum(volume) / 100;
                                    if (volume > 1.5) { // no ear rape
                                        m.reply(`Sorry, but I can not set the volume to ${(utils.toNum(volume) * 100).toFixed(0)}%`, 5000);
                                        m.deleteIn(5000);
                                        return;
                                    }
                                    m.reply(`Setting Volume to ${(utils.toNum(volume) * 100).toFixed(0)}%`, 5000);
                                    m.deleteIn(5000);
                                    voiceConnection.setVolume(volume);
                                    return;
                                }
                                if (args.toLowerCase().includes("down")) { // someone asks to turn volume down 10%
                                    let volume = voiceConnection.volume;
                                    volume = utils.toNum(voiceConnection.volume) - 0.1;
                                    volume = Math.round(utils.toNum(volume) * 100) / 100;
                                    if (utils.toNum(volume) < 0) {
                                        m.reply(`Sorry, but I can not set the volume to ${(volume * 100).toFixed(0)}%`, 5000);
                                        m.deleteIn(5000);
                                        return;
                                    }
                                    m.reply(`Setting Volume to ${(volume * 100).toFixed(0)}%`, 5000);
                                    m.deleteIn(5000);
                                    voiceConnection.setVolume(volume);
                                    return;
                                }
                                if (args.toLowerCase().includes("up")) { // someone asks to turn volume up 10%
                                    let volume = voiceConnection.volume;
                                    volume = utils.toNum(voiceConnection.volume) + 0.1;
                                    volume = Math.round(volume * 100) / 100;
                                    if (volume > 1.5) {
                                        m.reply(`Sorry, but I can not set the volume to ${(volume * 100).toFixed(0)}%`, 5000);
                                        m.deleteIn(5000);
                                        return;
                                    }
                                    m.reply(`Setting Volume to ${(volume * 100).toFixed(0)}%`, 5000);
                                    m.deleteIn(5000);
                                    voiceConnection.setVolume(volume);
                                    return;
                                }
                                else { // show current volume level
                                    m.reply(`Volume is set to ${voiceConnection.volume * 100}%`, 5000);
                                    m.deleteIn(5000);
                                }
                            }
                            else { // add the song to the queue since there is currently something playing
                                if (/(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/.exec(args)) {
                                    if (/(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/.exec(args)[1]) {
                                        code = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/.exec(args)[1];
                                    }
                                }
                                if (!code) {
                                    if (yt.validateURL(args)) {
                                        code = yt.getURLVideoID(args);
                                    }
                                }
                                var valid = await yt.validateURL(args);
                                console.log("code:", code);
                                console.log("valid code:", yt.validateID(code));
                                if (!code && !yt.validateID(code)) {
                                    valid = undefined;
                                }
                                if (!valid) {
                                    m.channel.sendTyping();
                                    m.reply("Searching youtube for: `" + args + "`", 5000);
                                    var search = await ytsr(args);
                                    try {
                                        var target = search.items[Object.keys(search.items)[0]];
                                        if (!target.type == "video") {
                                            target = search.items[Object.keys(search.items)[1]];
                                        }
                                        if (yt.validateURL(target.link)) {
                                            code = await yt.getURLVideoID(target.link);
                                            valid = true;
                                        }
                                    }
                                    catch (e) {
                                        console.log(e);
                                    }
                                }
                                if (!valid) {
                                    m.reply(`Sorry, I wasnt able to play a video with the code: ${code}`, 5000);
                                    m.deleteIn(5000);
                                }
                                if (guildDb[guild.id].music.queue) {
                                    if (guildDb[guild.id].music.queue[code]) {
                                        var queue = Object.keys(guildDb[guild.id].music.queue);
                                        var position = queue.indexOf(code);
                                        if (guildDb[guild.id].music.queue[position] != code) {
                                            m.reply("Unable to add that video to the queue at this time.", 5000);
                                            m.deleteIn(5000);
                                            return;
                                        }
                                        position++;
                                        m.reply("That song has already been requested by: **" + guildDb[guild.id].music.queue[code] + "**. It is at queue position: `" + position + "`", 7000);
                                        m.deleteIn(7000);
                                        return;
                                    }

                                    queue = Object.keys(guildDb[guild.id].music.queue);
                                    queue = queue.length;
                                    if (queue > 14) {
                                        m.reply("Sorry, only 15 songs are allowed in the queue at a time", 5000);
                                        m.deleteIn(5000);
                                        return;
                                    }
                                    if (code) {
                                        queue = guildDb[guild.id].music.queue;
                                        queue[code] = `${m.author.username + "#" + m.author.discriminator}`;
                                        dbs.guild.save(guildDb);
                                    }
                                }
                                console.log("final code:", code);
                                yt.getInfo("https://www.youtube.com/watch?v=" + code, function(error, info) {
                                    if (error) {
                                        console.log(error);
                                        return;
                                    }
                                    m.reply("Added: `" + info.title + "` [" + msToHMS(utils.toNum(info.length_seconds) * 1000) + "m] to queue. Requested by **" + m.author.username + "#" + m.author.discriminator + "**", 10000);
                                    m.deleteIn(10000);
                                    return;
                                });
                            }
                        }
                        else { // start a song since the bot is not currently playing anything, and the voice connection should be ready
                            isNewQueue = true;
                            if (code) {
                                valid = await yt.validateID(code);
                            }
                            if (valid) {
                                valid = await yt.validateURL("https://www.youtube.com/watch?v=" + code);
                            }
                            console.log("valid: " + valid);
                            console.log("code: " + code);
                            if (!code) {
                                if (yt.validateURL(args)) {
                                    code = yt.getURLVideoID(args);
                                }
                            }
                            if (!code) {
                                search = await ytsr(args);
                                m.channel.sendTyping();
                                try {
                                    target = search.items[Object.keys(search.items)[0]];
                                    if (!target.type == "video") {
                                        target = search.items[Object.keys(search.items)[1]];
                                    }
                                    if (yt.validateURL(target.link)) {
                                        code = await yt.getURLVideoID(target.link);
                                        valid = true;
                                    }
                                }
                                catch (e) {
                                    console.log(e);
                                }
                            }
                            if (!valid && code == undefined) {
                                m.reply(`Sorry, I wasn't able to play a video with the code: ${code}`, 5000);
                                m.deleteIn(5000);
                                if (BotVoiceState.channelID) {
                                    bot.leaveVoiceChannel(m.member.voiceState.channelID);
                                    guildDb[guild.id].music.current = {};
                                    dbs.guild.save(guildDb);
                                }
                                return;
                            }
                            var song = yt("https://www.youtube.com/watch?v=" + code, {
                                filter: "audioonly"
                            });
                            voiceConnection.play(song, {
                                inlineVolume: true
                            });
                            voiceConnection.setVolume(0.3);
                            guildDb[guild.id].music.current = {};
                            guildDb[guild.id].music.current.code = code;
                            guildDb[guild.id].music.current.player = `${m.author.username + "#" + m.author.discriminator}`;
                            dbs.guild.save(guildDb);
                            yt.getInfo("https://www.youtube.com/watch?v=" + code, async function(error, info) {
                                if (error) {
                                    console.log("Error: " + error);
                                    m.reply(`Sorry, I wasn't able to play a video with the code: ${code}`, 5000);
                                    m.deleteIn(5000);
                                    if (BotVoiceState.channelID) {
                                        bot.leaveVoiceChannel(m.member.voiceState.channelID);
                                        guildDb[guild.id].music.current = {};
                                        dbs.guild.save(guildDb);
                                    }
                                    return;
                                }
                                info = await info; // TODO: WTF?
                                m.reply("Now playing: `" + info.title + "` [" + msToHMS(utils.toNum(info.length_seconds) * 1000) + "m] requested by **" + m.author.username + "#" + m.author.discriminator + "**", 15000);
                                m.deleteIn(15000);
                            });
                        }
                    }
                    else { // User is in different Voice Channel and shouldnt be doing anything
                        m.reply("You must be in the same Voice Channel as me to play a song", 7000);
                        m.deleteIn(7000);
                    }
                    if (isNewQueue) {
                        var close = false;
                        // pls ignore all the extra console logs, they are for debugging this
                        voiceConnection.on("end", () => { // when the song ends
                            var guildDb = dbs.guild.load();
                            var queue = Object.keys(guildDb[guild.id].music.queue);
                            if (queue.length > 0 && !voiceConnection.playing) { // if there is another song in the queue, try to play that song
                                code = queue[0];
                                voiceConnection.playing = true;
                                console.log(code);
                                var valid = yt.validateID(code);
                                if (!valid || code == undefined) {
                                    delete guildDb[guild.id].music.queue[queue[0]];
                                    dbs.guild.save(guildDb);
                                    return;
                                }
                                var requester = guildDb[guild.id].music.queue[code];
                                var song = yt("https://www.youtube.com/watch?v=" + code, {
                                    filter: "audioonly"
                                });
                                voiceConnection.play(song, {
                                    inlineVolume: true
                                });
                                voiceConnection.setVolume(0.3);
                                yt.getInfo("https://www.youtube.com/watch?v=" + code, function(error, info) {
                                    if (error) {
                                        console.log("Error: " + error);
                                    }
                                    m.reply("Now playing: `" + info.title + "` [" + msToHMS(utils.toNum(info.length_seconds) * 1000) + "m] requested by **" + requester + "**", 5000);
                                });
                                guildDb[guild.id].music.current = {};
                                guildDb[guild.id].music.current.code = code;
                                guildDb[guild.id].music.current.player = `${m.author.username + "#" + m.author.discriminator}`;
                                delete guildDb[guild.id].music.queue[queue[0]];
                                dbs.guild.save(guildDb);
                                return;
                            }
                            else if (queue.length < 1 && !voiceConnection.playing && !close) {
                                setTimeout(function() {
                                    if (queue.length == 0 && !voiceConnection.playing) { // if there is no other song in the queue, leave the voice channel and have a wonderful day
                                        if (BotVoiceState.channelID) {
                                            bot.leaveVoiceChannel(m.member.voiceState.channelID);
                                            guildDb[guild.id].music.current = {};
                                            dbs.guild.save(guildDb);
                                            m.reply("Thanks for Listening " + utils.hands.wave(), 20000);
                                            close = true;
                                        }
                                    }
                                }, 5000);
                            }
                        });
                    }
                }
            });
        }
        else { // User isn't in a Voice Channel
            m.reply("You must be in a Voice Channel to play a song");
        }
    },
    help: "`!play <YT URL>` | `!play <search>` to play | `!play stop` to stop"
};
