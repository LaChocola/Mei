module.exports = {
    main: function(Bot, m, args) {
        var msg = m.cleanContent.replace("!say ", "");
        if (m.content == "!say") {
            Bot.createMessage(m.channel.id, "Please add something to say. i.e. ``!say <whatever>``")
            return
        } else {
            Bot.createMessage(m.channel.id, msg);
        }
    },
    help: "Makes me say something"
}