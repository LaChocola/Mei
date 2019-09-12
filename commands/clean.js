"use strict";

const conf = require("../conf");
const utils = require("../utils");

module.exports = {
    main: async function(bot, m, args, prefix) {
        args = args.split(/\s+/g);

        var member = m.guild.members.get(m.author.id);
        var targetId = m.mentions[0] && m.mentions[0].id;
        var targetAll = m.cleanContent.includes(" all");

        var count = 10;
        var countArg = utils.toInt(args.find(a => utils.isNum(a)));
        if (!isNaN(countArg)) {
            count = countArg;
        }

        var isMod = await member.isMod()
            || member.hasPerms(["banMembers", "administrator", "manageGuild", "manageChannels", "manageMessages"])
            || m.author.id !== conf.users.owner;

        if (!isMod) {
            var responses = [
                "Are you a real villain?",
                "Have you ever caught a good guy?\n"
                + "Like a real super hero?",
                "Have you ever tried a disguise?",
                "What are you doing?!?!?!",
                "*NO!*, Don't touch that!",
                "Fuck Off",
                "Roses are red\n"
                + "fuck me ;) "
            ];
            var response = responses[Math.floor(Math.random() * responses.length)];
            m.reply(response);
            return;
        }

        if (!targetId && !targetAll) {
            return "Please mention who you want to clean or say 'all', and optionally, a number of messages to delete from them";
        }

        m.delete();
        var fetchCount = targetAll ? count : 102;
        let msgs = await bot.getMessages(m.channel.id, fetchCount);

        let ids = [];
        var reason;
        if (targetAll) {
            ids = msgs.map(msg => msg.id);
            reason = `${ids.length} messages cleaned. Approved by ${m.author.username}#${m.author.discriminator}`;
        }
        else {
            for (let msg of msgs) {
                if (msg && msg.author.id === targetId) {
                    ids.push(msg.id);
                }
                if (ids.length < count) {
                    break;
                }
            }
        }

        var progressMsg = await m.reply(`Cleaning ${ids.length} messages`);

        var oldestAllowed = (Date.now() - 1421280000000) * 4194304;
        var invalid = ids.some(id => id < oldestAllowed);
        if (!invalid) {
            await bot.deleteMessages(m.channel.id, ids, reason);
        }
        else {
            for (let id of ids) {
                await bot.deleteMessage(m.channel.id, id, reason);
            }
        }

        progressMsg.delete();
        m.reply(`Cleaned ${ids.length} messages`, 3000);
    },
    help: "Clean stuff. `!clean @Chocola X` to delete the last X messages. Defaults to 100"
};
