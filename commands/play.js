const Eris = require("eris");
const ytdl = require("ytdl-core");
const ytsearch = require("youtube-search");
const fs = require("fs");
const https = require("https");
const crypto = require("crypto");
var config = require("../etc/config.json");
const SEARCH_KEY = config.tokens.youtube;
const YoutubeRegex = /(?:https?:\/\/)?(?:(?:www\.|m.)?youtube\.com\/watch\?.*v=|youtu\.be\/)([a-zA-Z0-9-_]{11})/;
const cleanURL = url => `https://youtube.com/watch?v=${url.match(YoutubeRegex)[1]}`;
const hands = [":wave::skin-tone-1:", ":wave::skin-tone-2:", ":wave::skin-tone-3:", ":wave::skin-tone-4:", ":wave::skin-tone-5:", ":wave:"];
const queues = new Eris.Collection(Array);

if (!fs.existsSync("./song-cache/")) fs.mkdirSync("./song-cache");
if (fs.readdirSync('./song-cache')[0]) fs.readdirSync('./song-cache').forEach(f => fs.unlinkSync(`./song-cache/${f}`));

function awaitMessage(Bot, channelID, userID) {
    return new Promise((resolve, reject) => {
        let onCreate = msg => {
            if (msg.channel.id === channelID && msg.author.id === userID) {
                Bot.removeListener("messageCreate", onCreate);
                clearInterval(rmvTimeout);
                resolve(msg);
            }
        }

        let rmvTimeout = setTimeout(() => {
            Bot.removeListener("messageCreate", onCreate);
            reject(new Error("Await expired"));
        }, 15000);

        Bot.on("messageCreate", onCreate);
    });
}

function search(Bot, m, content) {
    return new Promise((resolve, reject) => {
        let out = {};

        new Promise((_resolve, _reject) => {
            ytsearch(content, {key: SEARCH_KEY, maxResults: 10}, (err, res) => err ? _reject(err) : _resolve(res));
        }).then(res => {
            res = res.filter(r => r.kind === "youtube#video").slice(0, 5);
            let msg = "```asciidoc\n.Search Results.\n\n";

            if (res.length === 0) throw new Error("No search results");

            for (let i = 0; i < 5; i++) {
                if (!res[i]) break;
                msg += `* ${i + 1}. ${res[i].title}\n`;
            }

            msg += '```';
            out.res = res;

            return Bot.createMessage(m.channel.id, msg);
        }).then(msg => {
            out.msg = msg;
            return awaitMessage(Bot, m.channel.id, m.author.id);
        }).then(msg => {
            out.msg.delete();

            if (/^[1-5]$/.test(msg.content.split(' ')[0])) {
                let choice = out.res[Number(msg.content.split(' ')[0]) - 1];
                return `https://youtube.com/watch?v=${choice.id}`;
            } else {
                throw new Error("Invalid selection");
            }
        }).then(resolve).catch(reject);
    });
}

function saveSong(url) {
    return new Promise((resolve, reject) => {
        let name = crypto.createHash('md5').update(url + Date.now()).digest('hex').slice(0, 16);
        let out = fs.createWriteStream(`./song-cache/${name}`);

        https.get(url, res => {
            res.pipe(out);
            out.on('finish',  () => resolve(`./song-cache/${name}`));
        }).on('error', reject).end();
    });
}

function playLoop(Bot, msg, conn) {
     return new Promise((resolve, reject) => {
        if (!queues.get(msg.channel.guild.id)[0]) {
            msg.channel.createMessage(`Thanks for listening ${hands[Math.floor(Math.random() * hands.length)]}`);
            Bot.leaveVoiceChannel(conn.channelID);
            return resolve();
        }

        let curr = queues.get(msg.channel.guild.id).shift();
        let p;

        saveSong(curr.url).then(path => {
            p = path;

            conn.play(path);
            return msg.channel.createMessage(`Now playing \`${curr.title}\` requested by **${curr.user}**`);
        }).then(() => {
            if (!conn.eventNames().includes('error')) {
                conn.on('error', err => {
                    console.error(err);
                    msg.channel.createMessage(`\`${err}\``);
                });
            }

            if (!conn.eventNames().includes('end')) {
                conn.on('end', () => {
                    if (fs.existsSync(p)) fs.unlinkSync(p);
                    conn.stopPlaying();
                    resolve(playLoop(Bot, msg, conn));
                });
            }
        });
     });
}

module.exports = {
    main: function(Bot, m, args) {
        args = m.content.replace("!play", "").trim();

        if (!m.member.voiceState.channelID) {
            Bot.createMessage(m.channel.id, "You must be in a voice channel to play music.");
        } else if (!args) {
            Bot.createMessage(m.channel.id, "Please tell me something to play.");
        } else if (["pause", "stop", "cease"].includes(args.toLowerCase().split(' ')[0])) {
            let conn = Bot.voiceConnections.get(m.channel.guild.id);

            if (!conn) {
                Bot.createMessage(m.channel.id, "I am not in a voice channel.");
            } else if (m.member.voiceState.channelID !== conn.channelID) {
                Bot.createMessage(m.channel.id, "You must be in the same channel as me.");
            } else {
                Bot.leaveVoiceChannel(conn.channelID);
                queues.delete(m.channel.guild.id);
                Bot.createMessage(m.channel.id, hands[Math.floor(Math.random() * hands.length)]);
            }
        } else {
            new Promise(resolve => {
                if (!Bot.voiceConnections.get(m.channel.guild.id)) resolve(Bot.joinVoiceChannel(m.member.voiceState.channelID));
                else resolve(null);
            }).then(() => {
                if (!args.match(YoutubeRegex)) return search(Bot, m, args);
                else return cleanURL(args);
            }).then(url => {
                return ytdl.getInfo(url, {filter: 'audioonly'});
            }).then(res => {
                if (!queues.get(m.channel.guild.id)) {
                    let magic = [];
                    magic.id = m.channel.guild.id

                    queues.add(magic);
                }

                let queue = queues.get(m.channel.guild.id);

                queue.push({
                    url: res.formats.map(f => ({bitrate: f.audioBitrate, url: f.url})).sort((a, b) => b.bitrate - a.bitrate)[0].url,
                    title:  res.title,
                    user: `${m.author.username}#${m.author.discriminator}`
                });

                return Bot.createMessage(m.channel.id, `Queued **${res.title}**`);
            }).then(() => {
                let conn = Bot.voiceConnections.get(m.channel.guild.id);

                if (!conn.playing) {
                    return playLoop(Bot, m, conn);
                }
            }).catch(err => {
                if (err.message === "Invalid selection") {
                    return Bot.createMessage(m.channel.id, "Invalid selection, either too high, too low, or not a number.");
                } else if (err.message === "No search results") {
                    Bot.createMessage(m.channel.id, "No results.");
                } else if (err.message === "Await expired") {
                    Bot.createMessage(m.channel.id, "You took too long to respond.");
                } else {
                    console.error(err);
                    Bot.createMessage(m.channel.id, err.message);
                }
            });
        }
    },
    help: "Plays music."
}
