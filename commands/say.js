"use strict";

module.exports = {
    main: function(Bot, m, args, prefix) {
        var msg = m.cleanContent.replace(`${prefix}say `, "");
        if (m.content == `${prefix}say`) {
            Bot.createMessage(m.channel.id, "Please add something to say. i.e. ``!say <whatever>``")
            return
        } else {
            Bot.createMessage(m.channel.id, msg);
        }
    },
    help: "Makes me say something"
};
