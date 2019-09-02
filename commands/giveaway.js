"use strict";

const utils = require("../utils");
const dbs = require("../dbs");

var guildDb = dbs.guild.load();

function promiseTimeout(time) {
    return new Promise(resolve => setTimeout(() => resolve(), time));
}

module.exports = {
    main: function(Bot, m, args, prefix) {
        return new Promise((resolve, reject) => {
            var guild = m.channel.guild;
            var time = 0.5;
            var base = m.cleanContent.replace(`${prefix}giveaway `, "").split(" | ");
            if (utils.isNum(base[1])) {
                time = utils.toNum(base[1]);
                base.pop();
            }
            var msg = base[0];
            if (m.content == `${prefix}giveaway`) {
                return resolve(Bot.createMessage(m.channel.id, "Please add something to giveaway. \n\ni.e. `!giveaway Dragon Dildos` for giving away 'Dragon Dildos'\nor `!giveaway Dragon Dildos | 1` for giving away 'Dragon Dildos' in 1 hour (time defaults to 0.5 hours)"));
            }
            else {
                if (!guildDb[guild.id]) {
                    guildDb[guild.id] = {};
                    guildDb[guild.id].name = guild.name;
                    guildDb[guild.id].owner = guild.ownerID;
                    Bot.createMessage(m.channel.id, `Server: ${guild.name} added to database. Populating information ${utils.hands.ok()}`).then((msg) => {
                        return setTimeout(function() {
                            Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                            Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                        }, 5000);
                    });
                    dbs.guild.save(guildDb);
                }
                var author = m.author.id;
                var name = m.channel.guild.members.get(author).nick || m.channel.guild.members.get(author).username;
                if (!guildDb[guild.id].giveaways) {
                    guildDb[guild.id].giveaways = {};
                    dbs.guild.save(guildDb);
                    guildDb = dbs.guild.load();
                }
                if (guildDb[guild.id].giveaways.running) {
                    Bot.createMessage(m.channel.id, "There is already a giveaway running, try again later~");
                    return;
                }
                if (!guildDb[guild.id].giveaways.running) {
                    guildDb[guild.id].giveaways.running = true;
                    guildDb[guild.id].giveaways.item = msg;
                    guildDb[guild.id].giveaways.current = {};
                    guildDb[guild.id].giveaways.creator = author;
                    guildDb[guild.id].giveaways.current.contestants = {};
                    Bot.createMessage(m.channel.id, `***${name}*** has started a giveaway for: **` + msg + `**. React to this message with <:giveaway:367892951780818946> in ${time} hour(s) to enter!`).then((m) => {
                        guildDb[guild.id].giveaways.mID = m.id;
                        guildDb[guild.id].giveaways.channelID = m.channel.id;
                        dbs.guild.save(guildDb);
                        Bot.addMessageReaction(guildDb[guild.id].giveaways.channelID, guildDb[guild.id].giveaways.mID, "giveaway:367892951780818946");
                        var amount = time * 3600000;
                        return promiseTimeout(amount);
                    }).then(() => {
                        const data = dbs.guild.load();
                        var contestants = [];
                        var entries = data[guild.id].giveaways.current.contestants;
                        Object.keys(entries).forEach(function(key) {
                            contestants.push(key);
                        });
                        var winnerID = contestants[Math.floor(Math.random() * contestants.length)];
                        if (winnerID == undefined) {
                            data[guild.id].giveaways.running = false;
                            dbs.guild.save(data);
                            return Bot.editMessage(data[guild.id].giveaways.channelID, data[guild.id].giveaways.mID, "This Giveaway has ended, no one entered. So I guess everyone loses?");
                        }
                        var winner = m.channel.guild.members.get(winnerID).mention;
                        data[guild.id].giveaways.running = false;
                        dbs.guild.save(data);
                        return Bot.editMessage(data[guild.id].giveaways.channelID, data[guild.id].giveaways.mID, "This Giveaway has ended") && Bot.createMessage(m.channel.id, `Congrats ${winner}! :tada: :tada: :tada:\nYou won <@${data[guild.id].giveaways.creator}>'s giveaway for: \`${data[guild.id].giveaways.item}\``);
                    }).catch(console.log);
                }
            }
        });
    },
    help: "Makes me say something"
};
