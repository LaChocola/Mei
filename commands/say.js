"use strict";

module.exports = {
    main: async function (Bot, m, args, prefix) {
        var msg = m.cleanContent.replace(`${prefix}say `, "");
        if (m.content === `${prefix}say`) {
            msg = "Please add something to say. i.e. ``!say <whatever>``";
        }
        Bot.createMessage(m.channel.id, msg);
    },
    help: "Makes me say something"
};
