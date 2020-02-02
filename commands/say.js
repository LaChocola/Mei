"use strict";

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        var msg = m.cleanContent.replace(`${prefix}say `, "");
        if (m.content === `${prefix}say`) {
            msg = "Please add something to say. i.e. ``" + prefix + "say <whatever>``";
        }
        Bot.createMessage(m.channel.id, msg);
    },
    help: "Makes me say something"
};
