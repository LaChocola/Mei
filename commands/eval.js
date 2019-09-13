"use strict";

const safeEval = require("safe-eval");

const conf = require("../conf");

module.exports = {
    main: async function(bot, m, args, prefix) {
        var coolkids = [conf.users.owner, conf.users.digiduncan, conf.users.natalie];
        if (!coolkids.includes(m.author.id)) {
            m.reply("No, don't touch that", 1000);
            return;
        }

        try {
            var out = safeEval(m.fullArgs);
            m.reply(out);
            console.log("eval: ", out);
        }
        catch (err) {
            m.reply("**Error:** " + err.message);
            console.log("eval err: ", err);
        }
        
    },
    help: "Just don't",
    hidden: true
};
