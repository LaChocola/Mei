"use strict";

module.exports = {
    main: function(Bot, m, args, prefix) {
        var args = m.content.replace(`${prefix}d `, "");
        if (args.split("|").length > 2) {
            Bot.createMessage(m.channel.id, "You are onle able to roll 2 dice at once. Please use the following format: `!d 1d20 | 2d10` to roll multiple dice.").then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                }, 15000);
            });
            return;
        }
        if (args.split("|")[1]) {
            var args2 = args.split("|")[1].trim();
            var dice2 = args2.split("d")[0].trim() || null;
            var amount2 = args2.split("d")[1].trim() || null;
        }
        var dice = args.split("|")[0].split("d")[0].trim() || null;
        var amount = args.split("|")[0].split("d")[1].trim() || null;
        if (+dice < 0 || +amount < 0 || (args2 && +dice2 < 0 || args2 && +amount2 < 0)) {
            Bot.createMessage(m.channel.id, "No negative numbers are allowed. Please put the roll in the format of `!d 1d20`. where `1` is the number of times to roll, and `20` is the highest number possilbe on the roll.").then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                }, 15000);
            });
            return;
        }
        if (!+dice || !+amount || (args2 && !+dice2 || args2 && !+amount2)) {
            Bot.createMessage(m.channel.id, "Please put the roll in the format of `!d 1d20`. where `1` is the number of times to roll, and `20` is the highest number possilbe on the roll.").then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                }, 15000);
            });
            return;
        }
        if (dice > 30 || dice2 > 30) {
            Bot.createMessage(m.channel.id, "Please roll with a smaller number of dice, or break your roll into multiple different rolls").then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                }, 15000);
            });
            return;
        }
        var rolls = [];
        for (var i = 0; i < dice; i++) {
            var roll = Math.floor(Math.random() * amount + 1);
            rolls.push(`Roll ${i + 1}: **${roll}**`);
        }
        var msg = {
            color: 0xA260F6,
            title: "",
            fields: [
                {
                    "name": `:game_die: Rolling ${dice} D${amount}${dice > 1 ? "s" : ""}:`,
                    "value": "\n" + rolls.join("\n"),
                    "inline": "true"
                }
            ]
        };
        if (args2) {
            var rolls2 = [];
            for (var i = 0; i < dice2; i++) {
                var roll = Math.floor(Math.random() * amount2 + 1);
                rolls2.push(`Roll ${i + 1}: **${roll}**`);
            }
            msg.fields.push({
                "name": `:game_die: Rolling ${dice2} D${amount2}${dice2 > 1 ? "s" : ""}:`,
                "value": "\n" + rolls2.join("\n"),
                "inline": "true"
            });
        }
        Bot.createMessage(m.channel.id, { embed: msg });
    },
    help: "Dice rolling. `!d 2d20` or `!d 3d20 | 2d10` for dfferent values"
};
