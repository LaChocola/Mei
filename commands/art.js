"use strict";

const moment = require("moment");

const utils = require("../utils");
const dbs = require("../dbs");

function addArt(art, url, msg, isImage) {
    art[url] = {
        url: url,
        authorId: msg.author.id,
        timestamp: msg.timestamp,
        isImage: isImage
    };
}

function pick(options) {
    return options[Math.floor(Math.random() * options.length)];
}

module.exports = {
    main: async function(bot, m, args, prefix) {
        var guildDb = dbs.guild.load();

        var guild = m.channel.guild;
        if (!guildDb[guild.id]) {
            guildDb[guild.id] = {
                name: guild.name,
                owner: guild.ownerID
            };
            m.reply(`Server: ${guild.name} added to database. Populating information ${utils.hands.ok()}`, 5000);
            dbs.guild.save(guildDb);
        }
        var guildData = guildDb[guild.id];

        var artChannelId = guildData.art;

        if (!artChannelId) {
            m.reply(`An art channel has not been set up for this server. Please have a mod add one using the command: \`${prefix}edit art add #channel\``, 10000);
            m.deleteIn(10000);
            return;
        }

        var limit = 5000;
        if (args && !isNaN(+args)) {
            limit = parseInt(args, 10);
        }
        var artChannel = bot.getChannel(artChannelId);

        console.log(artChannel.nsfw);
        console.log(m.channel.nsfw);

        var icon = artChannel.guild.iconURL || null;

        if (artChannel.nsfw && !m.channel.nsfw) {
            m.reply(`The selected art channel, <#${artChannel.id}>, is an nsfw channel, and this channel is not. Please either use this command in an nsfw channel, or set the art channel to a non-nsfw channel`, 10000);
            m.deleteIn(10000);
            return;
        }

        if (limit > 7000) {
            m.reply("I can't grab more than 7000 messages in any channel. Setting limit to 7000.", 5000);
            limit = 7000;
        }

        await m.sendTyping();
        var msgs = await artChannel.getMessages(limit);

        var artDict = {};
        for (var msg of msgs) {
            if (msg.content.includes("pastebin.com")) {
                addArt(artDict, msg.content, msg, false);
            }
            if (msg.attachments[0]) {
                addArt(artDict, msg.attachments[0].url, msg, true);
            }
            if (msg.embeds[0]) {
                if (msg.embeds[0].image) {
                    addArt(artDict, msg.embeds[0].image.url, msg, true);
                }
                else {
                    addArt(artDict, msg.embeds[0].url, msg, true);
                }
            }
        }

        var art = pick(Object.values(artDict));

        console.log(art);
        if (!art) {
            m.reply(`No art was found within the last \`${limit}\` messages. Please try again using more messages`, 5000);
            m.deleteIn(5000);
            return;
        }

        var author = m.channel.guild.members.get(art.authorId) || m.channel.guild.members.get(art.authorId) || bot.users.get(art.authorId);
        var authorName = author.nick || author.username;
        var authorIcon = author.avatarURL || undefined;
        var time = moment(art.timestamp).format();
        var embed = {
            color: 0xA260F6,
            timestamp: time,
            description: `A random piece from <#${artChannel.id}>~`,
            author: {
                name: authorName,
                icon_url: authorIcon
            },
            footer: {
                icon_url: icon,
                text: `${artChannel.name} | ${artChannel.guild.name}`
            }
        };
        if (art.isImage) {
            embed.image = {
                url: art.url
            };
        }
        else {
            embed.title = art.url;
            embed.url = art.url;
        }
        m.reply({ embed: embed });
    },
    help: "Show art from the set art channel" // add description
};
