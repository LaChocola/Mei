"use strict";

const safeEval = require("safe-eval");

module.exports = {
    main: async function(Bot, m, args, prefix) {
        var coolkids = ["176975815072808960", "147383057844797441", "103832588556193792", "196026737019191296"];
        if (m.author.id == "161027274764713984") {
            try {
                var ev = eval(args);
                var ev = await eval(args);
                Bot.createMessage(m.channel.id, ev);
                console.log(ev);
            } catch (err) {
                Bot.createMessage(m.channel.id, err);
            }
            return;
        }
        if (coolkids.indexOf(m.author.id) > -1) {
            try {
                var ev = await safeEval(args);
                Bot.createMessage(m.channel.id, ev);
                console.log(ev);
            } catch (err) {
                Bot.createMessage(m.channel.id, err);
            }
            return;
        }
        if (!coolkids.indexOf(m.author.id) > -1) {
            var responses = ["Are you a real villan?", "Have you ever caught a good guy? \nLike a real super hero?", "Have you ever tried a disguise?", "What are you doing?!?!?!", "*NO!*, Don't touch that!", "Fuck Off", "Roses are red\nfuck me ;) "]
            var response = responses[Math.floor(Math.random() * responses.length)]
            Bot.createMessage(m.channel.id, response).then((msg) => {
                return setTimeout(function() {
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout")
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout")
                }, 5000)
              })
              return;
        }
    },
    help: "Just dont",
    hidden: true
};
