"use strict";

const conf = require("../conf");
const utils = require("../utils");
const dbs = require("../dbs");

var guildDb = await dbs.guild.load();

function promiseTimeout(time) {
    return new Promise(resolve => setTimeout(() => resolve(), time));
}

module.exports = {
    main: function(bot, m, args, prefix) {
        return new Promise((resolve, reject) => {
            var guild = m.channel.guild;
            var time = 0.5;
            var base = m.cleanContent.replace(`${prefix}giveaway `, "").split(" | ");
            if (utils.isNum(base[1])) {
                time = utils.toNum(base[1]);
                base.pop();
            }
            var msg = base[0];
            if (m.content === `${prefix}giveaway`) {
                return resolve(m.reply("Please add something to giveaway. \n\ni.e. `!giveaway Dragon Dildos` for giving away 'Dragon Dildos'\nor `!giveaway Dragon Dildos | 1` for giving away 'Dragon Dildos' in 1 hour (time defaults to 0.5 hours)"));
            }
            else {
                if (!guildDb[guild.id]) {
                    guildDb[guild.id] = {};
                    guildDb[guild.id].name = guild.name;
                    guildDb[guild.id].owner = guild.ownerID;
                    m.reply(`Server: ${guild.name} added to database. Populating information ${utils.hands.ok()}`, 5000);
                    m.deleteIn(5000);
                    await dbs.guild.save(guildDb);
                }
                var author = m.author.id;
                var name = m.channel.guild.members.get(author).nick || m.channel.guild.members.get(author).username;
                if (!guildDb[guild.id].giveaways) {
                    guildDb[guild.id].giveaways = {};
                    await dbs.guild.save(guildDb);
                    guildDb = await dbs.guild.load();
                }
                if (guildDb[guild.id].giveaways.running) {
                    m.reply("There is already a giveaway running, try again later~");
                    return;
                }
                if (!guildDb[guild.id].giveaways.running) {
                    guildDb[guild.id].giveaways.running = true;
                    guildDb[guild.id].giveaways.item = msg;
                    guildDb[guild.id].giveaways.current = {};
                    guildDb[guild.id].giveaways.creator = author;
                    guildDb[guild.id].giveaways.current.contestants = {};
                    m.reply(`***${name}*** has started a giveaway for: **` + msg + `**. React to this message with <:giveaway:${conf.emojis.giveaway}> in ${time} hour(s) to enter!`).then((m) => {
                        guildDb[guild.id].giveaways.mID = m.id;
                        guildDb[guild.id].giveaways.channelID = m.channel.id;
                        await dbs.guild.save(guildDb);
                        bot.addMessageReaction(guildDb[guild.id].giveaways.channelID, guildDb[guild.id].giveaways.mID, `giveaway:${conf.emojis.giveaway}`);
                        var amount = time * 3600000;
                        return promiseTimeout(amount);
                    }).then(() => {
                        var userDb = await dbs.user.load();
                        var contestants = [];
                        var entries = userDb[guild.id].giveaways.current.contestants;
                        Object.keys(entries).forEach(function(key) {
                            contestants.push(key);
                        });
                        var winnerID = contestants[Math.floor(Math.random() * contestants.length)];
                        if (winnerID == undefined) {
                            userDb[guild.id].giveaways.running = false;
                            await dbs.guild.save(userDb);
                            return bot.editMessage(userDb[guild.id].giveaways.channelID, userDb[guild.id].giveaways.mID, "This Giveaway has ended, no one entered. So I guess everyone loses?");
                        }
                        var winner = m.channel.guild.members.get(winnerID).mention;
                        userDb[guild.id].giveaways.running = false;
                        await dbs.guild.save(userDb);
                        return bot.editMessage(userDb[guild.id].giveaways.channelID, userDb[guild.id].giveaways.mID, "This Giveaway has ended") && m.reply(`Congrats ${winner}! :tada: :tada: :tada:\nYou won <@${userDb[guild.id].giveaways.creator}>'s giveaway for: \`${userDb[guild.id].giveaways.item}\``);
                    }).catch(console.log);
                }
            }
        });
    },
    help: "Makes me say something"
};
