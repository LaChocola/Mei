"use strict";

module.exports = {
    main: function(bot, m, args, prefix) {
        prefix = "!";
        args = m.content.slice(prefix.length).split(" ");
        args.shift();
        var embed = args.join(" ");
        if (args.indexOf("code") > -1) {
            embed = args.join(" ");
            m.reply({
                embed: {
                    color: 0xA260F6,
                    description: "**Embeded Text:**\n" + "```" + embed + "```"
                }
            });
        }
        else if (args.indexOf("blank") > -1) {
            embed = args.join(" ");
            m.reply({
                embed: {
                    color: 0xA260F6,
                    description: embed
                }
            });
        }
        else {
            embed = args.join(" ");
            m.reply({
                embed: {
                    color: 0xA260F6,
                    description: "**Embeded Text:**\n" + embed
                }
            });

        }
    },
    help: "Embed text"
};
