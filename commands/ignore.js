module.exports = {
    main: function(Bot, m, args, prefix) {
        if (m.author.id === '161027274764713984') {
            Bot.createMessage(m.channel.id, ":ok_hand:")
        } else {
            Bot.createMessage(m.channel.id, "Not today kiddo");
        }
    },
    help: "Chocola Only command"
}
