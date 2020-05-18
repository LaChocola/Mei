"use strict";

const yt = require("ytdl-core");
const progress = require("progress-string");
const ytsr = require("ytsr");
const AsyncLock = require("async-lock");

const { choose, delay, isNum, toNum } = require("../misc");
const serversdb = require("../servers");

// maxPending: 0 is replaced with the default 1000, so I have to use maxPending: -1 to avoid triggering the default
var lock = new AsyncLock();
var hands = [":wave::skin-tone-1:", ":wave::skin-tone-2:", ":wave::skin-tone-3:", ":wave::skin-tone-4:", ":wave::skin-tone-5:", ":wave:"];

function parseCode(args) {
    args = args || "";
    var code = undefined;

    try {
        code = yt.getVideoID(args);
    }
    catch (err) {
        // Ignore errors from getVideoID
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
        m.reply(`Server: ${guild.name} added to database. Populating information ${choose(hands)}`, 5000);
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

async function checkIfDone(bot, guildId, textChannelId) {
    try {
        await lock.acquire(guildId, async function() {
            await delay(5000);
            console.debug("Checking to see if new music was added");
            var guild = bot.guilds.get(guildId);
            var textChannel = guild.channels.get(textChannelId);
            var guildsdata = await serversdb.load();
            var guildData = guildsdata[guildId];
            var voiceConnection = bot.voiceConnections.get(guildId);

            // We are no longer connected to a voice channel
            if (!voiceConnection) {
                console.warn("TRIED TO CHECK IF DONE WHILE NOT CONNECTED");
                return;
            }

            var voiceChannel = bot.getChannel(voiceConnection.channelID);

            var queueLength = Object.keys(guildData.music.queue).length;
            // If songs have been added to the queue, process the next item
            if (queueLength > 0) {
                console.debug("Music was added, processing queue");
                processQueue(bot, guildId, textChannelId);
                return;
            }

            // We're playing music, don't need to do anything
            if (voiceConnection.playing) {
                return;
            }

            // If songs have not been added to the queue AND we are not currently playing anything, disconnect from voice channel
            if (voiceConnection.channelID) {
                console.debug("No music was added, leaving channel");
                voiceChannel.leave();
            }

            textChannel.send(`Thanks for Listening ${choose(hands)}`, 20000);
        });
    }
    catch(err) {
        if (err.message === "Too much pending tasks") {
            console.error("Tried to call checkIfDone more than once");
            return;
        }
        console.error("Error waiting for new music", err);
    }
    console.debug("Left checkIfDone()")
}

async function processQueue(bot, guildId, textChannelId) {
    try {
        var guild = bot.guilds.get(guildId);
        var textChannel = guild.channels.get(textChannelId);
        // Only allow one process to run processQueue per guild
        var guildsdata = await serversdb.load();
        var guildData = guildsdata[guildId];
        var voiceConnection = bot.voiceConnections.get(guildId);

        // We are no longer connected to a voice channel
        if (!voiceConnection) {
            console.warn("TRIED TO PROCESS QUEUE WHILE NOT CONNECTED");
            return;
        }

        // We are already playing something (this shouldn't happen)
        if (voiceConnection.playing) {
            console.warn("TRIED TO PROCESS QUEUE WHILE ALREADY PLAYING");
            return;
        }

        // if there is no other song in the queue, leave the voice channel and have a wonderful day
        var queueLength = Object.keys(guildData.music.queue).length;
        if (queueLength === 0) {
            checkIfDone(bot, guildId, textChannelId);
            return;
        }

        // Pop the first item off the queue
        var [code, requester] = Object.entries(guildData.music.queue)[0];
        delete guildData.music.queue[code];
        await serversdb.save(guildsdata);

        // Empty item in the queue (this shouldn't happen)
        if (!code) {
            console.warn("EMPTY ITEM IN THE QUEUE");
            // Just try to process the next item in the queue
            processQueue(bot, guildId, textChannelId);
            return;
        }

        // if there is another song in the queue, try to play that song
        var info = await getInfo(code);
        if (!info) {
            textChannel.send(`Sorry, I wasn't able to play a video with the code: ${code}`, 5000);
            // Just try to process the next item in the queue
            processQueue(bot, guildId, textChannelId);
            return;
        }

        try {
            var song = yt.downloadFromInfo(info, {
                filter: "audioonly"
            });
        }
        catch (err) {
            console.error("Error downloading song", err);
            console.log("Skipping to next song in queue");
            processQueue(bot, guildId, textChannelId);
            return;
        }

        voiceConnection.play(song, {
            inlineVolume: true
        });
        // If playback fails, then we need to kill the encoder
        if (!voiceConnection.playing) {
            textChannel.send(`Sorry, I wasn't able to play the video: ${info.title}`, 5000);
            voiceConnection.stopPlaying();
            processQueue(bot, guildId, textChannelId);
            return;
        }

        // Setup event handling for when a song ends
        voiceConnection.once("end", async function() {
            console.debug("EVENT: end");
            processQueue(bot, guildId, textChannelId);
        });

        voiceConnection.setVolume(0.3);

        textChannel.send("Now playing: `" + info.title + "` [" + msToHMS(+info.length_seconds * 1000) + "m] requested by **" + requester + "**", 5000);

        guildData.music.current = {
            code: code,
            player: requester
        };
        await serversdb.save(guildsdata);
    }
    catch (err) {
        console.error("Error processing queue", err);
    }
}

async function getInfo(code) {
    var info;
    try {
        info = await yt.getInfo("https://www.youtube.com/watch?v=" + code);
    }
    catch (err) {
        console.warn(`Failed to get info for ${code}: ${err}`);
    }
    return info;
}

async function addToQueue(bot, m, args) {
    var guildid = m.guild.id;
    var guildsdata = await serversdb.load();
    var guildData = guildsdata[guildid];

    var code = parseCode(args);
    console.log("code:", code);

    // Could not find code in queue. Try a youtube search instead.
    if (!code) {
        m.channel.sendTyping();
        m.reply("Searching youtube for: `" + args + "`", 5000);
        code = await searchCode(args);
    }

    // Invalid code
    if (!code) {
        m.reply(`Sorry, I wasn't able to play a video with the code: ${code}`, 5000);
        return;
    }

    // Song is already in the queue
    if (guildData.music.queue[code]) {
        var codes = Object.keys(guildData.music.queue);
        var position = codes.indexOf(code) + 1;
        var existingRequester = guildData.music.queue[code];
        m.reply("That song has already been requested by: **" + existingRequester + "**. It is at queue position: `" + position + "`", 5000);
        return;
    }

    // Too many items already in queue
    var queueLength = Object.keys(guildData.music.queue).length;
    if (queueLength >= 15) {
        m.reply("Sorry, only 15 songs are allowed in the queue at a time", 5000);
        return;
    }

    // Add the song to the queue
    var requester = `${m.author.username + "#" + m.author.discriminator}`;
    guildData.music.queue[code] = requester;
    await serversdb.save(guildsdata);

    console.log("final code:", code);

    var info = await getInfo(code);
    if (!info) {
        return;
    }

    // If we are starting a new queue, skip the "added to queue" message, since the queue processor is about to show a "now playing" message.
    var voiceConnection = bot.voiceConnections.get(m.guild.id);
    if (voiceConnection && voiceConnection.playing) {
        m.reply("Added: `" + info.title + "` [" + msToHMS(+info.length_seconds * 1000) + "m] to queue. Requested by **" + requester + "**", 5000);
    }
}

async function resumeCommand(bot, m) {
    var voiceConnection = bot.voiceConnections.get(m.guild.id);
    if (!(voiceConnection && voiceConnection.playing)) {
        m.reply("Nothing is currently playing");
        return;
    }
    if (!voiceConnection.paused) {
        return;
    }
    m.reply("Resuming music.", 5000);
    voiceConnection.resume();
}

async function stopCommand(bot, m) {
    var voiceConnection = bot.voiceConnections.get(m.guild.id);
    if (!(voiceConnection && voiceConnection.playing)) {
        m.reply("Nothing is currently playing");
        return;
    }
    m.reply("Stopping song.", 5000);
    voiceConnection.stopPlaying();
}

async function pauseCommand(bot, m) {
    var voiceConnection = bot.voiceConnections.get(m.guild.id);
    // someone asks to pause the song
    if (!(voiceConnection && voiceConnection.playing)) {
        m.reply("Nothing is currently playing");
        return;
    }
    if (voiceConnection.paused) {
        return;
    }
    m.reply("Pausing music.", 5000);
    voiceConnection.pause();
}

async function currentCommand(bot, m, guildData, cmdList) {
    var voiceConnection = bot.voiceConnections.get(m.guild.id);
    // someone asks for current song info
    if (!(voiceConnection && voiceConnection.playing)) {
        m.reply("Nothing is currently playing");
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
        m.reply("Nothing is currently playing");
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

    m.reply({
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
    }, end - start);
}

async function listCommand(bot, m, guildData) {
    var voiceConnection = bot.voiceConnections.get(m.guild.id);
    // display queue of songs if it exists
    if (!(voiceConnection && voiceConnection.playing)) {
        m.reply("Nothing is currently playing");
        return;
    }

    // Display queue of songs if it exists
    await m.channel.sendTyping();

    if (!Object.entries(guildData.music.queue)) {
        m.reply("The queue is empty right now");
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
        await m.reply({
            embed: {
                color: 0xA260F6,
                title: `${songs.length} songs currently queued`,
                description: "\n\n" + songs.join("\n")
            }
        });
    }
    catch (err) {
        if (err.code === 50013) {
            m.reply("I do not have permisson to embed links in this channel. Please make sure I have the `embed links` permission on my highest role, and that the channel permissions are not overriding it.", 5000);
        }
    }
}

async function volumeCommand(bot, m, volumeArg) {
    var voiceConnection = bot.voiceConnections.get(m.guild.id);
    if (!(voiceConnection && voiceConnection.playing)) {
        return;
    }
    // someone asks to set the volume to a specific percentage
    if (isNum(volumeArg)) {
        let newVolumePerc = toNum(volumeArg);
        let newVolume = newVolumePerc / 100;
        newVolume = Math.min(Math.max(0, newVolume), 1.5);

        if (newVolume === voiceConnection.volume) {
            return;
        }

        m.reply(`Setting Volume to ${newVolumePerc.toFixed(0)}%`, 5000);

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
        m.reply(`Setting Volume to ${newVolumePerc.toFixed(0)}%`, 5000);
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
        m.reply(`Setting Volume to ${newVolumePerc.toFixed(0)}%`, 5000);
        voiceConnection.setVolume(newVolume);
    }
    else { // show current volume level
        let volumePerc = voiceConnection.volume * 100;
        m.reply(`Volume is set to ${volumePerc}%`, 5000);
    }
}

// Get the voice connection, or create one if not yet connected
async function initVoiceConnection(bot, guildId, voiceChannelId) {
    var guild = bot.guilds.get(guildId);
    var voiceChannel = guild.channels.get(voiceChannelId);

    var voiceConnection = bot.voiceConnections.get(guildId);

    // Connection already exists
    if (voiceConnection) {
        if (voiceConnection.channelID !== voiceChannelId) {
            // This shouldn't happen
            throw new Error("Bot is in a different voice channel than user.");
        }
        // Return an existing voiceConnection
        return voiceConnection;
    }

    // Connection doesn't exist, create a new one
    voiceConnection = await voiceChannel.join();

    // Setup error event handling
    voiceConnection.on("error", function(err) {
        console.error(`VoiceConnection error: ${err}`);
    });
    voiceConnection.on("ready", function() {
        console.error("VoiceConnection ready");
    });

    return voiceConnection;
}

async function playCommand(bot, m, cleanArgs) {
    // Add item to the queue
    await addToQueue(bot, m, cleanArgs);
    // Setup the voice connection
    await initVoiceConnection(bot, m.guild.id, m.member.voiceState.channelID);
    // Start the first call to the queue
    processQueue(bot, m.guild.id, m.channel.id);
}

var x = 0;

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        console.log("X: ", x);
        x = 1;
        // Delete the user's message in 5 seconds
        m.deleteIn(5000);

        var guildsdata = await serversdb.load();
        var cleanArgs = m.cleanContent.slice(`${prefix}play`.length).trim();
        if (cleanArgs === "") {
            m.reply(`Please say what you want to do. e.g. \`${prefix}play <youtube link>\`, \`${prefix}play queue\`, \`${prefix}play current\`, or \`${prefix}play stop\``);
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

        var guildData = await loadGuildData(m, guildsdata);

        // User isn't in a Voice Channel
        if (!m.member.voiceState.channelID) {
            m.reply("You must be in a Voice Channel to play a song");
            return;
        }

        var voiceConnection = bot.voiceConnections.get(m.guild.id);

        // Clear the queue if the bot got disconnected
        if (!(voiceConnection && voiceConnection.playing)) {
            guildData.music.queue = {};
            await serversdb.save(guildsdata);
        }

        // User is in different Voice Channel and shouldn't be doing anything
        if (voiceConnection && voiceConnection.channelID !== m.member.voiceState.channelID) {
            m.reply("You must be in the same Voice Channel as me to play a song", 5000);
            return;
        }

        if (cmdResume) {
            await resumeCommand(bot, m);
        }
        else if (cmdStop) {
            await stopCommand(bot, m);
        }
        else if (cmdPause) {
            await pauseCommand(bot, m);
        }
        else if (cmdCurrent || (cmdList && Object.entries(guildData.music.queue).length === 0)) {
            await currentCommand(bot, m, guildData, cmdList);
        }
        else if (cmdList) {
            await listCommand(bot, m, guildData);
        }
        else if (cmdVolume) {
            await volumeCommand(bot, m, volumeArg);
        }
        else {
            await playCommand(bot, m, cleanArgs);
        }
    },
    help: "`[prefix]play <YT URL>` | `[prefix]play <search>` to play | `[prefix]play stop` to stop"
};
