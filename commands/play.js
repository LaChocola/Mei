"use strict";

const Eris = require("eris");
const ytdl = require("ytdl-core");
const progress = require("progress-string");
const ytsr = require("ytsr");

const utils = require("../utils");
const conf = require("../conf");
const dbs = require("../dbs");

const minVol = 0;
const maxVol = 1.5;

// Replaced with ytdl.getVideoID()
/*
function getYoutubeVideoId(fullArgs) {
    // this is so fucking long. Basically take the video code out of any form of youtube link
    var match = fullArgs.match(/(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/);
    var videoId = match && match[1] || undefined;
    return videoId;
}
*/

function parseVideoId(videoArg) {
    if (!videoArg) {
        return undefined;
    }
    var videoId = ytdl.getVideoID(videoArg);
    if (videoId instanceof Error) { // Why the heck would ytdl.getVideoID() _return_ an error instead of _throwing_ it???
        return undefined;
    }
    return videoId;
}

async function searchForVideo(searchString) {
    try {
        var results = await ytsr(searchString);
    }
    catch (err) {
        if (err.message === "Status Code 302") {
            // TODO: Use an actual youtube search API to prevent this?
            console.error("YouTube search thinks Mei is a robot. " + utils.shrug.html);
        }
        else {
            console.error("Error search for youtube video", err);
        }
        return undefined;
    }
    var target = results.items.find(i => i.type === "video");
    var videoId = parseVideoId(target && target.link);
    return videoId;
}

async function getYoutubeInfo(videoId) {
    var videoUrl = getYoutubeUrl(videoId);
    return ytdl.getInfo(videoUrl);
}

function getYoutubeUrl(videoId, startAt) {
    var url = `https://www.youtube.com/watch?v=${videoId}`;
    if (startAt) {
        url += `&t=${msToYoutubeMS(startAt)}`;
    }
    return url;
}

function getShortYoutubeUrl(videoId, startAt) {
    var url = `https://youtu.be/${videoId}`;
    if (startAt) {
        url += `?t=${msToYoutubeMS(startAt)}`;
    }
    return url;
}

function getYoutubeImageUrl(videoId) {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

// Convert seconds to hours : minutes : seconds
function sToHMS(s) {
    return msToHMS(s * 1000);
}

// Convert milliseconds to hours : minutes : seconds
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

// Convert milliseconds to minutes : seconds
function msToYoutubeMS(ms) {
    // Get hours
    let m = Math.floor(ms / (1000 * 60));
    // Get seconds
    let s = Math.floor(ms / 1000) - m * 60;

    var time = `${s}s`;
    if (m > 0) {
        time = `${m}m` + time;
    }
    return time;
}

function showNowPlayingEmbed(m, ) {
    var nowPlayingMsg = {
        embed: {
            author: {
                name: "Currently Playing:"
            },
            title: `:musical_note: ${info.title} :musical_note:`,
            url: getShortYoutubeUrl(current.videoId, progressMs),
            thumbnail: {
                url: getYoutubeImageUrl(current.videoId)
            },
            footer: {
                text: `Requested by: ${current.addedBy}`
            },
            fields: [
                {
                    name: `${msToHMS(progressMs)}/${msToHMS(lengthMs)}`,
                    value: `[${bar(progressMs)}]`,
                    inline: true
                }
            ],
            color: 0xA260F6
        }
    };
    m.reply(nowPlayingMsg);

}

// Initialize the guild database to default values, if necessary
async function initGuildData(guildDb, guild) {
    var modified = false;

    if (!guildDb[guild.id]) {
        guildDb[guild.id] = {
            name: guild.name,
            owner: guild.ownerID
        };
        //m.reply(`Server: ${guild.name} added to database. Populating information ${utils.hands.wave()}`, 5000);
        modified = true;
    }
    var guildData = guildDb[guild.id];

    // I am bad with storage, I know
    if (!guildData.music) {
        guildData.music = {};
        modified = true;
    }

    // Temporary code to convert old music object based-queues to new array-based queues
    // TODO: Remove eventually
    if (guildData.music.queue && !Array.isArray(guildData.music.queue)) {
        guildData.music.queue = Object.keys(guildData.music.queue).map(function(videoId) {
            var item = guildData.music.queue[videoId];
            var newItem = {
                videoId: videoId,
                addedBy: item
            };
            return newItem;
        });
        modified = true;
    }

    if (!guildData.music.queue) {
        guildData.music.queue = [];
        modified = true;
    }

    if (!guildData.music.current) {
        guildData.music.current = null;
        modified = true;
    }

    if (modified) {
        await dbs.guild.save(guildDb);
    }

    return guildData;
}

// !volume [subcommand]
function volumeCommand(m, voiceConnection, args) {
    if (!(voiceConnection && voiceConnection.playing)) {
        m.reply("Nothing is playing.", 2000);
        m.deleteIn(2000);
        return;
    }

    var volSubcommand = args[1]; // Ignore subcommand label
    if (args[0] === "turn" && args[1] === "it") {
        volSubcommand = args[2]; // Ignore subcommand label for "turn it"
    }

    if (volSubcommand === "down") { // someone asks to turn volume down 10%
        volumeDownCommand(m, voiceConnection);
    }
    else if (volSubcommand === "up") {  // someone asks to turn volume up 10%
        volumeUpCommand(m, voiceConnection);
    }
    else if (utils.isNum(volSubcommand)) {
        var newVol = Math.trunc(utils.toNum(volSubcommand)) / 100;
        volumeSetCommand(m, voiceConnection, newVol);
    }
    else {  // show current volume level
        volumeGetCommand(m, voiceConnection);
    }
}

// !volume up - Decrease the volume by 10%
function volumeDownCommand(m, voiceConnection) {
    if (voiceConnection.volume <= minVol) {
        voiceConnection.setVolume(minVol);  // Just in case we've already gone below the minimum volume
        m.reply("Volume is already at minimum", 5000);
        m.deleteIn(5000);
        return;
    }
    var newVol = voiceConnection.volume - 0.1;
    if (newVol < minVol) {
        newVol = minVol;
    }
    var newVolPerc = (newVol * 100).toFixed(0);
    m.reply(`Setting Volume to ${newVolPerc}%`, 5000);
    m.deleteIn(5000);
    voiceConnection.setVolume(newVol);
}

// !volume up - Increase the volume by 10%
function volumeUpCommand(m, voiceConnection) {
    if (voiceConnection.volume >= maxVol) {
        voiceConnection.setVolume(maxVol);  // Just in case we've already gone above the maximum volume
        m.reply("Volume is already at maximum", 5000);
        m.deleteIn(5000);
        return;
    }
    var newVol = voiceConnection.volume + 0.1;
    if (newVol > maxVol) {
        newVol = maxVol;
    }
    var newVolPerc = (newVol * 100).toFixed(0);
    m.reply(`Setting Volume to ${newVolPerc}%`, 5000);
    m.deleteIn(5000);
    voiceConnection.setVolume(newVol);
}

// !volume [level] - Set the volume
function volumeSetCommand(m, voiceConnection, newVol) {
    if (newVol < minVol) {
        newVol = minVol;
    }
    else if (newVol > maxVol) {
        newVol = maxVol;
    }
    var newVolPerc = (newVol * 100).toFixed(0);
    m.reply(`Setting Volume to ${newVolPerc}%`, 5000);
    m.deleteIn(5000);
    voiceConnection.setVolume(newVol);
}

// !volume - Get the current volume
function volumeGetCommand(m, voiceConnection) {
    var volPerc = (voiceConnection.volume * 100).toFixed(0);
    m.reply(`Volume is set to ${volPerc}%`, 5000);
    m.deleteIn(5000);
}

// !play pause - Pause a playing song
function pauseCommand(m, voiceConnection) {
    if (!(voiceConnection && voiceConnection.playing && !voiceConnection.paused)) {
        m.reply("Nothing is playing.", 2000);
        m.deleteIn(2000);
        return;
    }

    m.reply("Pausing music.", 5000);
    m.deleteIn(5000);
    voiceConnection.pause();
}

// !play resume - Unpause a playing song
function resumeCommand(m, voiceConnection) {
    if (!(voiceConnection && voiceConnection.playing && voiceConnection.paused)) {
        m.reply("Nothing is paused.", 2000);
        m.deleteIn(2000);
        return;
    }

    m.reply("Resuming music.", 5000);
    m.deleteIn(5000);
    voiceConnection.resume();
}

// !play stop - Skip the current song
function skipCommand(m, voiceConnection) {
    if (!(voiceConnection && voiceConnection.playing)) {
        m.reply("Nothing is playing", 2000);
        m.deleteIn(2000);
        return;
    }

    m.reply("Stopping song.", 5000);
    m.deleteIn(5000);
    voiceConnection.stopPlaying();
}

// !play queue - List the currently playing and queued songs
async function queueCommand(m, voiceConnection) {
    if (!(voiceConnection && voiceConnection.playing)) {
        m.reply("Nothing is playing", 2000);
        m.deleteIn(2000);
        return;
    }

    var guildDb = await dbs.guild.load();
    var guildData = await initGuildData(guildDb, m.guild);
    var queue = guildData.music.queue;
    var current = guildData.music.current;

    if (!current && queue.length === 0) {
        m.reply("Nothing is playing", 2000);
        return;
    }

    if (current) {
        var progressMs = voiceConnection.current.playTime;
        var info = await getYoutubeInfo(current.videoId);
        var lengthMs = info.length_seconds * 1000;
        var remainingMs = lengthMs - progressMs;
        var bar = progress({
            total: lengthMs,
            style: function(complete, incomplete) {
                return "+".repeat(complete.length) + "" + incomplete;
            }
        });
        var msg = {
            embed: {
                title: `:musical_note:  ${info.title} :musical_note:`,
                url: getShortYoutubeUrl(current.videoId, progressMs),
                color: 0xA260F6,
                footer: {
                    text: `Requested by: ${current.addedBy}`
                },
                thumbnail: {
                    url: getYoutubeImageUrl(current.videoId)
                },
                author: {
                    name: "Currently Playing:"
                },
                fields: [
                    {
                        name: `${msToHMS(progressMs)}/${msToHMS(lengthMs)}`,
                        value: `[${bar(progressMs)}]`,
                        inline: true
                    }
                ]
            }
        };
        m.reply(msg, remainingMs);
    }

    if (queue.length > 0) {
        // Display queue of songs if it exists
        m.channel.sendTyping();

        // This runs in parallel! (should run a little faster)
        var songs = await Promise.all(queue.map(async function(item, i) {
            var info = await getYoutubeInfo(item.videoId);
            return `${i + 1}. [${info.title}](${getYoutubeUrl(item.videoId)}) [${sToHMS(info.length_seconds)}]  |  Requested by: ${item.addedBy}`;
        }));

        m.reply({
            embed: {
                color: 0xA260F6,
                title: `${songs.length} songs currently queued`,
                description: "\n\n" + songs.join("\n")
            }
        });
    }
    m.deleteIn(2000);
}

// !play [song] - Add a song to the queue, and start playing
async function playCommand(m, voiceConnection) {
    var videoArg = m.fullArgs;

    var guildDb = await dbs.guild.load();
    var guildData = guildDb[m.guild.id];
    // If we're not already playing, clear any remaining queue information
    if (!(voiceConnection && voiceConnection.playing)) {
        guildData.music.queue = [];
        guildData.music.current = null;
        await dbs.guild.save(guildDb);
    }

    // Try parsing out the videoId, and failing that search for a matching video
    var videoId = parseVideoId(videoArg);

    if (!videoId) {
        var searchMsg = await m.reply(`Searching youtube for: \`${videoArg}\``);
        m.channel.sendTyping();
        videoId = await searchForVideo(videoArg);
        searchMsg.delete();
    }

    if (!videoId) {
        m.reply(`Sorry, I wasn't able to find the video: ${videoArg}`, 5000);
        m.deleteIn(5000);
        return;
    }

    // Reload guild data, in case the queue was updated while we were searching for the video id
    guildDb = await dbs.guild.load();
    guildData = guildDb[m.guild.id];

    var current = guildData.music.current;
    if (current && current.videoId === videoId) {
        m.reply("That song is current playing.", 7000);
        m.deleteIn(7000);
        return;
    }

    var queue = guildData.music.queue;

    var existingItemIndex = queue.findIndex(i => i.videoId === videoId);
    if (existingItemIndex !== -1) {
        var existingItem = queue[existingItemIndex];
        m.reply(`That song has already been requested by: **${existingItem.addedBy}"**. It is at queue position: \`${existingItemIndex + 1}\``, 7000);
        m.deleteIn(7000);
        return;
    }

    if (queue.length >= 15) {
        m.reply("Sorry, only 15 songs are allowed in the queue at a time", 5000);
        m.deleteIn(5000);
        return;
    }

    var newItem = {
        videoId: videoId,
        addedBy: `${m.author.username}#${m.author.discriminator}`
    };
    queue.push(newItem);
    await dbs.guild.save(guildDb);
    var info = await getYoutubeInfo(videoId);
    // If this is a new queue, a "now playing" message will appear, so skip showing the "Added to queue" message
    if (current) {
        m.reply(`Added: \`${info.title}\` [${sToHMS(info.length_seconds)}] to queue. Requested by **${newItem.addedBy}**`, 10000);
    }
    m.deleteIn(10000);

    var voiceChannelId = m.member.voiceState.channelID;
    var voiceChannel = m.guild.channels.get(voiceChannelId);

    // If bot is not connected, connect to the voice channel
    if (!voiceConnection) {
        console.debug(`Joining voice channel ${voiceChannelId}`);
        voiceConnection = await voiceChannel.join();
    }

    // If bot is connected to the wrong channel, connect to the new voice channel
    if (voiceConnection.channelID !== voiceChannelId) {
        console.debug(`Switching to voice channel ${voiceChannelId}`);
        voiceConnection.switchChannel(voiceChannelId);
    }

    processQueue(m);

}

// Process the next song in the queue
async function processQueue(m) {
    var voiceConnection = m.bot.voiceConnections.get(m.guild.id);

    var guildDb = await dbs.guild.load();
    var guildData = guildDb[m.guild.id];
    var queue = guildData.music.queue;

    // We're not connected to anything, clear the queue and stop processing
    if (!voiceConnection) {
        console.warn("Tried playing queue without active voice connection");
        guildData.music.queue = [];
        guildData.music.current = null;
        await dbs.guild.save(guildDb);
        return;
    }

    // If we're already playing, let the existing queue processor take care of things
    if (voiceConnection.playing) {
        console.debug(`Queue processor already running for guild ${m.guild.id}`);
        return;
    }

    console.debug(`Starting queue processor for guild ${m.guild.id}`);

    // If queue is empty, wait 5 seconds, and if nothing is playing, leave the channel
    if (queue.length === 0) {
        console.debug(`Queue processor closing for guild ${m.guild.id}`);
        guildData.music.current = null;
        await dbs.guild.save(guildDb);

        await utils.delay(5000);
        if (!voiceConnection.playing) {
            var voiceChannel = m.guild.channels.get(voiceConnection.channelID);
            if (voiceChannel) {
                voiceChannel.leave();
            }
            m.reply("Thanks for Listening " + utils.hands.wave(), 20000);
        }
        return;
    }

    guildData.music.current = queue.shift();
    await dbs.guild.save(guildDb);

    await playQueueItem(m, voiceConnection, guildData.music.current);

    // when song is done playing, process the next song in queue
    voiceConnection.once("end", function() {
        console.debug(`Queue item has ended for guild ${m.guild.id}`);
        processQueue(m);
    });
}

// Play a song
async function playQueueItem(m, voiceConnection, item) {
    console.debug("Playing queue item", item);
    var audioStream = ytdl(getYoutubeUrl(item.videoId), { filter: "audioonly" });
    voiceConnection.play(audioStream, { inlineVolume: true });
    voiceConnection.setVolume(0.3);
    var info = await getYoutubeInfo(item.videoId);
    var lengthMs = info.length_seconds * 1000;
    await m.reply(`Now playing: \`${info.title}\` [${sToHMS(info.length_seconds)}] requested by **${item.addedBy}**`, lengthMs);
    // TODO: Delete the now playing message if the song is stopped or interrupted
}

// !play
async function main(m, args) {
    // Disable play command for this guild?
    if (m.guild.id === conf.guilds.guild2) {
        return;
    }

    if (!m.fullArgs) {
        m.reply(`Please say what you want to do. e.g. \`${m.prefix}play <youtube link>\`, \`${m.prefix}play queue\`, \`${m.prefix}play current\`, or \`${m.prefix}play stop\``);
        return;
    }

    // TODO: Check if bot has permissions to connect to this voice channel
    var voiceChannelId = m.member.voiceState.channelID;
    if (!voiceChannelId) {
        m.reply("You must be in a Voice Channel to play a song");
        return;
    }

    var voiceConnection = m.bot.voiceConnections.get(m.guild.id);

    var guildDb = await dbs.guild.load();
    await initGuildData(guildDb, m.guild);  // Ensure that guild data is initialized for play command

    var subcommand = args[0];
    if (subcommand === "resume") {
        resumeCommand(m, voiceConnection);
    }
    else if (["stop", "cancel"].includes(subcommand)) {
        skipCommand(m, voiceConnection);
    }
    else if (["current", "queue", "list", "&list="].includes(subcommand)) {
        await queueCommand(m, voiceConnection);
    }
    else if (["pause"].includes(subcommand)) {
        pauseCommand(m, voiceConnection);
    }
    else if (["volume", "turn"].includes(subcommand)) {
        volumeCommand(m, voiceConnection, args);
    }
    else {
        playCommand(m, voiceConnection);
    }
}

module.exports = new Eris.Command("play", main, {
    description: "`!play <YT URL>` | `!play <search>` to play | `!play stop` to stop"   // TODO: Substitute correct prefix
});
