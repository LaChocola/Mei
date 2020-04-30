"use strict";

const serversdb = require("../servers");

function promiseTimeout(time) {
    return new Promise(resolve => setTimeout(() => resolve(), time));
}

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var data = await serversdb.load();

        var guild = m.channel.guild;
        var hands = [":ok_hand::skin-tone-1:", ":ok_hand::skin-tone-2:", ":ok_hand::skin-tone-3:", ":ok_hand::skin-tone-4:", ":ok_hand::skin-tone-5:", ":ok_hand:"];
        var hand = hands[Math.floor(Math.random() * hands.length)];
        var time = 0.5;
        var base = m.cleanContent.replace(`${prefix}giveaway `, "").split(" | ");
        if (!isNaN(+base[1])) {
            time = +base[1];
            base.pop();
        }
        var msg = base[0];
        if (m.content === `${prefix}giveaway`) {
            return await bot.createMessage(m.channel.id, "Please add something to giveaway. \n\ni.e. `" + prefix + "giveaway Dragon Dildos` for giving away 'Dragon Dildos'\nor `" + prefix + "giveaway Dragon Dildos | 1` for giving away 'Dragon Dildos' in 1 hour (time defaults to 0.5 hours)");
        }

        if (!data[guild.id]) {
            data[guild.id] = {};
            data[guild.id].name = guild.name;
            data[guild.id].owner = guild.ownerID;
            bot.createMessage(m.channel.id, `Server: ${guild.name} added to database. Populating information ${hand}`).then(function(msg) {
                promiseTimeout(5000).then(function() {
                    bot.deleteMessage(m.channel.id, m.id, "Timeout");
                    bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                });
            });
            await serversdb.save(data);
        }
        var author = m.author.id;
        var name = m.channel.guild.members.get(author).nick || m.channel.guild.members.get(author).username;
        if (!data[guild.id].giveaways) {
            data[guild.id].giveaways = {};
            await serversdb.save(data);
        }
        if (data[guild.id].giveaways.running) {
            bot.createMessage(m.channel.id, "There is already a giveaway running, try again later~");
            return;
        }
        if (!data[guild.id].giveaways.running) {
            data[guild.id].giveaways.running = true;
            data[guild.id].giveaways.item = msg;
            data[guild.id].giveaways.current = {};
            data[guild.id].giveaways.creator = author;
            data[guild.id].giveaways.current.contestants = {};
            try {
                var sentMsg = await bot.createMessage(m.channel.id, `***${name}*** has started a giveaway for: **` + msg + `**. React to this message with <:giveaway:367892951780818946> in ${time} hour(s) to enter!`);

                data[guild.id].giveaways.mID = sentMsg.id;
                data[guild.id].giveaways.channelID = sentMsg.channel.id;
                await serversdb.save(data);
                bot.addMessageReaction(data[guild.id].giveaways.channelID, data[guild.id].giveaways.mID, "giveaway:367892951780818946");
                var amount = time * 3600000;
                await promiseTimeout(amount);

                var contestants = [];
                var entries = data[guild.id].giveaways.current.contestants;
                Object.keys(entries).forEach(function(key) {
                    contestants.push(key);
                });
                var winnerID = contestants[Math.floor(Math.random() * contestants.length)];
                if (winnerID === undefined) {
                    data[guild.id].giveaways.running = false;
                    await serversdb.save(data);
                    return bot.editMessage(data[guild.id].giveaways.channelID, data[guild.id].giveaways.mID, "This Giveaway has ended, no one entered. So I guess everyone loses?");
                }
                var winner = m.channel.guild.members.get(winnerID).mention;
                data[guild.id].giveaways.running = false;
                await serversdb.save(data);
                return bot.editMessage(data[guild.id].giveaways.channelID, data[guild.id].giveaways.mID, "This Giveaway has ended") && bot.createMessage(m.channel.id, `Congrats ${winner}! :tada: :tada: :tada:\nYou won <@${data[guild.id].giveaways.creator}>'s giveaway for: \`${data[guild.id].giveaways.item}\``);
            }
            catch (err) {
                console.log(err);
            }
        }
    },
    help: "Makes me say something"
};
