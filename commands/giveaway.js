const _ = require("../data.js");
const data = _.load();

function promiseTimeout(time) {
    return new Promise(resolve => setTimeout(() => resolve(), time));
}
module.exports = {
    main: function(Bot, m, args) {
        return new Promise((resolve, reject) => {
            var time = 0.5
            var base = m.cleanContent.replace("!giveaway ", "").split(" | ");
            if (!isNaN(+base[1])) {
                var time = +base[1]
                base.pop();
            }
            var msg = base[0]
            if (m.content == "!giveaway") {
                return resolve(Bot.createMessage(m.channel.id, "Please add something to giveaway. \n\ni.e. `!giveaway Dragon Dildos` for giving away 'Dragon Dildos'\nor `!giveaway Dragon Dildos | 1` for giving away 'Dragon Dildos' in 1 hour (time defaults to 0.5 hours)"));
            } else {
                var author = m.author.id;
                var name = m.channel.guild.members.get(author).nick || m.channel.guild.members.get(author).username;
                if (data.giveaways.running) {
                    Bot.createMessage(m.channel.id, "There is already a giveaway running, try again later~");
                    return;
                }
                if (!data.giveaways.running) {
                    data.giveaways.running = true;
                    data.giveaways.item = msg;
                    data.giveaways.current = {};
                    data.giveaways.creator = author;
                    data.giveaways.current.contestants = {};
                    Bot.createMessage(m.channel.id, `***${name}*** has started a giveaway for: **` + msg + `**. React to this message with <:giveaway:367892951780818946> in ${time} hour(s) to enter!`).then((m) => {
                        data.giveaways.mID = m.id;
                        data.giveaways.channelID = m.channel.id;
                        _.save(data);
                        Bot.addMessageReaction(data.giveaways.channelID, data.giveaways.mID, "giveaway:367892951780818946")
                        var amount = time * 3600000
                        return promiseTimeout(amount);
                    }).then(() => {
                        const data = _.load();
                        var contestants = [];
                        var entries = data.giveaways.current.contestants;
                        Object.keys(entries).forEach(function(key) {
                            contestants.push(key);
                        });
                        var winnerID = contestants[Math.floor(Math.random() * contestants.length)];
                        if (winnerID == undefined) {
                            data.giveaways.running = false;
                            _.save(data);
                            return Bot.editMessage(data.giveaways.channelID, data.giveaways.mID, ` This Giveaway has ended, no one entered. So I guess everyone loses?`);
                        }
                        var winner = m.channel.guild.members.get(winnerID).mention
                        data.giveaways.running = false;
                        _.save(data);
                        return Bot.editMessage(data.giveaways.channelID, data.giveaways.mID, ` This Giveaway has ended~`) && Bot.createMessage(m.channel.id, `Congrats ${winner}! :tada: :tada: :tada:`);
                    }).catch(console.log);
                }
            }
        });
    },
    help: "Makes me say something"
}