const request = require('request');

module.exports = {
    main: function(Bot, m, args, prefix) {
        var word = (m.content.replace(`${prefix}urban `, ""));
        var urbanJsonURL = "http://api.urbandictionary.com/v0/define?term=" + word;
        var urbanJson = request.get({
            url: urbanJsonURL,
            json: true,
        }, function(e, r, b) {
            if (!e && b.list[0] != undefined) {
                var message = [
                    "```" + b.list[0].definition + "```",
                    "Example: " + b.list[0].example,
                    "<" + b.list[0].permalink + ">"
                ].join("\n")
                Bot.createMessage(m.channel.id, {
                    content: "Urban Dictionary definition of **" + b.list[0].word + "**:\n",
                    embed: {
                        color: 0xA260F6,
                        description: message
                    }
                });
            } else {
                Bot.createMessage(m.channel.id, "Not found");
            };
        });
    },
    help: "Search Urban Dictionary" // add description
}
