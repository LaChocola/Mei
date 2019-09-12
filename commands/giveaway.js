"use strict";

const conf = require("../conf");
const utils = require("../utils");
const dbs = require("../dbs");

module.exports = {
    main: async function(bot, m, args, prefix) {
        var guildDb = await dbs.guild.load();
        var guild = m.channel.guild;

        if (!guildDb[guild.id]) {
            guildDb[guild.id] = {
                name: guild.name,
                owner: guild.ownerID
            };
            m.reply(`Server: ${guild.name} added to database. Populating information ${utils.hands.ok()}`, 5000);
            m.deleteIn(5000);
            await dbs.guild.save(guildDb);
        }

        var guildData = guildDb[guild.id];

        if (!guildData.giveaways) {
            guildData.giveaways = {};
            await dbs.guild.save(guildDb);
        }

        var timeHours = 0.5;
        var base = m.cleanContent.replace(`${prefix}giveaway `, "").split(" | ");
        if (utils.isNum(base[1])) {
            timeHours = utils.toNum(base[1]);
            base.pop();
        }
        var msg = base[0];

        if (m.content === `${prefix}giveaway`) {
            m.reply("Please add something to giveaway. \n\ni.e. `!giveaway Dragon Dildos` for giving away 'Dragon Dildos'\nor `!giveaway Dragon Dildos | 1` for giving away 'Dragon Dildos' in 1 hour (time defaults to 0.5 hours)");
            return;
        }

        var author = m.author.id;
        var name = m.channel.guild.members.get(author).nick || m.channel.guild.members.get(author).username;

        if (guildData.giveaways.running) {
            m.reply("There is already a giveaway running, try again later~");
            return;
        }

        if (!guildData.giveaways.running) {
            guildData.giveaways.running = true;
            guildData.giveaways.item = msg;
            guildData.giveaways.current = {};
            guildData.giveaways.creator = author;
            guildData.giveaways.current.contestants = {};

            await m.reply(`***${name}*** has started a giveaway for: **` + msg + `**. React to this message with <:giveaway:${conf.emojis.giveaway}> in ${timeHours} hour(s) to enter!`);
            guildData.giveaways.mID = m.id;
            guildData.giveaways.channelID = m.channel.id;
            await dbs.guild.save(guildDb);
            bot.addMessageReaction(guildData.giveaways.channelID, guildData.giveaways.mID, `giveaway:${conf.emojis.giveaway}`);

            var timeMs = timeHours * 3600000;
            await utils.delay(timeMs);

            guildDb = await dbs.guild.load();
            guildData = guildDb[guild.id];
            var entries = guildDb[guild.id].giveaways.current.contestants;
            var contestants = Object.keys(entries).map(k => k);
            var winnerID = contestants[Math.floor(Math.random() * contestants.length)];
            if (!winnerID) {
                guildDb[guild.id].giveaways.running = false;
                await dbs.guild.save(guildDb);
                return bot.editMessage(guildData.giveaways.channelID, guildData.giveaways.mID, "This Giveaway has ended, no one entered. So I guess everyone loses?");
            }
            var winner = m.channel.guild.members.get(winnerID).mention;
            guildDb[guild.id].giveaways.running = false;
            await dbs.guild.save(guildDb);
            try {
                return bot.editMessage(guildData.giveaways.channelID, guildData.giveaways.mID, "This Giveaway has ended") && m.reply(`Congrats ${winner}! :tada: :tada: :tada:\nYou won <@${guildData.giveaways.creator}>'s giveaway for: \`${guildData.giveaways.item}\``);
            }
            catch (err) {
                console.error(err);
            }
        }
    },
    help: "Makes me say something"
};
