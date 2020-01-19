"use strict";

const safeEval = require("safe-eval");

const misc = require("../misc");
const ids = require("../ids");

// Bot and m are added to give eval access to them
async function runEval(Bot, m, code, unsafe) {
    code = "(async () => " + code + ")()";
    var result;
    try {
        if (unsafe) {
            result = await eval(code);
        }
        else {
            result = await safeEval(code, { Bot: Bot, m: m });
        }
    }
    catch (err) {
        result = err;
    }
    return result;
}

module.exports = {
    main: async function (Bot, m, args, prefix) {
        var isAdmin = m.author.id === ids.users.chocola;
        var coolkids = [ids.users.whosthis2, ids.users.whosthis3, ids.users.whosthis4, ids.users.whosthis5, ids.users.natalie, ids.users.digiduncan];
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

        var result = await runEval(Bot, m, args, isAdmin);
        Bot.createMessage(m.channel.id, "`" + result + "`");
        console.log(result);
    },
    help: "Just don't",
    hidden: true
};
