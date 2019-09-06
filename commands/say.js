"use strict";

module.exports = {
    main: async function(bot, m, args, prefix) {
        var msg = m.cleanContent.replace(`${prefix}say `, "");
        if (m.content == `${prefix}say`) {
            m.reply("Please add something to say. i.e. ``!say <whatever>``");
            return;
        }
        else {
            m.reply(msg);
        }
    },
    help: "Makes me say something"
};
