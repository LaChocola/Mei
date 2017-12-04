module.exports = {
    main: function(Bot, m, args) {
        var guildID = m.channel.id
        console.log(guildID)
        Bot.createMessage(m.channel.id, "This Channel's ID is: " + guildID)
    },
    help: "Test Command for Chocola"
}