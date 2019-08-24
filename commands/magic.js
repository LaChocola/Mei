module.exports = {
    main: function(Bot, m, args, prefix) {
        var time = process.hrtime();
        Bot.createMessage(m.channel.id, "Pong!").then(msg => {
            var ms = Math.round(process.hrtime(time)[1] / 1000000);
            Bot.editMessage(msg.channel.id, msg.id, "Pong! `" + ms + "ms`");
        });
    },
    help: "Testing"
};
