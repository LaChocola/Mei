"use strict";

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        bot.createMessage(m.channel.id, "Here is my Invite Link, Cya soon~ <https://discordapp.com/oauth2/authorize?client_id=309220487957839872&scope=bot&permissions=527825985>");
    },
    help: "Invite link~"
};
