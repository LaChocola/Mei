module.exports = {
    main: function(Bot, m, args, prefix) {
        var guild = m.channel.guild
        var roleSearch = function(role) {
            var roleName = role.name
            if (roleName != "undefined") {
                console.log(`"${roleName}": "${role.id}",`);
                return roleName;
            }
        }
        var roles = m.guild.roles.map(roleSearch)
        Bot.createMessage(m.channel.id, roles.join("  |  "));
    },
    help: "Get your role info"
}
