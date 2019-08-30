"use strict";

const safeEval = require("safe-eval");

const conf = require("../conf");

module.exports = {
    main: async function(Bot, m, args, prefix) {
        var coolkids = [conf.users.owner, "271803699095928832", "137269976255037440"];
        if (coolkids.indexOf(m.author.id) > -1) {
            try {
                var ev = await safeEval(args);
                Bot.createMessage(m.channel.id, ev);
                console.log(ev);
            }
            catch (err) {
                Bot.createMessage(m.channel.id, err);
            }
        }
        else {
            Bot.createMessage(m.channel.id, "No, dont touch that");
        }
    },
    help: "Just dont",
    hidden: true
};
