"use strict";

const safeEval = require("safe-eval");

const misc = require("../misc");
const ids = require("../ids");

// bot and m are added to give eval access to them
async function runEval(bot, m, code, unsafe) {
    code = "(async () => " + code + ")()";
    var result;
    try {
        if (unsafe) {
            result = await eval(code);
        }
        else {
            result = await safeEval(code, { bot: bot, m: m });
        }
    }
    catch (err) {
        result = err;
    }
    return result;
}

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        var isAdmin = m.author.id === ids.users.chocola;
        var coolkids = [ids.users.whosthis2, ids.users.whosthis3, ids.users.whosthis4, ids.users.whosthis5];
        var isCoolKid = coolkids.includes(m.author.id);

        if (!isAdmin && !isCoolKid) {
            var responses = [
                "Are you a real villain?",
                "Have you ever caught a good guy? \nLike a real super hero?",
                "Have you ever tried a disguise?",
                "What are you doing?!?!?!",
                "*NO!*, Don't touch that!",
                "Fuck Off",
                "Roses are red\nfuck me ;)"
            ];
            var response = misc.choose(responses);
            m.reply(response, 5000, true);
            return;
        }

        var result = await runEval(bot, m, args, isAdmin);
        m.reply("`" + result + "`");
        console.log(result);
    },
    help: "Just don't",
    hidden: true
};
