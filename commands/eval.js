"use strict";

const safeEval = require("safe-eval");

const misc = require("../misc");

async function runEval(args, unsafe) {
    var result;
    try {
        var evalFunc = unsafe ? eval : safeEval;
        result = await evalFunc(args);
    }
    catch (err) {
        result = err;
    }
    return result;
}

module.exports = {
    main: async function (Bot, m, args, prefix) {
        var coolkids = ["176975815072808960", "147383057844797441", "103832588556193792", "196026737019191296"];
        var isAdmin = m.author.id === "161027274764713984";
        var isCoolKid = coolkids.includes(m.author.id);

        if (!isAdmin && !isCoolKid) {
            var responses = [
                "Are you a real villan?",
                "Have you ever caught a good guy? \nLike a real super hero?",
                "Have you ever tried a disguise?",
                "What are you doing?!?!?!",
                "*NO!*, Don't touch that!",
                "Fuck Off",
                "Roses are red\nfuck me ;)"
            ];
            var response = misc.choose(responses);
            Bot.createMessage(m.channel.id, response).then((msg) => {
                return setTimeout(function () {
                    Bot.deleteMessage(m.channel.id, msg.id, "Timeout");
                    Bot.deleteMessage(m.channel.id, m.id, "Timeout");
                }, 5000);
            });
            return;
        }

        var result = await runEval(args, isAdmin);
        Bot.createMessage(m.channel.id, result);
        console.log(result);
    },
    help: "Just don't",
    hidden: true
};
