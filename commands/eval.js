"use strict";

const safeEval = require("safe-eval");

const conf = require("../conf");

module.exports = {
    main: async function(bot, m, args, prefix) {
        var coolkids = [conf.users.owner, "271803699095928832", "137269976255037440"];
        if (coolkids.indexOf(m.author.id) > -1) {
            try {
                var ev = await safeEval(args);
                m.reply(ev);
                console.log(ev);
            }
            catch (err) {
                m.reply(err);
            }
        }
        else {
            m.reply("No, dont touch that");
        }
    },
    help: "Just dont",
    hidden: true
};
