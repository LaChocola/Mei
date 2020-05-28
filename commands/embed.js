"use strict";

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(bot, m, args, prefix) {
        // Why do we override the prefix???
        // prefix = "!";
        var cleanArgs = m.content.slice(prefix.length).split(" ");
        cleanArgs.shift();

        var message = cleanArgs.join(" ");
        if (cleanArgs.includes("code")) {
            message = "```" + message + "```";
        }

        if (!cleanArgs.includes("blank")) {
            message = "**Embedded Text:**\n" + message;
        }

        bot.createMessage(m.channel.id, {
            embed: {
                color: 0xA260F6,
                description: message
            }
        });
    },
    help: "Embed text"
};
