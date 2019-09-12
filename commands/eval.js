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
            var ev = safeEval(args);
            m.reply(ev);
            console.log(ev);
        }
        catch (err) {
            m.reply(err);
        }
        
    },
    help: "Just don't",
    hidden: true
};
