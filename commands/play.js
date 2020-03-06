"use strict";

const yt = require("ytdl-core");
const progress = require("progress-string");
const ytsr = require("ytsr");

const misc = require("../misc");
const serversdb = require("../servers");

var hands = [":wave::skin-tone-1:", ":wave::skin-tone-2:", ":wave::skin-tone-3:", ":wave::skin-tone-4:", ":wave::skin-tone-5:", ":wave:"];

function parseCode(args) {
    args = args || "";
    var code = undefined;

    var urlCode = yt.getVideoID(args);
    if (!(urlCode instanceof Error)) {
        // handle error
        code = urlCode;
    }

    if (!code) {
        // this is so fucking long. Basically take the video code out of any form of youtube link
        var codeMatch = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/.exec(args);
        if (codeMatch && codeMatch[1] && yt.validateID(codeMatch[1])) {
            code = codeMatch[1];
        }
    }

    return code;
}

async function searchCode(args) {
    var code = undefined;
    try {
        var filters = await ytsr.getFilters(args);
        var filter = filters.get("Type").find(f => f.name === "Video");
        var results = await ytsr(null, {
            limit: 1,
            nextpageRef: filter.ref
        });
        var resultUrl = results.items[0] && results.items[0].link;
        code = parseCode(resultUrl);
    }
    catch (err) {
        console.error(`Error searching youtube for "${args}": ${err}`);
    }
    return code;
}

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

async function loadGuildData(m, data) {
    var guild = m.guild;
    var guildChanged = false;
    if (!data[guild.id]) {
        data[guild.id] = {
            name: guild.name,
            owner: guild.ownerID
        };
        m.channel.createMessage(`Server: ${guild.name} added to database. Populating information ${misc.choose(hands)}`)
            .then(async function(sentMsg) {
                await misc.delay(5000);
                sentMsg.delete("Timeout");
            });
        guildChanged = true;
    }
    var guildData = data[guild.id];
    // I am bad with storage, I know
    if (!guildData.music) {
        guildData.music = {};
        guildChanged = true;
    }
    if (!guildData.music.queue) {
        guildData.music.queue = {};
        guildChanged = true;
    }
    if (!guildData.music.current) {
        guildData.music.current = {};
        guildChanged = true;
    }

    if (guildChanged) {
        await serversdb.save(data);
    }

    return guildData;
}

async function processQueue(Bot, guildid, textChannel) {
    var data = await serversdb.load();
    var guildData = data[guildid];
    var voiceConnection = Bot.voiceConnections.get(guildid);

    // We are no longer connected to a voice channel
    if (!voiceConnection) {
        console.warn("TRIED TO PROCESS QUEUE WHILE NOT CONNECTED");
        return;
    }

    var voiceChannel = Bot.getChannel(voiceConnection.channelID);

    // We are already playing something (this shouldn't happen)
    if (voiceConnection.playing) {
        console.warn("TRIED TO PROCESS QUEUE WHILE ALREADY PLAYING");
        return;
    }

    // if there is no other song in the queue, leave the voice channel and have a wonderful day
    var queueLength = Object.keys(guildData.music.queue).length;
    if (queueLength === 0) {
        await misc.delay(5000);
        data = await serversdb.load();
        guildData = data[guildid];
        queueLength = Object.keys(guildData.music.queue).length;
        if (queueLength > 0) {
            // If songs have been added to the queue, process the next item
            await processQueue(Bot, guildid, textChannel);
        }
        else if (!voiceConnection.playing) {
            // If songs have not been added to the queue AND we are not currently playing anything, disconnect from voice channel
            if (voiceConnection.channelID) {
                voiceChannel.leave();
            }

            textChannel.createMessage(`Thanks for Listening ${misc.choose(hands)}`)
                .then(async function(sentMsg) {
                    await misc.delay(20000);
                    sentMsg.delete("Timeout");
                });
        }
        return;
    }

    // Pop the first item off the queue
    var [code, requester] = Object.entries(guildData.music.queue)[0];
    delete guildData.music.queue[code];
    await serversdb.save(data);

    // Empty item in the queue (this shouldn't happen)
    if (!code) {
        console.warn("EMPTY ITEM IN THE QUEUE");
        // Just try to process the next item in the queue
        await processQueue(Bot, guildid, textChannel);
        return;
    }

    // if there is another song in the queue, try to play that song
    var info = await getInfo(code);
    if (!info) {
        textChannel.createMessage(`Sorry, I wasn't able to play a video with the code: ${code}`)
            .then(async function(sentMsg) {
                await misc.delay(5000);
                sentMsg.delete("Timeout");
            });
        // Just try to process the next item in the queue
        await processQueue(Bot, guildid, textChannel);
        return;
    }

    var song = yt.downloadFromInfo(info, {
        filter: "audioonly"
    });
    voiceConnection.play(song, {
        inlineVolume: true
    });
    voiceConnection.setVolume(0.3);

    textChannel.createMessage("Now playing: `" + info.title + "` [" + msToHMS(+info.length_seconds * 1000) + "m] requested by **" + requester + "**")
        .then(async function(sentMsg) {
            await misc.delay(5000);
            sentMsg.delete("Timeout");
        });

    guildData.music.current = {
        code: code,
        player: requester
    };
    await serversdb.save(data);
}

async function getInfo(code) {
    var info;
    try {
        info = await yt.getInfo("https://www.youtube.com/watch?v=" + code);
    }
    catch (err) {
        console.warning(`Failed to get info for ${code}: ${err}`);
    }
    return info;
}

async function addToQueue(m, args, isPlaying) {
    var guildid = m.guild.id;
    var data = await serversdb.load();
    var guildData = data[guildid];

    var code = parseCode(args);
    console.log("code:", code);

    // Could not find code in queue. Try a youtube search instead.
    if (!code) {
        m.channel.sendTyping();
        m.channel.createMessage("Searching youtube for: `" + args + "`")
            .then(async function(sentMsg) {
                await misc.delay(5000);
                sentMsg.delete("Timeout");
            });
        code = await searchCode(args);
    }

    // Invalid code
    if (!code) {
        m.channel.createMessage(`Sorry, I wasn't able to play a video with the code: ${code}`)
            .then(async function(sentMsg) {
                await misc.delay(5000);
                sentMsg.delete("Timeout");
            });
        return;
    }

    // Song is already in the queue
    if (guildData.music.queue[code]) {
        var codes = Object.keys(guildData.music.queue);
        var position = codes.indexOf(code) + 1;
        var existingRequester = guildData.music.queue[code];
        m.channel.createMessage("That song has already been requested by: **" + existingRequester + "**. It is at queue position: `" + position + "`")
            .then(async function(sentMsg) {
                await misc.delay(5000);
                sentMsg.delete("Timeout");
            });
        return;
    }

    // Too many items already in queue
    var queueLength = Object.keys(guildData.music.queue).length;
    if (queueLength >= 15) {
        m.channel.createMessage("Sorry, only 15 songs are allowed in the queue at a time")
            .then(async function(sentMsg) {
                await misc.delay(5000);
                sentMsg.delete("Timeout");
            });
        return;
    }

    // Add the song to the queue
    var requester = `${m.author.username + "#" + m.author.discriminator}`;
    guildData.music.queue[code] = requester;
    await serversdb.save(data);

    console.log("final code:", code);

    var info = await getInfo(code);
    if (!info) {
        return;
    }

    // If we are starting a new queue, skip the "added to queue" message, since the queue processor is about to show a "now playing" message.
    if (isPlaying) {
        m.channel.createMessage("Added: `" + info.title + "` [" + msToHMS(+info.length_seconds * 1000) + "m] to queue. Requested by **" + requester + "**")
            .then(async function(sentMsg) {
                await misc.delay(5000);
                sentMsg.delete("Timeout");
            });
    }
}

async function resumeCommand(m, voiceConnection) {
    var isPlaying = voiceConnection && voiceConnection.playing;
    if (!isPlaying || !voiceConnection.paused) {
        m.channel.createMessage("Nothing is currently playing");
        return;
    }
    m.channel.createMessage("Resuming music.");
    voiceConnection.resume();
}

async function stopCommand(m, voiceConnection) {
    var isPlaying = voiceConnection && voiceConnection.playing;
    if (!isPlaying) {
        m.channel.createMessage("Nothing is currently playing");
        return;
    }
    m.channel.createMessage("Stopping song.")
        .then(async function(sentMsg) {
            await misc.delay(5000);
            sentMsg.delete("Timeout");
        });
    voiceConnection.stopPlaying();
}

async function pauseCommand(m, voiceConnection) {
    var isPlaying = voiceConnection && voiceConnection.playing;
    // someone asks to pause the song
    if (!isPlaying || voiceConnection.paused) {
        m.channel.createMessage("Nothing is currently playing");
        return;
    }
    m.channel.createMessage("Pausing music.")
        .then(async function(sentMsg) {
            await misc.delay(5000);
            sentMsg.delete("Timeout");
        });
    voiceConnection.pause();
}

async function currentCommand(m, voiceConnection, guildData, cmdList) {
    var isPlaying = voiceConnection && voiceConnection.playing;
    // someone asks for current song info
    if (!isPlaying) {
        m.channel.createMessage("Nothing is currently playing");
        return;
    }

    var info = await getInfo(guildData.music.current.code);
    if (!info) {
        return;
    }
    var currentCode;
    var currentRequester;
    if (guildData.music.current) {
        currentCode = guildData.music.current.code;
        currentRequester = guildData.music.current.player;
    }

    if (!(currentCode && currentRequester)) {
        m.channel.createMessage("Nothing is currently playing");
        return;
    }

    var start = voiceConnection.current.playTime;
    var end = +info.length_seconds * 1000;
    var bar = progress({
        total: end,
        style: function(complete, incomplete) {
            return "+".repeat(complete.length) + incomplete;
        }
    });

    m.channel.createMessage({
        embed: {
            title: `:musical_note:  ${info.title} :musical_note:`,
            url: `https://youtu.be/${currentCode}?t=${msToHMS(start).replace(":", "m")}s`,
            color: 0xA260F6,
            footer: {
                text: `Requested by: ${currentRequester}`
            },
            thumbnail: {
                url: `https://i.ytimg.com/vi/${currentCode}/hqdefault.jpg`
            },
            author: {
                name: (cmdList ? "Nothing Else is Queued.\n" : "") + "Currently Playing"
            },
            fields: [{
                name: `${msToHMS(start)}/${msToHMS(end)}`,
                value: `[${bar(start)}]`,
                inline: true
            }]
        }
    })
        .then(async function(sentMsg) {
            await misc.delay(end - start);
            sentMsg.delete("Timeout");
        });
}

async function listCommand(m, voiceConnection, guildData) {
    var isPlaying = voiceConnection && voiceConnection.playing;
    // display queue of songs if it exists
    if (!isPlaying) {
        m.channel.createMessage("Nothing is currently playing");
        return;
    }

    // Display queue of songs if it exists
    await m.channel.sendTyping();
    console.log(guildData.music.queue);

    if (!Object.entries(guildData.music.queue)) {
        m.channel.createMessage("The queue is empty right now");
        return;
    }

    // Load the info for all the songs
    var songs = await Promise.all(Object.entries(guildData.music.queue).map(async function([code, requester], i) {
        let info = await getInfo(code);
        if (!info) {
            // If we can't get info for a video, provide a basic entry (this shouldn't happen)
            return `${i + 1}. https://www.youtube.com/watch?v=${code}  |  Requested by: ${requester}`;
        }
        return `${i + 1}. [${info.title}](https://www.youtube.com/watch?v=${code}) [${msToHMS(+info.length_seconds * 1000)}]  |  Requested by: ${requester}`;
    }));

    try {
        await m.channel.createMessage({
            embed: {
                color: 0xA260F6,
                title: `${songs.length} songs currently queued`,
                description: "\n\n" + songs.join("\n")
            }
        });
    }
    catch (err) {
        if (err.code === 50013) {
            m.channel.createMessage("I do not have permisson to embed links in this channel. Please make sure I have the `embed links` permission on my highest role, and that the channel permissions are not overriding it.")
                .then(async function(sentMsg) {
                    await misc.delay(5000);
                    sentMsg.delete("Timeout");
                });
        }
    }
}

async function volumeCommand(m, voiceConnection, volumeArg) {
    var isPlaying = voiceConnection && voiceConnection.playing;
    if (!isPlaying) {
        return;
    }
    // someone asks to set the volume to a specific percentage
    if (misc.isNum(volumeArg)) {
        let newVolumePerc = misc.toNum(volumeArg);
        let newVolume = newVolumePerc / 100;
        newVolume = Math.min(Math.max(0, newVolume), 1.5);

        if (newVolume === voiceConnection.volume) {
            return;
        }

        m.channel.createMessage(`Setting Volume to ${newVolumePerc.toFixed(0)}%`)
            .then(async function(sentMsg) {
                await misc.delay(5000);
                sentMsg.delete("Timeout");
            });

        voiceConnection.setVolume(newVolume);
    }
    else if (volumeArg === "down") {
        // someone asks to turn volume down 10%
        let newVolume = voiceConnection.volume - 0.1;
        newVolume = Math.min(Math.max(0, newVolume), 1.5);
        if (newVolume === voiceConnection.volume) {
            return;
        }
        let newVolumePerc = newVolume * 100;
        m.channel.createMessage(`Setting Volume to ${newVolumePerc.toFixed(0)}%`)
            .then(async function(sentMsg) {
                await misc.delay(5000);
                sentMsg.delete("Timeout");
            });
        voiceConnection.setVolume(newVolume);
    }
    else if (volumeArg === "up") {
        // someone asks to turn volume up 10%
        let newVolume = voiceConnection.volume + 0.1;
        newVolume = Math.min(Math.max(0, newVolume), 1.5);
        if (newVolume === voiceConnection.volume) {
            return;
        }
        let newVolumePerc = newVolume * 100;
        m.channel.createMessage(`Setting Volume to ${newVolumePerc.toFixed(0)}%`)
            .then(async function(sentMsg) {
                await misc.delay(5000);
                sentMsg.delete("Timeout");
            });
        voiceConnection.setVolume(newVolume);
    }
    else { // show current volume level
        let volumePerc = voiceConnection.volume * 100;
        m.channel.createMessage(`Volume is set to ${volumePerc}%`)
            .then(async function(sentMsg) {
                await misc.delay(5000);
                sentMsg.delete("Timeout");
            });
    }
}

async function playCommand(Bot, m, voiceConnection, cleanArgs) {
    var isPlaying = voiceConnection && voiceConnection.playing;

    await addToQueue(m, cleanArgs, isPlaying);

    // start a song since the bot is not currently playing anything, and the voice connection should be ready
    if (isPlaying) {
        return;
    }

    // Join user voice channel
    var voiceChannel = Bot.getChannel(m.member.voiceState.channelID);
    voiceConnection = await voiceChannel.join();

    // Bot is not in Voice Channel
    if (!voiceConnection.channelID) {
        return;
    }

    // when the song ends
    voiceConnection.on("end", async function() {
        await processQueue(Bot, m.guild.id, m.channel);
    });
    voiceConnection.on("error", function(err) {
        console.error(`VoiceConnection error: ${err}`);
    });
    // Start the first call to the queue
    await processQueue(Bot, m.guild.id, m.channel);
}

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        // Delete the user's message in 5 seconds
        misc.delay(5000).then(() => m.delete("Timeout"));

        var data = await serversdb.load();
        var cleanArgs = m.cleanContent.slice(`${prefix}play`.length).trim();
        console.log("ARGS: " + cleanArgs);
        if (cleanArgs === "") {
            m.channel.createMessage(`Please say what you want to do. e.g. \`${prefix}play <youtube link>\`, \`${prefix}play queue\`, \`${prefix}play current\`, or \`${prefix}play stop\``);
            return;
        }

        var cmdResume = /^resume$/i.test(cleanArgs);
        var cmdStop = /^(?:stop|cancel)$/i.test(cleanArgs);
        var cmdCurrent = /^(?:current)$/i.test(cleanArgs);
        var cmdList = /^(?:queue|list)$/i.test(cleanArgs);
        var cmdPause = /^(?:pause)$/i.test(cleanArgs);
        var volumeMatch = cleanArgs.match(/^(?:volume|turn it|turn)(?: +(up|down|\d+))?$/i);
        var cmdVolume = Boolean(volumeMatch);
        var volumeArg = volumeMatch && volumeMatch[1];

        var guildData = await loadGuildData(m, data);

        // User isn't in a Voice Channel
        if (!m.member.voiceState.channelID) {
            m.channel.createMessage("You must be in a Voice Channel to play a song");
            return;
        }

        var voiceConnection = Bot.voiceConnections.get(m.guild.id);

        // Clear the queue if the bot got disconnected
        if (!(voiceConnection && voiceConnection.playing)) {
            guildData.music.queue = {};
            await serversdb.save(data);
        }

        // User is in different Voice Channel and shouldn't be doing anything
        if (voiceConnection && voiceConnection.channelID !== m.member.voiceState.channelID) {
            m.channel.createMessage("You must be in the same Voice Channel as me to play a song")
                .then(async function(sentMsg) {
                    await misc.delay(5000);
                    sentMsg.delete("Timeout");
                });
            return;
        }

        if (cmdResume) {
            await resumeCommand(m, voiceConnection);
        }
        else if (cmdStop) {
            await stopCommand(m, voiceConnection);
        }
        else if (cmdPause) {
            await pauseCommand(m, voiceConnection);
        }
        else if (cmdCurrent || (cmdList && Object.entries(guildData.music.queue).length === 0)) {
            await currentCommand(m, voiceConnection, guildData, cmdList);
        }
        else if (cmdList) {
            await listCommand(m, voiceConnection, guildData);
        }
        else if (cmdVolume) {
            await volumeCommand(m, voiceConnection, volumeArg);
        }
        else {
            await playCommand(Bot, m, voiceConnection, cleanArgs);
        }
    },
    help: "`[prefix]play <YT URL>` | `[prefix]play <search>` to play | `[prefix]play stop` to stop"
};
