const fs = require("fs");

module.exports = {
    main: function(Bot, m, args) {
        var prefix = "!";
        var args = m.content.slice(prefix.length).split(" ");
        args.shift();
        var embed = args.join(" ");
        if (args.indexOf("code") > -1) {
            var embed = args.join(" ");
            Bot.createMessage(m.channel.id, {
                embed: {
                    color: 0xA260F6,
                    description: "**Embeded Text:**\n" + "```" + embed + "```"
                }
            });
        } else if (args.indexOf("blank") > -1) {
            var embed = args.join(" ");
            Bot.createMessage(m.channel.id, {
                embed: {
                    color: 0xA260F6,
                    description: embed
                }
            });
        } else {
            var embed = args.join(" ");
            Bot.createMessage(m.channel.id, {
                embed: {
                    color: 0xA260F6,
                    description: "**Embeded Text:**\n" + embed
                }
            });

        }
    },
    help: "Embed text"
}