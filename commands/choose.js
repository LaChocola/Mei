"use strict";

module.exports = {
    main: async function(bot, m, args, prefix) {
        var list = m.cleanContent.replace(prefix, "").replace(/choose/i, "");

        if (!list) {
            m.reply("You need to add your choices, seperated by ` | `");
            return;
        }

        var choiceList = list.split("|");

        var choice = "`" + choiceList[Math.floor(Math.random() * choiceList.length)] + "`";

        var comments = ["I think " + choice + " is the best choice", "It's " + choice + " obviously", "Is that even a choice?  " + choice + " Duh", "I may be wrong, but I'm not, " + choice + " is the right answer"];

        var msg = comments[Math.floor(Math.random() * comments.length)];

        m.reply(msg);
    },
    help: "This or that?"
};
