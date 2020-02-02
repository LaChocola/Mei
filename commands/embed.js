"use strict";

module.exports = {
    // eslint-disable-next-line no-unused-vars
    main: async function(Bot, m, args, prefix) {
        // Why do we override the prefix???
        // prefix = "!";
        args = m.content.slice(prefix.length).split(" ");
        args.shift();

        var message = args.join(" ");
        if (args.includes("code")) {
            message = "```" + message + "```";
        }

        if (!args.includes("blank")) {
            message = "**Embedded Text:**\n" + message;
        }

        Bot.createMessage(m.channel.id, {
            embed: {
                color: 0xA260F6,
                description: message
            }
        });
    },
    help: "Embed text"
};
