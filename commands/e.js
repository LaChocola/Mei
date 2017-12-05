const request = require("request");

module.exports = {
    main: function(Bot, m, args) {
        var base = "http://emoji.getdango.com/api/emoji?q=";
        var query = args.replace(/ /g, "+");
        request.get({
            url: base + query,
            json: true
        }, function(error, res, data) {
            var emojis = [];
            var scores = [];
            data.results.forEach(function(result) {
                emojis.push(result.text);
                scores.push(result.score);
            });
            emojis.splice(5, 5);
            Bot.createMessage(m.channel.id, emojis.join(" "));
        });
    },
    help: "Emojis"
}